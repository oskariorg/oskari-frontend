import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select } from 'oskari-ui';
import { ColorPicker } from 'oskari-ui/components/ColorPicker';

const StyledSelect = styled(Select)`
    width: 120px;
`;

const ColorSet = styled.div`
    border: 1px solid #555555;
    height: 20px;
    display: flex;
    flex-flow: row nowrap;
    margin-top: 5px;
`;

const Color = styled.div`
    width: 100%;
    background: ${props => props.color}
`;

export const ColorSelect = ({
    colorsets,
    value,
    disabled,
    isSimple,
    handleColorChange
}) => {
    if (isSimple) {
        return (
            <ColorPicker disabled={disabled} value={value} hideTextInput
                onChange={handleColorChange}
            />
        );
    }
    // coloret: {name:'Blues', colors:['#deebf7','#9ecae1','#3182bd']}
    return (
        <StyledSelect onChange={handleColorChange} disabled={disabled} value={value}>
            { colorsets.map(({ name, colors }) => {
                return (
                    <Select.Option
                        value={name}
                        key={name}
                    >
                        <ColorSet>
                            { colors.map(color => <Color key={color} color={color}/>) }
                        </ColorSet>
                    </Select.Option>)
                ;
            })
            }
        </StyledSelect>
    );
};

ColorSelect.propTypes = {
    colorsets: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    isSimple: PropTypes.bool.isRequired,
    handleColorChange: PropTypes.func.isRequired
};
