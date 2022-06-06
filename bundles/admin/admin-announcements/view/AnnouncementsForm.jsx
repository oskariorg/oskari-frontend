import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, DateRange, LocalizationComponent, TextInput, Radio, Tooltip } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer, DeleteButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import moment from 'moment';
import { RichEditor } from 'oskari-ui/components/RichEditor';
import { BUNDLE_KEY, DATE_FORMAT, TIME_FORMAT, TYPE, OPTIONS } from './constants';
import 'draft-js/dist/Draft.css';

/*
This file contains the form for admin-announcements.
This is the main file for creating and editing announcements.
*/

const PaddingTop = styled.div`
    padding-top: 16px;
`;

const Label = styled.div`
    padding-bottom: 8px;
`;

// TODO: should type be stored to options??
const getType = ({ locale }) => {
    if (!locale) {
        // For new announcement default to content
        return TYPE.CONTENT;
    }
    const { link, content } = Oskari.getLocalized(locale) || {};
    if (link) {
        return TYPE.LINK;
    }
    if (content) {
        return TYPE.CONTENT;
    }
    return TYPE.TITLE;
};
const getMandatoryFields = type => {
    const fields = ['title'];
    if (type !== TYPE.TITLE) {
        fields.push(type);
    }
    return fields;
};
const getLocaleForSubmit = (state) => {
    const { type, locale } = state;
    // Announcement bundle uses getLocalized so add languages only if set to get fallback to default language
    const langs = Object.keys(locale).filter(lang => locale[lang].title);
    const fields = getMandatoryFields(type);
    const values = {};
    langs.forEach(lang => {
        values[lang] = {};
        fields.forEach(field => {
            values[lang][field] = locale[lang][field] || '';
        });
    });
    return values;
};
// TODO: warn if other languages have name but not content/link ??
const validateLocale = (state, defaultLang) => {
    const { type, locale } = state;
    const fields = getMandatoryFields(type);
    const defaultLocale = locale[defaultLang] || {};
    return fields.filter(key => {
        const value = defaultLocale[key];
        return !(value && value.trim().length > 0);
    });
};

const initState = announcement => {
    const { beginDate, endDate, options, locale, ...rest } = announcement;
    const begin = beginDate ? moment(beginDate) : moment().startOf('hour');
    const end = endDate ? moment(endDate) : moment().startOf('hour');
    return {
        ...rest,
        date: [begin, end],
        type: getType(announcement),
        locale: locale || {},
        options: options || { ...OPTIONS }
    };
};

// Return localized labels
const getLabels = () => {
    const getMsg = Oskari.getMsg.bind(null, BUNDLE_KEY);
    const labels = {};
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(`fields.locale.${language}`) === 'object' ? language : 'generic';
        labels[language] = {
            title: getMsg(`fields.locale.${langPrefix}.title`, [language]),
            content: getMsg(`fields.locale.${langPrefix}.content`, [language]),
            link: getMsg('fields.locale.link')
        };
    });
    return labels;
};

export const AnnouncementsForm = ({
    announcement = {},
    onSubmit,
    onDelete,
    onClose
}) => {
    const [state, setState] = useState(initState(announcement));

    const languages = Oskari.getSupportedLanguages();
    const defaultLang = languages[0];

    const isEdit = !!state.id;
    const errorKeys = validateLocale(state, defaultLang);
    const tooltip = errorKeys.length ? errorKeys.map(key => <div key={`validate-${key}`}><Message messageKey={`fields.validate.${key}`} /></div>) : null;

    const onSubmitClick = () => {
        // Should format date and locale before submit.
        const values = {
            id: state.id,
            beginDate: state.date[0].toISOString(),
            endDate: state.date[1].toISOString(),
            locale: getLocaleForSubmit(state),
            options: state.options
        };
        onSubmit(values);
    };
    const onOptionChange = (key, value) => {
        const options = state.options;
        options[key] = value;
        setState({ ...state, options });
    };

    return (
        <Fragment>
            <Label>
                <Message messageKey='fields.show.label' />
            </Label>
            <Radio.Group
                value={state.options.showAsPopup}
                buttonStyle="solid"
                onChange={(evt) => onOptionChange('showAsPopup', evt.target.value)}
            >
                <Radio.Button value={false}>
                    <Message messageKey={'fields.show.banner'} />
                </Radio.Button>
                <Radio.Button value={true}>
                    <Message messageKey={'fields.show.popup'} />
                </Radio.Button>
            </Radio.Group>
            <PaddingTop/>
            <Label>
                <Message messageKey='fields.date' />
            </Label>
            <DateRange
                value = {state.date}
                allowClear = {false}
                format = { DATE_FORMAT }
                showTime = {{ format: TIME_FORMAT }}
                onChange= {(date) => setState({ ...state, date })}
            />
            <PaddingTop/>
            <Label>
                <Message messageKey='fields.type.label' />
            </Label>
            <Radio.Group
                value={state.type}
                buttonStyle="solid"
                onChange={(evt) => setState({ ...state, type: evt.target.value })}
            >
                <Radio.Button value={TYPE.TITLE}>
                    <Message messageKey={'fields.type.title'} />
                </Radio.Button>
                <Radio.Button value={TYPE.CONTENT}>
                    <Message messageKey={'fields.type.content'} />
                </Radio.Button>
                <Radio.Button value={TYPE.LINK}>
                    <Message messageKey={'fields.type.link'} />
                </Radio.Button>
            </Radio.Group>
            <PaddingTop/>
            <LocalizationComponent
                labels={getLabels()}
                languages={languages}
                LabelComponent={Label}
                onChange={(locale) => setState({ ...state, locale })}
                value={state.locale}>
                <TextInput type='text' name='title' mandatory={[defaultLang]}/>
                <PaddingTop/>
                { state.type === 'link' && <TextInput name='link' mandatory={[defaultLang]}/> }
                { state.type === 'content' && <RichEditor name='content' mandatory={[defaultLang]}/> }
                { state.type !== 'title' && <PaddingTop/>}
            </LocalizationComponent>

            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onClose()}/>
                {isEdit && <DeleteButton onConfirm={onDelete}/>}
                <Tooltip title={tooltip}>
                    <PrimaryButton disabled={errorKeys.length > 0} type="save" onClick={onSubmitClick}/>
                </Tooltip>
            </ButtonContainer>
        </Fragment>
    );
};

AnnouncementsForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    announcement: PropTypes.object
};
