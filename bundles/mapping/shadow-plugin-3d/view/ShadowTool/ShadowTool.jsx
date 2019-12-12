import React from 'react';
import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';
import { Option, InputGroup } from 'oskari-ui';
import { Background, StyledIcon, Row, Col, ColFixed, StyledInput, StyledButton, StyledSlider, StyledSelect, Border } from './ShadowToolStyled';

export const ShadowTool = ({ mutator, date, time }) => {
    const [timeValue, setTime] = React.useState(time);
    const [dateValue, setDate] = React.useState(date);
    const setCurrentTime = () => {
        const d = new Date();
        const curTime = `${d.getHours()}:${d.getMinutes()}`;
        const curDate = `${d.getDate()}/${d.getMonth() + 1}`;
        setTime(curTime);
        setDate(curDate);
        mutator.setCurrentTime(curDate, curTime);
    };

    const validateTime = (target) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
        return regex.test(target);
    };

    const validateDate = (target) => {
        const matches = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])[/](0[1-9]|1[0-2]|[1-9])$/.exec(target);
        if (matches === null) {
            return false;
        }
        const d = parseInt(matches[1]);
        const m = matches[2] - 1;
        const dateObject = new Date(2019, m, d);
        return dateObject.getDate() === d && dateObject.getMonth() === m;
    };

    const inputChangeTime = event => {
        const val = event.target.value;
        changeTime(val);
    };

    const changeTime = val => {
        if (validateTime(val)) {
            mutator.setTime(val);
        }
        setTime(val);
    };

    const changeDate = event => {
        const val = event.target.value;
        if (validateDate(val)) {
            mutator.setDate(val);
        }
        setDate(val);
    };

    const sliderValueForTime = () => {
        const hoursMinutes = time.split(/[.:]/);
        const hours = parseInt(hoursMinutes[0], 10) * 60;
        const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes;
    };

    const changeSliderTime = (val) => {
        const hours = Math.floor(val / 60);
        const minutes = val % 60;
        const fMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const timeString = `${hours}:${fMinutes}`;
        setTime(timeString);
    };

    const marksForDate = () => {
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const styledMark = {
            color: '#fff'
        };
        return months.reduce((marks, month) => {
            return {
                ...marks,
                [month]: {
                    style: styledMark,
                    label: month
                }
            };
        }, {});
    };

    const marksForTime = {
        6: '',
        12: '',
        18: ''
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

    return (
        <Background>
            <Row>
                <Col>
                    <StyledIcon type="calendar" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                    <StyledInput value={dateValue} onChange={changeDate} />
                </Col>
                <ColFixed>
                    <StyledSlider marks={marksForDate()} min={1} max={13} step={0.01} />
                </ColFixed>
                <Col>
                    <StyledButton onClick={setCurrentTime}>Nykyhetki</StyledButton>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <StyledIcon type="clock-circle" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                    <StyledInput value={timeValue} onChange={inputChangeTime} />
                </Col>
                <ColFixed>
                    <InputGroup compact>
                        <Border>
                            <StyledSlider marks={marksForTime} min={0} max={1439} style={{ margin: 0 }} value={sliderValueForTime()} onChange={changeSliderTime} />
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
        </Background>
    );
};

ShadowTool.propTypes = {
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
};
