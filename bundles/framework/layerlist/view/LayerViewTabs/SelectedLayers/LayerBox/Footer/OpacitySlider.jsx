import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputGroup } from 'oskari-ui';
import { Timeout } from 'oskari-ui/util';
import { Opacity } from 'oskari-ui';

const OPACITY_EVENT_FIRING_DELAY = 100;

const Container = styled('div')`
    width: 200px;
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
            <Container>
                <Opacity bordered defaultValue={sliderValue} onChange={instantValueChange} />
            </Container>
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
