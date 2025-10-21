const jQuery = require('jquery');
global.jQuery = jQuery;
import { EFFECT, DELTA, DEFAULT_DELTA } from './constants';

describe('isNumber function', () => {
    test('returns true when parameter is number', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber(1)).toEqual(true);
    });

    test('returns false when parameter letter', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber('a')).toEqual(false);
    });

    test('returns false without parameters (appears as undefined)', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber()).toEqual(false);
    });

    test('returns false when parameters are null', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber(null, null)).toEqual(false);
    });

    test('returns false with leading zero and keep option true', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber('01', true)).toEqual(false);
    });

    test('returns false with array where one element is string with leading zero and keepLeadingZero option true', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber([12, 14.8, new Number(199), '01'], true)).toEqual(false);
    });

    test('returns true with array where all elements are numbers', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber([12, 14.8, new Number(199)])).toEqual(true);
    });

    test('returns false with array where one element is not number', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumber([12, 'a', new Number(199)])).toEqual(false);
    });
});

describe('isDecimal function', () => {

    test('returns true when parameter is decimal number', () => {
        expect.assertions(1);
        expect(Oskari.util.isDecimal(1.1)).toEqual(true);
    });

    test('returns false when parameter is integer', () => {
        expect.assertions(1);
        expect(Oskari.util.isDecimal(1)).toEqual(false);
    });

    test('returns false when parameter is letter', () => {
        expect.assertions(1);
        expect(Oskari.util.isDecimal('a')).toEqual(false);
    });

    test('returns false without parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.isDecimal()).toEqual(false);
    });

    test('returns false with array where one element is not decimal number', () => {
        expect.assertions(1);
        expect(Oskari.util.isDecimal([12.1, 'a', new Number(199.7)])).toEqual(false);
    });

});

describe('decimals function', () => {

    test('returns null without parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.decimals()).toEqual(null);
    });

    test('returns count of decimals as zero with integer', () => {
        expect.assertions(1);
        expect(Oskari.util.decimals(1)).toEqual(0);
    });

    test('returns count of decimals as expected with decimal parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.decimals(1.234)).toEqual(3);
    });

    test('returns count of decimals as expected with array parameter', () => {
        expect.assertions(1);
        const params = [1, 156.99883, 1.2, 2.23, 19.8];
        expect(Oskari.util.decimals(params)).toEqual(5);
    });
});

describe('hexToRgb function', () => {

    test('returns correct value with parameter FFFFFF (= White)', () => {
        expect.assertions(1);
        expect(Oskari.util.hexToRgb('FFFFFF')).toEqual({ "b": 255, "g": 255, "r": 255 });
    });

    test('returns correct value with shorthand parameter 03F', () => {
        expect.assertions(1);
        expect(Oskari.util.hexToRgb('03F')).toEqual({ "b": 255, "g": 51, "r": 0 });
    });

    test('returns correct value with shorthand parameter #03F', () => {
        expect.assertions(1);
        expect(Oskari.util.hexToRgb('#03F')).toEqual({ "b": 255, "g": 51, "r": 0 });
    });

    test('returns correct value with parameter 228B22 (= Green)', () => {
        expect.assertions(1);
        expect(Oskari.util.hexToRgb('228B22')).toEqual({ "b": 34, "g": 139, "r": 34 });
    });

    test('returns null when incorrect parameter is provided', () => {
        expect.assertions(1);
        expect(Oskari.util.hexToRgb('YYYYYY')).toEqual(null);
    });

    test('throws TypeError when parameter is not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.hexToRgb()).toThrow(TypeError);
    });

});

describe('rgbToHex function', () => {

    test('returns correct value with rgb(255,0,0) (= Red)', () => {
        expect.assertions(1);
        expect(Oskari.util.rgbToHex('rgb(255,0,0)')).toEqual('ff0000');
    });

    test('returns correct value with rgb(0,191,255) (= Light blue)', () => {
        expect.assertions(1);
        expect(Oskari.util.rgbToHex('rgb(0,191,255)')).toEqual('00bfff');
    });

    test('returns passed parameter without # when # is included as first char', () => {
        expect.assertions(1);
        expect(Oskari.util.rgbToHex('#rgb(255,0,0)')).toEqual('rgb(255,0,0)');
    });

    test('throws TypeError when invalid parameter is provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.rgbToHex('invalid')).toThrow(TypeError);
    });

    test('throws TypeError when parameter is not provided', () => {
        expect.assertions(1)
        expect(() => Oskari.util.rgbToHex()).toThrow(TypeError);
    });

});

