
/*
* @class Oskari.util
* Util class instance for static methods what may be used to for checks values.
* For example check at value is number or how many decimals this value have.
*
*/
Oskari.util = (function () {
    var util = {};

    /**
    * Checks at if value has leading zeros.
    * @private @method isLeadingZero
    *
    * @param {Object} value checked value
    */
    function isLeadingZero(value){
        if(typeof value === 'string' && value.length>0 && value[0] === '0') {
            if(util.isDecimal(value) && value.length>1 && value[1] === '.') {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };

    /**
    * Checks at if value is number.
    * @static @method Oskari.util.isNumber
    *
    * @param {Object} value checked value
    * @param {Boolean} keepLeadingZero, need keep leading zero
    */
    util.isNumber = function(value, keepLeadingZero) {
        var reg = new RegExp('^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$'),
            isNumber = true,
            i;

        if(typeof value === 'object') {
            for(i=0; i<value.length; i++) {
                if(keepLeadingZero && keepLeadingZero === true && isLeadingZero(value[i] + '')) {
                   isNumber = false;
                   break;
                }
                if(reg.test(value[i]) === false) {
                    isNumber = false;
                    break;
                }
            }
        } else {
            if(keepLeadingZero && keepLeadingZero === true && isLeadingZero(value + '')) {
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
    util.isDecimal = function(value){
        var isDecimal = true,
            i,
            s,
            val;

        if(!value || value === null || value === '') {
            return false;
        }

        if(typeof value === 'object') {
             for(i=0; i<value.length; i++) {
                val = String(value[i]);
                s = val.split('.');
                if(s.length === 2 && !isLeadingZero(val) && !isNaN(s[0]) && !isNaN(s[1])){
                    isDecimal = true;
                } else {
                    isDecimal = false;
                }
                if(isDecimal === false) {
                    break;
                }
             }
        } else {
            val = value+'';
            s = val.split('.');

            if(s.length === 2 && !isNaN(s[0]) && !isNaN(s[1]) &&
                ((isLeadingZero(s[0]) && s[0].length==1) || !isLeadingZero(s[0]))
                ){
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
    util.decimals = function(value){
        var val,
            maxDecimals = 0;

        if(!value || value === null || value === '' || (isNaN(value) && typeof value !== 'object')) {
            return null;
        }
        if(typeof value === 'object') {
            for(i=0; i<value.length; i++) {
                val = value[i] + '';
                val = val.split('.');
                if(val.length===2 && maxDecimals<val[1].length) {
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
    util.hexToRgb = function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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

        delete(parts[0]);
        for (j = 1; j <= 3; j += 1) {
            parts[j] = parseInt(parts[j], 10).toString(16);
            if (parts[j].length === 1) {
                parts[j] = '0' + parts[j];
            }
        }
        return parts.join('');
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
    util.keyExists = function(obj, keypath) {
        var tmpObj = obj,
            cnt = 0,
            splits = keypath.split('.');

        for (var i=0; tmpObj && i < splits.length; i++) {
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
    util.naturalSort = function(valueA, valueB, descending) {
        var re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g,
            sre = /^\s+|\s+$/g,   // trim pre-post whitespace
            snre = /\s+/g,        // normalize all whitespace to single ' ' character
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function(s) {
                return ('' + s).toLowerCase().replace(sre, '');
            },
            // convert all to strings strip whitespace
            x = i(valueA) || '',
            y = i(valueB) || '',
            // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            // numeric, hex or date detection
            xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
            yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
            normChunk = function(s, l) {
                // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
                return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
            },
            sortFunc = function(oFxNcL, oFyNcL){
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
            if ( xD < yD ) {
                retValue = -1;
                sortCompleted = true;
            }
            else if ( xD > yD ) {
                retValue = 1;
                sortCompleted = true;
            }
        }

        if(!sortCompleted) {
            // natural sorting through split numeric strings and default strings
            for(var cLoc=0, xNl = xN.length, yNl = yN.length, numS=Math.max(xNl, yNl); cLoc < numS; cLoc++) {
                oFxNcL = normChunk(xN[cLoc] || '', xNl);
                oFyNcL = normChunk(yN[cLoc] || '', yNl);

                sortCompleted = sortFunc(oFxNcL, oFyNcL);

                if(sortCompleted) {
                    break;
                }
            }
        }
        if (descending) {
            retValue =  -1 * retValue;
        }
        return retValue;
    };


    return util;
}());