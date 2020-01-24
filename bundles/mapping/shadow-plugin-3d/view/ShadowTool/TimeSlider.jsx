import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'oskari-ui';
import { StyledTimeSlider, TimeBorder, StyledPlayButton } from './ShadowToolStyled';
import { PlayPauseIcon } from '../../resources/icons';

const MINUTES = 1439;
export const TimeSlider = ({ isMobile, changeHandler, sliderTimeValue, playing, playHandler }) => {
    const clickPlayButton = () => {
        playHandler(!playing);
    };
    const changeSliderTime = (val) => {
        const hours = Math.floor(val / 60);
        const minutes = val % 60;
        const fMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const timeString = `${hours}:${fMinutes}`;
        changeHandler(timeString);
    };

    const marksForTime = {
        360: isMobile ? '' : '6:00',
        720: isMobile ? '' : '12:00',
        1080: isMobile ? '' : '18:00'
    };

    return (
        <InputGroup compact>
            <StyledPlayButton onClick={clickPlayButton}>
                <PlayPauseIcon initial={playing} />
            </StyledPlayButton>
            <TimeBorder isMobile={isMobile}>
                <StyledTimeSlider marks = {marksForTime} min={0} max={MINUTES} value={sliderTimeValue} onChange={changeSliderTime} tooltipVisible={false} />
            </TimeBorder>
        </InputGroup>
    );
};
TimeSlider.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    sliderTimeValue: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playHandler: PropTypes.func.isRequired
};
