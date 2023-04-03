import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { timeUnits } from './constants';

dayjs.extend(customParseFormat);

const calculateYearDifference = (from, to) => {
    return from - to;
}

const calculateMonthDifference = (from, to) => {
    return dayjs(to).diff(dayjs(from), timeUnits.MONTH);
};

const calculateDayDifference = (from, to) => {
    return dayjs(to).diff(dayjs(from), timeUnits.DAY);
};

const calculateHourDifference = (from, to) => {
    return dayjs(to).diff(dayjs(from), timeUnits.HOUR);
};

export const getDifferenceCalculator = (unit) => {
    switch (unit) {
        case timeUnits.YEAR:
            return calculateYearDifference;
        case timeUnits.MONTH:
            return calculateMonthDifference;
        case timeUnits.DAY:
            return calculateDayDifference;
        case timeUnits.HOUR:
            return calculateHourDifference;
        default:
            return calculateYearDifference;
    }
};

export const calculateSvgX = (clientX, svg) => {
    const ctm = svg.getScreenCTM();
    return (clientX - ctm.e) / ctm.a;
}
