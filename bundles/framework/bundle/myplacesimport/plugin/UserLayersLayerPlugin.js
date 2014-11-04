/**
 * @class Oskari.mapframework.bundle.myplacesimport.plugin.MyLayersLayerPlugin
 * Provides functionality to draw user layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin';
        me._name = 'UserLayersLayerPlugin';
        me._supportedFormats = {};
    }, {
        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'USERLAYER',

        /**
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         * 
         * @method register
         */
        register: function () {
            this.getMapModule().setLayerPlugin('userlayer', this);
        },

        /**
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         * 
         * @method unregister
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('userlayer', null);
        },

        /**
         * Interface method for the module protocol.
         *
         * @method init
         */
        _initImpl: function () {
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            // register domain builder
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'userlayer',
                    'Oskari.mapframework.bundle.myplacesimport.domain.UserLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
                    this.getSandbox()
                );
                mapLayerService.registerLayerModelBuilder(
                    'userlayer',
                    layerModelBuilder
                );
            }
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                'MapLayerVisibilityChangedEvent': function (event) {
                    var layer = event.getMapLayer();
                    if (layer.isLayerOfType(me._layerType)) {
                        me._changeMapLayerVisibility(layer);
                    }
                },
                'AfterMapLayerRemoveEvent': function (event) {
                    var layer = event.getMapLayer();
                    if (layer.isLayerOfType(me._layerType)) {
                        me._removeMapLayerFromMap(layer);
                    }
                },
                'AfterChangeMapLayerOpacityEvent': function (event) {
                    var layer = event.getMapLayer();
                    if (layer.isLayerOfType(me._layerType)) {
                        me._changeMapLayerOpacity(layer);
                    }
                }
            };
        },

        /**
         * Adds given user layers to map if of type 'userlayer'
         * 
         * @method preselectLayers
         * @param {Oskari.mapframework.domain.WfsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var me = this,
                sandbox = this.getSandbox();

            _.chain(layers)
                .filter(function (layer) {
                    return layer.isLayerOfType(me._layerType);
                })
                .each(function (layer) {
                    sandbox.printDebug('preselecting ' + layer.getId());
                    me.addMapLayerToMap(layer, true, layer.isBaseLayer());
                });
        },
        /**
         * Adds a single user layer to the map
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
                layerId = _.last(layer.getId().split('_')),
                imgUrl = (layer.getLayerUrls()[0] + layerId).replace(/&amp;/g, '&'),
                layerScales = this.getMapModule()
                    .calculateLayerScales(
                        layer.getMaxScale(),
                        layer.getMinScale()
                    ),
                openLayer = new OpenLayers.Layer.WMS(openLayerId, imgUrl, {
                    layers: layer.getRenderingElement(),
                    transparent: true,
                    format: 'image/png'
                }, {
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visibility: true,
                    singleTile: true,
                    buffer: 0
                });


            openLayer.opacity = layer.getOpacity() / 100;
            this.getMap().addLayer(openLayer);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for UserLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                this.getMap().setLayerIndex(
                    openLayer,
                    this.getMap().layers.length
                );
            } else {
                this.getMap().setLayerIndex(openLayer, 0);
            }

            this.handleBounds(layer);
        },

        /**
         * Make use of the layer bounding box information to set appropriate map view
         * 
         * @method handleBounds
         * @private
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer}
         * layer for which to handle bounds
         */
        handleBounds: function (layer) {
            var sandbox = this.getSandbox();

            this._parseGeometryForLayer(layer);

            var geom = layer.getGeometry();

            if ((geom === null) || (typeof geom === 'undefined') || geom.length === 0) {
                return;
            }

            var olPolygon = geom[0],
                bounds = olPolygon.getBounds(),
                centroid = olPolygon.getCentroid(),
                epsilon = 1.0,
                rb = sandbox.getRequestBuilder('MapMoveRequest'),
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
         * If layer.getGeometry() is empty, tries to parse layer.getGeometryWKT()
         * and set parsed geometry to the layer
         *
         * @method _parseGeometryForLayer
         * @private
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer}
         * layer for which to parse geometry
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
                var wkt = new OpenLayers.Format.WKT(),
                    features = wkt.read(layerWKTGeom);
                if (features) {
                    if (features.constructor !== Array) {
                        features = [features];
                    }
                    var geometries = [],
                        i;
                    for (i = 0; i < features.length; i += 1) {
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
            this._modifyOL(layer, function (oLayer) {
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
        _changeMapLayerOpacity: function (layer) {
            this._modifyOL(layer, function (oLayer) {
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
            this._modifyOL(layer, function (oLayer) {
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
        _modifyOL: function (layer, cb) {
            var oLayer = this.getOLMapLayers(layer);
            if (oLayer && oLayer.length && oLayer[0] !== null && oLayer[0] !== undefined) {
                cb(oLayer[0]);
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
            return this.getMap().getLayersByName('layer_' + layer.getId());
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });