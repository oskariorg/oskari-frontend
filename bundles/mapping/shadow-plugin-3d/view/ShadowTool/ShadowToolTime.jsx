import React from 'react';
import PropTypes from 'prop-types';
import { Option, InputGroup } from 'oskari-ui';
import { StyledIcon, Row, Col, ColFixed, StyledInput, StyledTimeSlider, StyledSelect, Border, StyledPlayButton } from './ShadowToolStyled';
import { PlayPauseIcon } from '../../resources/icons/';

const MINUTES = 1439;

export const ShadowToolTime = ({ changeHandler, timeValue, sliderTimeValue, playing, playHandler, speedHandler, speed }) => {
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
        360: {
            label: '6:00',
            style: {
                color: '#fff'
            }
        },
        720: {
            label: '12:00',
            style: {
                color: '#fff'
            }
        },
        1080: {
            label: '18:00',
            style: {
                color: '#fff'
            }
        }
    };

    const speedValues = [
        {
            value: 'slow',
            label: 'Hidas'
        },
        {
            value: 'normal',
            label: 'Normaali'
        },
        {
            value: 'fast',
            label: 'Nopea'
        },
        {
            value: 'superfast',
            label: 'Sairaan nopee'
        }
    ];

    const clickPlayButton = () => {
        playHandler(!playing);
    };

    const handleSpeedChange = (val) => {
        speedHandler(val);
    };

    return (
        <Row style={{ marginTop: '5px' }}>
            <Col>
                <StyledIcon type="clock-circle" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                <StyledInput value={timeValue} onChange={inputChangeTime} />
            </Col>
            <ColFixed>
                <InputGroup compact>
                    <StyledPlayButton onClick={clickPlayButton}>
                        <PlayPauseIcon initial={playing} />
                    </StyledPlayButton>
                    <Border>
                        <StyledTimeSlider marks={marksForTime} min={0} max={MINUTES} style={{ margin: 0 }} value={sliderTimeValue} onChange={changeSliderTime} tooltipVisible={false} />
                    </Border>
                </InputGroup>
            </ColFixed>
            <Col>
                <StyledSelect defaultValue={speed} style={{ width: '100%' }} size='large' onChange={handleSpeedChange}>
                    {speedValues.map(speed => (
                        <Option key={speed.value} value={speed.value}>{speed.label}</Option>
                    ))}
                </StyledSelect>
            </Col>
        </Row>
    );
};

ShadowToolTime.propTypes = {
    timeValue: PropTypes.string.isRequired,
    sliderTimeValue: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playHandler: PropTypes.func.isRequired,
    speedHandler: PropTypes.func.isRequired,
    speed: PropTypes.string.isRequired
};
