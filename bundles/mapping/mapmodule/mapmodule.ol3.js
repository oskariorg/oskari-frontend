/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.MapModule',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     *      Unigue ID for this map
     * @param {Array} map options, example data:
     *  {
     *      resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
     *      units : "m",
     *      maxExtent : {
     *          left : 0,
     *          bottom : 10000000,
     *          right : 10000000,
     *          top : 0
     *      },
     *      srsName : "EPSG:3067"
     *  }
     */

    function (id, imageUrl, options, mapDivId) {
        this._options = {
            resolutions: [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
            srsName: 'EPSG:3067',
            units: 'm'
        };
        this._mapDivId = mapDivId || 'mapdiv';
        this._dpi = 72;   //   25.4 / 0.28;  use OL2 dpi
        // override defaults
        var key;
        if (options) {
            for (key in options) {
                if (options.hasOwnProperty(key)) {
                    this._options[key] = options[key];
                }
            }
        }
    }, {
        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @return {OpenLayers.Map}
         */
        _initImpl: function (sandbox, options, map) {


            // TODO remove this whenever we're ready to add the containers when needed
            this._addMapControlPluginContainers();
            this.getMapEl().addClass('olMap');
            return map;
        },

        _startImpl: function () {
            var sandbox = this.getSandbox();
            this._addRequestHandlersImpl(sandbox);
            return true;
        },

        _addRequestHandlersImpl: function (sandbox) {
            this.requestHandlers = {
                mapLayerUpdateHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler', sandbox, this),
                mapMoveRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler', sandbox, this),
                showSpinnerRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.ShowProgressSpinnerRequestHandler', sandbox, this)
            };
            sandbox.addRequestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
            sandbox.addRequestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);
            sandbox.addRequestHandler('ShowProgressSpinnerRequest', this.requestHandlers.showSpinnerRequestHandler);
        },

        _getMapCenter: function() {
            return this._map.getView().getCenter();
        },
        getMapZoom: function() {
            return this._map.getView().getZoom();
        },
        _getMapLayersByName: function(layerName) {
            // FIXME: Cannot detect Marker layer, which is called Overlays in OL3
            return [];
        },
        getExtent: function() {
            return this._extent;
        },

        getMapScale: function () {
            var map = this.getMap();
            var view = map.getView(); ;
            var resolution = view.getResolution();
            var units = map.getView().getProjection().getUnits();
            var mpu = ol.proj.METERS_PER_UNIT[units];
            var scale = resolution * mpu * 39.37 * this._dpi;
            return scale;
        },

        /**
         * Returns zoom level for any scale
         * Find 1st the scale range of OL3 resolution scales of requested scale
         * @param scale any scale
         * @param {Boolean} closest  closest resolution for scale
         * @returns {number}  zoom level ( OL3 scale range min or closest)
         */
        getZoom4Scale: function (scale, closest) {
            var resolution = this.calculateScaleResolution(scale),
                zoom = this._options.resolutions.indexOf(resolution);
            return  (zoom !== -1) ? zoom : 5;
        },


        /**
        * @method getMaxZoomLevel
        * Gets map max zoom level.
        *
        * @return {Integer} map max zoom level
        */
        getMaxZoomLevel: function(){
            // getNumZoomLevels returns OL map resolutions length, so need decreased by one (this return max OL zoom)
            return this._options.resolutions.length - 1;
        },

        getInteractionInstance: function (interactionName) {
            var interactions = this.getMap().getInteractions().getArray();
            var interactionInstance = interactions.filter(function(interaction) {
              return interaction instanceof interactionName;
            })[0];
            return interactionInstance;
        },

        /**
         * @method getMapViewPortDiv
         * Returns a reference to the map viewport div for setting correct z-ordering of divs
         * @return {HTMLDivElement}
         */
        getMapViewPortDiv: function () {
            return this._map.viewPortDiv;
        },

        /**
         * @method getMapLayersContainerDiv
         * Returns a reference to the div containing the map layers for setting correct z-ordering of divs
         * @return {HTMLDivElement}
         */
        getMapLayersContainerDiv: function () {
            return this._map.layerContainerDiv;
        },

        /**
         * @method _createMap
         * Depricated
         * @private
         * Creates the OpenLayers.Map object
         * @return {OpenLayers.Map}
         */
        _createMap: function () {
            this.getSandbox().printWarn('_createMap is deprecated. Use _createMapImpl instead.');
            this._createMapImpl();
        },

        /**
         * @method createMap
         * @private
         * OL3!!!
         * Creates the OpenLayers.Map object
         * @return {OpenLayers.Map}
         */
        _createMapImpl: function() {

            var me = this;
            var sandbox = me._sandbox;
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup

            var maxExtent = me._maxExtent;
            var extent = me._extent;

            var projection = ol.proj.get(me._projectionCode);
            projection.setExtent(extent);

            var projectionExtent = projection.getExtent();
            me._projection = projection;

            var map = new ol.Map({
                extent: projectionExtent,
                isBaseLayer: true,
                maxExtent: maxExtent,
                keyboardEventTarget: document,
                target: this._mapDivId

            });

            var resolutions = me._options.resolutions;


            map.setView(new ol.View({
                projection: projection,
                center: [383341, 6673843],
                zoom: 5,
                resolutions: resolutions
            }));


            map.on('moveend', function(evt) {
                var map = evt.map;
                var extent = map.getView().calculateExtent(map.getSize());
                var center = map.getView().getCenter();

                var sandbox = me._sandbox;
                sandbox.getMap().setMoving(false);
                sandbox.printDebug("sending AFTERMAPMOVE EVENT from map Event handler");

                var lonlat = map.getView().getCenter();
                me._updateDomainImpl();
                var sboxevt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[1], map.getView().getZoom(), false, me.getMapScale());
                sandbox.notifyAll(sboxevt);

            });

            map.on('singleclick', function (evt) {
                var sandbox = me._sandbox;
                var CtrlPressed = evt.originalEvent.ctrlKey;
                var lonlat = {
                  lon : evt.coordinate[0],
                  lat : evt.coordinate[1]
                };
                var mapClickedEvent = sandbox.getEventBuilder('MapClickedEvent')(lonlat, evt.pixel[0], evt.pixel[1], CtrlPressed);
                sandbox.notifyAll(mapClickedEvent);
            });

            map.on('pointermove', function (evt) {
                var sandbox = me._sandbox;
                var hoverEvent = sandbox.getEventBuilder('MouseHoverEvent')(evt.coordinate[0], evt.coordinate[1], false);
                sandbox.notifyAll(hoverEvent);
            });

            //NOTE! The next is only for demos, delete when going to release ol3!
            //map.on('dblclick', function (evt) {
            //    if (this.emptyFeatures === undefined) {
            //        this.emptyFeatures = false;
            //    }
            //    if (!this.emptyFeatures) {
            //        me._testVectorPlugin(evt.coordinate[0], evt.coordinate[1]);
            //        this.emptyFeatures = true;
            //    } else {
            //        var rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';
            //        me._sandbox.postRequestByName(rn, []);
            //        this.emptyFeatures = false;
            //    }
            //});

            me._map = map;

            return me._map;
        },
        /**
         * @method createBaseLayer
         * Creates a dummy base layer and adds it to the map. Nothing to do with Oskari maplayers really.
         * @private
         */
        _createBaseLayer: function() {
            // do nothing
        },

        _calculateScalesImpl: function(resolutions) {
            var units = this.getMap().getView().getProjection().getUnits(),
                mpu = ol.proj.METERS_PER_UNIT[units];

            for (var i = 0; i < resolutions.length; ++i) {
                var scale = resolutions[i] * mpu * 39.37 * this._dpi;
                    scale = Math.round(scale);

                this._mapScales.push(scale);
            }

        },
        /**
         * @method _updateDomain
         * @private
         * Updates the sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode.
         */
        _updateDomainImpl: function() {

            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            var sandbox = this._sandbox;
            var mapVO = sandbox.getMap();
            var lonlat = this._getMapCenter();
            var zoom = this.getMapZoom();
            mapVO.moveTo(lonlat[0], lonlat[1], zoom);

            mapVO.setScale(this.getMapScale());

            var size = this._map.getSize();
            mapVO.setWidth(size[0]);
            mapVO.setHeight(size[1]);
            mapVO.setResolution(this._map.getView().getResolution());

            var extent = this._map.getView().calculateExtent(this._map.getSize());

            //var bbox = new ol.extent.boundingExtent([extent[0], extent[1]], [extent[2], extent[3]]);

            mapVO.setExtent({
                left: extent[0],
                bottom: extent[1],
                right: extent[2],
                top: extent[3]
            });

            mapVO.setBbox({
                left: extent[0],
                bottom: extent[1],
                right: extent[2],
                top: extent[3]
            });

            var maxBbox = this._maxExtent;
            //var maxExtentBounds = new ol.extent(maxBbox.left, maxBbox.bottom, maxBbox.right, maxBbox.top);
            //mapVO.setMaxExtent(maxExtentBounds);

        },

        _addLayerImpl: function(layerImpl) {
            this._map.addLayer(layerImpl);
        },

        _removeLayerImpl: function(layerImpl) {
            this._map.removeLayer(layerImpl);
            if(typeof layerImpl.destroy === 'function') {
                layerImpl.destroy();
            }
        },

        setLayerIndex: function(layerImpl, index) {
            var layerColl = this._map.getLayers();
            var layerIndex = this.getLayerIndex(layerImpl);

            /* find */
            /* remove */
            /* insert at */

            if (index === layerIndex) {
                return
            } else if (index === layerColl.getLength()) {
                /* to top */
                layerColl.removeAt(layerIndex);
                layerColl.insertAt(index, layerImpl);
            } else if (layerIndex < index) {
                /* must adjust change */
                layerColl.removeAt(layerIndex);
                layerColl.insertAt(index - 1, layerImpl);

            } else {
                layerColl.removeAt(layerIndex);
                layerColl.insertAt(index, layerImpl);
            }

        },

        getLayerIndex: function(layerImpl) {
            var layerColl = this._map.getLayers();
            var layerArr = layerColl.getArray();

            for (var n = 0; n < layerArr.length; n++) {
                if (layerArr[n] === layerImpl) {
                    return n;
                }
            }
            return -1;
        },
        getSize: function(){
            var sandbox = this._sandbox,
                mapVO = sandbox.getMap(),
                width =  mapVO.getWidth(),
                height = mapVO.getHeight();

            return {
                width: width,
                height: height
            };
        },

        updateSize: function() {
            this._map.updateSize();
            this._updateDomainImpl();

            var sandbox = this._sandbox,
                mapVO = sandbox.getMap(),
                width =  mapVO.getWidth(),
                height = mapVO.getHeight();

            // send as an event forward
            if(width && height) {
              var evt = sandbox.getEventBuilder(
                  'MapSizeChangedEvent'
              )(width, height);
              sandbox.notifyAll(evt);
            }
        },

        _addMapControlImpl: function(ctl) {
            this._map.addControl(ctl);
        },

        _removeMapControlImpl: function(ctl) {
            this._map.removeControl(ctl);

        },

        /**
         * @method transformCoordinates
         * Transforms coordinates from given projection to the maps projectino.
         * @param {Object} pLonlat object with lon and lat keys
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @return {Object} transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (pLonlat, srs) {
            if(!srs || this.getProjection() === srs) {
                return pLonlat;
            }
            // TODO: check that srs definition exists as in OL2
            //var transformed = new ol.proj.fromLonLat([pLonlat.lon, pLonlat.lat], this.getProjection());
            var transformed = ol.proj.transform([pLonlat.lon, pLonlat.lat], srs, this.getProjection());
            return {
              lon : transformed[0],
              lat : transformed[1]
            };
        },

        /**
         * Adds the layer to the map through the correct plugin for the layer's type.
         *
         * @method _afterMapLayerAddEvent
         * @param  {Object} layer Oskari layer of any type registered to the mapmodule plugin
         * @param  {Boolean} keepLayersOrder
         * @param  {Boolean} isBaseMap
         * @return {undefined}
         */
        _afterMapLayerAddEvent: function (event) {
            var map = this.getMap(),
                layer = event.getMapLayer(),
                keepLayersOrder = event.getKeepLayersOrder(),
                isBaseMap = event.isBasemap(),
                layerPlugins = this.getLayerPlugins(),
                layerFunctions = [],
                i;

            _.each(layerPlugins, function (plugin) {
                //FIXME if (plugin && _.isFunction(plugin.addMapLayerToMap)) {
                if (_.isFunction(plugin.addMapLayerToMap)) {
                    var layerFunction = plugin.addMapLayerToMap(layer, keepLayersOrder, isBaseMap);
                    if (_.isFunction(layerFunction)) {
                        layerFunctions.push(layerFunction);
                    }
                }
            });

            // Execute each layer function
            for (i = 0; i < layerFunctions.length; i += 1) {
                layerFunctions[i].apply();
            }
        },

        /**
         * Removes all the css classes which respond to given regex from all elements
         * and adds the given class to them.
         *
         * @method changeCssClasses
         * @param {String} classToAdd the css class to add to all elements.
         * @param {RegExp} removeClassRegex the regex to test against to determine which classes should be removec
         * @param {Array[jQuery]} elements The elements where the classes should be changed.
         */
        changeCssClasses: function (classToAdd, removeClassRegex, elements) {
            var i,
                j,
                el;

            for (i = 0; i < elements.length; i += 1) {
                el = elements[i];
                // FIXME build the function outside the loop
                el.removeClass(function (index, classes) {
                    var removeThese = '',
                        classNames = classes.split(' ');

                    // Check if there are any old font classes.
                    for (j = 0; j < classNames.length; j += 1) {
                        if (removeClassRegex.test(classNames[j])) {
                            removeThese += classNames[j] + ' ';
                        }
                    }

                    // Return the class names to be removed.
                    return removeThese;
                });

                // Add the new font as a CSS class.
                el.addClass(classToAdd);
            }
        },


        /**
         * @method getMapEl
         * Get jQuery map element
         */
        getMapEl: function () {
            var mapDiv = jQuery('#' + this._mapDivId);
            if (!mapDiv.length) {
                this.getSandbox().printWarn('mapDiv not found with #' + this._mapDivId);
            }
            return mapDiv;
        },

        /**
         * @method getMapElDom
         * Get DOM map element
         */
        getMapElDom: function () {
            return this.getMapEl().get(0);
        },

        /**
         * Brings map layer to top
         * @method bringToTop
         *
         * @param {OpenLayers.Layer} layer The new topmost layer
         */
        bringToTop: function(layer) {
            var map = this._map;
            var list = map.getLayers();
            list.remove(layer);
            list.push(layer);
        },

        /**
         * @method orderLayersByZIndex
         * Orders layers by Z-indexes.
         */
        orderLayersByZIndex: function() {
            this._map.getLayers().getArray().sort(function(a, b){
                return a.getZIndex()-b.getZIndex();
            });
        },
        /**
         * @method zoomTo
         * Sets the zoom level to given value
         * @param {Number} zoomLevel the new zoom level
         */
        zoomTo: function (zoomLevel) {
            this.setZoomLevel(zoomLevel);
        },

        /**
         * @method setZoomLevel
         * Sets the maps zoom level to given absolute number
         * @param {Number} newZoomLevel absolute zoom level
         * @param {Boolean} suppressEvent true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        setZoomLevel: function (newZoomLevel, suppressEvent) {
            if (newZoomLevel < 0 || newZoomLevel > this.getMaxZoomLevel()) {
                newZoomLevel = this.getMapZoom();
            }
            this._map.getView().setZoom(newZoomLevel);
            this._updateDomainImpl();
            if (suppressEvent !== true) {
                //send note about map change
                this.notifyMoveEnd();
            }
        },

        /**
         * @method zoomToExtent
         * Zooms the map to fit given bounds on the viewport
         * @param {OpenLayers.Bounds} bounds BoundingBox that should be visible on the viewport
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToExtent: function (bounds, suppressStart, suppressEnd) {
            var extent = this.__boundsToArray(bounds);
            this._map.getView().fit(extent, this._map.getSize());
            this._updateDomainImpl();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * Transforms a bounds object with left,top,bottom and right properties
         * to an OL3 array. Returns the parameter as is if those properties don't exist.
         * @param  {Object | Array} bounds bounds object or OL3 array
         * @return {Array}          Ol3 presentation of bounds
         */
        __boundsToArray : function(bounds) {
            var extent = bounds;
            if(bounds.left && bounds.top && bounds.right && bounds.bottom) {
              extent = [
                    bounds.left,
                    bounds.bottom,
                    bounds.right,
                    bounds.top];
            }
            return extent;
        },
        /**
         * @method panMapByPixels
         * Pans the map by given amount of pixels.
         * @param {Number} pX amount of pixels to pan on x axis
         * @param {Number} pY amount of pixels to pan on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} isDrag true if the user is dragging the map to a new location currently (optional)
         */
        panMapByPixels: function (pX, pY, suppressStart, suppressEnd, isDrag) {
            var view = this._map.getView(),
                centerCoords = view.getCenter();
                centerPixels = this._map.getPixelFromCoordinate(centerCoords),
                newCenterPixels = [centerPixels[0] + pX, centerPixels[1] + pY],
                newCenterCoords = this._map.getCoordinateFromPixel(newCenterPixels),
                pan = ol.animation.pan({
                    duration: 100,
                    source: (centerCoords)
                });

            this._map.beforeRender(pan);
            view.setCenter(newCenterCoords);

            this._updateDomainImpl();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method moveMapToLonLat
         * Moves the map to the given position.
         * NOTE! Doesn't send an event if zoom level is not changed.
         * Call notifyMoveEnd() afterwards to notify other components about changed state.
         * @param {Number[] | Object} lonlat coordinates to move the map to
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
         * @param {Boolean} pIsDragging true if the user is dragging the map to a new location currently (optional)
         */
        moveMapToLonLat: function (lonlat, zoomAdjust, pIsDragging) {
            // parse lonlat if it's given as an array instead of {lon : x, lat : y}
            lonlat = this.normalizeLonLat(lonlat);
            // should we spam events on dragmoves?
            this._map.getView().setCenter([lonlat.lon, lonlat.lat]);

            if (zoomAdjust) {
                this.adjustZoomLevel(zoomAdjust, true);
            }
            this._updateDomainImpl();
        },
        getPixelFromCoordinate : function(lonlat) {
            lonlat = this.normalizeLonLat(lonlat);
            var px = this._map.getPixelFromCoordinate([lonlat.lon, lonlat.lat]);
            return {
                x : px[0],
                y : px[1]
            };
        },
        /**
         * @method centerMap
         * Moves the map to the given position and zoomlevel.
         * @param {Number[] | Object} lonlat coordinates to move the map to
         * @param {Number} zoomLevel absolute zoomlevel to set the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMap: function (lonlat, zoom, suppressEnd) {
            // TODO: we have isValidLonLat(); maybe use it here
            lonlat = this.normalizeLonLat(lonlat);
            this._map.getView().setCenter([lonlat[0], lonlat[1]]);
            this._map.getView().setZoom(zoom);
            this._updateDomainImpl();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * @method zoomToScale
         * Pans the map to the given position.
         * @param {float} scale the new scale
         * @param {Boolean} closest find the zoom level that most closely fits the specified scale.
         *   Note that this may result in a zoom that does not exactly contain the entire extent.  Default is false
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToScale: function (scale, closest, suppressEnd) {
            var zoom = this.getZoom4Scale(scale, closest);
            this._map.getView().setZoom(zoom);
            this._updateDomainImpl();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method adjustZoomLevel
         * Adjusts the maps zoom level by given relative number
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1
         * @param {Boolean} suppressEvent true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        adjustZoomLevel: function (amount, suppressEvent) {
            var requestedZoomLevel = this._getNewZoomLevel(amount);

            this.zoomTo(requestedZoomLevel);
            this._map.updateSize();
            this._updateDomainImpl();
            if (suppressEvent !== true) {
                // send note about map change
                this.notifyMoveEnd();
            }
        },

        /**
         * @method _getNewZoomLevel
         * @private
         * Does a sanity check on a zoomlevel adjustment to see if the adjusted zoomlevel is
         * supported by the map (is between 0-12). Returns the adjusted zoom level if it is valid or
         * current zoom level if the adjusted one is out of bounds.
         * @return {Number} sanitized absolute zoom level
         */
        _getNewZoomLevel: function(adjustment) {
            // TODO: check isNaN?
            var requestedZoomLevel = this._map.getView().getZoom() + adjustment;

            if (requestedZoomLevel >= 0 && requestedZoomLevel <= this.getMaxZoomLevel()) {
                return requestedZoomLevel;
            }
            // if not in valid bounds, return original
            return this._map.getView().getZoom();
        },

        /**
         * @method notifyStartMove
         * Notify other components that the map has started moving. Sends a MapMoveStartEvent.
         * Not sent always, preferrably track map movements by listening to AfterMapMoveEvent.
         * Ignores the call if map is in stealth mode
         */
        notifyStartMove: function () {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            this.getSandbox().getMap().setMoving(true);
            var centerX = this._getMapCenter()[0],
                centerY = this._getMapCenter()[1],
                evt = this.getSandbox().getEventBuilder('MapMoveStartEvent')(centerX, centerY);
            this.getSandbox().notifyAll(evt);
        },

        /**
         * @method notifyMoveEnd
         * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
         * sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode. Plugins should use this to notify other components
         * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
         * (this class) calls this automatically if not stated otherwise in API documentation.
         * @param {String} creator
         *        class identifier of object that sends event
         */
        notifyMoveEnd: function (creator) {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            var sandbox = this.getSandbox();
            sandbox.getMap().setMoving(false);

            var lonlat = this._getMapCenter();
            this._updateDomainImpl();
            var evt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this.getMapZoom(), false, this.getMapScale(), creator);
            sandbox.notifyAll(evt);
        },
        /**
         * Get map max extent.
         * @method getMaxExtent
         * @return {Object} max extent
         */
        getMaxExtent: function(){
            var bbox = this.getSandbox().getMap().getBbox();
            return {
                bottom: bbox.bottom,
                left: bbox.left,
                right: bbox.right,
                top: bbox.top
            };
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapModule']
    });
