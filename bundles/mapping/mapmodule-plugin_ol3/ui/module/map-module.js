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
         * @method createBaseLayer
         * Creates a dummy base layer and adds it to the map. Nothing to do with Oskari maplayers really.
         * @private
         */
        _createBaseLayer: function() {
            // do nothing
        },
        _getMapCenter: function() {
            return this._map.getView().getCenter();
        },
        _getMapZoom: function() {
            return this._map.getView().getZoom();
        },
        _getMapLayersByName: function(layerName) {
            // FIXME: Cannot detect Marker layer, which is called Overlays in OL3
            return [];
        },
        getProjection: function() {
            return this._projection;
        },
        getExtent: function() {
            return this._extent;
        },
        _getCurrentScale: function () {
            var map = this.getMap();
            var view = map.getView(); ;
            var resolution = view.getResolution();
            var units = map.getView().getProjection().getUnits();
            var dpi = 25.4 / 0.28;
            var mpu = ol.proj.METERS_PER_UNIT[units];
            var scale = resolution * mpu * 39.37 * dpi;
            return scale;
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

        _getContainerWithClasses: function (containerClasses) {
            var mapDiv = this.getMapEl(),
                containerDiv = jQuery(
                    '<div class="mapplugins">' +
                    '  <div class="mappluginsContainer">' +
                    '    <div class="mappluginsContent"></div>' +
                    '  </div>' +
                    '</div>'
                );

            containerDiv.addClass(containerClasses);
            containerDiv.attr('data-location', containerClasses);
            return containerDiv;
        },

        _getContainerClasses: function () {
            return [
                'bottom center',
                'center top',
                'center right',
                'center left',
                'bottom right',
                'bottom left',
                'right top',
                'left top'
            ];
        },

        /**
         * Adds containers for map control plugins
         */
        _addMapControlPluginContainers: function () {
            var containerClasses = this._getContainerClasses(),
                containerDiv,
                mapDiv = this.getMapEl(),
                i;

            for (i = 0; i < containerClasses.length; i += 1) {
                mapDiv.append(
                    this._getContainerWithClasses(containerClasses[i])
                );
            }
        },

        _getMapControlPluginContainer: function (containerClasses) {
            var splitClasses = (containerClasses + '').split(' '),
                selector = '.mapplugins.' + splitClasses.join('.'),
                containerDiv,
                mapDiv = this.getMapEl();

            containerDiv = mapDiv.find(selector);
            if (!containerDiv.length) {
                var containersClasses = this._getContainerClasses(),
                    currentClasses,
                    previousFound = null,
                    current,
                    classesMatch,
                    i,
                    j;

                for (i = 0; i < containersClasses.length; i += 1) {
                    currentClasses = containersClasses[i].split(' ');
                    current = mapDiv.find('.mapplugins.' + currentClasses.join('.'));
                    if (current.length) {
                        // container was found in DOM
                        previousFound = current;
                    } else {
                        // container not in DOM, see if it's the one we're supposed to add
                        classesMatch = true;
                        for (j = 0; j < currentClasses.length; j += 1) {
                            if (jQuery.inArray(currentClasses[j], splitClasses) < 0) {
                                classesMatch = false;
                                break;
                            }
                        }
                        if (classesMatch) {
                            // It's the one we're supposed to add
                            containerDiv = this._getContainerWithClasses(
                                currentClasses
                            );
                            if (previousFound !== null && previousFound.length) {
                                previousFound.after(containerDiv);
                            } else {
                                mapDiv.prepend(containerDiv);
                            }
                        }
                    }
                }
            }
            return containerDiv;
        },

        /**
         * @method setMapControlPlugin
         * Inserts a map control plugin instance to the map DOM
         * @param  {Object} element          Control container (jQuery)
         * @param  {String} containerClasses List of container classes separated by space, e.g. 'top left'
         * @param  {Number} slot             Preferred slot/position for the plugin element. Inverted for bottom corners (at least).
         */

        setMapControlPlugin: function (element, containerClasses, position) {
            // Get the container
            var container = this._getMapControlPluginContainer(containerClasses),
                content = container.find('.mappluginsContainer .mappluginsContent'),
                pos = position + '',
                inverted = /^(?=.*\bbottom\b)((?=.*\bleft\b)|(?=.*\bright\b)).+/.test(containerClasses), // bottom corner container?
                precedingPlugin = null,
                curr;

            if (!element) {
                throw 'Element is non-existent.';
            }
            if (!containerClasses) {
                throw 'No container classes.';
            }
            if (!content || !content.length) {
                throw 'Container with classes "' + containerClasses + '" not found.';
            }
            if (content.length > 1) {
                throw 'Found more than one container with classes "' + containerClasses + '".';
            }

            // Add slot to element
            element.attr('data-position', position);
            // Detach element
            element.detach();
            // Get container's children, iterate through them
            if (position !== null && position !== undefined) {
                content.find('.mapplugin').each(function () {
                    curr = jQuery(this);
                    // if plugin's slot isn't bigger (or smaller for bottom corners) than ours, store it to precedingPlugin
                    if ((!inverted && curr.attr('data-position') <= pos) ||
                        (inverted && curr.attr('data-position') > pos)) {
                        precedingPlugin = curr;
                    }
                });
                if (!precedingPlugin) {
                    // no preceding plugin found, just slap our plugin to the beginning of the container
                    content.prepend(element);
                } else {
                    // preceding plugin found, insert ours after it.
                    precedingPlugin.after(element);
                }
            } else {
                // no position given, add to end
                content.append(element);
            }
            // Make sure container is visible
            container.css('display', '');
        },

        /**
         * @method removeMapControlPlugin
         * Removes a map control plugin instance from the map DOM
         * @param  {Object} element Control container (jQuery)
         * @param  {Boolean} keepContainerVisible Keep container visible even if there's no children left.
         */
        removeMapControlPlugin: function (element, keepContainerVisible) {
            var container = element.parents('.mapplugins'),
                content = element.parents('.mappluginsContent');
            // TODO take this into use in all UI plugins so we can hide unused containers...
            element.remove();
            if (!keepContainerVisible && content.children().length === 0) {
                container.css('display', 'none');
            }
        },

        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @return {OpenLayers.Map}
         */
        _initImpl: function (sandbox, options, map) {
            //var scales = this._calculateScalesFromResolutions(options.resolutions, map.units);
            //this._mapScales = scales;

            this._createBaseLayer();

            // TODO remove this whenever we're ready to add the containers when needed
            this._addMapControlPluginContainers();
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
                mapMoveRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler', sandbox, this)
            };
            sandbox.addRequestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
            sandbox.addRequestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);
        },

        /**
         * Changed to resolutions based map zoom levels, but we need to
         * calculate scales array for backward compatibility
         *
         * @param  {Number[]} resolutions configured resolutions array
         * @param  {String} units         OpenLayers unit (m/degree etc)
         * @return {Number[]}             calculated matching scales array
         * @private
         */
         /*
        _calculateScalesFromResolutions: function (resolutions, units) {
            var scales = [],
                i,
                calculatedScale;
            for (i = 0; i < resolutions.length; i += 1) {
                calculatedScale = OpenLayers.Util.getScaleFromResolution(resolutions[i], units);
                // rounding off the resolution to scale calculation
                calculatedScale = calculatedScale * 100000000;
                calculatedScale = Math.round(calculatedScale);
                calculatedScale = calculatedScale / 100000000;
                scales.push(calculatedScale);
            }
            return scales;
        },
        */

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

            proj4.defs("EPSG:3067","+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

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
                var sboxevt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[1], map.getView().getZoom(), false, me._getCurrentScale());
                sandbox.notifyAll(sboxevt);

            });

            map.on('singleclick', function (evt) {
                var sandbox = me._sandbox;
                var CtrlPressed = evt.browserEvent.ctrlKey;
                var mapClickedEvent = sandbox.getEventBuilder('MapClickedEvent')(evt.coordinate, evt.pixel[0], evt.pixel[1], CtrlPressed);
                sandbox.notifyAll(mapClickedEvent);
            });

            map.on('pointermove', function (evt) {
                var sandbox = me._sandbox;
                var hoverEvent = sandbox.getEventBuilder('MouseHoverEvent')(evt.coordinate[0], evt.coordinate[1], false);
                sandbox.notifyAll(hoverEvent);
            });

            //NOTE! The next is only for demos, delete when going to release ol3!
            map.on('dblclick', function (evt) {
                if (this.emptyFeatures === undefined) {
                    this.emptyFeatures = false;
                }
                if (!this.emptyFeatures) {
                    me._testVectorPlugin(evt.coordinate[0], evt.coordinate[1]);
                    this.emptyFeatures = true;
                } else {
                    var rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';
                    me._sandbox.postRequestByName(rn, []);
                    this.emptyFeatures = false;
                }
            });

            me._map = map;

            return me._map;
        },

        //NOTE! The next is only for demos, delete when going to release ol3!
        _testVectorPlugin: function (x,y) {
            var geojsonObject = {
                  'type': 'FeatureCollection',
                  'crs': {
                    'type': 'name',
                    'properties': {
                      'name': 'EPSG:3067'
                    }
                  },
                  'features': [
                    {
                      'type': 'Feature',
                      'geometry': {
                        'type': 'LineString',
                        'coordinates': [[x, y], [x+1000, y+1000]]
                      }
                    },
                    {
                      'type': 'Feature',
                      'geometry': {
                        'type': 'Point',
                        'coordinates': [x, y]
                      }
                    }

                  ]
                };

            var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
            this._sandbox.postRequestByName(rn, [geojsonObject, 'GeoJSON', null, 'replace', true, null, null, true]);
        },

        _calculateScalesImpl: function(resolutions) {
            return;

            // FIX this to work with ol3
            /*
            for (var i = 0; i < resolutions.length; ++i) {
                var calculatedScale = OpenLayers.Util.getScaleFromResolution(resolutions[i], 'm');
                calculatedScale = calculatedScale * 10000;
                calculatedScale = Math.round(calculatedScale);
                calculatedScale = calculatedScale / 10000;
                this._mapScales.push(calculatedScale);
            }
            */
        },

        getZoomLevel: function() {
            return this._map.getView().getZoom();
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
            var zoom = this._getMapZoom();
            mapVO.moveTo(lonlat[0], lonlat[1], zoom);

            mapVO.setScale(this._getCurrentScale());

            var size = this._map.getSize();
            mapVO.setWidth(size[0]);
            mapVO.setHeight(size[1]);
            mapVO.setResolution(this._map.getView().getResolution());

            var extent = this._map.getView().calculateExtent(this._map.getSize());

            //var bbox = new ol.extent.boundingExtent([extent[0], extent[1]], [extent[2], extent[3]]);

            mapVO.setExtent(extent);
            //mapVO.setBbox(bbox)

            var maxBbox = this._maxExtent;
            //var maxExtentBounds = new ol.extent(maxBbox.left, maxBbox.bottom, maxBbox.right, maxBbox.top);
            //mapVO.setMaxExtent(maxExtentBounds);

        },


        _addLayerImpl: function(layerImpl) {
            this._map.addLayer(layerImpl);
        },

        _removeLayerImpl: function(layerImpl) {
            this._map.removeLayer(layerImpl);
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

        updateSize: function() {
            this._map.updateSize();
        },

        _addMapControlImpl: function(ctl) {
            this._map.addControl(ctl);
        },

        _removeMapControlImpl: function(ctl) {
            this._map.removeControl(ctl);

        },

        /**
         * @method transformCoordinates
         * Deprecated
         * Transforms coordinates from given projection to the maps projectino.
         * @param {OpenLayers.LonLat} pLonlat
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @return {OpenLayers.LonLat} transformed coordinates
         */
        transformCoordinates: function (pLonlat, srs) {
            this.getSandbox().printWarn(
                'transformCoordinates is deprecated. Use _transformCoordinates instead if called from plugin. Otherwise, use Requests instead.'
            );

            return this._transformCoordinates(pLonlat, srs);
        },

        /**
         * @method _transformCoordinates
         * Transforms coordinates from given projection to the maps projectino.
         * @param {OpenLayers.LonLat} pLonlat
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @return {OpenLayers.LonLat} transformed coordinates
         */
        _transformCoordinates: function (pLonlat, srs) {
            return pLonlat.transform(
                new OpenLayers.Projection(srs),
                this.getMap().getProjectionObject()
            );
        },
        /**
         * @property eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapLayerAddEvent': function (event) {
                this._afterMapLayerAddEvent(event);
            },
            'LayerToolsEditModeEvent': function (event) {
                this._isInLayerToolsEditMode = event.isInMode();
            }
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
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * Internally calls getOLMapLayers() on all registered layersplugins.
         * @param {String} layerId
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layerId) {
            var me = this,
                sandbox = me._sandbox,
                layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                // not found
                return null;
            }
            var lps = this.getLayerPlugins(),
                p,
                layersPlugin,
                layerList,
                results = [];
            // let the actual layerplugins find the layer since the name depends on
            // type
            for (p in lps) {
                if (lps.hasOwnProperty(p)) {
                    layersPlugin = lps[p];
                    if (!layersPlugin) {
                        me.getSandbox().printWarn(
                            'LayerPlugins has no entry for "' + p + '"'
                        );
                    }
                    // find the actual openlayers layers (can be many)
                    layerList = layersPlugin ? layersPlugin.getOLMapLayers(layer): null;
                    if (layerList) {
                        // if found -> add to results
                        // otherwise continue looping
                        results = results.concat(layerList);
                    }
                }
            }
            return results;
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

        isInLayerToolsEditMode: function () {
            return this._isInLayerToolsEditMode;
        },

        /*
        _calculateScalesImpl: function (resolutions) {
            for (var i = 0; i < resolutions.length; i += 1) {
                var calculatedScale = OpenLayers.Util.getScaleFromResolution(
                    resolutions[i],
                    'm'
                );
                calculatedScale = calculatedScale * 10000;
                calculatedScale = Math.round(calculatedScale);
                calculatedScale = calculatedScale / 10000;
                this._mapScales.push(calculatedScale);
            }
        },
        */

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
            this._map.layers.sort(function(a, b){
                return a.getZIndex()-b.getZIndex();
            });
        },
        /**
         * @method zoomTo
         * Sets the zoom level to given value
         * @param {Number} zoomLevel the new zoom level
         */
        zoomTo: function (zoomLevel) {
            this.setZoomLevel(zoomLevel, false);
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
                newZoomLevel = this._getMapZoom();
            }
            this._map.getView().setZoom(newZoomLevel);
            /*
            this._updateDomainImpl();
            if (suppressEvent !== true) {
                //send note about map change
                this.notifyMoveEnd();
            }
            */
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
            this._map.getView().fit(bounds, this._map.getSize());
            this._updateDomainImpl();
            // send note about map change
            /*
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
            */
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
                    duration: 200,
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
         * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
         * @param {Boolean} pIsDragging true if the user is dragging the map to a new location currently (optional)
         */
        moveMapToLonLat: function (lonlat, zoomAdjust, pIsDragging) {
            // TODO: openlayers has isValidLonLat(); maybe use it here
            var isDragging = (pIsDragging === true);
            // TODO check if panTo (still) breaks IE9+ and if not, should we use it
            // using panTo BREAKS IE on startup so do not
            // should we spam events on dragmoves?
            this._map.getView().setCenter([lonlat[0], lonlat[1]]);

            if (zoomAdjust) {
                this.adjustZoomLevel(zoomAdjust, true);
            }
            this._updateDomainImpl();
        },

        setMapCenter: function (lonlat, zoom) {
            this._map.getView().setCenter([lonlat[0], lonlat[1]]);
            this._map.getView().setZoom(zoom);
            this._updateDomainImpl();
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
            var evt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this._getMapZoom(), false, this._getCurrentScale(), creator);
            sandbox.notifyAll(evt);
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapModule']
    });
