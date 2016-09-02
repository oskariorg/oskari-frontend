
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
        if(value === null) {
            return false;
        }
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

    util.getColorBrightness = function(color){
        var r,g,b,brightness;

        if (color.match(/^rgb/)) {
          color = color.match(/rgba?\(([^)]+)\)/)[1];
          color = color.split(/ *, */).map(Number);
          r = color[0];
          g = color[1];
          b = color[2];
        } else if ('#' == color[0] && 7 == color.length) {
          r = parseInt(color.slice(1, 3), 16);
          g = parseInt(color.slice(3, 5), 16);
          b = parseInt(color.slice(5, 7), 16);
        } else if ('#' == color[0] && 4 == color.length) {
          r = parseInt(color[1] + color[1], 16);
          g = parseInt(color[2] + color[2], 16);
          b = parseInt(color[3] + color[3], 16);
        }

        brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 125) {
          return 'dark';
        } else {
          return 'light';
        }
    };
    util.isDarkColor = function(color){
        return this.getColorBrightness(color) === 'dark';
    };
    util.isLightColor = function(color){
        return this.getColorBrightness(color) === 'light';
    };

    util.isMobile = function() {
        var md = new MobileDetect(window.navigator.userAgent);
        var mobileDefs = {
            width: 500,
            height: 400
        };
        var size = {
            height: jQuery(window).height(),
            width: jQuery(window).width()
        };

        var isSizeMobile = false;
        if(size.width <= mobileDefs.width || size.height <= mobileDefs.height) {
            isSizeMobile = true;
        }

        var isMobile = (md.mobile() !== null) ? true : isSizeMobile;

        return isMobile;
    };
    /**
     *
     * Sanitizes input and returns a string containing the sanitized content that can be injected to document and shown to user.
     * @param {String} content content to sanitize
     * @return String
     */
    util.sanitize = function(content) {
        return DOMPurify.sanitize(content, {SAFE_FOR_JQUERY: true, ADD_ATTR: ['target']});
    };

    var validCoordinates = function(point) {
        if(!point && typeof point !== 'object' && isNaN(point.length) && point.length !== 2)  {
            return false;
        } else {
            return true;
        }
    };

    var coordChars = {
        CHAR_DEG: "\u00B0",
        CHAR_MIN: "\u0027",
        CHAR_SEC: "\u0022",
        CHAR_SEP: "\u0020"
    };

    var coordinateDMSDecode = function(value) {
        var pattern1 = "";
        var pattern2 = "";
        var pattern3 = "";
        if(typeof value === 'number') {
            value = '' + value;
        }
        value = value.replace(Oskari.getDecimalSeparator(), '.');

        // Allow deg min sec
        // deg
        pattern1 += "(-?\\d+)[";
        pattern1 += coordChars.CHAR_DEG;
        pattern1 += "d";
        pattern1 += "]\\s*";

        // min
        pattern1 += "(\\d+)";
        pattern1 += coordChars.CHAR_MIN;
        pattern1 += "\\s*";

        // sec
        pattern1 += "(\\d+(?:\\.\\d+)?)";
        pattern1 += coordChars.CHAR_SEC;


        // Allow deg min
        // deg
        pattern2 += "(-?\\d+)[";
        pattern2 += coordChars.CHAR_DEG;
        pattern2 += "d";
        pattern2 += "]\\s*";

        // min
        pattern2 += "(\\d+(?:\\.\\d+)?)";
        pattern2 += coordChars.CHAR_MIN;
        pattern2 += "\\s*";

        // Allow deg
        // deg
        pattern3 += "(\\d+(?:\\.\\d+)?)[";
        pattern3 += coordChars.CHAR_DEG;
        pattern3 += "d";
        pattern3 += "]\\s*";


        if(value.match(new RegExp(pattern1)))  {
            return value.match(new RegExp(pattern1));
        } else if (value.match(new RegExp(pattern2))) {
            return value.match(new RegExp(pattern2));
        } else if (value.match(new RegExp(pattern3))) {
            return value.match(new RegExp(pattern3));
        } else {
            return null;
        }
    };

    util.coordinateMetricToDegrees = function(point, decimals){
        var roundToDecimals = decimals || 0;
        if(roundToDecimals>20) {
            roundToDecimals = 20;
        }
        if(validCoordinates(point))  {
            // first coordinate
            var dms1 = NaN;
            if(!coordinateDMSDecode(point[0])) {
                var p1 = parseFloat(point[0]);
                var d1 =  parseInt(p1);
                var m1 = parseInt((p1 - d1) * 60);
                var s1 = (p1 - d1 - m1/60) * 3600;
                s1 = parseFloat(s1).toFixed(roundToDecimals);
                s1 = '' + s1;
                s1 = s1.replace('.', Oskari.getDecimalSeparator());
                dms1 = d1 + coordChars.CHAR_DEG + coordChars.CHAR_SEP + m1 + coordChars.CHAR_MIN + coordChars.CHAR_SEP + s1 + coordChars.CHAR_SEC;
            } else {
                dms1 = point[0];
            }

            // second coordinate
            var dms2 = NaN;
            if(!coordinateDMSDecode(point[1])) {
                var p2 = parseFloat(point[1]);
                var d2 =  parseInt(p2);
                var m2 = parseInt((p2 - d2) * 60);
                var s2 = (p2 - d2 - m2/60) * 3600;
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

    util.coordinateDegreesToMetric = function(point, decimals){
        var roundToDecimals = decimals || 0;
        if(roundToDecimals>20) {
            roundToDecimals = 20;
        }
        if(validCoordinates(point))  {
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

            return [dd1,dd2];
        } else {
            return [NaN, NaN];
        }
    };

    util.coordinateIsDegrees = function(point){
        var matches1 = coordinateDMSDecode(point[0]);
        var matches2 = coordinateDMSDecode(point[1]);
        return (matches1 && matches2);
    };

    util.getBrowser = function(){
        var ua = window.navigator.userAgent;

        // Below code is getted in bowser  1.4.5 code
        // https://github.com/ded/bowser/releases
        //
        var t = true;

        function getFirstMatch(regex) {
          var match = ua.match(regex);
          return (match && match.length > 1 && match[1]) || '';
        }

        function getSecondMatch(regex) {
          var match = ua.match(regex);
          return (match && match.length > 1 && match[2]) || '';
        }

        var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
          , likeAndroid = /like android/i.test(ua)
          , android = !likeAndroid && /android/i.test(ua)
          , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
          , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
          , chromeos = /CrOS/.test(ua)
          , silk = /silk/i.test(ua)
          , sailfish = /sailfish/i.test(ua)
          , tizen = /tizen/i.test(ua)
          , webos = /(web|hpw)os/i.test(ua)
          , windowsphone = /windows phone/i.test(ua)
          , samsungBrowser = /SamsungBrowser/i.test(ua)
          , windows = !windowsphone && /windows/i.test(ua)
          , mac = !iosdevice && !silk && /macintosh/i.test(ua)
          , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
          , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
          , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
          , tablet = /tablet/i.test(ua)
          , mobile = !tablet && /[^-]mobi/i.test(ua)
          , xbox = /xbox/i.test(ua)
          , result

        if (/opera|opr|opios/i.test(ua)) {
          result = {
            name: 'Opera'
          , opera: t
          , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
          }
        }
        else if (/SamsungBrowser/i.test(ua)) {
          result = {
            name: 'Samsung Internet for Android'
            , samsungBrowser: t
            , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
          }
        }
        else if (/coast/i.test(ua)) {
          result = {
            name: 'Opera Coast'
            , coast: t
            , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
          }
        }
        else if (/yabrowser/i.test(ua)) {
          result = {
            name: 'Yandex Browser'
          , yandexbrowser: t
          , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
          }
        }
        else if (/ucbrowser/i.test(ua)) {
          result = {
              name: 'UC Browser'
            , ucbrowser: t
            , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
          }
        }
        else if (/mxios/i.test(ua)) {
          result = {
            name: 'Maxthon'
            , maxthon: t
            , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
          }
        }
        else if (/epiphany/i.test(ua)) {
          result = {
            name: 'Epiphany'
            , epiphany: t
            , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
          }
        }
        else if (/puffin/i.test(ua)) {
          result = {
            name: 'Puffin'
            , puffin: t
            , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
          }
        }
        else if (/sleipnir/i.test(ua)) {
          result = {
            name: 'Sleipnir'
            , sleipnir: t
            , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
          }
        }
        else if (/k-meleon/i.test(ua)) {
          result = {
            name: 'K-Meleon'
            , kMeleon: t
            , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
          }
        }
        else if (windowsphone) {
          result = {
            name: 'Windows Phone'
          , windowsphone: t
          }
          if (edgeVersion) {
            result.msedge = t
            result.version = edgeVersion
          }
          else {
            result.msie = t
            result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/msie|trident/i.test(ua)) {
          result = {
            name: 'Internet Explorer'
          , msie: t
          , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
          }
        } else if (chromeos) {
          result = {
            name: 'Chrome'
          , chromeos: t
          , chromeBook: t
          , chrome: t
          , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
          }
        } else if (/chrome.+? edge/i.test(ua)) {
          result = {
            name: 'Microsoft Edge'
          , msedge: t
          , version: edgeVersion
          }
        }
        else if (/vivaldi/i.test(ua)) {
          result = {
            name: 'Vivaldi'
            , vivaldi: t
            , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
          }
        }
        else if (sailfish) {
          result = {
            name: 'Sailfish'
          , sailfish: t
          , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/seamonkey\//i.test(ua)) {
          result = {
            name: 'SeaMonkey'
          , seamonkey: t
          , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/firefox|iceweasel|fxios/i.test(ua)) {
          result = {
            name: 'Firefox'
          , firefox: t
          , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
          }
          if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
            result.firefoxos = t
          }
        }
        else if (silk) {
          result =  {
            name: 'Amazon Silk'
          , silk: t
          , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/phantom/i.test(ua)) {
          result = {
            name: 'PhantomJS'
          , phantom: t
          , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/slimerjs/i.test(ua)) {
          result = {
            name: 'SlimerJS'
            , slimer: t
            , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
          }
        }
        else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
          result = {
            name: 'BlackBerry'
          , blackberry: t
          , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
          }
        }
        else if (webos) {
          result = {
            name: 'WebOS'
          , webos: t
          , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
          };
          /touchpad\//i.test(ua) && (result.touchpad = t)
        }
        else if (/bada/i.test(ua)) {
          result = {
            name: 'Bada'
          , bada: t
          , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
          };
        }
        else if (tizen) {
          result = {
            name: 'Tizen'
          , tizen: t
          , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
          };
        }
        else if (/qupzilla/i.test(ua)) {
          result = {
            name: 'QupZilla'
            , qupzilla: t
            , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
          }
        }
        else if (/chromium/i.test(ua)) {
          result = {
            name: 'Chromium'
            , chromium: t
            , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
          }
        }
        else if (/chrome|crios|crmo/i.test(ua)) {
          result = {
            name: 'Chrome'
            , chrome: t
            , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
          }
        }
        else if (android) {
          result = {
            name: 'Android'
            , version: versionIdentifier
          }
        }
        else if (/safari|applewebkit/i.test(ua)) {
          result = {
            name: 'Safari'
          , safari: t
          }
          if (versionIdentifier) {
            result.version = versionIdentifier
          }
        }
        else if (iosdevice) {
          result = {
            name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
          }
          // WTF: version is not part of user agent in web apps
          if (versionIdentifier) {
            result.version = versionIdentifier
          }
        }
        else if(/googlebot/i.test(ua)) {
          result = {
            name: 'Googlebot'
          , googlebot: t
          , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
          }
        }
        else {
          result = {
            name: getFirstMatch(/^(.*)\/(.*) /),
            version: getSecondMatch(/^(.*)\/(.*) /)
         };
       }

        // set webkit or gecko flag for browsers based on these engines
        if (!result.msedge && /(apple)?webkit/i.test(ua)) {
          if (/(apple)?webkit\/537\.36/i.test(ua)) {
            result.name = result.name || "Blink"
            result.blink = t
          } else {
            result.name = result.name || "Webkit"
            result.webkit = t
          }
          if (!result.version && versionIdentifier) {
            result.version = versionIdentifier
          }
        } else if (!result.opera && /gecko\//i.test(ua)) {
          result.name = result.name || "Gecko"
          result.gecko = t
          result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
        }

        // set OS flags for platforms that have multiple browsers
        if (!result.msedge && (android || result.silk)) {
          result.android = t
        } else if (iosdevice) {
          result[iosdevice] = t
          result.ios = t
        } else if (mac) {
          result.mac = t
        } else if (xbox) {
          result.xbox = t
        } else if (windows) {
          result.windows = t
        } else if (linux) {
          result.linux = t
        }

        // OS version extraction
        var osVersion = '';
        if (result.windowsphone) {
          osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
        } else if (iosdevice) {
          osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
          osVersion = osVersion.replace(/[_\s]/g, '.');
        } else if (android) {
          osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
        } else if (result.webos) {
          osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
        } else if (result.blackberry) {
          osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
        } else if (result.bada) {
          osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
        } else if (result.tizen) {
          osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
        }
        if (osVersion) {
          result.osversion = osVersion;
        }

        // device type extraction
        var osMajorVersion = osVersion.split('.')[0];
        if (
             tablet
          || nexusTablet
          || iosdevice == 'ipad'
          || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
          || result.silk
        ) {
          result.tablet = t
        } else if (
             mobile
          || iosdevice == 'iphone'
          || iosdevice == 'ipod'
          || android
          || nexusMobile
          || result.blackberry
          || result.webos
          || result.bada
        ) {
          result.mobile = t
        }

        // Graded Browser Support
        // http://developer.yahoo.com/yui/articles/gbs
        if (result.msedge ||
            (result.msie && result.version >= 10) ||
            (result.yandexbrowser && result.version >= 15) ||
                (result.vivaldi && result.version >= 1.0) ||
            (result.chrome && result.version >= 20) ||
            (result.samsungBrowser && result.version >= 4) ||
            (result.firefox && result.version >= 20.0) ||
            (result.safari && result.version >= 6) ||
            (result.opera && result.version >= 10.0) ||
            (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
            (result.blackberry && result.version >= 10.1)
            || (result.chromium && result.version >= 20)
            ) {
          result.a = t;
        }
        else if ((result.msie && result.version < 10) ||
            (result.chrome && result.version < 20) ||
            (result.firefox && result.version < 20.0) ||
            (result.safari && result.version < 6) ||
            (result.opera && result.version < 10.0) ||
            (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
            || (result.chromium && result.version < 20)
            ) {
          result.c = t
        } else result.x = t

        return result
    };

    return util;
}());