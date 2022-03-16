import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { ColorSelect } from './ColorSelect';
import './color.scss';

export const Color = ({ colorsets, values, controller, disabled }) => {
    const { color, mapStyle, reverseColors } = values;
    const isSimple = mapStyle === 'points';
    const labelKey = isSimple ? 'color' : 'colorset';

    const handleReverseColors = isReverse => controller.updateClassification('reverseColors', isReverse);
    const handleColorChange = color => controller.updateClassification('color', color);

    return (
        <div className="classification-colors option">
            <div className="select-label">
                <Message messageKey={`classify.labels.${labelKey}`}/>
            </div>
            <div className = "classification-colors value">
                <ColorSelect colorsets = {colorsets} isSimple = {isSimple} value = {color}
                    disabled = {disabled} handleColorChange = {handleColorChange}/>
                {!isSimple &&
                    <span className="flip-colors">
                        <input id="legend-flip-colors" type="checkbox"
                            checked = {reverseColors} disabled = {disabled}
                            onChange = {evt => handleReverseColors(evt.target.checked)}/>
                        <label htmlFor="legend-flip-colors">
                            <Message messageKey="classify.labels.reverseColors"/>
                        </label>
                    </span>
                }
            </div>
        </div>
    );
};
Color.propTypes = {
    colorsets: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
