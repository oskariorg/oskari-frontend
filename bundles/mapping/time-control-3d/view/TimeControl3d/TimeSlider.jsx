import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'oskari-ui';
import { StyledTimeSlider, TimeBorder, StyledPlayButton } from './styled';
import { PlayButton } from './PlayButton';
import { ThemeConsumer } from 'oskari-ui/util';
import { getHeaderTheme } from 'oskari-ui/theme';

const MINUTES = 1439;
export const TimeSlider = ThemeConsumer(({ theme, isMobile, changeHandler, sliderTimeValue, playing, playHandler }) => {
    const helper = getHeaderTheme(theme);
    const color = helper.getAccentColor();
    const hover = Oskari.util.getColorEffect(color, 30);
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
        <InputGroup block>
            <StyledPlayButton onClick={clickPlayButton} hover={hover} color={color}>
                <PlayButton initial={playing} />
            </StyledPlayButton>
            <TimeBorder isMobile={isMobile}>
                <StyledTimeSlider
                    color={color}
                    hover={hover}
                    useThick={isMobile}
                    marks={marksForTime}
                    min={0} max={MINUTES}
                    value={sliderTimeValue}
                    onChange={changeSliderTime}
                    tooltip={{ open: false }}/>
            </TimeBorder>
        </InputGroup>
    );
});
TimeSlider.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    sliderTimeValue: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playHandler: PropTypes.func.isRequired
};
