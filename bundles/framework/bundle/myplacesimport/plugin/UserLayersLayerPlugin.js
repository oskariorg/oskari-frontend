/**
 * @class Oskari.mapframework.bundle.myplacesimport.plugin.MyLayersLayerPlugin
 * Provides functionality to draw user layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (config) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
        this.config = config;
        this.ajaxUrl = null;
        if (config && config.ajaxUrl) {
            this.ajaxUrl = config.ajaxUrl;
        }
    }, {
        /** @static @property __name plugin name */
        __name: 'UserLayersLayerPlugin',

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'USERLAYER',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },
        /**
         * @method hasUI
         * This plugin doesn't have an UI that we would want to ever hide so always returns false
         * @return {Boolean}
         */
        hasUI: function () {
            return false;
        },
        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('userlayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('userlayer', null);
        },
        /**
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var sandboxName = (this.config ? this.config.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);
            var layerModelBuilder = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplacesimport.domain.UserLayersLayerModelBuilder',
                sandbox);
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

            // register domain builder
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'userlayer', 'Oskari.mapframework.bundle.myplacesimport.domain.UserLayer');
                mapLayerService.registerLayerModelBuilder(
                    'userlayer', layerModelBuilder);
            }
        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();

            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
            if (!this.ajaxUrl) {
                this.ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetAnalysis?';
            }

        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @static
         * @property eventHandlers
         */
        eventHandlers: {
            'MapLayerVisibilityChangedEvent': function (event) {
                var layer = event.getMapLayer();
                if (layer.isLayerOfType(this._layerType)) {
                    this._changeMapLayerVisibility(layer);
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                var layer = event.getMapLayer();
                if (layer.isLayerOfType(this._layerType)) {
                    this._removeMapLayerFromMap(layer);
                }
            },
            'AfterChangeMapLayerOpacityEvent': function (event) {
                var layer = event.getMapLayer();
                if (layer.isLayerOfType(this._layerType)) {
                    this._changeMapLayerOpacity(layer);
                }
            },
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) return handler.apply(this, [event]);
        },
        /**
         * @method preselectLayers
         * Adds given analysis layers to map if of type WFS
         * @param {Oskari.mapframework.domain.WfsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this._sandbox,
                i,
                layer,
                layerId;
            for (i = 0; i < layers.length; i++) {
                layer = layers[i];
                layerId = layer.getId();

                if (!layer.isLayerOfType(this._layerType)) {
                    continue;
                }

                sandbox.printDebug("preselecting " + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }

        },
        /**
         * Adds a single Analysis layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }
            var openLayerId = 'layer_' + layer.getId(),
                imgUrl = layer.getWpsUrl() + 'wpsLayerId=' + layer.getWpsLayerId(),
                layerScales = this.getMapModule()
                    .calculateLayerScales(layer.getMaxScale(), layer.getMinScale()),
                openLayer = new OpenLayers.Layer.WMS(openLayerId, imgUrl, {
                    layers: layer.getWpsName(),
                    transparent: true,
                    format: "image/png"
                }, {
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visibility: true,
                    singleTile: true,
                    buffer: 0
                });


            openLayer.opacity = layer.getOpacity() / 100;
            this._map.addLayer(openLayer);
            this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for UserLayer " + layer.getId());

            if (keepLayerOnTop) {
                this._map.setLayerIndex(openLayer, this._map.layers.length);
            } else {
                this._map.setLayerIndex(openLayer, 0);
            }

            this.handleBounds(layer);
        },

        /**
         * @method handleBounds
         * @private
         *
         * Make use of the layer bounding box information to set appropriate map view
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         *            layer layer for which to handle bounds
         *
         */
        handleBounds: function (layer) {
            var sandbox = this._sandbox;

            this._parseGeometryForLayer(layer);

            var geom = layer.getGeometry();

            if ((geom === null) || (typeof geom === "undefined") ) {
                return;
            }
            if (geom.length === 0) {
                return;
            }

            var olPolygon = geom[0];
            var bounds = olPolygon.getBounds();
            var centroid = olPolygon.getCentroid();
            var epsilon = 1.0;

            var rb = sandbox.getRequestBuilder('MapMoveRequest'),
                req;
            if (rb) {
                if (olPolygon.getArea() < epsilon) {
                    // zoom to level 9 if a single point
                    req = rb(centroid.x, centroid.y, 9);
                    sandbox.request(this, req);
                } else {
                    req = rb(centroid.x, centroid.y, bounds);
                    sandbox.request(this, req);
                }
            }
        },

        /**
         * @method _parseGeometryForLayer
         * @private
         *
         * If layer.getGeometry() is empty, tries to parse layer.getGeometryWKT()
         * and set parsed geometry to the layer
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         *            layer layer for which to parse geometry
         *
         */
        _parseGeometryForLayer: function (layer) {
            // parse geometry if available
            if (layer.getGeometry && layer.getGeometry().length === 0) {
                var layerWKTGeom = layer.getGeometryWKT();
                if (!layerWKTGeom) {
                    // no wkt, dont parse
                    return;
                }
                // http://dev.openlayers.org/docs/files/OpenLayers/Format/WKT-js.html
                // parse to OpenLayers.Geometry.Geometry[] array ->
                // layer.setGeometry();
                var wkt = new OpenLayers.Format.WKT();

                var features = wkt.read(layerWKTGeom);
                if (features) {
                    if (features.constructor != Array) {
                        features = [features];
                    }
                    var geometries = [],
                        i;
                    for (i = 0; i < features.length; ++i) {
                        geometries.push(features[i].geometry);
                    }
                    layer.setGeometry(geometries);
                } else {
                    // 'Bad WKT';
                }
            }
        },
        /**
         * Removes the OpenLayers layer from the map
         * 
         * @method _removeMapLayerFromMap
         * @private
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
            this._modifyOL(layer, function(oLayer) {
                // This should free all memory
                oLayer.destroy();
            });
        },
        /**
         * Changes the OpenLayers layer opacity.
         * 
         * @method _changeMapLayerOpacity
         * @private
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer
         */
        _changeMapLayerOpacity: function (event) {
            this._modifyOL(layer, function(oLayer) {
                oLayer.setOpacity(layer.getOpacity() / 100);
            });
        },
        /**
         * Changes the OpenLayers layer visibility.
         * 
         * @method _changeMapLayerVisibility
         * @private
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer}
         */
        _changeMapLayerVisibility: function (layer) {
            this._modifyOL(layer, function(oLayer) {
                oLayer.setVisibility(layer.isVisible());
            });
        },
        /**
         * Executes a callback on an OpenLayers layer if it's found on the map.
         * 
         * @method _modifyOL
         * @private
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer
         * @param {Function} cb
         */
        _modifyOL: function(layer, cb) {
            var oLayer = this.getOLMapLayers(layer);
            if (oLayer && oLayer.length && oLayer[0] !== null && oLayer[0] !== undefined) {
                cb(oLayer);
            }
        },
        /**
         * Returns references to OpenLayers layer objects for requested layer
         * or null if layer is not added to map.
         * 
         * @method getOLMapLayers
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            return this._map.getLayersByName('layer_' + layer.getId());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });