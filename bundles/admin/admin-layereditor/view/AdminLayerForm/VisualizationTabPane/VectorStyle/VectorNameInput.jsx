import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextInput, Message } from 'oskari-ui';

const NameInput = styled(TextInput)`
    & {
        margin: 0 0 20px;
    }
`;

export const VectorNameInput = ({ styleName = '', onChange, isValid = true }) => {
    return (
        <React.Fragment>
            <Message messageKey='styles.vector.name' />
            <NameInput
                value={ styleName }
                onChange={ (event) => onChange(event.target.value) }
            />
            { !isValid && <Message messageKey='styles.vector.validation.name' /> }
        </React.Fragment>
    );
};

VectorNameInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
    styleName: PropTypes.string
};
