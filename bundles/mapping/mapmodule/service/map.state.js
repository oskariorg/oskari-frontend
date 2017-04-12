/**
 * @class Oskari.mapframework.domain.Map
 *
 * Represents the values of the map implementation (openlayers)
 * Map module updates this domain object before sending out MapMoveEvents using
 * the set methods.
 * Set methods dont control the map in anyway so this is not the
 * way to control the map. This is only to get map values without openlayers
 * dependency.
 */
(function(Oskari) {
    var log = Oskari.log('map.state');

    // moved from core
    var _selectedLayers = [];
    var _activatedLayers = [];
    var _allowMultipleActivatedLayers = false;

    Oskari.clazz.define('Oskari.mapframework.domain.Map',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (sandbox) {
        this._sandbox = sandbox;

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

        // @property {OpenLayers.Bounds} maximumExtent configured for the map { left: NaN, top: NaN, right: NaN, bottom: NaN }
        this.maxExtent = null;

        // @property {Boolean} _isMoving true when map is being dragged
        this._isMoving = false;

        // @property {String} _projectionCode SRS projection code, defaults to 'EPSG:3067'
        this._projectionCode = "EPSG:3067";
    }, {
        /** @static @property __name service name */
        __name: "mapmodule.state",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__name;
        },
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method moveTo
         * Sets new center and zoomlevel for map domain
         * (NOTE: DOESN'T ACTUALLY MOVE THE MAP)
         *
         * @param {Number} x
         * @param {Number} y
         * @param {Number} zoom map zoomlevel
         */
        moveTo: function (x, y, zoom) {
            this._centerX = x;
            this._centerY = y;
            this._zoom = zoom;
        },
        /**
         * @method setMoving
         * Sets true if map is moving currently
         *
         * @param {Boolean}
         *            movingBln true if map is being moved currently
         */
        setMoving: function (movingBln) {
            this._isMoving = movingBln;
        },
        /**
         * @method isMoving
         * True if map is moving currently (is being dragged)
         *
         * @return {Boolean}
         *            true if map is being moved currently
         */
        isMoving: function () {
            return this._isMoving;
        },
        /**
         * @method getX
         * Map center coordinate - longitude
         *
         * @return {Number}
         *            map center x
         */
        getX: function () {
            return this._centerX;
        },
        /**
         * @method getY
         * Map center coordinate - latitude
         *
         * @return {Number}
         *            map center y
         */
        getY: function () {
            return this._centerY;
        },
        /**
         * @method getZoom
         * Map center zoom level (0-12)
         *
         * @return {Number}
         *            map zoom level
         */
        getZoom: function () {
            return this._zoom;
        },
        /**
         * @method setScale
         * Scale in map implementation (openlayers)
         *
         * @param {Number} scale
         *            map scale(float)
         */
        setScale: function (scale) {
            this._scale = scale;
        },
        /**
         * @method getScale
         * Scale in map implementation (openlayers)
         *
         * @return {Number}
         *            map scale (float)
         */
        getScale: function () {
            return this._scale;
        },
        /**
         * @method setBbox
         * Bounding box in map implementation (openlayers)
         *
         * @param {OpenLayers.Bounds} bbox
         *            bounding box
         */
        setBbox: function (bbox) {
            this._bbox = bbox;
        },
        /**
         * @method getBbox
         * Bounding box for map viewport
         *
         * @return {Object}
         *            bounding box
         */
        getBbox: function () {
            // bbox should be removed since it's the same as extent
            return this._bbox;
        },
        /**
         * @method getBbox
         * Bounding box for map viewport
         *
         * @return {String}
         *            bounding box as a string left, bottom, right, top
         */
        getBboxAsString: function () {
            var bbox = this.getBbox() || {};
            return [bbox.left, bbox.bottom, bbox.right, bbox.top].join(',');
        },
        /**
         * @method getExtent
         * Extent in map implementation (openlayers)
         *
         * @return {OpenLayers.Bounds}
         *            extent
         */
        getExtent: function () {
            log.warn('getExtent() is deprecated. Use getBbox() instead.');
            return this.getBbox();
        },

        /**
         * @method setWidth
         * width of map window
         *
         * @param {Number} width
         *            width
         */
        setWidth: function (width) {
            this.width = width;
        },
        /**
         * @method getWidth
         * width of map window
         *
         * @return {Number}
         *            width
         */
        getWidth: function () {
            return this.width;
        },
        /**
         * @method setHeight
         * height of map window
         *
         * @param {Number} height
         *            height
         */
        setHeight: function (height) {
            this.height = height;
        },
        /**
         * @method getHeight
         * height of map window
         *
         * @return {Number}
         *            height
         */
        getHeight: function () {
            return this.height;
        },
        /**
         * @method setResolution
         * resolution in map implementation (openlayers)
         *
         * @param {Number} r
         *            resolution (float)
         */
        setResolution: function (r) {
            this.resolution = r;
        },
        /**
         * @method getResolution
         * resolution in map implementation (openlayers)
         *
         * @return {Number}
         *            resolution (float)
         */
        getResolution: function () {
            return this.resolution;
        },
        /**
         * @method setMaxExtent
         * Max Extent in map implementation (openlayers)
         *
         * @param {OpenLayers.Bounds} me
         *            max extent
         */
        setMaxExtent: function (me) {
            this.maxExtent = me;
        },
        /**
         * @method getMaxExtent
         * Max Extent in map implementation (openlayers)
         *
         * @return {OpenLayers.Bounds}
         *            max extent
         */
        getMaxExtent: function () {
            return this.maxExtent;
        },
        /**
         * @method setSrsName
         * SRS projection code in map implementation (openlayers)
         *
         * @param {String} projection
         *            _projectionCode SRS projection code
         */
        setSrsName: function (projectionCode) {
            this._projectionCode = projectionCode;
        },
        /**
         * @method getSrsName
         * SRS projection code in map implementation (openlayers)
         *
         * @return {String}
         *            _projectionCode SRS projection code
         */
        getSrsName: function () {
            return this._projectionCode;
        },
        /************************************************
        * Common layer functions
        ************************************************** */
        getLayerIndex: function (id, list) {
            var normalizedId = id + '';
            if(!list) {
                list = this.getLayers();
            }
            var len = list.length;
            for (var i = 0; i < len; ++i) {
                if(list[i].getId() + '' === normalizedId) {
                    return i;
                }
            }
            return -1;
        },
        /************************************************
        * Selected layers
        ************************************************** */
        getLayers : function() {
            return _selectedLayers || [];
        },
        /**
         * @public @method getSelectedLayer
         * Checks if the layer matching the id is added to map
         *
         * @param {String} id ID of the layer to check
         * @return {Oskari.mapframework.domain.AbstractLayer|null} layer or null if not found
         */
        getSelectedLayer: function (id) {
            var index = this.getLayerIndex(id);
            if(index === -1) {
                return null;
            }
            var list = this.getLayers();
            return list[index];
        },
        /**
         * @public @method isLayerSelected
         * Checks if the layer matching the id is added to map
         *
         * @param {String} id ID of the layer to check
         * @return {Boolean} true if the layer is added to map
         */
        isLayerSelected: function (id) {
            return this.getLayerIndex(id) !== -1;
        },
        addLayer : function(layer, triggeredBy) {
            if(!layer || !layer.getId()) {
                log.warn('Attempt to add layer that is not available.');
                return;
            }
            if(this.isLayerSelected(layer.getId())) {
                log.warn('Layer already added. Skipping id ' + layer.getId());
                return false;
            }
            this.getLayers().push(layer);
            var evt = Oskari.eventBuilder('AfterMapLayerAddEvent')(layer);
            // TODO: setter?
            evt._creator = triggeredBy;
            this._sandbox.notifyAll(evt);
            return true;
        },
        removeLayer : function(id, triggeredBy) {
            var list = this.getLayers();
            var indexToRemove = this.getLayerIndex(id);
            if(indexToRemove === -1) {
                // not found
                log.debug('Attempt to remove layer "' + id + '" that is not selected.');
                return false;
            }
            // remove from activated list
            this.deactivateLayer(id);
            // remove layer
            var layer = this.getSelectedLayer(id);
            list.splice(indexToRemove, 1);
            // notify
            var evt = Oskari.eventBuilder('AfterMapLayerRemoveEvent')(layer);
            // TODO: setter?
            evt._creator = triggeredBy;
            this._sandbox.notifyAll(evt);
            return true;
        },
        moveLayer : function(id, newIndex, triggeredBy) {
            var list = this.getLayers();
            var oldIndex = this.getLayerIndex(id);
            if(oldIndex === -1) {
                // no layer to move
                return false;
            }
            if(!Oskari.util.isNumberBetween(newIndex, 0, list.length -1)) {
                // if not valid index -> treat as "move to last"
                newIndex = list.length - 1;
            }

            var moved = Oskari.util.arrayMove(list, oldIndex, newIndex);
            var layer = this.getSelectedLayer(id);
            // notify listeners
            var evt = Oskari.eventBuilder('AfterRearrangeSelectedMapLayerEvent')(layer, oldIndex, newIndex);
            // TODO: setter?
            evt._creator = triggeredBy;
            this._sandbox.notifyAll(evt);
            return moved;
        },
        /************************************************
        * Activated or "highlighted" layers
        ************************************************** */
        getActivatedLayers : function() {
            return _activatedLayers || [];
        },
        /**
         * If no parameter is given, returns the state of the flag. With parameter sets the flag.
         * @param  {Boolean} allow optional boolean value to set the flag
         * @return {Boolean} value of the flag
         */
        allowMultipleActivatedLayers : function(allow) {
            if(typeof allow === 'undefined') {
                // getter
                return _allowMultipleActivatedLayers;
            }
            // setter
            var newValue = !!allow;
            var activated = this.getActivatedLayers();
            // check if we have too many activated layers when turned off
            if(newValue === false && newValue !== _allowMultipleActivatedLayers && activated.length > 1) {
                var latestActivated = activated[activated.length -1];
                // deactivate all
                this.deactivateLayer();
                // reactivate the latest
                this.activateLayer(latestActivated.getId());
            }
            _allowMultipleActivatedLayers = newValue;
            return newValue;
        },
        /**
         * @public @method isLayerSelected
         * Checks if the layer matching the id is added to map
         *
         * @param {String} id ID of the layer to check
         * @return {Boolean} true if the layer is added to map
         */
        isLayerActivated: function (id) {
            return this.getLayerIndex(id, this.getActivatedLayers()) !== -1;
        },
        activateLayer : function(id, triggeredBy) {
            if(!this.isLayerSelected(id)) {
                log.warn('Trying to activate layer that is not selected. Skipping id ' + id);
                return false;
            }
            if(this.isLayerActivated(id)) {
                log.warn('Layer already activated. Skipping id ' + id);
                return false;
            }
            var layer = this.getSelectedLayer(id);
            // check if multiactivation is allowed -> deactivate the previous if not
            if(!this.allowMultipleActivatedLayers() && this.getActivatedLayers().length !== 0) {
                this.deactivateLayer(undefined, triggeredBy);
            }
            this.getActivatedLayers().push(layer);

            // finally notify sandbox
            var evt = Oskari.eventBuilder('map.layer.activation')(layer, true);
            // TODO: setter?
            evt._creator = triggeredBy;
            this._sandbox.notifyAll(evt);
            return true;
        },
        deactivateLayer : function(id, triggeredBy) {
            var sandbox = this._sandbox;
            var list = this.getActivatedLayers();
            var removalList = [];
            var evtBuilder = Oskari.eventBuilder('map.layer.activation');
            function notifyDim(removalList) {
                removalList.forEach(function(layer) {
                    var evt = evtBuilder(layer, false);
                    // TODO: setter?
                    evt._creator = triggeredBy;
                    sandbox.notifyAll(evt);
                });
            }
            if(typeof id === 'undefined') {
                // remove all
                removalList = list.slice(0);
                _activatedLayers = [];
                notifyDim(removalList);
                return removalList.length !== 0;
            }
            // remove single
            var indexToRemove = this.getLayerIndex(id, list);
            if(indexToRemove === -1) {
                // not found
                log.debug('Attempt to deactivate layer "' + id + '" that is not activated.');
                return false;
            }
            removalList = list.splice(indexToRemove, 1);
            notifyDim(removalList);
            return true;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));