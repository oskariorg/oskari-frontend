import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextInput } from 'oskari-ui';

const InputGroup = styled.div`
    & {
        margin: 0 0 20px;
    }
`;

const hasValidName = (name) => {
    return name.length > 0;
};

export const VectorNameInput = ({ styleName = '', onChange, isValid = true, nameFieldHeader, validationErrorMessage }) => {
    return (
        <InputGroup>
            { nameFieldHeader }
            <TextInput
                value={ styleName }
                onChange={ (event) => onChange(event.target.value, hasValidName(event.target.value)) }
            />
            { !isValid && validationErrorMessage }
        </InputGroup>
    );
};

VectorNameInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    styleName: PropTypes.string,
    nameFieldHeader: PropTypes.any,
    validationErrorMessage: PropTypes.any
};