describe('colorToArray function', () => {

    test('returns correct parts with rgb(255,0,0) (= Red)', () => {
        expect.assertions(1);
        expect(Oskari.util.colorToArray('rgb(255,0,0)')).toEqual([255, 0, 0]);
    });

    test('returns correct parts with rgba(0,191,255, 0.5) (= Light blue)', () => {
        expect.assertions(1);
        expect(Oskari.util.colorToArray('rgba(0,191,255, 0.5)')).toEqual([0, 191, 255, 0.5]);
    });

    test('returns correct parts with parameter FFFFFF (= White)', () => {
        expect.assertions(1);
        expect(Oskari.util.colorToArray('FFFFFF')).toEqual([255, 255, 255]);
    });

    test('returns correct parts with shorthand parameter 03F', () => {
        expect.assertions(1);
        expect(Oskari.util.colorToArray('03F')).toEqual([0, 51, 255]);
    });

    test('returns correct parts with shorthand parameter #03F0', () => {
        expect.assertions(1);
        expect(Oskari.util.colorToArray('#03F0')).toEqual([0, 51, 255, 0]);
    });

    test('returns correct parts with parameter #FFFFFFFF', () => {
        expect.assertions(1);
        expect(Oskari.util.colorToArray('#FFFFFFFF')).toEqual([255, 255, 255, 1]);
    });

    test('returns empty array when invalid parameter is provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.colorToArray('invalid')).toHaveLength(0);
    });

    test('returns empty array when parameter is not provided', () => {
        expect.assertions(1)
        expect(() => Oskari.util.colorToArray()).toHaveLength(0);
    });

});

describe('getColorEffect and alterBrightness functions should return same', () => {
    test('hex and positive amount', () => {
        expect.assertions(1);
        const hex = '#9932cc';
        const effect = 10;
        expect(Oskari.util.getColorEffect(hex, effect)).toEqual(Oskari.util.alterBrightness(hex, effect));
    });
    test('hex and negative amount', () => {
        expect.assertions(1);
        const hex = '#9932cc';
        const effect = -10;
        expect(Oskari.util.getColorEffect(hex, effect)).toEqual(Oskari.util.alterBrightness(hex, effect));
    });
    test('hex and auto', () => {
        expect.assertions(2);
        const hex = '#9932cc';
        const delta = DEFAULT_DELTA;
        expect(Oskari.util.getDeltaForEffect(hex, EFFECT.AUTO)).toEqual(delta);
        expect(Oskari.util.getColorEffect(hex, EFFECT.AUTO)).toEqual(Oskari.util.alterBrightness(hex, delta));
    });
    test('hex and lighten', () => {
        expect.assertions(2);
        const hex = '#9932cc';
        const delta = 60;
        expect(Oskari.util.getDeltaForEffect(hex, EFFECT.LIGHTEN_MINOR)).toEqual(delta);
        expect(Oskari.util.getColorEffect(hex, EFFECT.LIGHTEN_MINOR)).toEqual(Oskari.util.alterBrightness(hex, delta));
    });
    test('hex and darken', () => {
        expect.assertions(2);
        const hex = '#9932cc';
        const delta = -60;
        expect(Oskari.util.getDeltaForEffect(hex, EFFECT.DARKEN_MINOR)).toEqual(delta);
        expect(Oskari.util.getColorEffect(hex, EFFECT.DARKEN_MINOR)).toEqual(Oskari.util.alterBrightness(hex, delta));
    });
});

