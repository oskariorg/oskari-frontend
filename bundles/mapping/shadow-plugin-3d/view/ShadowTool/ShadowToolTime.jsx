import React from 'react';
import PropTypes from 'prop-types';
import { Option, InputGroup, Message } from 'oskari-ui';
import { StyledIcon, Row, Col, ColFixed, StyledInput, StyledTimeSlider, StyledSelect, TimeBorder, StyledPlayButton } from './ShadowToolStyled';
import { PlayPauseIcon } from '../../resources/icons/';

const MINUTES = 1439;

export const ShadowToolTime = props => {
    const { isMobile, changeHandler, timeValue, sliderTimeValue, playing, playHandler, speedHandler, speed } = props;
    const inputChangeTime = event => {
        const val = event.target.value;
        changeHandler(val);
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

    const speedValues = [
        {
            value: 'slow',
            label: <Message messageKey={'speeds.slow'} />
        },
        {
            value: 'normal',
            label: <Message messageKey={'speeds.normal'} />
        },
        {
            value: 'fast',
            label: <Message messageKey={'speeds.fast'} />
        }
    ];

    const clickPlayButton = () => {
        playHandler(!playing);
    };

    const handleSpeedChange = (val) => {
        speedHandler(val);
    };
    const date = () => {
        return (
            <Col>
                <StyledIcon type="clock-circle"/>
                <StyledInput value={timeValue} onChange={inputChangeTime} />
            </Col>
        );
    };
    const time = () => {
        return (
            <Col>
                <StyledSelect defaultValue={speed} size='large' onChange={handleSpeedChange}>
                    {speedValues.map(speed => (
                        <Option key={speed.value} value={speed.value}>{speed.label}</Option>
                    ))}
                </StyledSelect>
            </Col>
        );
    };
    const slider = () => {
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
    if (isMobile) {
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    {date()}
                    {time()}
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    {slider()}
                </Row>
            </div>
        );
    }
    return (
        <Row style={{ marginTop: '5px' }}>
            {date()}
            <ColFixed>
                {slider()}
            </ColFixed>
            {time()}
        </Row>
    );
};

ShadowToolTime.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    timeValue: PropTypes.string.isRequired,
    sliderTimeValue: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playHandler: PropTypes.func.isRequired,
    speedHandler: PropTypes.func.isRequired,
    speed: PropTypes.string.isRequired
};
