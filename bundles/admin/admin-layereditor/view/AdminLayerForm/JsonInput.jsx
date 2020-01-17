import React from 'react';
import PropTypes from 'prop-types';
import { TextAreaInput } from 'oskari-ui';

const validate = value => {
    if (value) {
        try {
            return typeof JSON.parse(value) === 'object';
        } catch (err) {
            return false;
        }
    }
    return true;
};
const errorStyle = {
    borderColor: 'red',
    boxShadow: '0 0 0 2px rgba(255, 0, 0, 0.2)'
};
export const JsonInput = ({ value, isValid = validate(value), style = {}, ...rest }) => {
    if (!isValid) {
        style = { ...style, ...errorStyle };
    }
    return <TextAreaInput value={value} style={style} { ...rest } />;
};
JsonInput.propTypes = {
    value: PropTypes.string,
    style: PropTypes.object,
    isValid: PropTypes.bool
};
