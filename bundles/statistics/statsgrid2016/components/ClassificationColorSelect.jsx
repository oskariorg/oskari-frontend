import React from 'react';
import {withContext} from '../../../../src/reactUtil/genericContext';
import ColorSelect from './ColorSelect';

const handleReverseColors = (service, isReverse) => {
    service.getStateService().updateActiveClassification('reverseColors', isReverse);
};
const handleColorChange = (service, value) => {
    service.getStateService().updateActiveClassification('name', value);
};

const ClassificationColorSelect = ({properties, values, loc, service, disabled}) => {
    let colors;
    let label;
    const isSimple = values.mapStyle !== 'choropleth';
    const opacity = values.transparency / 100 || 1;
    if (isSimple) {
        label = loc('classify.map.color');
        colors = service.getColorService().getDefaultSimpleColors();
    } else {
        label = loc('colorset.button');
        colors = service.getColorService().getOptionsForType(values.type, values.count, values.reverseColors);
    }

    return (
        <div className={properties.class}>
            <div className="label">{label}</div>
            <div className = "classification-colors value">
                <ColorSelect colors = {colors} isSimple = {isSimple} value = {values.name} opacity = {opacity}
                    disabled = {disabled} handleColorChange = {value => handleColorChange(service, value)}/>
                {!isSimple &&
                    <span className="flip-colors">
                        <input id="legend-flip-colors" type="checkbox"
                            checked = {values.reverseColors} disabled = {disabled}
                            onChange = {evt => handleReverseColors(service, evt.target.checked)}/>
                        <label htmlFor="legend-flip-colors">{loc('colorset.flipButton')}</label>
                    </span>
                }
            </div>
        </div>
    );
};
export default withContext(ClassificationColorSelect);
