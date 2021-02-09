import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Message } from 'oskari-ui';

export const VectorNameInput = ({ styleName = '', onChange, isValid = true }) => {
    return (
        <React.Fragment>
            <TextInput value={ styleName }
                onChange={ (event) => onChange(event.target.value) } />
            { !isValid && <Message messageKey="styles.vector.validation.name" /> }
        </React.Fragment>
    );
};

VectorNameInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
    styleName: PropTypes.string
};
