import React from 'react';
import {withContext} from '../../../../src/reactUtil/genericContext';

const ClassificationCheckbox = ({properties, value, handleChange, disabled}) => {
    return (
        <div className={properties.class + ' option'}>
            <label className="label oskari-checkboxinput">
                <input type="checkbox" checked={value} disabled = {disabled}
                    onChange={evt => handleChange(properties.id, evt.target.checked)}/>
                <span>{properties.label}</span>
            </label>
        </div>
    );
};
export default withContext(ClassificationCheckbox);
