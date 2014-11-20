/**
 * @class Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin',
/**
 * @method create called automatically on construction
 * @static

 * @param {Object} config
 */

    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin';
        me._name = 'WfsLayerPlugin';

        // connection and communication
        me._connection = null;
        me._io = null;

        // state
        me.tileSize = null;
        me.zoomLevel = null;
        me._isWFSOpen = 0;

        // printing
        me._printTiles = {};

        // wms layer handling
        me._tiles = {};
        me._tilesToUpdate = null;
        me._tileData = null;
        me._tileDataTemp = null;

        // highlight enabled or disabled
        me._highlighted = true;

        me.errorTriggers = {
            connection_not_available: {
                limit: 1,
                count: 0
            },
            connection_broken: {
                limit: 1,
                count: 0
            }
        };

        me.activeHighlightLayers = [];
    }, {
        __layerPrefix: 'wfs_layer_',
        __typeHighlight: 'highlight',
        __typeNormal: 'normal',

        /**
         * @private @method _initImpl
         *
         * Initiliazes the connection to the CometD servlet and registers the domain model
         */
        _initImpl: function () {
            var me = this,
                config = me.getConfig(),
                layerModelBuilder,
                mapLayerService,
                portAsString,
                sandbox = me.getSandbox();

            me.createTilesGrid();

            // service init
            if (config) {
                if (!config.hostname || config.hostname === 'localhost') {
                    // convenience so the host isn't required
                    config.hostname = location.hostname;
                }
                if (!config.port) {
                    // convenience so the port isn't required
                    config.port = '';
                    config.port += location.port;
                }
                // length check won't work if port is given as number
                portAsString = '';
                portAsString += config.port;
                if (portAsString.length > 0) {
                    config.port = ':' + config.port;
                }
                if (!config.contextPath) {
                    // convenience so the contextPath isn't required
                    config.contextPath = '/transport';
                }
                me._config = config;
            }
            me._connection = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.service.Connection',
                me._config,
                me
            );

            me._io = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.service.Mediator',
                me._config,
                me
            );

            // register domain model
            mapLayerService = sandbox.getService(
                'Oskari.mapframework.service.MapLayerService'
            );
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'wfslayer',
                    'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',
                    sandbox
                );
                mapLayerService.registerLayerModelBuilder(
                    'wfslayer',
                    layerModelBuilder
                );
            }

            // tiles to draw  - key: layerId + bbox
            me._tilesToUpdate = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.plugin.TileCache'
            );
            // data for tiles - key: layerId + bbox
            me._tileData = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.plugin.TileCache'
            );
            me._tileDataTemp = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.plugin.TileCache'
            );

            me._visualizationForm = Oskari.clazz.create(
                'Oskari.userinterface.component.VisualizationForm'
            );
        },

        /**
         * @method register
         *
         * Registers plugin into mapModule
         */
        register: function () {
            this.getMapModule().setLayerPlugin('wfslayer', this);
        },

        /**
         * @method unregister
         *
         * Removes registration of the plugin from mapModule
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('wfslayer', null);
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                /**
                 * @method AfterMapMoveEvent
                 * @param {Object} event
                 */
                AfterMapMoveEvent: function (event) {
                    if (me.getConfig() && me.getConfig().deferSetLocation) {
                        me.getSandbox().printDebug(
                            'setLocation deferred (to aftermapmove)'
                        );
                        return;
                    }
                    me.mapMoveHandler();
                },

                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Object} event
                 */
                AfterMapLayerAddEvent: function (event) {
                    me.mapLayerAddHandler(event);
                },

                /**
                 * @method AfterMapLayerRemoveEvent
                 * @param {Object} event
                 */
                AfterMapLayerRemoveEvent: function (event) {
                    me.mapLayerRemoveHandler(event);
                },

                /**
                 * @method WFSFeaturesSelectedEvent
                 * @param {Object} event
                 */
                WFSFeaturesSelectedEvent: function (event) {
                    me.featuresSelectedHandler(event);
                },

                /**
                 * @method MapClickedEvent
                 * @param {Object} event
                 */
                MapClickedEvent: function (event) {
                    me.mapClickedHandler(event);
                },

                /**
                 * @method AfterChangeMapLayerStyleEvent
                 * @param {Object} event
                 */
                AfterChangeMapLayerStyleEvent: function (event) {
                    me.changeMapLayerStyleHandler(event);
                },

                /**
                 * @method MapLayerVisibilityChangedEvent
                 * @param {Object} event
                 */
                MapLayerVisibilityChangedEvent: function (event) {
                    me.mapLayerVisibilityChangedHandler(event);
                    if (event.getMapLayer().hasFeatureData()) {
                        if (me.getConfig() && me.getConfig().deferSetLocation) {
                            me.getSandbox().printDebug(
                                'sending deferred setLocation'
                            );
                            me.mapMoveHandler();
                        }
                    }
                },

                /**
                 * @method AfterChangeMapLayerOpacityEvent
                 * @param {Object} event
                 */
                AfterChangeMapLayerOpacityEvent: function (event) {
                    me.afterChangeMapLayerOpacityEvent(event);
                },

                /**
                 * @method MapSizeChangedEvent
                 * @param {Object} event
                 */
                MapSizeChangedEvent: function (event) {
                    me.mapSizeChangedHandler(event);
                },

                /**
                 * @method WFSSetFilter
                 * @param {Object} event
                 */
                WFSSetFilter: function (event) {
                    me.setFilterHandler(event);
                },

                /**
                 * @method WFSSetPropertyFilter
                 * @param {Object} event
                 */
                WFSSetPropertyFilter: function (event) {
                    me.setPropertyFilterHandler(event);
                },

                /**
                 * @method WFSImageEvent
                 * @param {Object} event
                 */
                WFSImageEvent: function (event) {
                    me.drawImageTile(
                        event.getLayer(),
                        event.getImageUrl(),
                        event.getBBOX(),
                        event.getSize(),
                        event.getLayerType(),
                        event.isBoundaryTile(),
                        event.isKeepPrevious()
                    );
                }
            };
        },

        _createRequestHandlers: function () {
            var me = this;

            return {
                ShowOwnStyleRequest: Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler',
                    me
                ),
                'WfsLayerPlugin.ActivateHighlightRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapwfs2.request.ActivateHighlightRequestHandler',
                    me
                )
            };
        },

        /**
         * @method getConnection
         * @return {Object} connection
         */
        getConnection: function () {
            return this._connection;
        },

        /**
         * @method getIO
         * @return {Object} io
         */
        getIO: function () {
            return this._io;
        },

        /**
         * @method getVisualizationForm
         * @return {Object} io
         */
        getVisualizationForm: function () {
            return this._visualizationForm;
        },

        /**
         * @method mapMoveHandler
         */
        mapMoveHandler: function () {
            var me = this,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                srs = map.getSrsName(),
                bbox = map.getExtent(),
                zoom = map.getZoom(),
                geomRequest = false,
                grid,
                fids,
                layerId,
                layers,
                i,
                tiles,
                x;

            // clean tiles for printing
            me._printTiles = {};

            // update location
            grid = this.getGrid();

            // update cache
            this.refreshCaches();

            layers = sandbox.findAllSelectedMapLayers();

            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setActiveFeatures([]); /// clean features lists
                    if (grid !== null && grid !== undefined) {
                        layerId = layers[i].getId();
                        tiles = me.getNonCachedGrid(layerId, grid);
                        me.getIO().setLocation(
                            layerId,
                            srs,
                            [
                                bbox.left,
                                bbox.bottom,
                                bbox.right,
                                bbox.top
                            ],
                            zoom,
                            grid,
                            tiles
                        );
                        me._tilesLayer.redraw();
                    }
                }
            }

            // update zoomLevel and highlight pictures
            if (me.zoomLevel !== zoom) {
                me.zoomLevel = zoom;

                // TODO 472: if no connection or the layer is not registered, get highlight with URL
                for (x = 0; x < me.activeHighlightLayers.length; x += 1) {
                    if (me.getConnection().isLazy() &&
                            (!me.getConnection().isConnected() ||
                            !sandbox.findMapLayerFromSelectedMapLayers(me.activeHighlightLayers[x].getId()))) {

                        // FIXME can't we just do this stuff once outside the loop?
                        srs = map.getSrsName();
                        bbox = map.getExtent();
                        zoom = map.getZoom();
                        fids = me.activeHighlightLayers[x].getClickedFeatureListIds();
                        me.removeHighlightImages(
                            me.activeHighlightLayers[x]
                        );
                        me.getHighlightImage(
                            me.activeHighlightLayers[x],
                            srs,
                            [
                                bbox.left,
                                bbox.bottom,
                                bbox.right,
                                bbox.top
                            ],
                            zoom,
                            fids
                        );
                    }
                }

                layers.forEach(function (layer) {
                    if (layer.hasFeatureData()) {
                        fids = me.getAllFeatureIds(layer);
                        me.removeHighlightImages(layer);
                        if (me._highlighted) {
                            me.getIO().highlightMapLayerFeatures(
                                layer.getId(),
                                fids,
                                false,
                                geomRequest
                            );
                        }
                    }
                });
            }
        },

        /**
         * @method mapLayerAddHandler
         */
        mapLayerAddHandler: function (event) {
            var me = this,
                connection = me.getConnection(),
                layer = event.getMapLayer(),
                styleName = null;

            if (layer.hasFeatureData()) {
                if (connection.isLazy() && !connection.isConnected()) {
                    connection.connect();
                }

                me._isWFSOpen += 1;
                connection.updateLazyDisconnect(me.isWFSOpen());

                if (layer.getCurrentStyle()) {
                    styleName = layer.getCurrentStyle().getName();
                }
                if (styleName === null || styleName === undefined ||
                        styleName === '') {

                    styleName = 'default';
                }

                me._addMapLayerToMap(
                    layer,
                    me.__typeNormal
                ); // add WMS layer

                // send together
                connection.get().batch(function () {
                    me.getIO().addMapLayer(
                        layer.getId(),
                        styleName
                    );
                    me.mapMoveHandler(); // setLocation
                });
            }
        },

        /**
         * @method mapLayerRemoveHandler
         */
        mapLayerRemoveHandler: function (event) {
            var me = this,
                layer = event.getMapLayer();

            if (layer.hasFeatureData()) {
                me._isWFSOpen -= 1;
                me.getConnection().updateLazyDisconnect(me.isWFSOpen());
                // remove from transport
                me.getIO().removeMapLayer(layer.getId());
                // remove from OL
                me.removeMapLayerFromMap(layer);

                // clean tiles for printing
                me._printTiles[layer.getId()] = [];

                // delete possible error triggers
                delete me.errorTriggers[
                    'wfs_no_permissions_' + layer.getId()
                ];
                delete me.errorTriggers[
                    'wfs_configuring_layer_failed_' + layer.getId()
                ];
                delete me.errorTriggers[
                    'wfs_request_failed_' + layer.getId()
                ];
                delete me.errorTriggers[
                    'features_parsing_failed_' + layer.getId()
                ];
            }
        },

        /**
         * @method featuresSelectedHandler
         * @param {Object} event
         */
        featuresSelectedHandler: function (event) {
            if (!event.getMapLayer().hasFeatureData()) {
                // No featuredata available, return
                return;
            }
            var me = this,
                bbox,
                connection = me.getConnection(),
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                layer = event.getMapLayer(),
                layerId = layer.getId(),
                ids = layer.getClickedFeatureListIds(),
                srs,
                tmpIds = event.getWfsFeatureIds(),
                geomRequest = true,
                wfsFeatureIds = event.getWfsFeatureIds(),
                zoom;

            if (!event.isKeepSelection()) {
                layer.setClickedFeatureListIds(wfsFeatureIds);
            } else {
                // Merge tmpIds to ids
                tmpIds.forEach(function (id) {
                    if (ids.indexOf(id) === -1) {
                        ids.push(id);
                    }
                });
            }

            // remove highlight image
            if (!event.isKeepSelection()) {
                me.removeHighlightImages();
            }

            // TODO 472: if no connection or the layer is not registered, get highlight with URl
            if (connection.isLazy() && (!connection.isConnected() ||
                    !sandbox.findMapLayerFromSelectedMapLayers(layerId))) {

                srs = map.getSrsName();
                bbox = map.getExtent();
                zoom = map.getZoom();

                layer.setClickedFeatureListIds(wfsFeatureIds);
                this.getHighlightImage(
                    layer,
                    srs,
                    [
                        bbox.left,
                        bbox.bottom,
                        bbox.right,
                        bbox.top
                    ],
                    zoom,
                    wfsFeatureIds
                );
            }
            if (me._highlighted) {
                me.getIO().highlightMapLayerFeatures(
                    layerId,
                    wfsFeatureIds,
                    event.isKeepSelection(),
                    geomRequest
                );
            }
        },

        /**
         * @method mapClickedHandler
         * @param {Object} event
         */
        mapClickedHandler: function (event) {
            // don't process while moving
            if (this.getSandbox().getMap().isMoving()) {
                return;
            }
            var lonlat = event.getLonLat(),
                keepPrevious = this.getSandbox().isCtrlKeyDown();

            this.getIO().setMapClick(lonlat, keepPrevious);
        },

        /**
         * @method changeMapLayerStyleHandler
         * @param {Object} event
         */
        changeMapLayerStyleHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                // render "normal" layer with new style
                var OLLayer = this.getOLMapLayer(
                    event.getMapLayer(),
                    this.__typeNormal
                );
                OLLayer.redraw();

                this.getIO().setMapLayerStyle(
                    event.getMapLayer().getId(),
                    event.getMapLayer().getCurrentStyle().getName()
                );
            }
        },

        /**
         * @method mapLayerVisibilityChangedHandler
         * @param {Object} event
         */
        mapLayerVisibilityChangedHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                this.getIO().setMapLayerVisibility(
                    event.getMapLayer().getId(),
                    event.getMapLayer().isVisible()
                );
            }
        },

        /**
         * @method afterChangeMapLayerOpacityEvent
         * @param {Object} event
         */
        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                layers,
                opacity;

            if (!layer.hasFeatureData()) {
                return;
            }
            opacity = layer.getOpacity() / 100;
            layers = this.getOLMapLayers(layer);
            layers.forEach(function (layer) {
                layer.setOpacity(opacity);
            });
        },

        /**
         * @method mapSizeChangedHandler
         * @param {Object} event
         */
        mapSizeChangedHandler: function (event) {
            var bbox,
                grid,
                layerId,
                layers,
                me = this,
                map = me.getSandbox().getMap(),
                srs,
                tiles,
                zoom;

            me.getIO().setMapSize(event.getWidth(), event.getHeight());

            // update tiles
            srs = map.getSrsName();
            bbox = map.getExtent();
            zoom = map.getZoom();
            grid = me.getGrid();

            // update cache
            me.refreshCaches();

            layers = me.getSandbox().findAllSelectedMapLayers();

            layers.forEach(function (layer) {
                if (layer.hasFeatureData()) {
                    layer.setActiveFeatures([]); /// clean features lists
                    if (grid !== null && grid !== undefined) {
                        layerId = layer.getId();
                        tiles = me.getNonCachedGrid(layerId, grid);
                        me.getIO().setLocation(
                            layerId,
                            srs,
                            [
                                bbox.left,
                                bbox.bottom,
                                bbox.right,
                                bbox.top
                            ],
                            zoom,
                            grid,
                            tiles
                        );
                        me._tilesLayer.redraw();
                    }
                }
            });
        },

        /**
         * @method setFilterHandler
         * @param {Object} event
         */
        setFilterHandler: function (event) {
            /// clean selected features lists
            var layers = this.getSandbox().findAllSelectedMapLayers();

            layers.forEach(function (layer) {
                if (layer.hasFeatureData()) {
                    layer.setSelectedFeatures([]);
                }
            });

            this.getIO().setFilter(event.getGeoJson());
        },

        /**
         * @method setPropertyFilterHandler
         * @param {Object} event
         */
        setPropertyFilterHandler: function (event) {
            /// clean selected features lists
            var layers = this.getSandbox().findAllSelectedMapLayers();

            layers.forEach(function (layer) {
                if (layer.hasFeatureData() &&
                        layer.getId() === event.getLayerId()) {
                    layer.setSelectedFeatures([]);
                }
            });

            this.getIO().setPropertyFilter(
                event.getFilters(),
                event.getLayerId()
            );
        },

        /**
         * @method setCustomStyle
         */
        setCustomStyle: function (layerId, values) {
            // convert values to send (copy the values - don't edit the original)
            this.getIO().setMapLayerCustomStyle(layerId, values);
        },


        /**
         * @method clearConnectionErrorTriggers
         */
        clearConnectionErrorTriggers: function () {
            this.errorTriggers.connection_not_available = {
                limit: 1,
                count: 0
            };
            this.errorTriggers.connection_broken = {
                limit: 1,
                count: 0
            };
        },

        /**
         * @method preselectLayers
         */
        preselectLayers: function (layers) {
            _.each(
                layers,
                function (layer) {
                    if (layer.hasFeatureData()) {
                        this.getSandbox().printDebug(
                            '[WfsLayerPlugin] preselecting ' + layer.getId()
                        );
                    }
                }
            );
        },

        /**
         * @method removeHighlightImages
         *
         * Removes a tile from the Openlayers map
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to remove
         */
        removeHighlightImages: function (layer) {
            if (layer && !layer.hasFeatureData()) {
                return;
            }

            var me = this,
                layerName,
                layerPart = '(.*)',
                map = me.getMap(),
                removeLayers;

            if (layer) {
                layerPart = layer.getId();
            }

            layerName = new RegExp(
                me.__layerPrefix + layerPart + '_' + me.__typeHighlight
            );
            removeLayers = map.getLayersByName(layerName);

            removeLayers.forEach(function (removeLayer) {
                // FIXME what use is the layer index here?
                map.getLayerIndex(removeLayer);
                removeLayer.destroy();
            });
        },

        /**
         * @method removeMapLayerFromMap
         * @param {Object} layer
         */
        removeMapLayerFromMap: function (layer) {
            var removeLayers = this.getOLMapLayers(layer);

            removeLayers.forEach(function (removeLayer) {
                removeLayer.destroy();
            });
        },

        /**
         * @method getOLMapLayers
         * @param {Object} layer
         */
        getOLMapLayers: function (layer) {
            if (layer && !layer.hasFeatureData()) {
                return;
            }

            var layerPart = '',
                wfsReqExp;

            if (layer) {
                layerPart = layer.getId();
            }
            wfsReqExp = new RegExp(
                this.__layerPrefix + layerPart + '_(.*)',
                'i'
            ); // that's all folks
            return this.getMap().getLayersByName(wfsReqExp);
        },

        /**
         * @method getOLMapLayer
         * @param {Object} layer
         * @param {String} type
         */
        getOLMapLayer: function (layer, type) {
            if (!layer || !layer.hasFeatureData()) {
                return null;
            }

            var layerName = this.__layerPrefix + layer.getId() + '_' + type,
                wfsReqExp = new RegExp(layerName);

            return this.getMap().getLayersByName(wfsReqExp)[0];
        },

        /**
         * @method drawImageTile
         *
         * Adds a tile to the Openlayers map
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to update
         * @param {String} imageUrl
         *           url that will be used to download the tile image
         * @param {OpenLayers.Bounds} imageBbox
         *           bounds for the tile
         * @param {Object} imageSize
         * @param {String} layerType
         *           postfix so we can identify the tile as highlight/normal
         * @param {Boolean} boundaryTile
         *           true if on the boundary and should be redrawn
         * @param {Boolean} keepPrevious
         *           true to not delete existing tile
         */
        drawImageTile: function (layer, imageUrl, imageBbox, imageSize, layerType, boundaryTile, keepPrevious) {
            var me = this,
                map = me.getMap(),
                layerId = layer.getId(),
                layerIndex = null,
                layerName = me.__layerPrefix + layerId + '_' + layerType,
                layerScales,
                normalLayer,
                normalLayerExp,
                normalLayerIndex,
                highlightLayer,
                highlightLayerExp,
                BBOX,
                bboxKey,
                dataForTileTemp,
                style,
                tileToUpdate,
                boundsObj = new OpenLayers.Bounds(imageBbox),
                ols,
                wfsMapImageLayer;

            /** Safety checks */
            if (!imageUrl || !boundsObj) {
                return;
            }

            if (layerType === me.__typeHighlight) {
                ols = new OpenLayers.Size(
                    imageSize.width,
                    imageSize.height
                );

                layerScales = me.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                );

                wfsMapImageLayer = new OpenLayers.Layer.Image(
                    layerName,
                    imageUrl,
                    boundsObj,
                    ols,
                    {
                        scales: layerScales,
                        transparent: true,
                        format: 'image/png',
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        buffer: 0
                    }
                );

                wfsMapImageLayer.opacity = layer.getOpacity() / 100;
                map.addLayer(wfsMapImageLayer);
                wfsMapImageLayer.setVisibility(true);
                wfsMapImageLayer.redraw(true); // also for draw

                // if removed set to same index [but if wfsMapImageLayer created
                // in add (sets just in draw - not needed then here)]
                if (layerIndex !== null && wfsMapImageLayer !== null) {
                    map.setLayerIndex(wfsMapImageLayer, layerIndex);
                }

                // highlight picture on top of normal layer images
                normalLayerExp = new RegExp(
                    me.__layerPrefix + layerId + '_' + me.__typeNormal
                );
                highlightLayerExp = new RegExp(
                    me.__layerPrefix + layerId + '_' + me.__typeHighlight
                );
                normalLayer = map.getLayersByName(normalLayerExp);
                highlightLayer = map.getLayersByName(highlightLayerExp);

                if (normalLayer.length > 0 && highlightLayer.length > 0) {
                    normalLayerIndex = map.getLayerIndex(
                        normalLayer[normalLayer.length - 1]
                    );
                    map.setLayerIndex(
                        highlightLayer[0],
                        normalLayerIndex + 10
                    );
                }
            } else { // "normal"
                BBOX = boundsObj.toArray(false);
                bboxKey = BBOX.join(',');
                style = layer.getCurrentStyle().getName();
                tileToUpdate = me._tilesToUpdate.mget(
                    layerId,
                    '',
                    bboxKey
                );

                // put the data in cache      
                if (!boundaryTile) { // normal case and cached
                    me._tileData.mput(
                        layerId,
                        style,
                        bboxKey,
                        imageUrl
                    );
                } else { // temp cached and redrawn if gotten better
                    dataForTileTemp = me._tileDataTemp.mget(
                        layerId,
                        style,
                        bboxKey
                    );
                    if (dataForTileTemp) {
                        return;
                    }
                    me._tileDataTemp.mput(
                        layerId,
                        style,
                        bboxKey,
                        imageUrl
                    );
                }

                if (tileToUpdate) {
                    tileToUpdate.draw(); // QUEUES updates! 
                }
            }
        },

        /**
         * @method _addMapLayerToMap
         *
         * @param {Object} layer
         * @param {String} layerType
         */
        _addMapLayerToMap: function (_layer, layerType) {
            if (!_layer.hasFeatureData()) {
                return;
            }

            var layerName =
                    this.__layerPrefix + _layer.getId() + '_' + layerType,
                layerScales = this.getMapModule().calculateLayerScales(
                    _layer.getMaxScale(),
                    _layer.getMinScale()
                ),
                key,
                defaultParams = {
                    layers: '',
                    transparent: true,
                    id: _layer.getId(),
                    styles: _layer.getCurrentStyle().getName(),
                    format: 'image/png'
                },
                defaultOptions = {
                    layerId: _layer.getId(),
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: true,
                    visibility: true,
                    buffer: 0,
                    _plugin: this,

                    getURL: function (bounds, theTile) {
                        bounds = this.adjustBounds(bounds);

                        var BBOX = bounds.toArray(false),
                            bboxKey = BBOX.join(','),
                            layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(
                                this.layerId
                            ),
                            style = layer.getCurrentStyle().getName(),
                            dataForTile = this._plugin._tileData.mget(
                                this.layerId,
                                style,
                                bboxKey
                            );

                        if (dataForTile) {
                            this._plugin._tilesToUpdate.mdel(
                                this.layerId,
                                '',
                                bboxKey
                            ); // remove from drawing
                        } else {
                            // temp cache
                            dataForTile = this._plugin._tileDataTemp.mget(
                                this.layerId,
                                style,
                                bboxKey
                            );

                            this._plugin._tilesToUpdate.mput(
                                this.layerId,
                                '',
                                bboxKey,
                                theTile
                            ); // put in drawing

                            // DEBUG image (red)
                            //dataForTile = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
                        }

                        return dataForTile;
                    },

                    addTile: function (bounds, position) {
                        var tileOpts = OpenLayers.Util.extend(
                                {},
                                this.tileOptions
                            );
                        OpenLayers.Util.extend(tileOpts, {
                            setBounds: function (bounds) {
                                bounds = bounds.clone();
                                if (this.layer.map.baseLayer.wrapDateLine) {
                                    var worldExtent =
                                            this.layer.map.getMaxExtent(),
                                        tolerance =
                                            this.layer.map.getResolution();

                                    bounds = bounds.wrapDateLine(
                                        worldExtent,
                                        {
                                            leftTolerance: tolerance,
                                            rightTolerance: tolerance
                                        }
                                    );
                                }
                                this.bounds = bounds;
                            },
                            renderTile: function () {
                                this.layer.div.appendChild(this.getTile());
                                if (this.layer.async) {
                                    // Asynchronous image requests call the asynchronous getURL method
                                    // on the layer to fetch an image that covers "this.bounds".
                                    var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
                                    this.layer.getURLasync(
                                        this.bounds,
                                        function (url) {
                                            if (id === this.asyncRequestId) {
                                                this.url = url;
                                                this.initImage();
                                            }
                                        },
                                        this
                                    );
                                } else {
                                    // synchronous image requests get the url immediately.
                                    this.url = this.layer.getURL(
                                        this.bounds,
                                        this
                                    );
                                    this.initImage();
                                }
                            }
                        });

                        var tile = new this.tileClass(
                            this,
                            position,
                            bounds,
                            null,
                            this.tileSize,
                            tileOpts
                        );

                        this._plugin._tiles[tile.id] = tile;

                        var BBOX = bounds.toArray(false),
                            bboxKey = BBOX.join(',');

                        this._plugin._tilesToUpdate.mput(
                            this.layerId,
                            '',
                            bboxKey,
                            tile
                        );

                        tile.events.register(
                            'beforedraw',
                            this,
                            this.queueTileDraw
                        );
                        return tile;
                    },

                    destroyTile: function (tile) {
                        this.removeTileMonitoringHooks(tile);
                        delete this._plugin._tiles[tile.id];

                        tile.destroy();
                    }
                },
                layerParams = _layer.getParams(),
                layerOptions = _layer.getOptions();

            // override default params and options from layer
            for (key in layerParams) {
                if (layerParams.hasOwnProperty(key)) {
                    defaultParams[key] = layerParams[key];
                }
            }
            for (key in layerOptions) {
                if (layerOptions.hasOwnProperty(key)) {
                    defaultOptions[key] = layerOptions[key];
                }
            }

            var openLayer = new OpenLayers.Layer.WMS(
                layerName,
                '',
                defaultParams,
                defaultOptions
            );
            openLayer.opacity = _layer.getOpacity() / 100;

            this.getMap().addLayer(openLayer);
        },

        // from tilesgridplugin

        /**
         * @method createTilesGrid
         *
         * Creates an invisible layer to support Grid operations
         * This manages sandbox Map's TileQueue
         *
         */
        createTilesGrid: function () {
            var tileQueue = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapwfs2.domain.TileQueue'
                ),
                strategy = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapwfs2.plugin.QueuedTilesStrategy',
                    {
                        tileQueue: tileQueue
                    }
                );

            strategy.debugGridFeatures = false;
            this.tileQueue = tileQueue;
            this.tileStrategy = strategy;

            var styles = new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    pointRadius: 3,
                    strokeColor: 'red',
                    strokeWidth: 2,
                    fillColor: '#800000'
                }),
                'tile': new OpenLayers.Style({
                    strokeColor: '#008080',
                    strokeWidth: 5,
                    fillColor: '#ffcc66',
                    fillOpacity: 0.5
                }),
                'select': new OpenLayers.Style({
                    fillColor: '#66ccff',
                    strokeColor: '#3399ff'
                })
            });

            this._tilesLayer = new OpenLayers.Layer.Vector(
                'Tiles Layer',
                {
                    strategies: [strategy],
                    styleMap: styles,
                    visibility: true
                }
            );
            this.getMap().addLayer(this._tilesLayer);
            this._tilesLayer.setOpacity(0.3);
        },

        getTileSize: function () {
            var OLGrid = this.tileStrategy.getGrid().grid;
            this.tileSize = null;

            if (OLGrid) {
                this.tileSize = {};
                this.tileSize.width = OLGrid[0][0].size.w;
                this.tileSize.height = OLGrid[0][0].size.h;
            }

            return this.tileSize;
        },

        getGrid: function () {
            var bounds,
                clen,
                grid = null,
                iCol,
                iRow,
                len,
                OLGrid,
                row,
                tile;

            // get grid information out of tileStrategy
            this.tileStrategy.update();
            OLGrid = this.tileStrategy.getGrid().grid;

            if (OLGrid) {
                grid = {
                    rows: OLGrid.length,
                    columns: OLGrid[0].length,
                    bounds: []
                };
                for (iRow = 0, len = OLGrid.length; iRow < len; iRow += 1) {
                    row = OLGrid[iRow];
                    for (iCol = 0, clen = row.length; iCol < clen; iCol += 1) {
                        tile = row[iCol];

                        // if failed grid
                        if (typeof tile.bounds.left === 'undefined' ||
                                typeof tile.bounds.bottom === 'undefined' ||
                                typeof tile.bounds.right === 'undefined' ||
                                typeof tile.bounds.top === 'undefined') {
                            return null;
                        }

                        // left, bottom, right, top
                        bounds = [];
                        bounds[0] = tile.bounds.left;
                        bounds[1] = tile.bounds.bottom;
                        bounds[2] = tile.bounds.right;
                        bounds[3] = tile.bounds.top;
                        grid.bounds.push(bounds);
                    }
                }
            }
            return grid;
        },

        /*
         * @method getPrintTiles
         */
        getPrintTiles: function () {
            return this._printTiles;
        },

        /*
         * @method setPrintTile
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to update
         * @param {OpenLayers.Bounds} bbox
         * @param imageUrl
         */
        setPrintTile: function (layer, bbox, imageUrl) {
            if (typeof this._printTiles[layer.getId()] === 'undefined') {
                this._printTiles[layer.getId()] = [];
            }
            this._printTiles[layer.getId()].push({
                'bbox': bbox,
                'url': imageUrl
            });
        },

        /*
         * @method refreshCaches
         */
        refreshCaches: function () {
            this._tileData.purgeOffset(4 * 60 * 1000);
            this._tileDataTemp.purgeOffset(4 * 60 * 1000);
        },


        /*
         * @method getNonCachedGrid
         *
         * @param grid
         */
        getNonCachedGrid: function (layerId, grid) {
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(
                    layerId
                ),
                style = layer.getCurrentStyle().getName(),
                result = [],
                i,
                bboxKey,
                dataForTile;

            for (i = 0; i < grid.bounds.length; i += 1) {
                bboxKey = grid.bounds[i].join(',');
                dataForTile = this._tileData.mget(layerId, style, bboxKey);
                if (!dataForTile) {
                    result.push(grid.bounds[i]);
                }
            }
            return result;
        },

        /*
         * @method deleteTileCache
         *
         * @param layerId
         * @param styleName
         */
        deleteTileCache: function (layerId, styleName) {
            this._tileData.mdel(layerId, styleName);
            this._tileDataTemp.mdel(layerId, styleName);
        },

        /*
         * @method isWFSOpen
         */
        isWFSOpen: function () {
            if (this._isWFSOpen > 0) {
                return true;
            }
            return false;
        },

        /*
         * @method getLayerCount
         */
        getLayerCount: function () {
            return this._isWFSOpen;
        },

        /**
         * @method _isArrayEqual
         * @param {String[]} current
         * @param {String[]} old
         *
         * Checks if the arrays are equal
         */
        isArrayEqual: function (current, old) {
            if (old.length !== current.length) { // same size?
                return false;
            }
            var i;
            for (i = 0; i < current.length; i += 1) {
                if (current[i] !== old[i]) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @method getLocalization
         * Convenience method to call from Tile and Flyout
         * Returns JSON presentation of bundles localization data for
         * current language. If key-parameter is not given, returns
         * the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization('MapWfs2');
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /*
         * @method showErrorPopup
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that we want to update
         * @param {OpenLayers.Bounds} bbox
         * @param imageUrl
         */
        showErrorPopup: function (message, layer, once) {
            if (once) {
                if (this.errorTriggers[message]) {
                    if (this.errorTriggers[message].count >= this.errorTriggers[message].limit) {
                        return;
                    }
                    this.errorTriggers[message].count += 1;
                } else {
                    if (this.errorTriggers[message + '_' + layer.getId()]) {
                        return;
                    }
                    this.errorTriggers[message + '_' + layer.getId()] = true;
                }
            }

            var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                popupLoc = this.getLocalization('error').title,
                content = this.getLocalization('error')[message],
                okBtn = dialog.createCloseButton(
                    this.getLocalization().button.close
                );

            if (layer) {
                content = content.replace(/\{layer\}/, layer.getName());
            }

            okBtn.addClass('primary');
            dialog.addClass('error_handling');
            dialog.show(popupLoc, content, [okBtn]);
            dialog.fadeout(5000);
        },

        /**
         * @method getAllFeatureIds
         *
         * @param {Object} layer
         */
        getAllFeatureIds: function (layer) {
            var fids = layer.getClickedFeatureIds().slice(0),
                k;

            for (k = 0; k < layer.getSelectedFeatures().length; k += 1) {
                fids.push(layer.getSelectedFeatures()[k][0]);
            }
            return fids;
        },

        /**
         * @method getHighlightImage
         *
         * @param {Number} layerId
         * @param {String} srs
         * @param {Number[]} bbox
         * @param {Number} zoom
         * @param {String[]} featureIds
         *
         * sends message to /highlight*
         */
        getHighlightImage: function (layer, srs, bbox, zoom, featureIds) {
            // helper function for visibleFields
            var me = this,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                contains = function (a, obj) {
                    var i;

                    for (i = 0; i < a.length; i += 1) {
                        // FIXME use ===, check that it works
                        if (a[i] == obj) {
                            return true;
                        }
                    }
                    return false;
                };

            if (!contains(me.activeHighlightLayers, layer)) {
                me.activeHighlightLayers.push(layer);
            }

            var imageSize = {
                    width: map.getWidth(),
                    height: map.getHeight()
                },
                params = '?layerId=' + layer.getId() +
                    '&session=' + me.getIO().getSessionID() +
                    '&type=' + 'highlight' +
                    '&srs=' + srs +
                    '&bbox=' + bbox.join(',') +
                    '&zoom=' + zoom +
                    '&featureIds=' + featureIds.join(',') +
                    '&width=' + imageSize.width +
                    '&height=' + imageSize.height,
                imageUrl = me.getIO().getRootURL() + '/image' + params;

            // send as an event forward to WFSPlugin (draws)
            var event = sandbox.getEventBuilder('WFSImageEvent')(
                layer,
                imageUrl,
                bbox,
                imageSize,
                'highlight',
                false,
                false
            );
            sandbox.notifyAll(event);
        },

        /**
         * Enable or disable WFS highlight
         *
         * @param highlighted Truth value of highlight activation
         */
        setHighlighted: function (highlighted) {
            this._highlighted = highlighted;
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
