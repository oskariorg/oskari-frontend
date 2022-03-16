import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';

export const Select = ({ name, options, value, disabled, handleChange }) => {
    // options => array of values [1,3,4,5] or array of objects with properties: value and optionally: text, hidden, disabled
    // TODO: hidden is only for adding selected opacity
    return (
        <div className={`classification-${name} option`}>
            <div className="select-label">
                <Message messageKey={`classify.labels.${name}`}/>
            </div>
            <div className = {`classification-${name}-value`}>
                <select className={`classification-${name} select`} value={value} disabled = {disabled} onChange={evt => handleChange(name, evt.target.value)}>
                    {options.map(opt => {
                        if (opt.value !== undefined && opt.hidden) {
                            return <option className = "oskari-hidden" disabled = {opt.disabled ? true : null} key= {'hidden_' + opt.value} value = {opt.value}>{opt.title || opt.value}</option>;
                        } else if (opt.value !== undefined) {
                            return <option key= {opt.value} disabled = {opt.disabled ? true : null} value = {opt.value}>{opt.title || opt.value}</option>;
                        }
                        return <option key= {opt} value = {opt}>{opt}</option>;
                    })}
                </select>
            </div>
        </div>
    );
};
Select.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired
};
