import DOMPurify from 'dompurify';
import { DELTA, EFFECT, DEFAULT_DELTA } from './constants';
const MobileDetect = require('mobile-detect');

/*
* @class Oskari.util
* Util class instance for static methods what may be used to for checks values.
* For example check at value is number or how many decimals this value have.
*
*/
Oskari.util = (function () {
    const log = Oskari.log('Oskari.util');
    const util = {};

    // break points for "mobile mode"
    const mobileDefs = {
        width: 650,
        height: 500
    };
    const isMobileDevice = !!(new MobileDetect(window.navigator.userAgent).mobile());

    /**
    * Checks at if value has leading zeros.
    * @private @method isLeadingZero
    *
    * @param {Object} value checked value
    */
    function isLeadingZero (value) {
        if (typeof value === 'string' && value.length > 0 && value[0] === '0') {
            if (util.isDecimal(value) && value.length > 1 && value[1] === '.') {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /**
    * Returns a function, that, when invoked, will only be triggered at most once
    * during a given window of time. Normally, the throttled function will run
    * as much as it can, without ever going more than once per `wait` duration;
    * but if you'd like to disable the execution on the leading edge, pass
    * `{leading: false}`. To disable execution on the trailing edge, ditto.
    * @static @method Oskari.util.throttle
    * @param {Function} func target function to throttle
    * @param {Number} wait time in millieconds to wait before calling function again
    * @param {Object} options options, see description above
    */
    util.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = Date.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    /**
    * Checks at if value is number.
    * @static @method Oskari.util.isNumber
    *
    * @param {Object} value checked value
    * @param {Boolean} keepLeadingZero, need keep leading zero
    */
    util.isNumber = function (value, keepLeadingZero) {
        if (value === null) {
            return false;
        }
        var reg = new RegExp('^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$'),
            isNumber = true,
            i;

        if (typeof value === 'object') {
            for (i = 0; i < value.length; i++) {
                if (keepLeadingZero && keepLeadingZero === true && isLeadingZero(value[i] + '')) {
                    isNumber = false;
                    break;
                }
                if (reg.test(value[i]) === false) {
                    isNumber = false;
                    break;
                }
            }
        } else {
            if (keepLeadingZero && keepLeadingZero === true && isLeadingZero(value + '')) {
                isNumber = false;
            } else {
                isNumber = reg.test(value);
            }
        }
        return isNumber;
    };

    /**
    * Checks at if value is decimal.
    * @static @method Oskari.util.isDecimal
    *
    * @param {Object} value checked value
    */
    util.isDecimal = function (value) {
        var isDecimal = true,
            i,
            s,
            val;

        if (!value || value === null || value === '') {
            return false;
        }

        if (typeof value === 'object') {
            for (i = 0; i < value.length; i++) {
                val = String(value[i]);
                s = val.split('.');
                if (s.length === 2 && !isLeadingZero(val) && !isNaN(s[0]) && !isNaN(s[1])) {
                    isDecimal = true;
                } else {
                    isDecimal = false;
                }
                if (isDecimal === false) {
                    break;
                }
            }
        } else {
            val = value + '';
            s = val.split('.');

            if (s.length === 2 && !isNaN(s[0]) && !isNaN(s[1]) &&
                ((isLeadingZero(s[0]) && s[0].length == 1) || !isLeadingZero(s[0]))
            ) {
                isDecimal = true;
            } else {
                isDecimal = false;
            }
        }
        return isDecimal;
    };

    /**
    * Calculates the amount of decimals in value or maximum number of decimals in numbers of an array.
    * @static @method Oskari.util.decimals
    *
    * @param {Object} value checked value
    */
    util.decimals = function (value) {
        let val;
        let maxDecimals = 0;

        if (!value || value === null || value === '' || (isNaN(value) && typeof value !== 'object')) {
            return null;
        }
        if (typeof value === 'object') {
            for (let i = 0; i < value.length; i++) {
                val = value[i] + '';
                val = val.split('.');
                if (val.length === 2 && maxDecimals < val[1].length) {
                    maxDecimals = val[1].length;
                }
            }
            return maxDecimals;
        } else {
            val = value + '';
            val = val.split('.');
            return val.length === 2 ? val[1].length : 0;
        }
    };

    /**
     * Converts hexadecimal color values to decimal values (255,255,255)
     * Green: hexToRgb("#0033ff").g
     * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     *
     * @method hex
     * hexadecimal color value e.g. '#00ff99'
     */
    util.hexToRgb = function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) {
            return null;
        }
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    };

    /**
     * Convert color to array
     *
     * @method colorToArray
     * @param {String} color hex, rgb or rgba
     * @return {Array} color as an array [r, g, b(,a)]. Where r,g,b are int 0-255 and a is float 0-1.
     */
    util.colorToArray = function (color) {
        if (typeof color !== 'string') {
            return [];
        }
        const bracket = color.indexOf('(');
        if (bracket !== -1) {
            const parts = color.substring(bracket + 1, color.indexOf(')')).split(',');
            return parts.map((part, i) => {
                if (i === 3) {
                    return parseFloat(part);
                }
                return parseInt(part);
            });
        }
        let hex = color.charAt(0) === '#' ? color.substring(1) : color;
        let a;
        // parse alpha if exists
        if (hex.length === 4 || hex.length === 8) {
            const isShort = hex.length === 4;
            const i = isShort ? 3 : 6;
            const hexA = isShort ? hex[i] + hex[i] : hex.substring(i);
            a = parseInt(hexA, 16) / 255;
            // don't pass alpha to hexToRgb
            hex = hex.substring(0, i);
        }
        // supports short and full hex
        const parts = util.hexToRgb(hex);
        if (!parts) {
            return [];
        }
        const { r, g, b } = parts;
        return typeof a === 'undefined' ? [r,g,b] : [r,g,b,a];
    };

    /**
     * Convert rgb values to hexadecimal color values
     *
     * @method rgbToHex
     * @param {String} rgb decimal color values e.g. 'rgb(255,0,0)'
     */
    util.rgbToHex = function (rgb) {
        if (rgb.charAt(0) === '#') {
            return rgb.substring(1);
        }
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),
            j;

        delete (parts[0]);
        for (j = 1; j <= 3; j += 1) {
            parts[j] = parseInt(parts[j], 10).toString(16);
            if (parts[j].length === 1) {
                parts[j] = '0' + parts[j];
            }
        }
        return parts.join('');
    };

    /**
     * @method getDeltaForEffect
     * @param {String} color Color to apply the effect on
     * @param {String|Number} effect Oskari style constant (auto, darken, lighten with specifiers minor, normal, major) or delta (auto is used)
     * @return {Number} delta
     */
    util.getDeltaForEffect = function (color = '', effect = '') {
        if (typeof effect === 'number') {
            return this.isLightColor(color) ? -effect : effect;
        }

        let delta = DEFAULT_DELTA;
        Object.keys(DELTA).forEach(key => {
            if (effect.includes(key)) {
                delta = DELTA[key];
            }
        });
        if (effect.includes(EFFECT.DARKEN) || (effect.includes(EFFECT.AUTO) && this.isLightColor(color))) {
            return -delta;
        }
        return delta;
    };

    /**
     * @method getColorEffect
     * @param {String} color Color to apply the effect on
     * @param {String} effect Oskari style constant
     * @return {String} Affected color (hex or rgba) or original color if failed to apply effect
     */
    util.getColorEffect = function (color, effect) {
        if (!effect || !color || effect === EFFECT.NONE) {
            return color;
        }
        const delta = this.getDeltaForEffect(color, effect);
        const colors = Oskari.util.colorToArray(color).map((part, i) => {
            if (i >= 3) {
                return part;
            }
            const clr = part + delta;
            if (clr > 255) {
                return 255;
            } else if (clr < 0) {
                return 0;
            }
            return clr;
        });
        if (colors.length === 3) {
            return '#' + colors.map(part => {
                const hex = part.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        } else if (colors.length === 4) {
            const [r,g,b,a] = colors;
            return `rgba(${r},${g},${b},${a})`;
        }
        return color;
    };
    /**
     * Returns a new color string for lighter or darker color than the original.
     * @param {String} colorStr color to change
     * @param {Number} amount amount of change. Positive number for lighter, negative for darker color.
     * @param {Number} lightColorFlip if color is light the change will be flipped.
     */
    util.alterBrightness = function (colorStr, amount, lightColorFlip) {
        var usePound = false;

        if (lightColorFlip && this.isLightColor(colorStr)) {
            amount = -amount;
        }

        if (colorStr.indexOf('rgba') === 0) {
            // Alpha is not supported
            return colorStr;
        }
        if (colorStr.indexOf('rgb') === 0) {
            colorStr = util.rgbToHex(colorStr);
        }
        if (colorStr[0] === '#') {
            colorStr = colorStr.slice(1);
            usePound = true;
        }

        var num = parseInt(colorStr, 16);

        var red = (num >> 16) + amount;
        if (red > 255) red = 255;
        else if (red < 0) red = 0;

        var blue = ((num >> 8) & 0x00FF) + amount;
        if (blue > 255) blue = 255;
        else if (blue < 0) blue = 0;

        var green = (num & 0x0000FF) + amount;
        if (green > 255) green = 255;
        else if (green < 0) green = 0;
        var color = (green | (blue << 8) | (red << 16)).toString(16);
        // Pad with leading zeros
        color = String('000000' + color).slice(-6);
        return (usePound ? '#' : '') + color;
    };

    /**
    * Check, if nested key exists
    * @method keyExists
    * @params {Object}  object to check { "test" : { "this" : true }}
    * @params String object path "test.this"
    * @public
    *
    * @returns {Boolean}: true if nested key exists
    */
    util.keyExists = function (obj, keypath) {
        var tmpObj = obj,
            cnt = 0,
            splits = keypath.split('.');

        for (var i = 0; tmpObj && i < splits.length; i++) {
            if (splits[i] in tmpObj) {
                tmpObj = tmpObj[splits[i]];
                cnt++;
            }
        }
        return cnt === splits.length;
    };

    /**
     * Natural array sort
     * @method  naturalSort
     * @param  {String|Integer|Double} valueA     sorted value a
     * @param  {String|Integer|Double} valueB     soted value b
     * @param  {Boolean} descending is descending
     * @return {Integer}            sort number
     */
    util.naturalSort = function (valueA, valueB, descending) {
        var re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g,
            sre = /^\s+|\s+$/g, // trim pre-post whitespace
            snre = /\s+/g, // normalize all whitespace to single ' ' character
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function (s) {
                return ('' + s).toLowerCase().replace(sre, '');
            },
            // convert all to strings strip whitespace
            x = i(valueA) || '',
            y = i(valueB) || '',
            // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            // numeric, hex or date detection
            xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
            yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
            normChunk = function (s, l) {
                // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
                return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
            },
            sortFunc = function (oFxNcL, oFyNcL) {
                // handle numeric vs string comparison - number < string - (Kyle Adams)
                if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
                    retValue = (isNaN(oFxNcL)) ? 1 : -1;
                    return true;
                }
                // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
                else if (typeof oFxNcL !== typeof oFyNcL) {
                    oFxNcL += '';
                    oFyNcL += '';
                }

                if (oFxNcL < oFyNcL) {
                    retValue = -1;
                    return true;
                }
                if (oFxNcL > oFyNcL) {
                    retValue = 1;
                    return true;
                }
            },
            oFxNcL, oFyNcL,
            retValue = 0,
            sortCompleted = false;

        // first try and sort Hex codes or Dates
        if (yD) {
            if (xD < yD) {
                retValue = -1;
                sortCompleted = true;
            } else if (xD > yD) {
                retValue = 1;
                sortCompleted = true;
            }
        }

        if (!sortCompleted) {
            // natural sorting through split numeric strings and default strings
            for (var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); cLoc < numS; cLoc++) {
                oFxNcL = normChunk(xN[cLoc] || '', xNl);
                oFyNcL = normChunk(yN[cLoc] || '', yNl);

                sortCompleted = sortFunc(oFxNcL, oFyNcL);

                if (sortCompleted) {
                    break;
                }
            }
        }

        if (descending) {
            retValue = -1 * retValue;
        }

        // Check null values so at they are always last values
        if (valueA === '' && valueB !== '') {
            retValue = 1;
        } else if (valueB === '' && valueA !== '') {
            retValue = -1;
        } else if (valueA === '' && valueB === '') {
            retValue = 0;
        }

        return retValue;
    };

    util.getColorBrightness = function (color) {
        let r, g, b;

        if (color.match(/^rgb/)) {
            color = color.match(/rgba?\(([^)]+)\)/)[1];
            color = color.split(/ *, */).map(Number);
            r = color[0];
            g = color[1];
            b = color[2];
        } else if (color[0] === '#' && color.length === 7 || color.length === 9) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        } else if (color[0] === '#' && color.length === 4 || color.length === 5) {
            r = parseInt(color[1] + color[1], 16);
            g = parseInt(color[2] + color[2], 16);
            b = parseInt(color[3] + color[3], 16);
        }

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 125) {
            return 'dark';
        } else {
            return 'light';
        }
    };
    util.isDarkColor = function (color) {
        return this.getColorBrightness(color) === 'dark';
    };
    util.isLightColor = function (color) {
        return this.getColorBrightness(color) === 'light';
    };

    util.isSmallScreen = function () {
        const rootEl = Oskari.dom.getRootEl();
        return Oskari.dom.getWidth(rootEl) <= mobileDefs.width || Oskari.dom.getHeight(rootEl) <= mobileDefs.height;
    };

    util.isMobile = function (ignoreSize) {
        if (ignoreSize === true) {
            return isMobileDevice;
        }
        return isMobileDevice || util.isSmallScreen();
    };
    /**
     *
     * Sanitizes input and returns a string containing the sanitized content that can be injected to document and shown to user.
     * @param {String} content content to sanitize
     * @return String
     */
    util.sanitize = function (content) {
        return DOMPurify.sanitize(content, { ADD_ATTR: ['target'] });
    };

    const validCoordinates = function (point) {
        if (!point && typeof point !== 'object' && isNaN(point.length) && point.length !== 2) {
            return false;
        } else {
            return true;
        }
    };

    const coordChars = {
        CHAR_DEG: '\u00B0',
        CHAR_MIN: '\u0027',
        CHAR_SEC: '\u0022',
        CHAR_SEP: '\u0020'
    };

    const coordinateDMSDecode = function (value) {
        if (typeof value === 'number') {
            value = '' + value;
        }
        value = value.replace(Oskari.getDecimalSeparator(), '.');
        // also convert comma to dot
        value = value.replace(',', '.');

        const patterns = {
            'DDMMSS.s': '(-?\\d+)[' + coordChars.CHAR_DEG + 'd]\\s*' + // DD
                            '(-?\\d+)' + coordChars.CHAR_MIN + '\\s*' + // MM
                            '(-?\\d+(?:\\.\\d+)?)' + coordChars.CHAR_SEC, // SS.s
            'DDMM.mmm 1': '(-?\\d+)[' + coordChars.CHAR_DEG + 'd]\\s*' + // DD
                            '(-?\\d+(?:\\.\\d+)?)[' + coordChars.CHAR_MIN + ']\\s*', // MM.mmm
            'DDMM.mmm 2': '(-?\\d+)[' + coordChars.CHAR_DEG + 'd]\\s*' + // DD
                            '(-?\\d+(?:\\.\\d+)?)\\s*', // MM.mmm
            'DD.ddddd': '(\\d+(?:\\.\\d+)?)[' + coordChars.CHAR_DEG + 'd]\\s*' // DD.ddd
        };

        for (let key in patterns) {
            if (patterns.hasOwnProperty(key) && value.match(new RegExp(patterns[key]))) {
                log.debug('Coordinate match to pattern ' + key);
                return value.match(new RegExp(patterns[key]));
            }
        }

        log.debug('Coordinate not match to any patterns');
        return null;
    };

    util.coordinateMetricToDegrees = function (point, decimals) {
        let roundToDecimals = decimals || 0;
        if (roundToDecimals > 20) {
            roundToDecimals = 20;
        }
        if (validCoordinates(point)) {
            // first coordinate
            var dms1 = NaN;
            if (!coordinateDMSDecode(point[0])) {
                var p1 = parseFloat(point[0]);
                var d1 = p1 | 0;
                var m1 = ((p1 - d1) * 60) | 0;
                var s1 = (p1 - d1 - m1 / 60) * 3600;
                s1 = parseFloat(s1).toFixed(roundToDecimals);
                s1 = '' + s1;
                s1 = s1.replace('.', Oskari.getDecimalSeparator());
                dms1 = d1 + coordChars.CHAR_DEG + coordChars.CHAR_SEP + m1 + coordChars.CHAR_MIN + coordChars.CHAR_SEP + s1 + coordChars.CHAR_SEC;
            } else {
                dms1 = point[0];
            }

            // second coordinate
            var dms2 = NaN;
            if (!coordinateDMSDecode(point[1])) {
                var p2 = parseFloat(point[1]);
                var d2 = p2 | 0;
                var m2 = ((p2 - d2) * 60) | 0;
                var s2 = (p2 - d2 - m2 / 60) * 3600;
                s2 = parseFloat(s2).toFixed(roundToDecimals);
                s2 = '' + s2;
                s2 = s2.replace('.', Oskari.getDecimalSeparator());
                dms2 = d2 + coordChars.CHAR_DEG + coordChars.CHAR_SEP + m2 + coordChars.CHAR_MIN + coordChars.CHAR_SEP + s2 + coordChars.CHAR_SEC;
            } else {
                dms2 = point[1];
            }

            return [dms1, dms2];
        } else {
            return [NaN, NaN];
        }
    };

    util.coordinateDegreesToMetric = function (point, decimals) {
        let roundToDecimals = decimals || 0;
        if (roundToDecimals > 20) {
            roundToDecimals = 20;
        }
        if (validCoordinates(point)) {
            // first coordinate
            var dd1 = NaN;
            var matches1 = coordinateDMSDecode(point[0]);

            if (matches1) {
                var d1 = parseFloat(matches1[1]);
                var m1 = parseFloat(matches1[2]);
                var s1 = parseFloat(matches1[3]);

                if (!(isNaN(d1) || isNaN(m1) || isNaN(s1))) {
                    dd1 = parseFloat(d1 + (m1 / 60.0) + (s1 / 3600)).toFixed(roundToDecimals);
                } else if (!(isNaN(d1) || isNaN(m1))) {
                    dd1 = parseFloat(d1 + (m1 / 60.0)).toFixed(roundToDecimals);
                } else if (!(isNaN(d1))) {
                    dd1 = parseFloat(d1).toFixed(roundToDecimals);
                }
            }

            // second coordinate
            var dd2 = NaN;
            var matches2 = coordinateDMSDecode(point[1]);

            if (matches2) {
                var d2 = parseFloat(matches2[1]);
                var m2 = parseFloat(matches2[2]);
                var s2 = parseFloat(matches2[3]);

                if (!(isNaN(d2) || isNaN(m2) || isNaN(s2))) {
                    dd2 = parseFloat(d2 + (m2 / 60.0) + (s2 / 3600)).toFixed(roundToDecimals);
                } else if (!(isNaN(d2) || isNaN(m2))) {
                    dd2 = parseFloat(d2 + (m2 / 60.0)).toFixed(roundToDecimals);
                } else if (!(isNaN(d2))) {
                    dd2 = parseFloat(d2).toFixed(roundToDecimals);
                }
            }

            return [dd1, dd2];
        } else {
            return [NaN, NaN];
        }
    };

    util.coordinateIsDegrees = function (point) {
        const matches1 = coordinateDMSDecode(point[0]);
        const matches2 = coordinateDMSDecode(point[1]);
        return (matches1 != null && matches1.length > 0 && matches2 != null && matches2.length > 0);
    };

    /**
     * @method getRequestParam
     * Returns a request parameter from query string
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
     * @param {String} name - parameter name
     * @param {String} defaultValue - default value if param is not set
     * @return {String} value for the parameter or null if not found
     */
    util.getRequestParam = function (name, defaultValue) {
        const query = location.search.substring(1);
        const result = util.getRequestParameters(query);
        return result[name] || defaultValue;
    };

    /**
     * @method getRequestParameters
     * Returns request parameters from query string as an object
     * @return {Object} parameters
     */
    util.getRequestParameters = function (query) {
        const params = {};
        query.split('&').forEach(part => {
            const item = part.split('=');
            params[item[0]] = decodeURIComponent(item[1]);
        });
        return params;
    };
    /**
     * Returns true if first param is a number with value between start-stop parameters
     * @param  {Number}  num   [description]
     * @param  {Number}  start [description]
     * @param  {Number}  stop  [description]
     * @return {Boolean}       [description]
     */
    util.isNumberBetween = function (num, start, stop) {
        if (typeof num !== 'number') {
            return false;
        }
        return num >= start && num <= stop;
    };

    /**
     * Moves item in array using from and to parameters as indexes.
     * Returns boolean indicating if something was changed.
     * @param  {Object[]} array array to re-order
     * @param  {Number}   from  index for item to move
     * @param  {Number}   to    index to move the item to
     * @return {Boolean}  true if order was changed
     */
    util.arrayMove = function (array, from, to) {
        // normalize
        if (!array || !array.length || !array.splice) {
            return false;
        }
        if (!util.isNumberBetween(from, 0, array.length - 1)) {
            from = array.length - 1;
        }
        if (!util.isNumberBetween(to, 0, array.length - 1)) {
            to = array.length - 1;
        }
        if (from === to) {
            return false;
        }
        // From http://jsperf.com/arraymove-many-sizes
        if (Math.abs(from - to) > 60) {
            array.splice(to, 0, array.splice(from, 1)[0]);
        } else {
            // works better when we are not moving things very far
            const target = array[from];
            const inc = (to - from) / Math.abs(to - from);
            let current = from;
            for (; current !== to; current += inc) {
                array[current] = array[current + inc];
            }
            array[to] = target;
        }
        return true;
    };

    /**
     * Checks if two arrays have equal primitive values and order.
     * Shallow test.
     *
     * @return {Boolean} true if the arrays are equal
     */
    util.arraysEqual = function (a, b) {
        if (a === b) {
            return true;
        }
        if (!Array.isArray(a) || !Array.isArray(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        let i;
        for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    /**
     * Sql LIKE like operator.
     * Supports % and * as zero to n characters and _ as a single character.
     * @param  {String|Number} value value to check
     * @param  {String|Number} likePattern pattern to check against
     * @return {Boolean} true if pattern exists in the value
     */
    util.stringLike = (value, likePattern) => {
        const regExpSpecials = '\\' + ['/', '.', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\');
        const likeRegExp = new RegExp(`^${likePattern.toString()
            .replace(new RegExp(regExpSpecials, 'g'), '\\$1')
            .replace(/%|\*/g, '.*')
            .replace(/_/g, '.')}$`);
        return likeRegExp.test(value.toString());
    };
    /**
    * Function to get errorText from objects received in jQuery.ajax request failure.
    *
    * @param {jqXHR} jqXHR The jqXHR (in jQuery 1.4.x, XMLHttpRequest) object
    * @param {String} errorThrown exception object
    */
    util.getErrorTextFromAjaxFailureObjects = (jqXHR, errorThrown) => {
        let error = errorThrown.message || errorThrown;
        try {
            const err = JSON.parse(jqXHR.responseText).error;
            if (err !== null && err !== undefined) {
                error = err;
            }
        } catch (ignore) {}
        return error;
    };
    /**
    * Function to validate network domain.
    * Implemented by modifying function introduced in https://miguelmota.com/bytes/validate-domain-regex/
    *
    * @param {domain} domain to be validated
    * @return {Boolean} true if domain is valid, false otherwise.
    */
    util.isValidDomain = (domain) => {
        if (!domain) {
            return false;
        }
        const re = /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi;
        return re.test(domain);
    };
    /**
    * Function to copy text to clipboard
    *
    * @param {String} text to be copied to clipboard
    * @param {jQuery} el element which is animated
    */
    util.copyTextToClipboard = (text, el) => {
        if (typeof text !== 'string') {
            return;
        }
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.value = text;
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        if (el) {
            const cls = 'oskari-copy-effect';
            el.addClass(cls);
            setTimeout(() => {
                el.removeClass(cls);
            }, 500);
        }
    };

    /**
     * Format timestamp to more readable date
     * @param {String} text
     * @param {Object} options optional { time, date }
     * @param {Array || String} locales optional
     * @returns {String}
     */
    util.formatDate = (text, options, locales) => {
        if (!text) {
            return '';
        }
        const dateTime = new Date(text);
        if (isNaN(dateTime.getMilliseconds())) {
            return '';
        }
        const { date = {}, time = {}} = options || {};
        if (!locales) {
            // default to locale by selected language
            // en -> en_US -> en-US
            locales = Oskari.getSupportedLocales()
                .filter(loc => loc.includes(Oskari.getLang()))
                .map(loc => loc.replace('_', '-'));
        }
        const defaults = {
            hour: '2-digit',
            minute: '2-digit'
        };
        const localeDate = dateTime.toLocaleDateString(locales, date);
        const localeTime = dateTime.toLocaleTimeString(locales, {...defaults, ...time});
        return `${localeDate} ${localeTime}`;
    };

    util.mouseExists = () => {
        if (window.matchMedia("(pointer: fine)").matches) {
            // Has a mouse-like device
            return true;
        }
        // Probably mobile
        return false;
    };

    return util;
}());
