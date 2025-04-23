import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { BUNDLE_KEY } from '../../constants';

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

export const ValidationErrorMessage = ({ errors, closeCallback }) => {
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
