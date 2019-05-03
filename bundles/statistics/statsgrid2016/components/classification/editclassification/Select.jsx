import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'oskari-ui/util';

const Select = ({ properties, options, value, disabled, handleChange }) => {
    // options => array of values [1,3,4,5] or array of objects with properties: value and optionally: text, hidden, disabled
    return (
        <div className={properties.class + ' option'}>
            <div className="select-label">{properties.label}</div>
            <div className = {properties.class + ' value'}>
                <select className={properties.class + ' select'} value={value} disabled = {disabled} onChange={evt => handleChange(properties, evt.target.value)}>
                    {options.map(opt => {
                        if (opt.value !== undefined && opt.hidden) {
                            return <option className = "oskari-hidden" disabled = {opt.disabled ? true : null} key= {'hidden_' + opt.value} value = {opt.value}>{opt.text || opt.value}</option>;
                        } else if (opt.value !== undefined) {
                            return <option key= {opt.value} disabled = {opt.disabled ? true : null} value = {opt.value}>{opt.text || opt.value}</option>;
                        }
                        return <option key= {opt} value = {opt}>{opt}</option>;
                    })}
                </select>
            </div>
        </div>
    );
};
Select.propTypes = {
    properties: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired
};

const contextWrapped = withContext(Select);
export { contextWrapped as Select };
