import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Slider, NumberInput, InputGroup } from 'oskari-ui';
import { Timeout } from 'oskari-ui/util';

const OPACITY_EVENT_FIRING_DELAY = 200;

const Border = styled('div')`
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    width: 120px;
    padding: 10px 15px;
`;
const StyledSlider = styled(Slider)`
    margin: 0 !important;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 60px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
    height: 34px !important;
`;

export const OpacitySlider = ({ value, onChange }) => {
    const [sliderValue, setSliderValue] = useState(value);
    const [eventTimeout, setEventTimeout] = useState(null);
    const instantValueChange = val => {
        setSliderValue(val);
        const delayedAction = () => onChange(val);
        if (eventTimeout && eventTimeout.isPending()) {
            eventTimeout.reset(delayedAction);
            return;
        }
        setEventTimeout(new Timeout(delayedAction, OPACITY_EVENT_FIRING_DELAY));
    };
    React.useEffect(() => {
        setSliderValue(value);
    }, [value]);
    return (
        <InputGroup compact>
            <Border>
                <StyledSlider value={sliderValue} onChange={instantValueChange} />
            </Border>
            <StyledNumberInput
                min={0}
                max={100}
                value={sliderValue}
                onChange={onChange}
                formatter={value => `${value} %`}
            />
        </InputGroup>
    );
};

OpacitySlider.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};
