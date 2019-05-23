/*
* util.js requires Oskari object with few functions in global variables in order to work without errors.
* For this reason mock object is created and placed to global variables before importing util 
*/
const OskariMock = {
    log: () => {
        return {
            // Prevent debug logging in tests to achieve leaner Jest test execution output
            debug: (text) => { }
        }
    },
    getDecimalSeparator: () => { return '.' }
};

global.Oskari = OskariMock;
const util = require('./util')

describe('throttle function', () => {

    test('with leading false waits given time before calling function again', () => {

        expect.assertions(1);

        const wait = 1000;

        const throttledFunction = OskariMock.util.throttle(() => {
            return 1;
        }, wait, { leading: false });

        let start = Date.now();
        while (undefined === throttledFunction()) { };
        let end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(wait);
    });
});

describe('isNumber function', () => {

    test('returns true when parameter is number', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumber(1)).toEqual(true);
    });

    test('returns false when parameter letter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumber('a')).toEqual(false);
    });

    test('returns false without parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumber()).toEqual(false);
    });
});

describe('isDecimal function', () => {

    test('returns true when parameter is decimal number', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDecimal(1.1)).toEqual(true);
    });

    test('returns false when parameter is integer', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDecimal(1)).toEqual(false);
    });

    test('returns false when parameter is letter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDecimal('a')).toEqual(false);
    });

    test('returns false without parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDecimal()).toEqual(false);
    });
});

describe('decimals function', () => {

    test('returns null without parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.decimals()).toEqual(null);
    });

    test('returns count of decimals as zero with integer', () => {
        expect.assertions(1);
        expect(OskariMock.util.decimals(1)).toEqual(0);
    });

    test('returns count of decimals as expected with decimal parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.decimals(1.234)).toEqual(3);
    });

    test('returns count of decimals as expected with array parameter', () => {
        expect.assertions(1);
        const params = [1, 156.99883, 1.2, 2.23, 19.8];
        expect(OskariMock.util.decimals(params)).toEqual(5);
    });
});

describe('hexToRgb function', () => {

    test('returns correct value with parameter FFFFFF (= White)', () => {
        expect.assertions(1);
        expect(OskariMock.util.hexToRgb('FFFFFF')).toEqual({ "b": 255, "g": 255, "r": 255 });
    });

    test('returns correct value with parameter 228B22 (= Green)', () => {
        expect.assertions(1);
        expect(OskariMock.util.hexToRgb('228B22')).toEqual({ "b": 34, "g": 139, "r": 34 });
    });

    test('returns null when incorrect parameter is provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.hexToRgb('YYYYYY')).toEqual(null);
    });

    test('throws TypeError when parameter is not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.hexToRgb()).toThrowError(TypeError);
    });

});

describe('rgbToHex function', () => {

    test('returns correct value with rgb(255,0,0) (= Red)', () => {
        expect.assertions(1);
        expect(OskariMock.util.rgbToHex('rgb(255,0,0)')).toEqual('ff0000');
    });

    test('returns correct value with rgb(0,191,255) (= Light blue)', () => {
        expect.assertions(1);
        expect(OskariMock.util.rgbToHex('rgb(0,191,255)')).toEqual('00bfff');
    });

    test('throws TypeError when invalid parameter is provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.rgbToHex('invalid')).toThrowError(TypeError);
    });

    test('throws TypeError when parameter is not provided', () => {
        expect.assertions(1)
        expect(() => OskariMock.util.rgbToHex()).toThrowError(TypeError);
    });

});

