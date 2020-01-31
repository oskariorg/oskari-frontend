/**
 * @method validateDate
 * @return {boolean} true if valid date D/M
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
 * @method validateTime
 * @return {Bool} true if valid time HH:mm
 */
export const validateTime = target => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
    return regex.test(target);
};
