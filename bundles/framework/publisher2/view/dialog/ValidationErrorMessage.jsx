import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { showModal } from 'oskari-ui/components/window';
import { BUNDLE_KEY } from '../../constants';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-validation'
};

const MessageContainer = styled('div')`
    margin: 1em;
    display: flex;
    flex-direction: column;
`;

const ErrorList = styled('ul')`
    padding: 0 1em;
`;
const ButtonContainer = styled('div')`
    margin: 1em 0 0 0 ;
    display: flex;
    justify-content: center;
`;

const ValidationErrorMessage = ({ errors, closeCallback }) => {
    return <MessageContainer>
        <ErrorList>
            { errors.map(({ error, field, args }) => (
                <li key={field}>
                    <Message bundleKey={BUNDLE_KEY} messageKey={error} messageArgs={args}/>
                </li>
            ))}
        </ErrorList>
        <ButtonContainer>
            <PrimaryButton type='close' onClick={closeCallback}/>
        </ButtonContainer>
    </MessageContainer>;
};

ValidationErrorMessage.propTypes = {
    errors: PropTypes.array,
    closeCallback: PropTypes.func
};

export const showValidationErrorPopup = (errors, onClose) => {
    return showModal(
        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.error.title' />,
        <ValidationErrorMessage errors={errors} closeCallback={onClose}/>,
        onClose,
        POPUP_OPTIONS
    );
};