describe('alterBrightness function', () => {

    const parameterAsRgb = 'rgb(153,50,204)'
    const parameterAsHex = '9932cc'

    test('returns passed color when when rgb color and amount with value 0 is provided as parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsRgb, 0)).toEqual(parameterAsHex);
    });

    test('returns passed color when hex color and amount with value 0 is provided as parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsHex, 0)).toEqual(parameterAsHex);
    });

    test('returns lighter color when rgb color and positive amount are provided as parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsRgb, 5)).toEqual('9e37d1');
    });

    test('returns lighter color when hex color and positive amount are provided as parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsHex, 5)).toEqual('9e37d1');
    });

    test('returns darker color when rgb color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsRgb, -5)).toEqual('942dc7');
    });

    test('returns darker color when hex color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsHex, -5)).toEqual('942dc7');
    });

    test('Returns 000000 (= Black) when rgb color is provided and amount parameter is not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsRgb)).toEqual('000000');
    });

    test('Returns 000000 (= Black) when hex color is provided and amount parameter is not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness(parameterAsHex)).toEqual('000000');
    });

    test('flips change when color is light and lightColorFlip is provided as parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness('ffffff', 5, true)).toEqual('fafafa');
    });

    test('returns white in edge case when trying to lighter white', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness('ffffff', 5)).toEqual('ffffff');
    });

    test('returns black in edge case when trying to darker black', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness('000000', -5)).toEqual('000000');
    });

    test('includes bound in result if included in parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.alterBrightness('#000000', -5)).toEqual('#000000');
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.alterBrightness()).toThrowError(TypeError);
    });
});

describe('keyExists function', () => {

    const object = {
        "level1": {
            "level2": "value"
        }
    }

    test('returns true when key exists', () => {
        expect.assertions(1);
        expect(OskariMock.util.keyExists(object, "level1.level2")).toEqual(true);
    });

    test('returns false when key not exists', () => {
        expect.assertions(1);
        expect(OskariMock.util.keyExists(object, "level1.dummy")).toEqual(false);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.keyExists()).toThrowError(TypeError);
    });
});

describe('naturalSort function', () => {

    /*
    * Natural sort returns 1 if parameters are in correct order with used ascending / descending and
    * -1 if parameters are in incorrect order with used ascending / descending.
    */
    const sortAscending = false;
    const sortDescending = true;

    test('returns sort number 0 when parameters are not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort()).toEqual(0);
    });

    test('returns sort number -1 when only first paremeter is provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort('a')).toEqual(-1);
    });

    test('returns sort number 1 when only second paremeter is provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort(null, 'b')).toEqual(1);
    });

    test('returns sort number correctly with string parameters ascending', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort('a', 'b', sortAscending)).toEqual(-1);
    });

    test('returns sort number correctly with string parameters descending', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort('a', 'b', sortDescending)).toEqual(1);
    });

    test('returns sort number correctly with integer parameters ascending', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort(1, 2, sortAscending)).toEqual(-1);
    });

    test('returns sort number correctly with integer parameters descending', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort(1, 2, sortDescending)).toEqual(1);
    });

    test('returns sort number correctly with double parameters ascending', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort(10.1, 22.1, sortDescending)).toEqual(1);
    });

    test('returns sort number correctly with double parameters descending', () => {
        expect.assertions(1);
        expect(OskariMock.util.naturalSort(10.1, 22.1, sortAscending)).toEqual(-1);
    });
});

describe('getColorBrightness function', () => {

    test('returns dark with black rgb parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.getColorBrightness('rgb(0,0,0)')).toEqual('dark');
    });

    test('returns light with white rgb parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.getColorBrightness('rgb(255,255,255)')).toEqual('light');
    });

    test('returns dark with black hex parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.getColorBrightness('#000000')).toEqual('dark');
    });

    test('returns light with white hex parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.getColorBrightness('#FFFFFF')).toEqual('light');
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.getColorBrightness()).toThrowError(TypeError);
    });
});

describe('isDarkColor function', () => {

    test('returns true with black rgb parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDarkColor('rgb(0,0,0)')).toEqual(true);
    });

    test('returns false with white rgb parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDarkColor('rgb(255,255,255)')).toEqual(false);
    });

    test('returns true with black hex parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDarkColor('#000000')).toEqual(true);
    });

    test('returns false with white hex parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isDarkColor('#FFFFFF')).toEqual(false);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.isDarkColor()).toThrowError(TypeError);
    });
});