describe('getColorEffect function', () => {

    const rgb = 'rgb(153,50,204)';
    const rgba = 'rgba(153,50,204,0.5)';
    const hex = '#9932cc';
    const a = '50'
    const hexa = hex + a;
    const alpha = parseInt(a, 16) / 255;

    test('returns passed color when amount with value 0 is provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(rgb, 0)).toEqual(rgb);
    });

    test('returns passed color when effect is missing', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hex)).toEqual(hex);
    });

    test('returns lighter color when rgb color and positive amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(rgb, 5)).toEqual('#9e37d1');
    });

    test('returns darker color when rgb color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(rgb, -5)).toEqual('#942dc7');
    });

    test('flips change when color is light and amount (auto effect) is provided as parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect('ffffff', 5)).toEqual('#fafafa');
    });

    test('returns white in edge case when trying to lighter white', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect('ffffff', EFFECT.LIGHTEN)).toEqual('#ffffff');
    });

    test('returns black in edge case when trying to darker black', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect('000000', EFFECT.DARKEN)).toEqual('#000000');
    });

    test('returns lighter color when hex color and lighten effect are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hex, EFFECT.LIGHTEN)).toEqual('#f38cff');
    });

    test('returns darker color when hex color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hex, EFFECT.DARKEN)).toEqual('#3f0072');
    });

    test('returns lighter color when rgba color and positive amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(rgba, 5)).toEqual('rgba(158,55,209,0.5)');
    });

    test('returns darker color when hex color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(rgba, EFFECT.AUTO)).toEqual('rgba(243,140,255,0.5)');
    });

    test('returns darker color when hex color with alpha and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hexa, -5)).toEqual(`rgba(148,45,199,${alpha})`);
    });

    test('returns darker color when hex color with alpha and darken effect are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hexa, EFFECT.DARKEN_MINOR)).toEqual(`rgba(93,0,144,${alpha})`);
    });

    test('returns darker color when hex color (without "#") with alpha and darken effect are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hexa.substring(1), EFFECT.LIGHTEN_MAJOR)).toEqual(`rgba(255,170,255,${alpha})`);
    });

    test('Returns passed color when rgb color is provided and amount parameter is not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(rgb)).toEqual(rgb);
    });

    test('Returns passed color when hex color is provided and none effect is not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect(hex, EFFECT.NONE)).toEqual(hex);
    });
    test('Returns undefined (passed color) when parameters are not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorEffect()).toEqual(undefined);
    });
});

describe('alterBrightness function', () => {

    const parameterAsRgb = 'rgb(153,50,204)'
    const parameterAsHex = '9932cc'

    test('returns passed color when when rgb color and amount with value 0 is provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsRgb, 0)).toEqual(parameterAsHex);
    });

    test('returns passed color when hex color and amount with value 0 is provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsHex, 0)).toEqual(parameterAsHex);
    });

    test('returns lighter color when rgb color and positive amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsRgb, 5)).toEqual('9e37d1');
    });

    test('returns lighter color when hex color and positive amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsHex, 5)).toEqual('9e37d1');
    });

    test('returns darker color when rgb color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsRgb, -5)).toEqual('942dc7');
    });

    test('returns darker color when hex color and negative amount are provided as parameters', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsHex, -5)).toEqual('942dc7');
    });

    test('Returns 000000 (= Black) when rgb color is provided and amount parameter is not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsRgb)).toEqual('000000');
    });

    test('Returns 000000 (= Black) when hex color is provided and amount parameter is not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness(parameterAsHex)).toEqual('000000');
    });

    test('flips change when color is light and lightColorFlip is provided as parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness('ffffff', 5, true)).toEqual('fafafa');
    });

    test('returns white in edge case when trying to lighter white', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness('ffffff', 5)).toEqual('ffffff');
    });

    test('returns black in edge case when trying to darker black', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness('000000', -5)).toEqual('000000');
    });

    test('includes bound in result if included in parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness('#000000', -5)).toEqual('#000000');
    });

    test('Returns passed parameter with not supported rgba parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.alterBrightness('rgba(255,0,0,0.3)', -5)).toEqual('rgba(255,0,0,0.3)');
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.alterBrightness()).toThrow(TypeError);
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
        expect(Oskari.util.keyExists(object, "level1.level2")).toEqual(true);
    });

    test('returns false when key not exists', () => {
        expect.assertions(1);
        expect(Oskari.util.keyExists(object, "level1.dummy")).toEqual(false);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.keyExists()).toThrow(TypeError);
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
        expect(Oskari.util.naturalSort()).toEqual(0);
    });

    test('returns sort number -1 when only first paremeter is provided', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('a')).toEqual(-1);
    });

    test('returns sort number 1 when only second paremeter is provided', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort(null, 'b')).toEqual(1);
    });

    test('returns sort number correctly with string parameters ascending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('a', 'b', sortAscending)).toEqual(-1);
    });

    test('returns sort number correctly with string parameters descending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('a', 'b', sortDescending)).toEqual(1);
    });

    test('returns sort number correctly with integer parameters ascending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort(1, 2, sortAscending)).toEqual(-1);
    });

    test('returns sort number correctly with integer parameters descending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort(1, 2, sortDescending)).toEqual(1);
    });

    test('returns sort number correctly with double parameters descending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort(10.1, 22.1, sortDescending)).toEqual(1);
    });

    test('returns sort number correctly with double parameters ascending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort(10.1, 22.1, sortAscending)).toEqual(-1);
    });

    test('returns sort number correctly with multi-digit string as first parameter ascending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('z11', 'z2', sortAscending)).toEqual(1);
    });

    test('returns sort number correctly with multi-digit string as first parameter descending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('z11', 'z2', sortDescending)).toEqual(-1);
    });

    test('returns sort number correctly with multi-digit string as second parameter ascending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('z2', 'z11', sortAscending)).toEqual(-1);
    });

    test('returns sort number correctly with multi-digit string as second parameter descending', () => {
        expect.assertions(1);
        expect(Oskari.util.naturalSort('z2', 'z11', sortDescending)).toEqual(1);
    });
});

