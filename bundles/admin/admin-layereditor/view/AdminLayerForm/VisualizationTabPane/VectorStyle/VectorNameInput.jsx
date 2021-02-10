import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextInput, Message } from 'oskari-ui';

const InputGroup = styled.div`
    & {
        margin: 0 0 20px;
    }
`;

export const VectorNameInput = ({ styleName = '', onChange, isValid = true }) => {
    return (
        <InputGroup>
            <Message messageKey='styles.vector.name' />
            <TextInput
                value={ styleName }
                onChange={ (event) => onChange(event.target.value) }
            />
            { !isValid && <Message messageKey='styles.vector.validation.name' /> }
        </InputGroup>
    );
};

VectorNameInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
    styleName: PropTypes.string
};