describe('isLightColor  function', () => {

    test('returns false with black rgb parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isLightColor('rgb(0,0,0)')).toEqual(false);
    });

    test('returns true with white rgb parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isLightColor('rgb(255,255,255)')).toEqual(true);
    });

    test('returns false with black hex parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isLightColor('#000000')).toEqual(false);
    });

    test('returns true with white hex parameter', () => {
        expect.assertions(1);
        expect(OskariMock.util.isLightColor('#FFFFFF')).toEqual(true);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.isLightColor()).toThrowError(TypeError);
    });
});

describe('coordinateMetricToDegrees function', () => {

    test('returns degrees correctly', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateMetricToDegrees([20, 33], 2)).toEqual(["20° 0' 0.00\"", "33° 0' 0.00\""]);
    });

    test('returns array with NaN values when invalid parameters are provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateMetricToDegrees(['a', 'b'], 0)).toEqual(["0° 0' NaN\"", "0° 0' NaN\""]);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.coordinateMetricToDegrees()).toThrowError(TypeError);
    });

});

describe('coordinateDegreesToMetric  function', () => {

    test('returns degrees correctly', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateDegreesToMetric(['123°', '50°'], 2)).toEqual(["123.00", "50.00"]);
    });

    test('returns array with NaN values when invalid parameters are provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateDegreesToMetric(['a', 'b'], 0)).toEqual([NaN, NaN]);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.coordinateDegreesToMetric()).toThrowError(TypeError);
    });

});

describe('coordinateIsDegrees function', () => {

    test('returns true when both coordinates are degrees', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateIsDegrees(['123°', '50°'])).toEqual(true);
    });

    test('returns false when either of coordinates are not degrees', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateIsDegrees(['123', '50'])).toEqual(false);
    });

    test('returns false when first coordinate is not degree', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateIsDegrees(['123', '50°'])).toEqual(false);
    });

    test('returns false when second coordinate is not degree', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateIsDegrees(['123°', '50'])).toEqual(false);
    });

    test('returns false when invalid parameters are provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.coordinateIsDegrees(['a', 'b'])).toEqual(false);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => OskariMock.util.coordinateIsDegrees()).toThrowError(TypeError);
    });

});

describe('getRequestParam function', () => {

    const oldWindowHistory = window.history;

    beforeAll(() => {
        window.history.pushState({}, null, '/pathname?param1=value1&param2=value2');
    });

    test('returns value correctly', () => {
        expect.assertions(1);
        expect(OskariMock.util.getRequestParam('param1')).toEqual('value1');
    });

    test('returns default value correctly', () => {
        expect.assertions(1);
        expect(OskariMock.util.getRequestParam('dummy', 'default')).toEqual('default');
    });

    test('returns undefined when parameter not found and default value not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.getRequestParam('dummy')).toBeUndefined();
    });

    test('returns undefined when parameters are not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.getRequestParam()).toBeUndefined();
    });

    afterAll(() => {
        window.history = oldWindowHistory;
    });

});

describe('isNumberBetween function', () => {

    test('returns true when first number param is between second and third number params', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumberBetween(5, 4, 6)).toEqual(true);
    });

    test('returns false when first number param is not between second and third number params', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumberBetween(7, 4, 6)).toEqual(false);
    });

    test('returns false when parameters are not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumberBetween()).toEqual(false);
    });

    test('returns false when only first parameter is provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumberBetween(1)).toEqual(false);
    });

    test('returns true when second parameter is not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumberBetween(1, null, 3)).toEqual(true);
    });

    test('returns false when third parameter is not provided', () => {
        expect.assertions(1);
        expect(OskariMock.util.isNumberBetween(3, 1, null)).toEqual(false);
    });

});

