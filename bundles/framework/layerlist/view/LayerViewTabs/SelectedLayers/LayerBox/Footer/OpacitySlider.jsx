import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputGroup, Opacity } from 'oskari-ui';
import { Timeout } from 'oskari-ui/util';

const OPACITY_EVENT_FIRING_DELAY = 100;

const Container = styled('div')`
    width: ${props => props.$isMobile ? '85px' : '200px'};
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
    const isMobile = Oskari.util.isMobile();
    return (
        <InputGroup>
            <Container $isMobile={isMobile}>
                <Opacity bordered defaultValue={sliderValue} onChange={instantValueChange} inputOnly={isMobile} />
            </Container>
        </InputGroup>
    );
};

OpacitySlider.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
};
