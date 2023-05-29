import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Checkbox } from 'oskari-ui';
import { ColorSelect } from './ColorSelect';

const Component = styled.div`
    padding-bottom: 10px;
    padding-top: 10px;
`;
const StyledCheckbox = styled(Checkbox)`
    margin-left: 10px;
`;

export const Color = ({ colorsets, values, controller, disabled }) => {
    const { color, mapStyle, reverseColors, type } = values;
    const isSimple = mapStyle === 'points' && type !== 'div';

    const handleReverseColors = evt => controller.updateClassification('reverseColors', evt.target.checked);
    const handleColorChange = color => controller.updateClassification('color', color);
    return (
        <Component className="classification-colors option">
            <ColorSelect colorsets = {colorsets} isSimple = {isSimple} value = {color}
                disabled = {disabled} handleColorChange = {handleColorChange}/>
            {!isSimple && (
                <StyledCheckbox
                    checked = {reverseColors}
                    disabled = {disabled}
                    onChange = {handleReverseColors}>
                    <Message messageKey='classify.labels.reverseColors'/>
                </StyledCheckbox>)}
        </Component>
    );
};
Color.propTypes = {
    colorsets: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
