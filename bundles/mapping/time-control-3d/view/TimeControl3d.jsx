import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Controller, ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';
import { CloseIcon } from '../../../../src/react/components/window/CloseIcon';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { TimeControl } from './TimeControl3d/TimeControl';
import { DateControl } from './TimeControl3d/DateControl';
import { Divider } from './TimeControl3d/styled';
import { validateDate, validateTime } from '../../mapmodule/util/time';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const sliderValueForDate = (d) => {
    const dayMonth = d.split('/');
    const diff = new Date(2019, dayMonth[1] - 1, dayMonth[0]) - new Date(2019, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
};

const sliderValueForTime = (t) => {
    const hoursMinutes = t.split(':');
    const hours = parseInt(hoursMinutes[0], 10) * 60;
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes;
};
// Helper function using react-hooks to manipulate setInterval
function useInterval (callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick () {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const Background = styled.div`
    cursor: grab;
    width: ${props => props.isMobile ? '260px' : '720px'} !important;
    background-color: ${props => props.theme.getNavigationBackgroundColor()};
    padding: 10px 20px 20px;
`;

const Header = styled.div`
    color: ${props => props.theme.getTextColor()};
    display: flex;
    justify-content: space-between;
    > button {
        margin-top: -5px;
        color: ${props => props.theme.getTextColor()};
    }
`;

export const TimeControl3d = ThemeConsumer(({ theme, controller, date, time, isMobile, onClose }) => {
    const navigationTheme = getNavigationTheme(theme);

    const [timeValue, setTime] = useState(time);
    const [dateValue, setDate] = useState(date);
    const [sliderTimeValue, setSliderTime] = useState(sliderValueForTime(time));
    const [sliderDateValue, setSliderDate] = useState(sliderValueForDate(date));
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState('normal');

    useInterval(() => {
        let nextTime;
        let nextDate;
        switch (speed) {
        case 'normal':
            nextTime = addMinutes(6);
            nextDate = calculateNextDay(nextTime);
            break;
        case 'fast':
            nextTime = addMinutes(30);
            nextDate = calculateNextDay(nextTime);
            break;
        case 'slow':
        default:
            nextTime = addMinutes(1);
            nextDate = calculateNextDay(nextTime);
            break;
        }
        changeTimeAndDate(nextTime, nextDate);
    }, playing ? 50 : null);

    const calculateNextDay = (nextTime) => {
        const nextDate = nextTime < timeValue ? addDays(1) : dateValue;
        if (nextDate === '1/1' && nextDate !== dateValue) {
            setPlaying(false);
        }
        return nextDate;
    };

    const addMinutes = (minutes) => {
        return dayjs.utc(timeValue, 'HH:mm').add(minutes, 'minutes').format('HH:mm');
    };

    const addDays = (days) => {
        return dayjs.utc(dateValue, 'D/M').add(days, 'day').format('D/M');
    };

    const changeTime = val => {
        if (validateTime(val)) {
            controller.requestNewTime(val);
            setSliderTime(sliderValueForTime(val));
        }
        setTime(val);
    };

    const changeDate = val => {
        if (validateDate(val)) {
            controller.requestNewDate(val);
            setSliderDate(sliderValueForDate(val));
        }
        setDate(val);
    };

    const changeTimeAndDate = (t, d) => {
        setTime(t);
        setDate(d);
        setSliderDate(sliderValueForDate(d));
        setSliderTime(sliderValueForTime(t));
        controller.requestNewDateAndTime(d, t);
    };

    return (
        <Background isMobile={isMobile} theme={navigationTheme}>
            <Header theme={navigationTheme}>
                <h3><Message messageKey='title'/></h3>
                <CloseIcon onClose={onClose}/>
            </Header>
            <DateControl
                isMobile={isMobile}
                changeHandler={changeDate}
                sliderDateValue={sliderDateValue}
                dateValue={dateValue}
                currentTimeHandler={changeTimeAndDate}
            />
            <Divider />
            <TimeControl
                isMobile={isMobile}
                changeHandler={changeTime}
                timeValue={timeValue}
                sliderTimeValue={sliderTimeValue}
                playing={playing}
                playHandler={setPlaying}
                speedHandler={setSpeed}
                speed={speed}
            />
        </Background>
    );
});

TimeControl3d.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired
};