describe('arrayMove function', () => {

    test('moves item in array correctly', () => {

        expect.assertions(3);
        const values = [72, 12, 13, 32, 45];

        expect(OskariMock.util.arrayMove(values, 1, 2)).toEqual(true);
        expect(values[1]).toEqual(13);
        expect(values[2]).toEqual(12);
    });

    test('returns false and array remains non-changed if from and to parameters are not provided', () => {

        expect.assertions(2);

        const values = [72, 12, 13, 32, 45];
        const originalValues = [...values];

        expect(OskariMock.util.arrayMove(values)).toEqual(false);
        expect(values).toEqual(originalValues);
    });

    test('returns false when parameters are not provided ', () => {

        expect.assertions(1);
        expect(OskariMock.util.arrayMove()).toEqual(false);
    });

    test('returns false and leaves array untouched when both from and to parameters are out of bounds ', () => {

        expect.assertions(2);

        const values = [72, 12, 13, 32, 45];
        const originalValues = [...values];

        expect(OskariMock.util.arrayMove(values, -1, values.length)).toEqual(false);
        expect(values).toEqual(originalValues);
    });

    test('returns true and moves from element to last element in array when to parameters is out of bounds', () => {

        expect.assertions(2);

        const firstItemAtStart = 72;
        const values = [firstItemAtStart, 12, 13, 32, 45];

        expect(OskariMock.util.arrayMove(values, 0, values.length)).toEqual(true);
        expect(values[values.length - 1]).toEqual(firstItemAtStart);
    });

    test('returns true and moves last element to position when from parameters is out of bounds', () => {

        expect.assertions(2);

        const lastItemAtStart = 45;
        const values = [72, 12, 13, 32, lastItemAtStart];

        expect(OskariMock.util.arrayMove(values, -1, 3)).toEqual(true);
        expect(values[3]).toEqual(lastItemAtStart);
    });

});

describe('arraysEqual function', () => {

    test('returns true arrays are equal', () => {

        expect.assertions(1);

        const values1 = [72, 12, 13, 32];
        const values2 = [...values1];

        expect(OskariMock.util.arraysEqual(values1, values2)).toEqual(true);
    });

    test('returns false order of values are different', () => {

        expect.assertions(1);

        const values1 = [72, 12, 13, 32];
        const values2 = [12, 72, 13, 32];

        expect(OskariMock.util.arraysEqual(values1, values2)).toEqual(false);
    });

    test('returns true when parameters are not provided', () => {

        expect.assertions(1);

        expect(OskariMock.util.arraysEqual()).toEqual(true);
    });

    test('returns false when first parameters is not provided', () => {

        expect.assertions(1);

        const values = [72, 12, 13, 32];

        expect(OskariMock.util.arraysEqual(values, null)).toEqual(false);
    });

    test('returns false when second parameters is not provided', () => {

        expect.assertions(1);

        const values = [72, 12, 13, 32];

        expect(OskariMock.util.arraysEqual(null, values)).toEqual(false);
    });

});

describe('stringLike function', () => {

    test('returns true when string matches pattern', () => {
        const patternAsteriskAndPercentageAndUnderscoreIncluded = 'te_t*s%';
        expect(OskariMock.util.stringLike('testingstring', patternAsteriskAndPercentageAndUnderscoreIncluded)).toEqual(true);
    });

    test('returns true when string matches pattern', () => {
        const patternOnlyNumbers = '^[0-9]*$';
        expect(OskariMock.util.stringLike('testing', patternOnlyNumbers)).toEqual(false);
    });

    test('throws TypeError when pattern parameter is not provided', () => {
        expect(() => OskariMock.util.stringLike('testing')).toThrowError(TypeError);
    });

    test('throws TypeError when value parameter is not provided', () => {
        expect(() => OskariMock.util.stringLike(null, 'testing')).toThrowError(TypeError);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect(() => OskariMock.util.stringLike()).toThrowError(TypeError);
    });
});