describe('getColorBrightness function', () => {

    test('returns dark with black rgb parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorBrightness('rgb(0,0,0)')).toEqual('dark');
    });

    test('returns light with white rgb parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorBrightness('rgb(255,255,255)')).toEqual('light');
    });

    test('returns dark with black hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorBrightness('#000000')).toEqual('dark');
    });

    test('returns light with white hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorBrightness('#FFFFFF')).toEqual('light');
    });

    test('returns light with white sort hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.getColorBrightness('#FFF')).toEqual('light');
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.getColorBrightness()).toThrow(TypeError);
    });
});

describe('isDarkColor function', () => {

    test('returns true with black rgb parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isDarkColor('rgb(0,0,0)')).toEqual(true);
    });

    test('returns false with white rgb parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isDarkColor('rgb(255,255,255)')).toEqual(false);
    });

    test('returns true with black hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isDarkColor('#000000')).toEqual(true);
    });

    test('returns false with white hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isDarkColor('#FFFFFF')).toEqual(false);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.isDarkColor()).toThrow(TypeError);
    });
});

describe('isLightColor  function', () => {

    test('returns false with black rgb parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isLightColor('rgb(0,0,0)')).toEqual(false);
    });

    test('returns true with white rgb parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isLightColor('rgb(255,255,255)')).toEqual(true);
    });

    test('returns false with black hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isLightColor('#000000')).toEqual(false);
    });

    test('returns true with white hex parameter', () => {
        expect.assertions(1);
        expect(Oskari.util.isLightColor('#FFFFFF')).toEqual(true);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.isLightColor()).toThrow(TypeError);
    });
});

describe('coordinateMetricToDegrees function', () => {

    test('returns degrees correctly', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateMetricToDegrees([20, 33], 2)).toEqual(["20° 0' 0,00\"", "33° 0' 0,00\""]);
    });

    test('returns array with NaN values when invalid parameters are provided', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateMetricToDegrees(['a', 'b'], 0)).toEqual(["0° 0' NaN\"", "0° 0' NaN\""]);
    });

    test('limits decimals to 20', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateMetricToDegrees([20, 33], 21))
            .toEqual(["20° 0' 0,00000000000000000000\"", "33° 0' 0,00000000000000000000\""]);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.coordinateMetricToDegrees()).toThrow(TypeError);
    });

});

describe('coordinateDegreesToMetric  function', () => {

    test('returns degrees correctly', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateDegreesToMetric(['123°', '50°'], 2)).toEqual(["123.00", "50.00"]);
    });

    test('returns array with NaN values when invalid parameters are provided', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateDegreesToMetric(['', '', ''], 0)).toEqual([NaN, NaN]);
    });

    test('limits decimals to 20', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateDegreesToMetric(['123°', '50°'], 21))
            .toEqual(["123.00000000000000000000", "50.00000000000000000000"]);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.coordinateDegreesToMetric()).toThrow(TypeError);
    });

});

