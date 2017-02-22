/**
 * @class Oskari.mapframework.domain.Tool
 *
 * Map Layer Tool
 */
Oskari.clazz.define('Oskari.mapframework.domain.Tool',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this._name = null;
        this._title = null;
        this._tooltip = null;
        this._iconCls = null;
        this._callback = null;
    }, {

        /**
         * @method setName
         * Sets name for the tool
         *
         * @param {String} name
         *            style name
         */
        setName: function (name) {
            this._name = name;
        },
        /**
         * @method getName
         * Gets name for the tool
         *
         * @return {String} style name
         */
        getName: function () {
            return this._name;
        },
        /**
         * @method setTitle
         * Sets title for the tool
         *
         * @param {String} title
         *            tool title
         */
        setTitle: function (title) {
            this._title = title;
        },
        /**
         * @method getTitle
         * Gets title for the tool
         *
         * @return {String} tool title
         */
        getTitle: function () {
            return this._title;
        },
        /**
         * @method setTooltip
         * Set tooltip for tool
         *
         * @param {String} tooltip text
         */
        setTooltip: function (tooltip) {
            this._tooltip = tooltip;
        },
        /**
         * @method getTooltip
         * Get tooltip text
         *
         * @return {String} tooltip text
         */
        getTooltip: function () {
            return this._tooltip;
        },
        /**
         * @method setIconCls
         * Set optional icon name (e.g. icon-close)
         *
         * @param {String} icon name
         */
        setIconCls: function (iconCls) {
            this._iconCls = iconCls;
        },
        /**
         * @method getIconCls
         * Get optional icon name
         *
         * @return {String} icon name
         */
        getIconCls: function () {
            return this._iconCls;
        },
        /**
         * @method setCallback
         * Sets callback definition for tool
         *
         * @param {function} callback code
         *
         */
        setCallback: function (callback) {
            this._callback = callback;
        },
        /**
         * @method getCallback
         * Get callback code for tool
         *
         * @return {function} callback definition
         */
        getCallback: function () {
            return this._callback;
        }
    });