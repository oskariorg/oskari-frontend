import React from 'react';
import PropTypes from 'prop-types';
import { Option, InputGroup } from 'oskari-ui';
import { StyledIcon, Row, Col, ColFixed, StyledInput, StyledSlider, StyledSelect, Border, StyledPlayButton } from './ShadowToolStyled';
import { PlayPauseIcon } from '../../resources/icons/';

const MINUTES = 1439;

export const ShadowToolTime = ({ changeHandler, timeValue, sliderTimeValue, playing, playHandler }) => {
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
            value: 1,
            label: '1x'
        },
        {
            value: 60,
            label: '60x'
        }
    ];

    const clickPlayButton = () => {
        playHandler(!playing);
    };

    return (
        <Row style={{ marginTop: '20px' }}>
            <Col>
                <StyledIcon type="clock-circle" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                <StyledInput value={timeValue} onChange={inputChangeTime} />
            </Col>
            <ColFixed>
                <InputGroup compact>
                    <Border>
                        <StyledPlayButton onClick={clickPlayButton}>
                            <PlayPauseIcon initial={playing} />
                        </StyledPlayButton>
                        <StyledSlider marks={marksForTime} min={0} max={MINUTES} style={{ margin: 0 }} value={sliderTimeValue} onChange={changeSliderTime} tooltipVisible={false} />
                    </Border>
                </InputGroup>
            </ColFixed>
            <Col>
                <StyledSelect style={{ width: '100%' }}>
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
    playHandler: PropTypes.func.isRequired
};
