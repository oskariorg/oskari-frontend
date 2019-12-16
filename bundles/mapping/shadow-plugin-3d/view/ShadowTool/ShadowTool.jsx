import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';
import { Background } from './ShadowToolStyled';
import { ShadowToolTime } from './ShadowToolTime';
import { ShadowToolDate } from './ShadowToolDate';

const sliderValueForDate = (d) => {
    const dayMonth = d.split('/');
    const dObject = new Date(2019, dayMonth[1] - 1, dayMonth[0]);
    const start = new Date(2019, 0, 0);
    const diff = dObject - start;
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

export const ShadowTool = ({ mutator, date, time }) => {
    const [timeValue, setTime] = useState(time);
    const [dateValue, setDate] = useState(date);
    const [sliderTimeValue, setSliderTime] = useState(sliderValueForTime(time));
    const [sliderDateValue, setSliderDate] = useState(sliderValueForDate(date));

    /**
     * Duplicated in SetTimeRequestHandler
     * TODO have util.js on 3d-mapmodule that could be imported to both
     */
    const validateTime = target => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
        return regex.test(target);
    };

    const changeTime = val => {
        if (validateTime(val)) {
            mutator.setTime(val);
            setSliderTime(sliderValueForTime(val));
        }
        setTime(val);
    };

    /**
     * Duplicated in SetTimeRequestHandler
     * TODO have util.js on 3d-mapmodule that could be imported to both
     */
    const validateDate = target => {
        const matches = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])[/](0[1-9]|1[0-2]|[1-9])$/.exec(target);
        if (matches === null) {
            return false;
        }
        const d = parseInt(matches[1]);
        const m = matches[2] - 1;
        const dateObject = new Date(2019, m, d);
        return dateObject.getDate() === d && dateObject.getMonth() === m;
    };

    const changeDate = val => {
        if (validateDate(val)) {
            mutator.setDate(val);
            setSliderDate(sliderValueForDate(val));
        }
        setDate(val);
    };

    const setTimeAndDate = (t, d) => {
        setTime(t);
        setDate(d);
        setSliderDate(sliderValueForDate(d));
        setSliderTime(sliderValueForTime(t));
        mutator.setCurrentTime(d, t);
    };

    return (
        <Background>
            <ShadowToolDate
                changeHandler={changeDate}
                sliderDateValue={sliderDateValue}
                dateValue={dateValue}
                currentTimeHandler={setTimeAndDate}
            />
            <ShadowToolTime
                changeHandler={changeTime}
                timeValue={timeValue}
                sliderTimeValue={sliderTimeValue}
            />
        </Background>
    );
};

ShadowTool.propTypes = {
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
};
