import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Slider, NumberInput, InputGroup } from 'oskari-ui';

const StyledSlider = styled.div`
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    width: 120px;
    padding: 10px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 60px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
    height: 34px !important;
`;

export const OpacitySlider = ({ value, onChange }) => (
    <InputGroup compact>
        <StyledSlider>
            <Slider
                value={value}
                onChange={onChange}
                style={{ margin: '0px' }}
            />
        </StyledSlider>
        <StyledNumberInput
            min={0}
            max={100}
            value={value}
            onChange={onChange}
            formatter={value => `${value} %`}
        />
    </InputGroup>
);

OpacitySlider.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};
