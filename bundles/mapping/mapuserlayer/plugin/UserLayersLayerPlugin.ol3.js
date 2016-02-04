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
        this._clazz =
            'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin';
    }, {
        __name : 'UserLayersLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype : 'userlayer',

        getLayerTypeSelector : function() {
            return this.layertype;
        },
        /**
         * Interface method for the module protocol.
         *
         * @method init
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (!mapLayerService) {
                return;
            }
            mapLayerService.registerLayerModel(this.layertype,
                'Oskari.mapframework.bundle.myplacesimport.domain.UserLayer');

            var layerModelBuilder = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
                this.getSandbox()
            );
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                'MapLayerVisibilityChangedEvent': function (event) {
                    var layer = event.getMapLayer();
                    if (layer.isLayerOfType(me._layerType)) {
                        me._changeMapLayerVisibility(layer);
                    }
                }
            };
        },
        /**
         * Adds a single user layer to the map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.Userlayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var me = this,
                layerId = _.last(layer.getId().split('_')),
                imgUrl = (layer.getLayerUrls()[0] + layerId).replace(/&amp;/g, '&'),
                //minresolution === maxscale and vice versa...
                minResolution = this.getMapModule().getResolutionForScale(layer.getMaxScale()),
                maxResolution = this.getMapModule().getResolutionForScale(layer.getMinScale()),
                sandbox = this.getSandbox(),
                wms = {
                    'URL': imgUrl,
                    'LAYERS': layer.getRenderingElement(),
                    'FORMAT': 'image/png'
                },
                openlayer = new ol.layer.Image({
                    source: new ol.source.ImageWMS({
                        url: wms.URL,
                        params: {
                            'LAYERS': wms.LAYERS,
                            'FORMAT': wms.FORMAT
                        }
                    }),
                    minResolution: minResolution,
                    maxResolution: maxResolution,
                    visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                    opacity: layer.getOpacity() / 100
                });
            this.getMapModule().addLayer(openlayer, layer, layer.getName());

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for UserLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                me.getMapModule().setLayerIndex(openlayer, me.getMap().getLayers().getArray().length);
            } else {
                me.getMapModule().setLayerIndex(openlayer, 0);
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
         * @method _mapLayerVisibilityChangedEvent
         * Handle MapLayerVisibilityChangedEvent
         * @private
         * @param {OL 3 layer}
         */
        _changeMapLayerVisibility: function (layer) {
            var olLayers = this.getOLMapLayers(layer);

            _.each(olLayers, function(ol) {
                ol.setVisible(layer.isVisible());
            });
        }

    }, {
        "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });