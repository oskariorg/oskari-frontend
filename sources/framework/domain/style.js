/**
 * @class Oskari.mapframework.domain.Style
 *
 * Map Layer Style
 */
Oskari.clazz.define('Oskari.mapframework.domain.Style',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this._name = null;
        this._title = null;
        this._legend = null;
    }, {

        /**
         * @method setName
         * Sets name for the style
         *
         * @param {String} name
         *            style name
         */
        setName: function (name) {
            this._name = name;
        },
        /**
         * @method getName
         * Gets name for the style
         *
         * @return {String} style name
         */
        getName: function () {
            return this._name;
        },
        /**
         * @method setTitle
         * Sets title for the style
         *
         * @param {String} title
         *            style title
         */
        setTitle: function (title) {
            this._title = title;
        },
        /**
         * @method getTitle
         * Gets title for the style
         *
         * @return {String} style title
         */
        getTitle: function () {
            return this._title;
        },
        /**
         * @method setLegend
         * Sets legendimage URL for the style
         *
         * @param {String} legend
         *            style legend
         */
        setLegend: function (legend) {
            this._legend = legend;
        },
        /**
         * @method getLegend
         * Gets legendimage URL for the style
         *
         * @return {String} style legend
         */
        getLegend: function () {
            return this._legend;
        }
    });