import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';
import { Background } from './ShadowToolStyled';
import { ShadowToolTime } from './ShadowToolTime';
import { ShadowToolDate } from './ShadowToolDate';
import { validateDate, validateTime, sliderValueForDate, sliderValueForTime } from './ShadowToolUtil';
import moment from 'moment';

export const ShadowTool = ({ mutator, date, time }) => {
    const [timeValue, setTime] = useState(time);
    const [dateValue, setDate] = useState(date);
    const [sliderTimeValue, setSliderTime] = useState(sliderValueForTime(time));
    const [sliderDateValue, setSliderDate] = useState(sliderValueForDate(date));
    // const [speed, setSpeed] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const tick = () => {
            if (playing) {
                const nextMinute = moment.utc(timeValue, 'HH:mm').add(1, 'minute').format('HH:mm');
                changeTime(nextMinute);
            }
        };
        const playInterval = setInterval(tick, 1000);
        return () => clearInterval(playInterval);
    }, []);

    const clickPlayButton = () => {
        setPlaying(!playing);
    };

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
            />
            <button onClick={clickPlayButton}>Testi</button>
        </Background>
    );
};

ShadowTool.propTypes = {
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
};
