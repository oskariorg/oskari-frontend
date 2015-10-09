/**
 * Provides functionality to draw MyPlaces layers on the map
 *
 * @class Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin';
        me._name = 'MyPlacesLayerPlugin';

        me._supportedFormats = {};
        me.ajaxUrl = null;
        me.layers = {};
        if (me._config && me._config.ajaxUrl) {
            me.ajaxUrl = me._config.ajaxUrl;
        }
    }, {

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'MYPLACES',

        /**
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         *
         * @method register
         */
        register: function () {
            this.getMapModule().setLayerPlugin('myplaceslayer', this);
        },

        /**
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         *
         * @method unregister
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('myplaceslayer', null);
        },

        /**
         * Interface method for the module protocol.
         *
         * @private @method _initImpl
         *
         *
         */
        _initImpl: function () {
            // register domain builder
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'myplaceslayer',
                    'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder',
                    this.getSandbox()
                );
                mapLayerService.registerLayerModelBuilder(
                    'myplaceslayer',
                    layerModelBuilder
                );
            }
        },

        /**
         * Interface method for the plugin protocol.
         *
         * @private @method _startPluginImpl
         *
         *
         */
        _startPluginImpl: function () {
            if (!this.ajaxUrl) {
                this.ajaxUrl =
                    this.getSandbox().getAjaxUrl() +
                    'action_route=GetAnalysis?';
            }
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me._afterMapLayerRemoveEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                }
            };
        },

        /**
         * Adds given analysis layers to map if of type WFS
         *
         * @method preselectLayers
         * @param {Oskari.mapframework.domain.WfsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (!layer.isLayerOfType(this._layerType)) {
                    continue;
                }

                sandbox.printDebug('preselecting ' + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }
        },

        /**
         * Adds a single MyPlaces layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var me = this,
                openLayer,
                openLayerId = 'layer_' + layer.getId(),
                imgUrl = layer.getWmsUrl(),
                layerScales = this.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                );

            openLayer = new OpenLayers.Layer.WMS(
                openLayerId,
                imgUrl, {
                    layers: layer.getWmsName(),
                    transparent: true,
                    format: 'image/png',
                    hidden_ids: ''
                }, {
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visibility: true,
                    singleTile: true,
                    transitionEffect: null
                }
            );

            me._addMapLayersToMap(layer, openLayer, keepLayerOnTop, true);
        },

        /**
         * Adds  map layers (Wms layer / label text layer / group layer) to this map
         *
         * @method _addMapLayersToMap
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer
         * @param {OpenLayers.Layer.WMS} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isNew  is WMS openLayer already on Map
         */
        _addMapLayersToMap: function (layer, openLayer, keepLayerOnTop, isNew) {
            var me = this,
                openLayerId = 'layer_' + layer.getId(),
                renderer = OpenLayers.Util.getParameters(window.location.href).renderer;

            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            var attentionLayer = new OpenLayers.Layer.Vector(
                'layer_name_' + layer.getId(),
                {
                    styleMap: new OpenLayers.StyleMap({
                        'default': new OpenLayers.Style({
                            strokeOpacity: 1.0,
                            fillOpacity: 1.0,
                            pointerEvents: 'visiblePainted',
                            label: '${attentionText}',
                            fontColor: '#${color}',
                            labelAlign: '${align}',
                            labelXOffset: '${xOffset}',
                            labelYOffset: '${yOffset}',
                            fontSize: '24px',
                            fontFamily: 'Open Sans',
                            fontWeight: 'bold',
                            labelOutlineColor: 'white',
                            labelOutlineWidth: 3
                        })
                    }),
                    renderers: renderer
                }
            );

            // Define three colors that will be used to style the cluster features
            // depending on the number of features they contain.
            var colors = {
                low: '#6baed6',
                middle: '#3182bd',
                high: '#08519c'
            };

            // Define three rules to style the cluster features.
            var lowRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: 'count',
                    value: 5
                }),
                symbolizer: {
                    fillColor: colors.low,
                    fillOpacity: 0.9,
                    strokeColor: colors.low,
                    strokeOpacity: 0.5,
                    strokeWidth: 6,
                    pointRadius: 10,
                    label: '${count}',
                    labelOutlineWidth: 1,
                    fontColor: '#ffffff',
                    fontOpacity: 0.8,
                    fontSize: '12px'
                }
            });
            var middleRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: 'count',
                    lowerBoundary: 5,
                    upperBoundary: 10
                }),
                symbolizer: {
                    fillColor: colors.middle,
                    fillOpacity: 0.9,
                    strokeColor: colors.middle,
                    strokeOpacity: 0.5,
                    strokeWidth: 6,
                    pointRadius: 13,
                    label: '${count}',
                    labelOutlineWidth: 1,
                    fontColor: '#ffffff',
                    fontOpacity: 0.8,
                    fontSize: '12px'
                }
            });
            var highRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: 'count',
                    value: 10
                }),
                symbolizer: {
                    fillColor: colors.high,
                    fillOpacity: 0.9,
                    strokeColor: colors.high,
                    strokeOpacity: 0.5,
                    strokeWidth: 6,
                    pointRadius: 16,
                    label: '${count}',
                    labelOutlineWidth: 1,
                    fontColor: '#ffffff',
                    fontOpacity: 0.8,
                    fontSize: '12px'
                }
            });

            // Create a Style that uses the three previous rules
            var style = new OpenLayers.Style(null, {
                rules: [lowRule, middleRule, highRule]
            });

            /**
             * Class: OpenLayers.Strategy.Cluster
             * Strategy for vector feature clustering.
             *
             * Inherits from:
             *  - <OpenLayers.Strategy>
             */
            OpenLayers.Strategy.Cluster = OpenLayers.Class(OpenLayers.Strategy, {

                /**
                 * APIProperty: distance
                 * {Integer} Pixel distance between features that should be considered a
                 *     single cluster.  Default is 20 pixels.
                 */
                distance: 20,

                /**
                 * APIProperty: threshold
                 * {Integer} Optional threshold below which original features will be
                 *     added to the layer instead of clusters.  For example, a threshold
                 *     of 3 would mean that any time there are 2 or fewer features in
                 *     a cluster, those features will be added directly to the layer instead
                 *     of a cluster representing those features.  Default is null (which is
                 *     equivalent to 1 - meaning that clusters may contain just one feature).
                 */
                threshold: null,

                /**
                 * Property: features
                 * {Array(<OpenLayers.Feature.Vector>)} Cached features.
                 */
                features: null,

                /**
                 * Property: clusters
                 * {Array(<OpenLayers.Feature.Vector>)} Calculated clusters.
                 */
                clusters: null,

                /**
                 * Property: clustering
                 * {Boolean} The strategy is currently clustering features.
                 */
                clustering: false,

                /**
                 * Property: resolution
                 * {Float} The resolution (map units per pixel) of the current cluster set.
                 */
                resolution: null,

                /**
                 * Constructor: OpenLayers.Strategy.Cluster
                 * Create a new clustering strategy.
                 *
                 * Parameters:
                 * options - {Object} Optional object whose properties will be set on the
                 *     instance.
                 */

                /**
                 * APIMethod: activate
                 * Activate the strategy.  Register any listeners, do appropriate setup.
                 *
                 * Returns:
                 * {Boolean} The strategy was successfully activated.
                 */
                activate: function () {
                    var activated =
                        OpenLayers.Strategy.prototype.activate.call(this);

                    if (activated) {
                        this.layer.events.on({
                            'beforefeaturesadded': this.cacheFeatures,
                            'featuresremoved': this.clearCache,
                            'moveend': this.cluster,
                            scope: this
                        });
                    }
                    return activated;
                },

                /**
                 * APIMethod: deactivate
                 * Deactivate the strategy.  Unregister any listeners, do appropriate
                 *     tear-down.
                 *
                 * Returns:
                 * {Boolean} The strategy was successfully deactivated.
                 */
                deactivate: function () {
                    var deactivated =
                        OpenLayers.Strategy.prototype.deactivate.call(this);

                    if (deactivated) {
                        this.clearCache();
                        this.layer.events.un({
                            'beforefeaturesadded': this.cacheFeatures,
                            'featuresremoved': this.clearCache,
                            'moveend': this.cluster,
                            scope: this
                        });
                    }
                    return deactivated;
                },

                /**
                 * Method: cacheFeatures
                 * Cache features before they are added to the layer.
                 *
                 * Parameters:
                 * event - {Object} The event that this was listening for.  This will come
                 *     with a batch of features to be clustered.
                 *
                 * Returns:
                 * {Boolean} False to stop features from being added to the layer.
                 */
                cacheFeatures: function (event) {
                    var propagate = true;
                    if (!this.clustering) {
                        this.clearCache();
                        this.features = event.features;
                        this.cluster();
                        propagate = false;
                    }
                    return propagate;
                },

                /**
                 * Method: clearCache
                 * Clear out the cached features.
                 */
                clearCache: function () {
                    if (!this.clustering) {
                        this.features = null;
                    }
                },

                /**
                 * Method: cluster
                 * Cluster features based on some threshold distance.
                 *
                 * Parameters:
                 * event - {Object} The event received when cluster is called as a
                 *     result of a moveend event.
                 */
                cluster: function (event) {
                    var clusteredFeatures = [],
                        i,
                        j,
                        me = this;

                    if ((!event || event.zoomChanged) && me.features) {
                        var firstAdded = false,
                            resolution = me.layer.map.getResolution();

                        if (resolution != me.resolution || !me.clustersExist()) {
                            me.resolution = resolution;
                            var clusters = [],
                                feature,
                                clustered,
                                cluster;
                            for (i = 0; i < me.features.length; i += 1) {
                                me.features[i].geometry.clustered = false;
                                feature = me.features[i];
                                if (feature.geometry) {
                                    clustered = false;
                                    for (j = clusters.length - 1; j >= 0; j -= 1) {
                                        cluster = clusters[j];
                                        if (me.shouldCluster(cluster, feature)) {
                                            me.features[i].geometry.clustered = true;
                                            clusteredFeatures.push(
                                                me.features[i].featureId
                                            );
                                            if (!firstAdded) {
                                                cluster.cluster[0].geometry.clustered = true;
                                                clusteredFeatures.push(
                                                    cluster.cluster[0].featureId
                                                );
                                                firstAdded = true;
                                            }
                                            me.addToCluster(cluster, feature);
                                            clustered = true;
                                            break;
                                        }
                                    }
                                    if (!clustered) {
                                        clusters.push(
                                            me.createCluster(me.features[i])
                                        );
                                    }
                                }
                            }

                            me.clustering = true;
                            me.layer.removeAllFeatures();
                            me.clustering = false;
                            if (clusters.length > 0) {
                                if (me.threshold > 1) {
                                    var clone = clusters.slice();
                                    clusters = [];
                                    var candidate,
                                        len;
                                    for (i = 0, len = clone.length; i < len; i += 1) {
                                        candidate = clone[i];
                                        if (candidate.attributes.count < me.threshold) {
                                            Array.prototype.push.apply(
                                                clusters,
                                                candidate.cluster
                                            );
                                        } else {
                                            clusters.push(candidate);
                                        }
                                    }
                                }
                                me.clustering = true;
                                // A legitimate feature addition could occur during this
                                // addFeatures call.  For clustering to behave well, features
                                // should be removed from a layer before requesting a new batch.
                                me.layer.addFeatures(clusters);
                                me.clustering = false;
                            }
                            me.clusters = clusters;
                            var layerName = me.layer.name,
                                attentionLayer = me.layer.map.getLayersByName(
                                    layerName.substring(0, layerName.length - 1)
                                )[0];

                            for (i = 0; i < attentionLayer.features.length; i += 1) {
                                if (attentionLayer.features[i].geometry.clustered) {
                                    attentionLayer.features[i].style = {
                                        display: ''
                                    };
                                } else {
                                    attentionLayer.features[i].style = null;
                                }
                            }
                            attentionLayer.redraw();

                            var featureFilter = '';
                            /*
                            for (i = 0; i < clusteredFeatures.length; i += 1) {
                                featureFilter = featureFilter + "+AND+id<>'" + clusteredFeatures[i] + "'";
                            }*/

                            /*
                             if (clusteredFeatures > 0) {
                             var featureFilter = "+AND+NOT+IN(";
                             for (var i=0; i<clusteredFeatures.length; i++) {
                             featureFilter = featureFilter+"'"+clusteredFeatures[i]+"'";
                             if (i < clusteredFeatures.length-1) {
                             featureFilter = featureFilter+",";
                             }
                             }
                             featureFilter = featureFilter+")";
                             */
                            if (featureFilter !== null) {
                                var openLayer = me.layer.map.getLayersByName(
                                    'layer_' + layer.getId()
                                )[0];
                                openLayer.mergeNewParams({
                                    'myFeatureNames': featureFilter
                                });
                                //                                openLayer.redraw();
                            }
                        }
                    }
                    //              }
                },

                /**
                 * Method: clustersExist
                 * Determine whether calculated clusters are already on the layer.
                 *
                 * Returns:
                 * {Boolean} The calculated clusters are already on the layer.
                 */
                clustersExist: function () {
                    var me = this,
                        exist = false,
                        i;

                    if (me.clusters && me.clusters.length > 0 &&
                            me.clusters.length === me.layer.features.length) {
                        exist = true;
                        for (i = 0; i < me.clusters.length; i += 1) {
                            if (me.clusters[i] != me.layer.features[i]) {
                                exist = false;
                                break;
                            }
                        }
                    }
                    return exist;
                },

                /**
                 * Method: shouldCluster
                 * Determine whether to include a feature in a given cluster.
                 *
                 * Parameters:
                 * cluster - {<OpenLayers.Feature.Vector>} A cluster.
                 * feature - {<OpenLayers.Feature.Vector>} A feature.
                 *
                 * Returns:
                 * {Boolean} The feature should be included in the cluster.
                 */
                shouldCluster: function (cluster, feature) {
                    var cc = cluster.geometry.getBounds().getCenterLonLat(),
                        fc = feature.geometry.getBounds().getCenterLonLat(),
                        distance = (
                            Math.sqrt(
                                Math.pow((cc.lon - fc.lon), 2) +
                                Math.pow((cc.lat - fc.lat), 2)
                            ) / this.resolution
                        );
                    return (distance <= this.distance);
                },

                /**
                 * Method: addToCluster
                 * Add a feature to a cluster.
                 *
                 * Parameters:
                 * cluster - {<OpenLayers.Feature.Vector>} A cluster.
                 * feature - {<OpenLayers.Feature.Vector>} A feature.
                 */
                addToCluster: function (cluster, feature) {
                    cluster.cluster.push(feature);
                    cluster.attributes.count += 1;
                },

                /**
                 * Method: createCluster
                 * Given a feature, create a cluster.
                 *
                 * Parameters:
                 * feature - {<OpenLayers.Feature.Vector>}
                 *
                 * Returns:
                 * {<OpenLayers.Feature.Vector>} A cluster.
                 */
                createCluster: function (feature) {
                    var center = feature.geometry.getBounds().getCenterLonLat(),
                        cluster = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(
                                center.lon,
                                center.lat
                            ),
                            {
                                count: 1
                            }
                        );
                    cluster.cluster = [feature];
                    return cluster;
                },

                CLASS_NAME: 'OpenLayers.Strategy.Cluster'
            });

            var clusterStrategy = new OpenLayers.Strategy.Cluster({
                distance: 25,
                threshold: 2
            }),
            clusterLayer = new OpenLayers.Layer.Vector(
                'layer_name_' + layer.getId() + 'C',
                {
                    strategies: [clusterStrategy],
                    styleMap: new OpenLayers.StyleMap({
                        'default': style
                    })
                }
            ),
            myPlacesService = this.getSandbox().getService(
                'Oskari.mapframework.bundle.myplaces2.service.MyPlacesService'
            );

            /*  GeoServer is used instead.
            if (myPlacesService) {
                this._addAttentionText(myPlacesService, layer.getId(), attentionLayer);
            }
            */

            attentionLayer.opacity = layer.getOpacity() / 100;
            openLayer.opacity = layer.getOpacity() / 100;
            clusterLayer.opacity = layer.getOpacity() / 100;

            if (isNew) {
                this.getMap().addLayer(openLayer);
            }
            this.getMap().addLayer(attentionLayer);
            this.getMap().addLayer(clusterLayer);

            var myLayersGroup = [];
            myLayersGroup.push(openLayer);
            myLayersGroup.push(attentionLayer);
            myLayersGroup.push(clusterLayer);

            this.layers[openLayerId] = myLayersGroup;

            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for MyPlacesLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                this.getMap().setLayerIndex(
                    openLayer,
                    this.getMap().layers.length
                );
                this.getMap().setLayerIndex(
                    clusterLayer,
                    this.getMap().layers.length
                );
            } else {
                this.getMap().setLayerIndex(openLayer, 0);
            }

            /* if (myPlacesService) {
                this._addPointClusters(myPlacesService, layer.getId(), clusterLayer);
            } */

        },

        /**
         * Adds a single attention text to MyPlaces layer to this map
         *
         * @method _addAttentionText
         * @private
         * @param {Oskari.mapframework.bundle.myplaces2.service.MyPlacesService} myPlacesService
         * @param {String} layerId
         * @param {OpenLayers.Layer.Vector} vectorLayer
         */
        _addAttentionText: function (myPlacesService, layerId, vectorLayer) {
            var me = this,
                categoryId = layerId.split('_')[1],
                category = myPlacesService.findCategory(categoryId),
                features = myPlacesService.getPlacesInCategory(categoryId);

            _.forEach(features, function (feature) {
                var name = feature.name;

                if (feature.attention_text) {
                    name = feature.attention_text;
                }

                // FIXME lotsa code duplication here...

                if (feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.MultiPoint') {
                    _.forEach(feature.geometry.components, function (component) {
                        vectorLayer.addFeatures(
                            me._createFeature(
                                name,
                                component,
                                category.dotColor,
                                category.dotSize * 4
                            )
                        );
                    });
                } else if (feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.MultiPolygon') {
                    _.forEach(feature.geometry.components, function (component) {
                        var rightMostPoint = _.max(
                            component.components[0].components,
                            function (chr) {
                                return chr.x;
                            }
                        );
                        vectorLayer.addFeatures(
                            me._createFeature(
                                name,
                                rightMostPoint,
                                category.dotColor,
                                5
                            )
                        );
                    });
                } else if (feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.LineString') {
                    var rightMostPoint = _.max(
                        feature.geometry.components,
                        function (chr) {
                            return chr.x;
                        }
                    );
                    vectorLayer.addFeatures(
                        me._createFeature(
                            name,
                            rightMostPoint,
                            category.dotColor,
                            5
                        )
                    );
                } else if (feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.Polygon') {
                    _.forEach(feature.geometry.components, function (component) {
                        var rightMostPoint = _.max(
                            component.components,
                            function (chr) {
                                return chr.x;
                            }
                        );
                        vectorLayer.addFeatures(
                            me._createFeature(
                                name,
                                rightMostPoint,
                                category.dotColor,
                                5
                            )
                        );
                    });
                }

            });
        },

        /**
         * Creating new point feature
         *
         * @method _createFeature
         * @private
         * @param {String} name
         * @param {Component} component
         * @param {String} color
         * @param {integer} xOffset
         */
        _createFeature: function (name, component, color, xOffset) {
            var pointFeature = new OpenLayers.Feature.Vector(component);
            pointFeature.attributes = {
                attentionText: name,
                color: color,
                align: 'lb',
                xOffset: xOffset
            };
            return pointFeature;
        },

        /**
         * Creates and adds point clusters to MyPlaces layer to this map
         *
         * @method _addPointClusters
         * @private
         * @param {Oskari.mapframework.bundle.myplaces2.service.MyPlacesService} myPlacesService
         * @param {String} layerId
         * @param {OpenLayers.Layer.Vector} vectorLayer
         */
        _addPointClusters: function (myPlacesService, layerId, vectorLayer) {
            var categoryId = layerId.split('_')[1],
                features = myPlacesService.getPlacesInCategory(categoryId),
                i,
                j,
                points = [];

            for (i = 0; i < features.length; i += 1) {
                if (features[i].geometry.CLASS_NAME === 'OpenLayers.Geometry.MultiPoint') {
                    for (j = 0; j < features[i].geometry.components.length; j += 1) {
                        points.push(new OpenLayers.Feature.Vector(
                            features[i].geometry.components[j]
                        ));
                        points[points.length - 1].featureId = features[i].id;
                    }
                } else if (features[i].geometry.CLASS_NAME === 'OpenLayers.Geometry.Point') {
                    points.push(new OpenLayers.Feature.Vector(
                        features[i].geometry
                    ));
                    points[points.length - 1].featureId = features[i].id;
                }
            }
            vectorLayer.addFeatures(points);
        },

        /**
         * Handle AfterMapLayerRemoveEvent
         *
         * @method _afterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }
            this._removeMapLayerFromMap(layer);

        },

        /**
         * Removes the layer from the map
         *
         * @method _afterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
            if (!layer.isLayerOfType(this._layerType)) {
                return null;
            }

            var mapLayers = this.getOLMapLayers(layer);

            _.forEach(mapLayers, function (mapLayer) {
                mapLayer.destroy();
            });

            /* This should free all memory */
            //mapLayer[0].destroy();
        },

        /**
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         *
         * @method getOLMapLayers
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType(this._layerType)) {
                return null;
            }

            //return this.getMap().getLayersByName('layer_' + layer.getId());
            return this.layers['layer_' + layer.getId()];
        },

        /**
         * Handle AfterChangeMapLayerOpacityEvent
         *
         * @method _afterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var opacity = layer.getOpacity() / 100,
                openLayers = this.getOLMapLayers(layer);

            _.forEach(openLayers, function (mapLayer) {
                mapLayer.setOpacity(opacity);
            });
            //openLayer[0].setOpacity(opacity);
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
