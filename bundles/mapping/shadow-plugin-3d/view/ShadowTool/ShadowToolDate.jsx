import React from 'react';
import PropTypes from 'prop-types';
import { StyledIcon, Row, Col, ColFixed, StyledInput, StyledButton, StyledDateSlider } from './ShadowToolStyled';
import moment from 'moment';

/**
 * NOTE! Hardcoded to year 2019 so no leap years
 */
const DAYS = 365;

export const ShadowToolDate = ({ changeHandler, sliderDateValue, dateValue, currentTimeHandler }) => {
    const inputChangeDate = event => {
        const val = event.target.value;
        changeHandler(val);
    };

    const changeSliderDate = (val) => {
        const d = new Date(2019, 0, val);
        const timeToSet = moment(d).format('D/M');
        changeHandler(timeToSet);
    };

    const marksForDate = () => {
        const months = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        const styledMark = {
            color: '#fff'
        };
        let i = 0;
        return months.reduce((marks, month) => {
            i++;
            return {
                ...marks,
                [month]: {
                    style: styledMark,
                    label: i
                }
            };
        }, {});
    };

    const setCurrentTime = () => {
        const d = new Date();
        const fMinutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        const curTime = `${d.getHours()}:${fMinutes}`;
        const curDate = `${d.getDate()}/${d.getMonth() + 1}`;
        currentTimeHandler(curTime, curDate);
    };

    return (
        <Row>
            <Col>
                <StyledIcon type="calendar" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                <StyledInput value={dateValue} onChange={inputChangeDate} />
            </Col>
            <ColFixed>
                <StyledDateSlider marks={marksForDate()} min={1} max={DAYS} step={1} value={sliderDateValue} onChange={changeSliderDate} tooltipVisible={false} />
            </ColFixed>
            <Col>
                <StyledButton onClick={setCurrentTime}>Nykyhetki</StyledButton>
            </Col>
        </Row>
    );
};

ShadowToolDate.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    sliderDateValue: PropTypes.number.isRequired,
    dateValue: PropTypes.string.isRequired,
    currentTimeHandler: PropTypes.func.isRequired
};
