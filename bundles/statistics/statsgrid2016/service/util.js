/**
 * @function equalSizeBands
 * Creates array of numbers between min & max so that delta between numbers is the same
 * @param {Number} classCount number of classed requested. Array length will be classCount+1
 * @param {Number} min
 * @param {Number} max
 */
export function equalSizeBands (classCount, min, max) {
    var output = [];
    if (classCount < 1) {
        return;
    }
    var step = (max - min) / classCount;

    for (var i = 0; i < classCount; i++) {
        output.push(min + step * i);
    }

    output.push(max);
    return output;
};

/**
 * Generates a function that returns a value based on input but makes sure it is within given range.
 */
export const createClamp = (min, max) => value => {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
};