describe('coordinateIsDegrees function', () => {

    test('returns true when both coordinates are degrees', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateIsDegrees(['123°', '50°'])).toEqual(true);
    });

    test('returns false when either of coordinates are not degrees', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateIsDegrees(['123', '50'])).toEqual(false);
    });

    test('returns false when first coordinate is not degree', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateIsDegrees(['123', '50°'])).toEqual(false);
    });

    test('returns false when second coordinate is not degree', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateIsDegrees(['123°', '50'])).toEqual(false);
    });

    test('returns false when invalid parameters are provided', () => {
        expect.assertions(1);
        expect(Oskari.util.coordinateIsDegrees(['a', 'b'])).toEqual(false);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.coordinateIsDegrees()).toThrow(TypeError);
    });

});

describe('getRequestParam function', () => {

    const oldWindowHistory = window.history;

    beforeAll(() => {
        window.history.pushState({}, null, '/pathname?param1=value1&param2=value2');
    });

    test('returns value correctly', () => {
        expect.assertions(1);
        expect(Oskari.util.getRequestParam('param1')).toEqual('value1');
    });

    test('returns default value correctly', () => {
        expect.assertions(1);
        expect(Oskari.util.getRequestParam('dummy', 'default')).toEqual('default');
    });

    test('returns undefined when parameter not found and default value not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.getRequestParam('dummy')).toBeUndefined();
    });

    test('returns undefined when parameters are not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.getRequestParam()).toBeUndefined();
    });

    afterAll(() => {
        window.history = oldWindowHistory;
    });

});

describe('isNumberBetween function', () => {

    test('returns true when first number param is between second and third number params', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumberBetween(5, 4, 6)).toEqual(true);
    });

    test('returns false when first number param is not between second and third number params', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumberBetween(7, 4, 6)).toEqual(false);
    });

    test('returns false when parameters are not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumberBetween()).toEqual(false);
    });

    test('returns false when only first parameter is provided', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumberBetween(1)).toEqual(false);
    });

    test('returns true when second parameter is not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumberBetween(1, null, 3)).toEqual(true);
    });

    test('returns false when third parameter is not provided', () => {
        expect.assertions(1);
        expect(Oskari.util.isNumberBetween(3, 1, null)).toEqual(false);
    });

});

describe('arrayMove function', () => {

    test('moves item in array correctly', () => {

        expect.assertions(3);
        const values = [72, 12, 13, 32, 45];

        expect(Oskari.util.arrayMove(values, 1, 2)).toEqual(true);
        expect(values[1]).toEqual(13);
        expect(values[2]).toEqual(12);
    });

    test('returns false and array remains non-changed if from and to parameters are not provided', () => {

        expect.assertions(2);

        const values = [72, 12, 13, 32, 45];
        const originalValues = [...values];

        expect(Oskari.util.arrayMove(values)).toEqual(false);
        expect(values).toEqual(originalValues);
    });

    test('returns false when parameters are not provided ', () => {

        expect.assertions(1);
        expect(Oskari.util.arrayMove()).toEqual(false);
    });

    test('returns false and leaves array untouched when both from and to parameters are out of bounds ', () => {

        expect.assertions(2);

        const values = [72, 12, 13, 32, 45];
        const originalValues = [...values];

        expect(Oskari.util.arrayMove(values, -1, values.length)).toEqual(false);
        expect(values).toEqual(originalValues);
    });

    test('returns true and moves from element to last element in array when to parameters is out of bounds', () => {

        expect.assertions(2);

        const firstItemAtStart = 72;
        const values = [firstItemAtStart, 12, 13, 32, 45];

        expect(Oskari.util.arrayMove(values, 0, values.length)).toEqual(true);
        expect(values[values.length - 1]).toEqual(firstItemAtStart);
    });

    test('returns true and moves last element to position when from parameters is out of bounds', () => {

        expect.assertions(2);

        const lastItemAtStart = 45;
        const values = [72, 12, 13, 32, lastItemAtStart];

        expect(Oskari.util.arrayMove(values, -1, 3)).toEqual(true);
        expect(values[3]).toEqual(lastItemAtStart);
    });

    test('Also works when from and to difference is greater than 60', () => {

        expect.assertions(1);

        const values = [];

        for (let i = 0; i < 100; i++) {
            values[i] = i;
        }

        expect(Oskari.util.arrayMove(values, 1, 64)).toEqual(true);
    });

});

