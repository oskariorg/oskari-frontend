import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputGroup } from 'oskari-ui';
import { Timeout } from 'oskari-ui/util';
import { Opacity } from 'oskari-ui';

const OPACITY_EVENT_FIRING_DELAY = 100;

const Border = styled('div')`
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    width: 100%;
    padding: 10px 15px;
`;
const StyledSlider = styled(Opacity)`
    margin: 0 20px 0 10px;
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
    useEffect(() => {
        setSliderValue(value);
    }, [value]);
    return (
        <InputGroup compact>
            <Border>
                <StyledSlider defaultValue={sliderValue} onChange={instantValueChange} />
            </Border>
        </InputGroup>
    );
};

OpacitySlider.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onChange: PropTypes.func.isRequired
};
