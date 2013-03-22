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
function() {
    this._name = null;
    this._title = null;
    this._tooltip = null;
    this._iconCls = null;
    this._callback = null;
}, {

    /**
     * @method setName
     * Sets name for the style
     *
     * @param {String} name
     *            style name
     */
    setName : function(name) {
        this._name = name
    },
    /**
     * @method getName
     * Gets name for the style
     *
     * @return {String} style name
     */
    getName : function() {
        return this._name;
    },
    /**
     * @method setTitle
     * Sets title for the style
     *
     * @param {String} title
     *            style title
     */
    setTitle : function(title) {
        this._title = title;
    },
    /**
     * @method getTitle
     * Gets title for the style
     *
     * @return {String} style title
     */
    getTitle : function() {
        return this._title;
    },
    /**
     * @method setTooltip
     * Set tooltip for tool
     *
     * @param {String} tooltip text
     */
    setTooltip : function(tooltip) {
        this._tooltip = tooltip;
    },
    /**
     * @method getTooltip
     * Get tooltip text
     *
     * @return {String} tooltip text
     */
    getTooltip : function() {
        return this._tooltip;
    },
    /**
     * @method setIconCls
     * Set optional icon css style
     *
     * @param {String} css style
     */
    setIconCls : function(iconCls) {
        this._iconCls = iconCls;
    },
    /**
     * @method getIconCls
     * Get optional icon css style
     *
     * @return {String} css style
     */
    getIconCls : function() {
        return this._iconCls;
    },
    /**
     * @method setCallback
     * Sets callback definition for tool
     *
     * @param {String} caalback code
     *            
     */
    setCallback : function(callback) {
        this._callback = callback
    },
    /**
     * @method getCallback
     * Get callback code for tool
     *
     * @return {String} callback definition
     */
    getCallback : function() {
        return this._callback;
    }
});
