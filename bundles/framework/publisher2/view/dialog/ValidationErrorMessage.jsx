import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PrimaryButton } from 'oskari-ui/components/buttons';

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
    const listItems = errors.map((err, index) => <li key={err.field + '_' + index}>{err.error}</li>);
    return <MessageContainer>
        <ErrorList>
            {listItems}
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
