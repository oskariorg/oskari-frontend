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
    }, {
        __name : 'UserLayersLayerPlugin',
        _clazz : 'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype : 'userlayer',

        getLayerTypeSelector : function() {
            return this.layertype;
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
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

        /**
         * Adds a single user layer to the map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.Userlayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this;
            var layerId = _.last(layer.getId().split('_'));
            var imgUrl = (layer.getLayerUrls()[0] + layerId).replace(/&amp;/g, '&');

            var sandbox = this.getSandbox();
            var map = this.getMapModule();
            var model = {
                source: new ol.source.ImageWMS({
                    url: imgUrl,
                    params: {
                        'LAYERS': layer.getRenderingElement(),
                        'FORMAT': 'image/png'
                    },
                    crossOrigin : layer.getAttributes('crossOrigin')
                }),
                visible: layer.isInScale(map.getMapScale()) && layer.isVisible(),
                opacity: layer.getOpacity() / 100
            };
            //minresolution === maxscale and vice versa...
            if(layer.getMaxScale() && layer.getMaxScale() !== -1) {
                model.minResolution = map.getResolutionForScale(layer.getMaxScale());
            }
            if(layer.getMinScale() && layer.getMinScale() !== -1) {
                var maxResolution = map.getResolutionForScale(layer.getMinScale());
                if(maxResolution !== map.getResolutionArray()[0]) {
                    // ol3 maxReso is exclusive so don't set if it's the map max resolution
                    model.maxResolution = maxResolution;
                }
            }

            var openlayer = new ol.layer.Image(model);
            map.addLayer(openlayer, !keepLayerOnTop);
            me._registerLayerEvents(openlayer, layer);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for UserLayer ' +
                layer.getId()
            );

            this.handleBounds(layer);
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL2 || OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function(layer, oskariLayer){
        var me = this;
        var source = layer.getSource();

        source.on('imageloadstart', function() {
          me.getMapModule().loadingState( oskariLayer._id, true);
        });

        source.on('imageloadend', function() {
          me.getMapModule().loadingState( oskariLayer._id, false);
        });

        source.on('imageloaderror', function() {
          oskariLayer.loadingError();
        });

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
        }
    }, {
        'extend': ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