describe('arraysEqual function', () => {

    test('returns true arrays are equal', () => {

        expect.assertions(1);

        const values1 = [72, 12, 13, 32];
        const values2 = [...values1];

        expect(Oskari.util.arraysEqual(values1, values2)).toEqual(true);
    });

    test('returns false order of values are different', () => {

        expect.assertions(1);

        const values1 = [72, 12, 13, 32];
        const values2 = [12, 72, 13, 32];

        expect(Oskari.util.arraysEqual(values1, values2)).toEqual(false);
    });

    test('returns true when parameters are not provided', () => {

        expect.assertions(1);

        expect(Oskari.util.arraysEqual()).toEqual(true);
    });

    test('returns false when first parameters is not provided', () => {

        expect.assertions(1);

        const values = [72, 12, 13, 32];

        expect(Oskari.util.arraysEqual(values, null)).toEqual(false);
    });

    test('returns false when second parameters is not provided', () => {

        expect.assertions(1);

        const values = [72, 12, 13, 32];

        expect(Oskari.util.arraysEqual(null, values)).toEqual(false);
    });

    test('returns false when array lengths are different', () => {

        expect.assertions(1);

        const shorter = [72, 12, 13];
        const longer = [72, 12, 13, 32];

        expect(Oskari.util.arraysEqual(shorter, longer)).toEqual(false);
    });

});

describe('stringLike function', () => {

    test('returns true when string matches pattern', () => {
        expect.assertions(1);
        const patternAsteriskAndPercentageAndUnderscoreIncluded = 'te_t*s%';
        expect(Oskari.util.stringLike('testingstring', patternAsteriskAndPercentageAndUnderscoreIncluded)).toEqual(true);
    });

    test('returns true when string matches pattern', () => {
        expect.assertions(1);
        const patternOnlyNumbers = '^[0-9]*$';
        expect(Oskari.util.stringLike('testing', patternOnlyNumbers)).toEqual(false);
    });

    test('throws TypeError when pattern parameter is not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.stringLike('testing')).toThrow(TypeError);
    });

    test('throws TypeError when value parameter is not provided', () => {
        expect.assertions(1);
        expect(() => Oskari.util.stringLike(null, 'testing')).toThrow(TypeError);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect(() => Oskari.util.stringLike()).toThrow(TypeError);
    });
});

describe('isMobile function', () => {
    afterEach(() => {
        document.body.innerHTML = null;
    });

    test('returns false when screen is not mobile', () => {
        expect.assertions(1);
        document.body.innerHTML =
            `<div id="testroot" style="height: 660px;width: 660px;">
                Dummy div content
            </div>`;
        Oskari.dom.setRootEl('testroot');
        expect(Oskari.util.isMobile()).toEqual(false);
    });

    test('returns true when screen is mobile', () => {
        expect.assertions(1);

        document.body.innerHTML =
            `<div id="testroot" style="height: 300px;width: 300px;">
                Dummy div content
            </div>`;

        Oskari.dom.setRootEl('testroot');
        expect(Oskari.util.isMobile()).toEqual(true);
    });
    test('returns false when screen size is small but device is desktop/cant be detected', () => {
        expect.assertions(1);

        document.body.innerHTML =
            `<div id="testroot" style="height: 300px;width: 300px;">
                Dummy div content
            </div>`;

        Oskari.dom.setRootEl('testroot');
        expect(Oskari.util.isMobile(true)).toEqual(false);
    });
});

