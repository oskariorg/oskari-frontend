import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm, DateRange, LocalizationComponent, TextInput, Button, Radio, Tooltip } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { Controller } from 'oskari-ui/util';
import styled from 'styled-components';
import moment from 'moment';
import { RichEditor } from 'oskari-ui/components/RichEditor';
import { BUNDLE_KEY, DATEFORMAT } from './constants';
import 'draft-js/dist/Draft.css';

/*
This file contains the form for admin-announcements.
This is the main file for creating and editing announcements.
*/
const SHOW_AS = ['popup', 'banner'];
const TYPE = ['title', 'content', 'link'];

const PaddingTop = styled.div`
    padding-top: 16px;
`;

const Label = styled.div`
    padding-bottom: 8px;
`;
const DeleteButton = ({ onConfirm }) => (
    <Confirm
        title={<Message messageKey='messages.deleteAnnouncementConfirm'/>}
        onConfirm={onConfirm}
        okText={<Message messageKey='buttons.yes' bundleKey='oskariui'/>}
        cancelText={<Message messageKey='buttons.cancel' bundleKey='oskariui'/>}
        placement='top'>
        <Button danger>
            <Message messageKey='buttons.delete' bundleKey='oskariui'/>
        </Button>
    </Confirm>
);
DeleteButton.propTypes = {
    onConfirm: PropTypes.func.isRequired
};

const initState = announcement => {
    // TODO migrate options and init from announcement
    const { beginDate, endDate, active, ...rest } = announcement;
    const begin = beginDate || moment().startOf('hour');
    const end = endDate || moment().startOf('hour');
    const date = [moment(begin, DATEFORMAT), moment(end, DATEFORMAT)];
    const options = {
        showAs: active ? SHOW_AS[1] : SHOW_AS[0],
        type: TYPE[1]
    };
    return { date, options, ...rest };
};

// Return localized labels
const getLabels = () => {
    const getMsg = Oskari.getMsg.bind(null, BUNDLE_KEY);
    const labels = {};
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(`fields.locale.${language}`) === 'object' ? language : 'generic';
        labels[language] = {
            name: getMsg(`fields.locale.${langPrefix}.name`, [language]),
            content: getMsg(`fields.locale.${langPrefix}.content`, [language]),
            link: getMsg('fields.type.link')
        };
    });
    return labels;
};
const getRadioButtons = (type, options) => options.map((opt, i) => (
    <Radio.Button key={`radio-${type}-${i}`} value={opt}>
        <Message messageKey={`fields.${type}.${opt}`} />
    </Radio.Button>
));

export const AnnouncementsForm = ({
    controller,
    announcement = {},
    onClose
}) => {
    const [state, setState] = useState(initState(announcement));
    console.log(state);
    const isEdit = !!state.id;
    const onSave = () => {
        const { date, ...other } = state;
        // TODO: should link or/and content be removed from locale??
        // Should format date value before submit.
        const values = {
            beginDate: date[0].format(DATEFORMAT),
            endDate: date[1].format(DATEFORMAT),
            ...other
        };
        if (isEdit) {
            controller.updateAnnouncement(values);
        } else {
            controller.saveAnnouncement(values);
        }
        onClose();
    };
    const onDelete = () => controller.deleteAnnouncement(announcement.id);
    const onOptionChange = (key, value) => {
        const options = state.options;
        options[key] = value;
        setState({ ...state, options });
    };

    const languages = Oskari.getSupportedLanguages();
    const defaultLang = languages[0];
    const hasMandatoryName = Oskari.util.keyExists(state.locale, `${defaultLang}.name`) && state.locale[defaultLang].name.trim().length > 0;
    const tooltip = hasMandatoryName ? '' : <Message messageKey={`titleError`} />;
    const type = state.options.type;
    // TODO: try UrlInput in LocalizationComponent
    return (
        <Fragment>
            <Label>
                <Message messageKey='fields.show.label' />
            </Label>
            <Radio.Group
                value={state.options.showAs}
                buttonStyle="solid"
                onChange={(evt) => onOptionChange('showAs', evt.target.value)}
            >
                {getRadioButtons('show', SHOW_AS)}
            </Radio.Group>
            <PaddingTop/>
            <Label>
                <Message messageKey='fields.date' />
            </Label>
            <DateRange
                value = {state.date}
                allowClear = {false}
                format = { DATEFORMAT }
                showTime = {{ format: 'HH' }}
                onChange= {(date) => setState({ ...state, date })}
            />
            <PaddingTop/>
            <Label>
                <Message messageKey='fields.type.label' />
            </Label>
            <Radio.Group
                value={state.options.type}
                buttonStyle="solid"
                onChange={(evt) => onOptionChange('type', evt.target.value)}
            >
                {getRadioButtons('type', TYPE)}
            </Radio.Group>
            <PaddingTop/>
            <LocalizationComponent
                labels={getLabels()}
                languages={languages}
                LabelComponent={Label}
                onChange={(locale) => setState({ ...state, locale })}
                value={state.locale}>
                <TextInput type='text' name='name'/>
                <PaddingTop/>
                { type === 'link' && <TextInput name='link'/> }
                { type === 'content' && <RichEditor name='content'/> }
                { type !== 'title' && <PaddingTop/>}
            </LocalizationComponent>

            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onClose()}/>
                {isEdit && <DeleteButton onConfirm={onDelete}/>}
                <Tooltip title={tooltip}>
                    <PrimaryButton disabled={!hasMandatoryName} type="save" onClick={onSave}/>
                </Tooltip>
            </ButtonContainer>
        </Fragment>
    );
};

AnnouncementsForm.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    onClose: PropTypes.func.isRequired,
    announcement: PropTypes.object
};
