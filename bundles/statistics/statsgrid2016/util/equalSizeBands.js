/**
 * @function equalSizeBands
 * Creates array of numbers between min & max so that delta between numbers is the same
 * @param {Number} classCount number of classed requested. Array length will be classCount+1
 * @param {Number} min
 * @param {Number} max
 */
export default function equalSizeBands (classCount, min, max) {
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
}
