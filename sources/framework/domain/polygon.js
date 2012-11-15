/**
 * @class Oskari.framework.domain.Polygon
 *
 * Used by Oskari.mapframework.mapmodule.SketchLayerPlugin that does some weird
 * stuff like setting id -1 OR -2.
 * Sent in request that is handled by core which in turn sends an after-event
 * that isn't listened in any code. 
 * 
 * TODO: move to plugins files?
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.domain.Polygon',

/** 
 * @method create called automatically on construction
 * @static
 */
function() {

    this._id = null;

    this._description = null;

    this._top = null;

    this._left = null;

    this._right = null;

    this._bottom = null;

    this._link = null;

    this._color = "#684781";

    this._display = "";

    this._zoomToExtent = false;
},
{

    /**
     * @method setId
     * Sets internal id for this polygon
     *
     * @param {Number} id
     *            internal id
     */
    setId : function(id) {
        this._id = id;
    },
    /**
     * @method getId
     * Gets internal id for this polygon
     *
     * @return {Number}
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method setDescription
     * Sets description for the polygon
     *
     * @param {String} description
     *            description
     */
    setDescription : function(description) {
        this._description = description;
    },
    /**
     * @method getDescription
     * Gets description for the polygon
     *
     * @return {String}
     */
    getDescription : function() {
        return this._description;
    },
    /**
     * @method setTop
     * Sets north latitude for the polygon
     *
     * @param {Number} top
     *            top latitude
     */
    setTop : function(top) {
        this._top = top;
    },
    /**
     * @method getTop
     * Gets north latitude for the polygon
     *
     * @return {Number}  top latitude
     */
    getTop : function() {
        return this._top;
    },
    /**
     * @method setLeft
     * Sets east longitude for the polygon
     *
     * @param {Number} left
     *            east longitude
     */
    setLeft : function(left) {
        this._left = left;
    },
    /**
     * @method getLeft
     * Gets east longitude for the polygon
     *
     * @return {Number}  east longitude
     */
    getLeft : function() {
        return this._left;
    },
    /**
     * @method setBottom
     * Sets south latitude for the polygon
     *
     * @param {Number} top
     *            bottom latitude
     */
    setBottom : function(bottom) {
        this._bottom = bottom;
    },
    /**
     * @method getBottom
     * Gets south latitude for the polygon
     *
     * @return {Number}  south latitude
     */
    getBottom : function() {
        return this._bottom;
    },
    /**
     * @method setRight
     * Sets west longitude for the polygon
     *
     * @param {Number} right
     *            west longitude
     */
    setRight : function(right) {
        this._right = right;
    },
    /**
     * @method getRight
     * Gets west longitude for the polygon
     *
     * @return {Number}  west longitude
     */
    getRight : function() {
        return this._right;
    },
    /**
     * @method setLink
     * @deprecated not used?
     *
     * @param {String} link
     */
    setLink : function(link) {
        this._link = link;
    },
    /**
     * @method getLink
     * @deprecated not used?
     *
     * @return {String}
     */
    getLink : function() {
        return this._link;
    },
    /**
     * @method setColor
     * Sets color for the polygon
     *
     * @param {String} color hex code for color e.g. #ff00ff
     */
    setColor : function(color) {
        this._color = color;
    },
    /**
     * @method getColor
     * Gets color for the polygon
     *
     * @return {String} color hex code e.g. #ff00ff
     */
    getColor : function() {
        return this._color;
    },
    /**
     * @method setDisplay
     * @deprecated not used?
     *
     * @param display
     */
    setDisplay : function(display) {
        this._display = display;
    },
    /**
     * @method getDisplay
     * @deprecated not used?
     *
     * @return
     */
    getDisplay : function() {
        return this._display;
    },
    /**
     * @method setZoomToExtent
     * @deprecated not used?
     *
     * @param zoomToExtent
     */
    setZoomToExtent : function(zoomToExtent) {
        this._zoomToExtent = zoomToExtent;
    },
    /**
     * @method getZoomToExtent
     * @deprecated not used?
     *
     * @return
     */
    getZoomToExtent : function() {
        return this._zoomToExtent;
    }
});
