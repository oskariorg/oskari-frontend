import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';

export const Checkbox = ({ name, value, handleChange, disabled }) => {
    return (
        <div className={`classification-${name} option`}>
            <label className="label oskari-checkboxinput">
                <input type="checkbox" checked={value} disabled = {disabled}
                    onChange={evt => handleChange(name, evt.target.checked)}/>
                <Message messageKey={`classify.labels.${name}`}/>
            </label>
        </div>
    );
};

Checkbox.propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    handleChange: PropTypes.func
};
