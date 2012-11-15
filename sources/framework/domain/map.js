/**
 * @class Oskari.framework.domain.Map
 *
 * Represents the values of the map implementation (openlayers)
 * Map module updates this domain object before sending out MapMoveEvents using
 * the set methods.
 * Set methods dont control the map in anyway so this is not the
 * way to control the map. This is only to get map values without openlayers
 * dependency.
 */
Oskari.clazz.define('Oskari.mapframework.domain.Map',

/** 
 * @method create called automatically on construction
 * @static
 */
function() {

    // @property {Number} _centerX map longitude (float)
    this._centerX = null;

    // @property {Number} _centerY map latitude (float)
    this._centerY = null;

    // @property {Number} _zoom map zoom level (0-12)
    this._zoom = null;

    // @property {Number} _scale map scale (float)
    this._scale = null;

    // @property {OpenLayers.Bounds} _bbox map bounding box
    this._bbox = null;

    // @property {Boolean} true if marker is being shown
    this._markerVisible = null;

    // @property {Number} width map window width
    this.width = null;

    // @property {Number} height  map window height
    this.height = null;

    // @property {Number} resolution current map resolution (float)
    this.resolution = null;
    
    // @property {OpenLayers.Bounds} current map extent { left: NaN, top: NaN, right: NaN, bottom: NaN }
    this.extent = null;
    
    // @property {OpenLayers.Bounds} maximumExtent configured for the map { left: NaN, top: NaN, right: NaN, bottom: NaN }
    this.maxExtent = null;

    // @property {Boolean} _isMoving true when map is being dragged 
    this._isMoving = false;
}, {
    /**
     * @method moveTo
     * Sets new center and zoomlevel for map domain (NOTE: DOESN'T ACTUALLY MOVE
     * THE MAP)
     *
     * @param {Number}
     *            x
     * @param {Number}
     *            y
     * @param {Number}
     *            zoom map zoomlevel
     */
    moveTo : function(x, y, zoom) {
        this._centerX = Math.floor(x);
        this._centerY = Math.floor(y);
        this._zoom = zoom;
    },
    /**
     * @method setMoving
     * Sets true if map is moving currently
     *
     * @param {Boolean}
     *            movingBln true if map is being moved currently
     */
    setMoving : function(movingBln) {
        this._isMoving = movingBln;
    },
    /**
     * @method isMoving
     * True if map is moving currently (is being dragged)
     *
     * @return {Boolean}
     *            true if map is being moved currently
     */
    isMoving : function() {
        return this._isMoving;
    },
    /**
     * @method getX
     * Map center coordinate - longitude
     *
     * @return {Number}
     *            map center x
     */
    getX : function() {
        return this._centerX;
    },
    /**
     * @method getY
     * Map center coordinate - latitude
     *
     * @return {Number}
     *            map center y
     */
    getY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * Map center zoom level (0-12)
     *
     * @return {Number}
     *            map zoom level
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method setScale
     * Scale in map implementation (openlayers)
     *
     * @param {Number} scale
     *            map scale(float)
     */
    setScale : function(scale) {
        this._scale = scale;
    },
    /**
     * @method getScale
     * Scale in map implementation (openlayers)
     *
     * @return {Number}
     *            map scale (float)
     */
    getScale : function() {
        return this._scale;
    },
    /**
     * @method setBbox
     * Bounding box in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} bbox
     *            bounding box
     */
    setBbox : function(bbox) {
        this._bbox = bbox;
    },
    /**
     * @method getBbox
     * Bounding box in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            bounding box
     */
    getBbox : function() {
        return this._bbox;
    },
    /**
     * @method setMarkerVisible
     * true if marker is shown on map
     *
     * @param {Boolean} markerVisible
     *            true if marker is shown on map
     */
    setMarkerVisible : function(markerVisible) {
        this._markerVisible = markerVisible;
    },
    /**
     * @method isMarkerVisible
     * true if marker is shown on map
     *
     * @return {Boolean}
     *            true if marker is shown on map
     */
    isMarkerVisible : function() {
        if(this._markerVisible == true) {
            return true;
        }
        return false;
    },
    /**
     * @method setWidth
     * width of map window
     *
     * @param {Number} width
     *            width
     */
    setWidth : function(width) {
        this.width = width;
    },
    /**
     * @method getWidth
     * width of map window
     *
     * @return {Number}
     *            width
     */
    getWidth : function() {
        return this.width;
    },
    /**
     * @method setHeight
     * height of map window
     *
     * @param {Number} height
     *            height
     */
    setHeight : function(height) {
        this.height = height;
    },
    /**
     * @method getHeight
     * height of map window
     *
     * @return {Number}
     *            height
     */
    getHeight : function() {
        return this.height;
    },
    /**
     * @method setResolution
     * resolution in map implementation (openlayers)
     *
     * @param {Number} r
     *            resolution (float)
     */
    setResolution : function(r) {
        this.resolution = r;
    },
    /**
     * @method getResolution
     * resolution in map implementation (openlayers)
     *
     * @return {Number}
     *            resolution (float)
     */
    getResolution : function() {
        return this.resolution;
    },
    /**
     * @method setExtent
     * Extent in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} e
     *            extent
     */
    setExtent : function(e) {
        this.extent = e;
        /* e is this kind of oject  { left: l, top: t, right: r, bottom: b }*/;
    },
    /**
     * @method getExtent
     * Extent in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            extent
     */
    getExtent : function() {
        return this.extent;
    },
    /**
     * @method setMaxExtent
     * Max Extent in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} me
     *            max extent
     */
    setMaxExtent : function(me) {
        this.maxExtent = me;
        /* me is this kind of oject { left: l, top: t, right: r, bottom: b }*/;
    },
    /**
     * @method getMaxExtent
     * Max Extent in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            max extent
     */
    getMaxExtent : function() {
        return this.maxExtent;
    }
});
