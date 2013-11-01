/**
 * @class Oskari.userinterface.component.VisualizationForm
 * Generic form component
 */
Oskari.clazz.define('Oskari.userinterface.component.VisualizationForm',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (creator, options) {
        this._creator = creator;
        this._loc = this._getLocalization(this._creator);
        this._clazzPrefix = 'Oskari.userinterface.component.visualization-form.';
        this._clazzSuffix = 'Form';

        var defaultOptions = {
            // include all forms by default
            forms: ['point', 'line', 'area']
        };
        options = options || {};

        this._options = jQuery.extend({}, defaultOptions, options);
    }, {
    /**
     * Convert hexadecimal color values to decimal values (255,255,255)
     * Green: hexToRgb("#0033ff").g 
     * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     *
     * @method hexToRgb
     * hexadecimal color value e.g. '#00ff99'
     */
    hexToRgb: function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert rgb values to hexadecimal color values
     *
     * @method rgbToHex
     * decimal color values e.g. 'rgb(255,0,0)'
     */
    rgbToHex: function(rgb) {
        if (rgb.charAt(0) === '#') return rgb.substring(1);
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete (parts[0]);
        for (var j = 1; j <= 3; ++j) {
            parts[j] = parseInt(parts[j]).toString(16);
            if (parts[j].length == 1) parts[j] = '0' + parts[j];
        }
        return parts.join('');
    },

    _getLocalization: function(creator) {
        if (creator && creator.getLocalization && typeof creator.getLocalization === 'function') {
            return creator.getLocalization();
        } else {
            return {};
        }
    },

    _createFormClazz: function(formName, opts) {
        var clazz = this._capitalize(formName),
            clazzName = this._clazzPrefix + clazz + this._clazzSuffix;

        return Oskari.clazz.create(clazzName, opts || {});
    },

    _capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});