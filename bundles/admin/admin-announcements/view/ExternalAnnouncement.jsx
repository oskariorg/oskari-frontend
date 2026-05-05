import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Label, LabeledInput } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';
import { DateRange } from 'oskari-ui/components/DateRange';
import { styled } from 'styled-components';
import { RichEditor } from 'oskari-ui/components/RichEditor';
import { DATE_FORMAT, TIME_FORMAT } from './constants';

const PaddingTop = styled('div')`
    padding-top: 0.25em;
`;

const InfoText = styled('div')`
    margin-bottom: 1rem;
    font-style: italic;
`;

export const ExternalAnnouncement = ({
    state,
    setState,
    languages,
    getMessage,
    onSubmitClick,
    onClose
}) => {
    const defaultLang = languages[0];

    return (
        <Fragment>
            <PaddingTop/>
            <InfoText>
                <Message messageKey='fields.externalInfo' />
            </InfoText>
            <PaddingTop/>
            <Label>
                <Message messageKey='fields.endDate' />
            </Label>
            <DateRange
                value={[state.date[0], state.date[1]]}
                allowClear={false}
                format={DATE_FORMAT}
                showTime={{ format: TIME_FORMAT }}
                onChange={(date) => setState({ ...state, date })}
                disabled={[true, false]}
            />
            <PaddingTop/>
            <LocalizationComponent
                languages={languages}
                onChange={(locale) => setState({ ...state, locale })}
                value={state.locale}
                disabledLanguages={[defaultLang]}
            >
                <LabeledInput type='text' name='title' label={getMessage('fields.locale.title')} mandatory={false}/>
                { state.type === 'link' && <LabeledInput label={getMessage('fields.locale.link')} name='link' mandatory={false}/> }
                { state.type === 'content' && <RichEditor label={getMessage('fields.locale.content')} name='content' mandatory={false}/> }
                { state.type === 'content' && <PaddingTop/> }
            </LocalizationComponent>

            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onClose()}/>
                <PrimaryButton type="save" onClick={onSubmitClick}/>
            </ButtonContainer>
        </Fragment>
    );
};

ExternalAnnouncement.propTypes = {
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    languages: PropTypes.array.isRequired,
    getMessage: PropTypes.func.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
