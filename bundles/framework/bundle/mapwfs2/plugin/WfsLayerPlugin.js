/**
 * @class Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin';
        me._name = 'WfsLayerPlugin';

        // connection and communication
        this._connection = null;
        this._io = null;

        // state
        this.tileSize = null;
        this.zoomLevel = null;
        this._isWFSOpen = 0;

        // printing
        this._printTiles = {};

        // wms layer handling
        this._tiles = {};
        this._tilesToUpdate = null;
        this._tileData = null;
        this._tileDataTemp = null;

        // highlight enabled or disabled
        this._highlighted = true;

        this.errorTriggers = {
            connection_not_available: {
                limit: 1,
                count: 0
            },
            connection_broken: {
                limit: 1,
                count: 0
            }
        };

        this.activeHighlightLayers = [];
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

            // service init
            if (config) {
                if (!config.hostname || config.hostname === 'localhost') {
                    // convenience so the host isn't required
                    config.hostname = location.hostname;
                }
                if (!config.port) {
                    // convenience so the port isn't required
                    config.port = '' + location.port;
                }
                // length check won't work if port is given as number
                portAsString = '' + config.port;
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

        /**
         * @private @method _startPluginImpl
         *
         * Creates grid and registers event handlers
         */
        _startPluginImpl: function () {
            this.createTilesGrid();
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
         * @static
         * @property eventHandlers
         */
        eventHandlers: {
            /**
             * @method AfterMapMoveEvent
             * @param {Object} event
             */
            AfterMapMoveEvent: function (event) {
                if (this.getConfig() && this.getConfig().deferSetLocation) {
                    this.getSandbox().printDebug(
                        'setLocation deferred (to aftermapmove)'
                    );
                    return;
                }
                this.mapMoveHandler();
            },

            /**
             * @method AfterMapLayerAddEvent
             * @param {Object} event
             */
            AfterMapLayerAddEvent: function (event) {
                this.mapLayerAddHandler(event);
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Object} event
             */
            AfterMapLayerRemoveEvent: function (event) {
                this.mapLayerRemoveHandler(event);
            },

            /**
             * @method WFSFeaturesSelectedEvent
             * @param {Object} event
             */
            WFSFeaturesSelectedEvent: function (event) {
                this.featuresSelectedHandler(event);
            },

            /**
             * @method MapClickedEvent
             * @param {Object} event
             */
            MapClickedEvent: function (event) {
                this.mapClickedHandler(event);
            },

            /**
             * @method AfterChangeMapLayerStyleEvent
             * @param {Object} event
             */
            AfterChangeMapLayerStyleEvent: function (event) {
                this.changeMapLayerStyleHandler(event);
            },

            /**
             * @method MapLayerVisibilityChangedEvent
             * @param {Object} event
             */
            MapLayerVisibilityChangedEvent: function (event) {
                this.mapLayerVisibilityChangedHandler(event);
                if (event.getMapLayer().hasFeatureData()) {
                    if (this.getConfig() && this.getConfig().deferSetLocation) {
                        this.getSandbox().printDebug(
                            'sending deferred setLocation'
                        );
                        this.mapMoveHandler();
                    }
                }
            },

            /**
             * @method AfterChangeMapLayerOpacityEvent
             * @param {Object} event
             */
            AfterChangeMapLayerOpacityEvent: function (event) {
                this.afterChangeMapLayerOpacityEvent(event);
            },

            /**
             * @method MapSizeChangedEvent
             * @param {Object} event
             */
            MapSizeChangedEvent: function (event) {
                this.mapSizeChangedHandler(event);
            },

            /**
             * @method WFSSetFilter
             * @param {Object} event
             */
            WFSSetFilter: function (event) {
                this.setFilterHandler(event);
            },

            /**
             * @method WFSSetPropertyFilter
             * @param {Object} event
             */
            WFSSetPropertyFilter: function (event) {
                this.setPropertyFilterHandler(event);
            },

            /**
             * @method WFSImageEvent
             * @param {Object} event
             */
            WFSImageEvent: function (event) {
                this.drawImageTile(
                    event.getLayer(),
                    event.getImageUrl(),
                    event.getBBOX(),
                    event.getSize(),
                    event.getLayerType(),
                    event.isBoundaryTile(),
                    event.isKeepPrevious()
                );
            }
        },

        /**
         * @method mapMoveHandler
         */
        mapMoveHandler: function () {
            var srs = this.getSandbox().getMap().getSrsName(),
                bbox = this.getSandbox().getMap().getExtent(),
                zoom = this.getSandbox().getMap().getZoom(),
                geomRequest = false,
                fids;

            // clean tiles for printing
            this._printTiles = {};

            // update location
            var grid = this.getGrid();

            // update cache
            this.refreshCaches();

            var layerId,
                layers = this.getSandbox().findAllSelectedMapLayers(),
                i,
                j,
                tiles,
                x;

            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setActiveFeatures([]); /// clean features lists
                    if (grid !== null && grid !== undefined) {
                        layerId = layers[i].getId();
                        tiles = this.getNonCachedGrid(layerId, grid);
                        this.getIO().setLocation(
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
                        this._tilesLayer.redraw();
                    }
                }
            }

            // update zoomLevel and highlight pictures
            if (this.zoomLevel !== zoom) {
                this.zoomLevel = zoom;

                // TODO 472: if no connection or the layer is not registered, get highlight with URL
                for (x = 0; x < this.activeHighlightLayers.length; x += 1) {
                    if (this.getConnection().isLazy() &&
                            !this.getConnection().isConnected() ||
                            !this.getSandbox().findMapLayerFromSelectedMapLayers(this.activeHighlightLayers[x].getId())) {

                        srs = this.getSandbox().getMap().getSrsName();
                        bbox = this.getSandbox().getMap().getExtent();
                        zoom = this.getSandbox().getMap().getZoom();
                        fids = this.activeHighlightLayers[x].getClickedFeatureListIds();
                        this.removeHighlightImages(
                            this.activeHighlightLayers[x]
                        );
                        this.getHighlightImage(
                            this.activeHighlightLayers[x],
                            srs, [
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

                for (j = 0; j < layers.length; j += 1) {
                    if (layers[j].hasFeatureData()) {
                        fids = this.getAllFeatureIds(layers[j]);
                        this.removeHighlightImages(layers[j]);
                        if (this._highlighted) {
                            this.getIO().highlightMapLayerFeatures(
                                layers[j].getId(),
                                fids,
                                false,
                                geomRequest
                            );
                        }
                    }
                }
            }
        },

        /**
         * @method mapLayerAddHandler
         */
        mapLayerAddHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                if (this.getConnection().isLazy() &&
                        !this.getConnection().isConnected()) {

                    this.getConnection().connect();
                }

                this._isWFSOpen += 1;
                this.getConnection().updateLazyDisconnect(this.isWFSOpen());

                var styleName = null;
                if (event.getMapLayer().getCurrentStyle()) {
                    styleName = event.getMapLayer().getCurrentStyle().getName();
                }
                if (styleName === null || styleName === undefined ||
                        styleName === '') {

                    styleName = 'default';
                }

                this._addMapLayerToMap(
                    event.getMapLayer(),
                    this.__typeNormal
                ); // add WMS layer

                // send together
                var self = this;
                this.getConnection().get().batch(function () {
                    self.getIO().addMapLayer(
                        event.getMapLayer().getId(),
                        styleName
                    );
                    self.mapMoveHandler(); // setLocation
                });
            }
        },

        /**
         * @method mapLayerRemoveHandler
         */
        mapLayerRemoveHandler: function (event) {
            var layer = event.getMapLayer();

            if (layer.hasFeatureData()) {
                this._isWFSOpen -= 1;
                this.getConnection().updateLazyDisconnect(this.isWFSOpen());
                // remove from transport
                this.getIO().removeMapLayer(layer.getId());
                // remove from OL
                this.removeMapLayerFromMap(layer);

                // clean tiles for printing
                this._printTiles[layer.getId()] = [];

                // delete possible error triggers
                delete this.errorTriggers[
                    'wfs_no_permissions_' + layer.getId()
                ];
                delete this.errorTriggers[
                    'wfs_configuring_layer_failed_' + layer.getId()
                ];
                delete this.errorTriggers[
                    'wfs_request_failed_' + layer.getId()
                ];
                delete this.errorTriggers[
                    'features_parsing_failed_' + layer.getId()
                ];
            }
        },

        /**
         * @method featuresSelectedHandler
         * @param {Object} event
         */
        featuresSelectedHandler: function (event) {
            if (event.getMapLayer().hasFeatureData()) {
                var layer = event.getMapLayer(),
                    ids = layer.getClickedFeatureListIds(),
                    tmpIds = event.getWfsFeatureIds(),
                    geomRequest = true,
                    isFound,
                    i,
                    j;

                if (!event.isKeepSelection()) {
                    layer.setClickedFeatureListIds(event.getWfsFeatureIds());
                } else {
                    isFound = false;
                    for (i = 0; i < tmpIds.length; i += 1) {
                        isFound = false;
                        for (j = 0; j < ids.length; j += 1) {
                            if (tmpIds[i] === ids[j]) {
                                isFound = true;
                                continue;
                            }
                        }
                        if (!isFound) {
                            ids.push(tmpIds[i]);
                        }

                    }
                }

                // remove highlight image
                if (!event.isKeepSelection()) {
                    this.removeHighlightImages();
                }

                // TODO 472: if no connection or the layer is not registered, get highlight with URl
                if (this.getConnection().isLazy() &&
                    !this.getConnection().isConnected() ||
                    !this.getSandbox().findMapLayerFromSelectedMapLayers(layer.getId())) {

                    var srs = this.getSandbox().getMap().getSrsName(),
                        bbox = this.getSandbox().getMap().getExtent(),
                        zoom = this.getSandbox().getMap().getZoom();
                    layer.setClickedFeatureListIds(event.getWfsFeatureIds());
                    this.getHighlightImage(
                        layer,
                        srs, [
                            bbox.left,
                            bbox.bottom,
                            bbox.right,
                            bbox.top
                        ],
                        zoom,
                        event.getWfsFeatureIds()
                    );
                }
                if (this._highlighted) {
                    this.getIO().highlightMapLayerFeatures(
                        layer.getId(),
                        event.getWfsFeatureIds(),
                        event.isKeepSelection(),
                        geomRequest
                    );
                }
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
            var layer = event.getMapLayer();

            if (!layer.hasFeatureData()) {
                return;
            }
            var layers = this.getOLMapLayers(layer);
            for (var i = 0; i < layers.length; i += 1) {
                layers[i].setOpacity(layer.getOpacity() / 100);
            }
        },

        /**
         * @method mapSizeChangedHandler
         * @param {Object} event
         */
        mapSizeChangedHandler: function (event) {
            this.getIO().setMapSize(event.getWidth(), event.getHeight());

            // update tiles
            var srs = this.getSandbox().getMap().getSrsName(),
                bbox = this.getSandbox().getMap().getExtent(),
                zoom = this.getSandbox().getMap().getZoom(),
                grid = this.getGrid();

            // update cache
            this.refreshCaches();

            var i,
                layerId,
                layers = this.getSandbox().findAllSelectedMapLayers(),
                tiles;

            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setActiveFeatures([]); /// clean features lists
                    if (grid !== null && grid !== undefined) {
                        layerId = layers[i].getId();
                        tiles = this.getNonCachedGrid(layerId, grid);
                        this.getIO().setLocation(
                            layerId,
                            srs, [
                                bbox.left,
                                bbox.bottom,
                                bbox.right,
                                bbox.top
                            ],
                            zoom,
                            grid,
                            tiles
                        );
                        this._tilesLayer.redraw();
                    }
                }
            }
        },

        /**
         * @method setFilterHandler
         * @param {Object} event
         */
        setFilterHandler: function (event) {
            /// clean selected features lists
            var i,
                layers = this.getSandbox().findAllSelectedMapLayers();

            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].hasFeatureData()) {
                    layers[i].setSelectedFeatures([]);
                }
            }

            this.getIO().setFilter(event.getGeoJson());
        },

        /**
         * @method setPropertyFilterHandler
         * @param {Object} event
         */
        setPropertyFilterHandler: function (event) {
            /// clean selected features lists
            var i,
                layers = this.getSandbox().findAllSelectedMapLayers();

            for (i = 0; i < layers.length; i += 1) {
                if (layers[i].hasFeatureData() &&
                    layers[i].getId() === event.getLayerId()) {
                    layers[i].setSelectedFeatures([]);
                }
            }

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
            _.each(layers, function (layer) {
                if (layer.hasFeatureData()) {
                    this.getSandbox().printDebug(
                        '[WfsLayerPlugin] preselecting ' + layer.getId()
                    );
                }
            });
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

            var layerPart = '(.*)';
            if (layer) {
                layerPart = layer.getId();
            }

            var layerName = new RegExp(
                    this.__layerPrefix + layerPart + '_' + this.__typeHighlight
                ),
                removeLayers = this.getMap().getLayersByName(layerName),
                i,
                layerIndex;

            for (i = 0; i < removeLayers.length; i += 1) {
                layerIndex = this.getMap().getLayerIndex(removeLayers[i]);
                removeLayers[i].destroy();
            }
        },

        /**
         * @method removeMapLayerFromMap
         * @param {Object} layer
         */
        removeMapLayerFromMap: function (layer) {
            var i,
                removeLayers = this.getOLMapLayers(layer);
            for (i = 0; i < removeLayers.length; i += 1) {
                removeLayers[i].destroy();
            }
        },

        /**
         * @method getOLMapLayers
         * @param {Object} layer
         */
        getOLMapLayers: function (layer) {
            if (layer && !layer.hasFeatureData()) {
                return;
            }

            var layerPart = '';
            if (layer) {
                layerPart = layer.getId();
            }
            var wfsReqExp = new RegExp(
                this.__layerPrefix + layerPart + '_(.*)', 'i'
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
                layerName =
                    me.__layerPrefix + layer.getId() + '_' + layerType,
                boundsObj = new OpenLayers.Bounds(imageBbox);

            /** Safety checks */
            if (!imageUrl || !layer || !boundsObj) {
                return;
            }

            var layerIndex = null;

            if (layerType === me.__typeHighlight) {
                var ols = new OpenLayers.Size(
                    imageSize.width,
                    imageSize.height
                );

                var layerScales = me.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                );

                var wfsMapImageLayer = new OpenLayers.Layer.Image(
                    layerName,
                    imageUrl,
                    boundsObj,
                    ols, {
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
                me.getMap().addLayer(wfsMapImageLayer);
                wfsMapImageLayer.setVisibility(true);
                wfsMapImageLayer.redraw(true); // also for draw

                // if removed set to same index [but if wfsMapImageLayer created
                // in add (sets just in draw - not needed then here)]
                if (layerIndex !== null && wfsMapImageLayer !== null) {
                    me.getMap().setLayerIndex(wfsMapImageLayer, layerIndex);
                }

                // highlight picture on top of normal layer images
                var normalLayerExp = new RegExp(
                        me.__layerPrefix + layer.getId() + '_' +
                        me.__typeNormal
                    ),
                    highlightLayerExp = new RegExp(
                        me.__layerPrefix + layer.getId() + '_' +
                        me.__typeHighlight
                    ),
                    normalLayer = me.getMap().getLayersByName(normalLayerExp),
                    highlightLayer = me.getMap().getLayersByName(highlightLayerExp);

                if (normalLayer.length > 0 && highlightLayer.length > 0) {
                    var normalLayerIndex = me.getMap().getLayerIndex(
                        normalLayer[normalLayer.length - 1]
                    );
                    me.getMap().setLayerIndex(
                        highlightLayer[0],
                        normalLayerIndex + 10
                    );
                }
            } else { // "normal"
                var BBOX = boundsObj.toArray(false),
                    bboxKey = BBOX.join(','),
                    style = layer.getCurrentStyle().getName(),
                    tileToUpdate = me._tilesToUpdate.mget(
                        layer.getId(),
                        '',
                        bboxKey
                    );

                // put the data in cache      
                if (!boundaryTile) { // normal case and cached
                    me._tileData.mput(
                        layer.getId(),
                        style,
                        bboxKey,
                        imageUrl
                    );
                } else { // temp cached and redrawn if gotten better
                    var dataForTileTemp = me._tileDataTemp.mget(
                        layer.getId(),
                        style,
                        bboxKey
                    );
                    if (dataForTileTemp) {
                        return;
                    }
                    me._tileDataTemp.mput(
                        layer.getId(),
                        style,
                        bboxKey,
                        imageUrl);
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
                key;

            // default params and options
            var defaultParams = {
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
                            bboxKey = BBOX.join(','),
                            layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(this.layerId),
                            style = layer.getCurrentStyle().getName();

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
                'Tiles Layer', {
                    strategies: [strategy],
                    styleMap: styles,
                    visibility: true
                });
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
                    } else {
                        this.errorTriggers[message + '_' + layer.getId()] = true;
                    }
                }
            }

            var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                popupLoc = this.getLocalization('error').title,
                content = this.getLocalization('error')[message];

            if (layer) {
                content = content.replace(/\{layer\}/, layer.getName());
            }
            var okBtn = dialog.createCloseButton(
                this.getLocalization().button.close
            );

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
            var contains = function (a, obj) {
                var i;
                for (i = 0; i < a.length; i += 1) {
                    if (a[i] == obj) {
                        return true;
                    }
                }
                return false;
            };

            if (!contains(this.activeHighlightLayers, layer)) {
                this.activeHighlightLayers.push(layer);
            }

            var imageSize = {
                width: this.getSandbox().getMap().getWidth(),
                height: this.getSandbox().getMap().getHeight()
            };

            var params = '?layerId=' + layer.getId() +
                '&session=' + this.getIO().getSessionID() +
                '&type=' + 'highlight' +
                '&srs=' + srs +
                '&bbox=' + bbox.join(',') +
                '&zoom=' + zoom +
                '&featureIds=' + featureIds.join(',') +
                '&width=' + imageSize.width +
                '&height=' + imageSize.height;

            var imageUrl = this.getIO().getRootURL() + '/image' + params;

            // send as an event forward to WFSPlugin (draws)
            var event = this.getSandbox().getEventBuilder('WFSImageEvent')(
                layer,
                imageUrl,
                bbox,
                imageSize,
                'highlight',
                false,
                false
            );
            this.getSandbox().notifyAll(event);
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
