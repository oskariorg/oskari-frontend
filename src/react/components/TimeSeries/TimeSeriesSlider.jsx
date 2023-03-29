import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { playbackSpeedOptions } from './constants';
import styled from 'styled-components';

const SliderContainer = styled('div')`
`;

export const TimeSeriesSlider = ({
    min,
    max,
    dataPoints,
    onChange,
    allowPlayback = false,
    playbackSpeeds
}) => {
    const [state, setState] = useState({});
    return (
        <SliderContainer>

        </SliderContainer>
    );
}

TimeSeriesSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    dataPoints: PropTypes.arrayOf(
        PropTypes.oneOfType(
            [PropTypes.number, PropTypes.string]
        )
    ),
    onChange: PropTypes.func.isRequired,
    allowPlayback: PropTypes.bool,
    playbackSpeeds: PropTypes.arrayOf(
        PropTypes.string
    )
};
