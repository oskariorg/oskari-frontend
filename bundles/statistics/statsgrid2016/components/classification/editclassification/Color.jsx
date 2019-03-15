import React from 'react';
import PropTypes from 'prop-types';
import {withContext} from '../../../../../../src/react/util.jsx';
import {ColorSelect} from './ColorSelect';
import './color.scss';

const handleReverseColors = (service, isReverse) => {
    service.getStateService().updateActiveClassification('reverseColors', isReverse);
};
const handleColorChange = (service, value) => {
    service.getStateService().updateActiveClassification('name', value);
};

const Color = ({colors, values, loc, service, disabled}) => {
    let label = loc('colorset.button');
    const isSimple = values.mapStyle !== 'choropleth';
    const opacity = values.transparency / 100 || 1;
    if (isSimple) {
        label = loc('classify.map.color');
    }
    return (
        <div className="classification-colors option">
            <div className="select-label">{label}</div>
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
Color.propTypes = {
    colors: PropTypes.array,
    values: PropTypes.object,
    disabled: PropTypes.bool,
    service: PropTypes.object,
    loc: PropTypes.func
};

const contextWrapped = withContext(Color);
export {contextWrapped as Color};