describe('getErrorTextFromAjaxFailureObjects function', () => {
    const mockjqHRerrorText = 'mockjqHRerrorText';
    const mockExceptionMessage = 'exceptionmsg';

    const mockjqHR = {
        "responseText": JSON.stringify({"error": mockjqHRerrorText})
    };
    const mockException = {
        "message" : mockExceptionMessage
    };

    const mockExceptionWihtoutMessage = {};

    test('Returns jqXHR.responseText when present', () => {
        expect(Oskari.util.getErrorTextFromAjaxFailureObjects(mockjqHR,mockException)).toEqual(mockjqHRerrorText);
    });

    test('Returns message from exception object when jqXHR is not provided', () => {
        expect(Oskari.util.getErrorTextFromAjaxFailureObjects(null,mockException)).toEqual(mockExceptionMessage);
    });

    test('Returns exception object when jqXHR is not provided and exception does not contain message', () => {
        expect(Oskari.util.getErrorTextFromAjaxFailureObjects(null,mockExceptionWihtoutMessage)).toEqual(mockExceptionWihtoutMessage);
    });

    test('throws TypeError when parameters are not provided', () => {
        expect(() => Oskari.util.getErrorTextFromAjaxFailureObjects()).toThrow(TypeError);
    });

    test('throws TypeError when exception is not provided', () => {
        expect(() => Oskari.util.getErrorTextFromAjaxFailureObjects(mockjqHR,null)).toThrow(TypeError);
    });

});

describe('isValidDomain function', () => {

    test('returns true when domain contains domain extension', () => {
        expect(Oskari.util.isValidDomain('example.com')).toEqual(true);
    });

    test('returns true when domain contains subdomain extension', () => {
        expect(Oskari.util.isValidDomain('foo.example.com')).toEqual(true);
    });

    test('returns true when domain contains multiple subdomain extensions', () => {
        expect(Oskari.util.isValidDomain('bar.foo.example.com')).toEqual(true);
    });

    test('returns true when domain contains dash and subdomain extension', () => {
        expect(Oskari.util.isValidDomain('exa-mple.co.uk')).toEqual(true);
    });

    test('returns false when domain parameter is not provided', () => {
        expect(Oskari.util.isValidDomain()).toEqual(false);
    });

    test('returns false with empty domain parameter', () => {
        expect(Oskari.util.isValidDomain('')).toEqual(false);
    });

    test('returns false when domain constains underscore', () => {
        expect(Oskari.util.isValidDomain('exa_mple.com')).toEqual(false);
    });

    test('returns false when domain does not contain domain name extension', () => {
        expect(Oskari.util.isValidDomain('example')).toEqual(false);
    });

    test('returns false when domain contains only domain extension ', () => {
        expect(Oskari.util.isValidDomain('.fi')).toEqual(false);
    });

    test('returns false when domain contains asterisk', () => {
        expect(Oskari.util.isValidDomain('ex*mple.com')).toEqual(false);
    });

    test('returns false when domain contains space', () => {
        expect(Oskari.util.isValidDomain('ex mple.com')).toEqual(false);
    });

    test('returns false when domain contains only numbers', () => {
        expect(Oskari.util.isValidDomain('3434')).toEqual(false);
    });
});

describe('deepClone function', () => {
    const obj = {foo: {bar : 1}};

    test('returns new reference', () => {
        expect(Oskari.util.deepClone(obj)).not.toBe(obj);
    });

    test('returns equal content', () => {
        expect(Oskari.util.deepClone(obj)).toEqual(obj);
    });

    test('returns merged content', () => {
        const merge1 = {foo: {baz: {test: true}}};
        const merge2 = {foo: {bar: 2}};
        const merge3 = {test: [2]};
        const merged = {foo: {bar: 2, baz: {test: true}}, test: [2]};
        expect(Oskari.util.deepClone(obj, merge1, merge2, merge3)).toEqual(merged);
    });

    test('returns whole style on merge', () => {
        const color = '#000000';
        const size = 1;
        const style = {
            "image": {
                "shape": 5,
                "size": 3,
                "fill": {
                    "color": "#FAEBD7"
                }
            },
            "fill": {
                "area": {
                    "pattern": -1
                },
                "color": "#FAEBD7"
            },
            "stroke": {
                "area": {
                    "color": "#000000",
                    "lineDash": "solid",
                    "width": 1,
                    "lineJoin": "round"
                },
                "color": "#000000",
                "lineCap": "round",
                "lineDash": "solid",
                "width": 1,
                "lineJoin": "round"
            }
        };
        const merge = {
            stroke: {},
            fill: { color },
            image: { size }
        };

        const merged = Oskari.util.deepClone(style, merge);
        style.image.size = size;
        style.fill.color = color;
        expect(style).toEqual(merged);
    });
});
