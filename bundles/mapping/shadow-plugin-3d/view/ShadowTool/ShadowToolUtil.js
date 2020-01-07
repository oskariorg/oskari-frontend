export const sliderValueForDate = (d) => {
    const dayMonth = d.split('/');
    const diff = new Date(2019, dayMonth[1] - 1, dayMonth[0]) - new Date(2019, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
};

export const sliderValueForTime = (t) => {
    const hoursMinutes = t.split(':');
    const hours = parseInt(hoursMinutes[0], 10) * 60;
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes;
};

/**
 * Duplicated in SetTimeRequestHandler
 * TODO have util.js on 3d-mapmodule that could be imported to both
 */
export const validateDate = target => {
    const matches = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])[/](0[1-9]|1[0-2]|[1-9])$/.exec(target);
    if (matches === null) {
        return false;
    }
    const d = parseInt(matches[1]);
    const m = matches[2] - 1;
    const dateObject = new Date(2019, m, d);
    return dateObject.getDate() === d && dateObject.getMonth() === m;
};

/**
 * Duplicated in SetTimeRequestHandler
 * TODO have util.js on 3d-mapmodule that could be imported to both
 */
export const validateTime = target => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
    return regex.test(target);
};
