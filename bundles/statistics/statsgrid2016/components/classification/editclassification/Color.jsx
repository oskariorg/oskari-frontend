import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'oskari-ui/util';
import { ColorSelect } from './ColorSelect';
import './color.scss';

const handleReverseColors = (mutator, isReverse) => {
    mutator.updateClassification('reverseColors', isReverse);
};
const handleColorChange = (mutator, value) => {
    mutator.updateClassification('name', value);
};

const Color = ({ colors, values, loc, mutator, disabled }) => {
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
                    disabled = {disabled} handleColorChange = {value => handleColorChange(mutator, value)}/>
                {!isSimple &&
                    <span className="flip-colors">
                        <input id="legend-flip-colors" type="checkbox"
                            checked = {values.reverseColors} disabled = {disabled}
                            onChange = {evt => handleReverseColors(mutator, evt.target.checked)}/>
                        <label htmlFor="legend-flip-colors">{loc('colorset.flipButton')}</label>
                    </span>
                }
            </div>
        </div>
    );
};
Color.propTypes = {
    colors: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    mutator: PropTypes.object.isRequired,
    loc: PropTypes.func.isRequired
};

const contextWrapped = withContext(Color);
export { contextWrapped as Color };
