import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';
import { Background } from './ShadowToolStyled';
import { ShadowToolTime } from './ShadowToolTime';
import { ShadowToolDate } from './ShadowToolDate';
import { validateDate, validateTime, sliderValueForDate, sliderValueForTime } from './ShadowToolUtil';
import moment from 'moment';

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
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const ShadowTool = ({ mutator, date, time }) => {
    const [timeValue, setTime] = useState(time);
    const [dateValue, setDate] = useState(date);
    const [sliderTimeValue, setSliderTime] = useState(sliderValueForTime(time));
    const [sliderDateValue, setSliderDate] = useState(sliderValueForDate(date));
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState('slow');

    useInterval(() => {
        let nextTime;
        let nextDate;
        switch (speed) {
        case 'normal':
            nextTime = moment.utc(timeValue, 'HH:mm').add(6, 'minutes').format('HH:mm');
            nextDate = nextTime < timeValue
                ? moment.utc(dateValue, 'D/M').add(1, 'day').format('D/M')
                : dateValue;
            break;
        case 'fast':
            nextTime = moment.utc(timeValue, 'HH:mm').add(30, 'minutes').format('HH:mm');
            nextDate = nextTime < timeValue
                ? moment.utc(dateValue, 'D/M').add(1, 'day').format('D/M')
                : dateValue;
            break;
        case 'superfast':
            nextTime = timeValue;
            nextDate = moment.utc(dateValue, 'D/M').add(1, 'day').format('D/M');
            break;
        default:
            nextTime = moment.utc(timeValue, 'HH:mm').add(1, 'minute').format('HH:mm');
            nextDate = nextTime < timeValue
                ? moment.utc(dateValue, 'D/M').add(1, 'day').format('D/M')
                : dateValue;
            break;
        }
        changeTimeAndDate(nextTime, nextDate);
    }, playing ? 100 : null);

    const changeTime = val => {
        if (validateTime(val)) {
            mutator.setTime(val);
            setSliderTime(sliderValueForTime(val));
        }
        setTime(val);
    };

    const changeDate = val => {
        if (validateDate(val)) {
            mutator.setDate(val);
            setSliderDate(sliderValueForDate(val));
        }
        setDate(val);
    };

    const changeTimeAndDate = (t, d) => {
        setTime(t);
        setDate(d);
        setSliderDate(sliderValueForDate(d));
        setSliderTime(sliderValueForTime(t));
        mutator.setTimeAndDate(d, t);
    };

    return (
        <Background>
            <ShadowToolDate
                changeHandler={changeDate}
                sliderDateValue={sliderDateValue}
                dateValue={dateValue}
                currentTimeHandler={changeTimeAndDate}
            />
            <ShadowToolTime
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
};

ShadowTool.propTypes = {
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
};
