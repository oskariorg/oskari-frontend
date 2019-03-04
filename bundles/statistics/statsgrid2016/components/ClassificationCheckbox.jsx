import React from 'react';
import {withContext} from '../../../../src/reactUtil/genericContext';

const handleChange = (service, id, value) => {
    service.getStateService().updateActiveClassification(id, value);
};

const ClassificationCheckbox = ({properties, value, loc, service, disabled}) => {
    return (
        <div className={properties.class + ' option'}>
            <label className="label oskari-checkboxinput">
                <input type="checkbox" checked={value} disabled = {disabled}
                    onChange={evt => handleChange(service, properties.id, evt.target.checked)}/>
                <span>{properties.label}</span>
            </label>
        </div>
    );
};
export default withContext(ClassificationCheckbox);
