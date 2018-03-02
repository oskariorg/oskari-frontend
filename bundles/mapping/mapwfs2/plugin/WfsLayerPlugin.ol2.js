/**
 * @class Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin',
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
        me._index = 95;

        // state
        me.tileSize = null;
        me._isWFSOpen = 0;

        // Manual refresh ui location
        me._defaultLocation = 'top right';

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

             me.WFSLayerService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);

            sandbox.registerService(me.WFSLayerService);

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
         * @method _createControlElement
         * @private
         * Creates UI div for manual refresh/load of wfs layer,
         * where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                el = jQuery('<div class="mapplugin mapwfs2plugin">' +
                '<a href="JavaScript: void(0);"></a>' +
                '</div>');
            var link = el.find('a');
            me._loc = Oskari.getLocalization('MapWfs2', Oskari.getLang() || Oskari.getDefaultLanguage());
            link.html(me._loc.refresh);
            el.attr('title', me._loc.refresh_title);
            me._bindLinkClick(link);
            el.mousedown(function (event) {
                event.stopPropagation();
            });
            el.hide();
            return el;
        },

        _bindLinkClick: function (link) {
            var me = this,
                linkElement = link || me.getElement().find('a'),
                sandbox = me.getSandbox();
            linkElement.bind('click', function () {
                var event = sandbox.getEventBuilder('WFSRefreshManualLoadLayersEvent')();
                sandbox.notifyAll(event);
                return false;
            });
        },
        /**
         * @method refresh
         * Updates the plugins interface (hides if no manual load wfs layers selected)
         */
        refresh: function () {
            var me = this,
                sandbox = me.getMapModule().getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                i,
                loc = me.getLocalization(),
                isVisible = false,
                isInvisible = false,
                countManu = 0,
                countInvisi = 0,
                countInscale = 0,
                refresh_status1 = "all_invisible",
                refresh_status2 = "all_not_in_scale",
                scale = sandbox.getMap().getScale(),
                conf = me._config;
            if(this.getElement()) {
                this.getElement().hide();
            }
            // Check, if there's any manual refresh wfs layers, show element if so
            for (i = 0; i < layers.length; i++) {
                if (layers[i].hasFeatureData() && layers[i].isManualRefresh()) {
                    countManu++;
                    isVisible = true;
                }
            }

            // Check, if all invisible
            if (isVisible && this.getElement()) {

                for (i = 0; i < layers.length; i++) {
                    if (layers[i].hasFeatureData() && layers[i].isManualRefresh() && !layers[i].isVisible()) {
                        countInvisi++;
                    }
                    if (layers[i].hasFeatureData() && layers[i].isManualRefresh() && !layers[i].isInScale(scale)) {
                        countInscale++;
                    }
                }

                if (countInscale === countManu && loc.refresh_alert ) {
                    this.getElement().attr('refresh_status', refresh_status2);
                    this.getElement().css({'background-color': '#FF007F'});
                    this.getElement().attr('title', loc.refresh_alert[refresh_status2]);
                } else {
                    if (countInvisi === countManu && loc.refresh_alert ) {
                        this.getElement().attr('refresh_status', refresh_status1);
                        this.getElement().css({'background-color': '#FF007F'});
                        this.getElement().attr('title', loc.refresh_alert[refresh_status1]);
                    } else {
                        this.getElement().removeAttr('refresh_status');
                        this.getElement().css({'background-color': ''});
                        this.getElement().attr('title', loc.refresh_title);
                    }
                }

            }
            if(isVisible && this.getElement()) {
                this.getElement().show();
            }
            me.setVisible(isVisible);

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }

        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style ? style : 'default');

            var classList = el.attr('class').split(/\s+/);
            for(var c=0;c<classList.length;c++){
                var className = classList[c];
                if(className.indexOf('toolstyle-') > -1){
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        },
        /**
         * @method checkManualRefreshState
         * Updates the plugins interface (hides if no manual load wfs layers selected)
         */
        checkManualRefreshState: function () {
            var me = this,
                refresh_status,
                loc = me.getLocalization();

            if(me.getElement()) {
                refresh_status = me.getElement().attr("refresh_status");
            }
            if(refresh_status && loc.refresh_alert){
                //  refresh_status values = "all_invisible", "all_not_in_scale",
                me.showMessage(loc.refresh_alert.title, loc.refresh_alert[refresh_status]);
                return true;
            }
            return false;

        },
        /**
         * @method inform
         * Inform the user how to manage manual refresh layers (only when 1st manual refresh layer in selection)
         */
        inform: function (event) {
            var me = this,
                config = me.getConfig(),
                sandbox = me.getMapModule().getSandbox(),
                layer = event.getMapLayer(),
                layers = sandbox.findAllSelectedMapLayers(),
                i,
                count = 0,
                render = false;

            if(config){
                render = config.isPublished;
            }

            // see if there's any wfs layers, show  if so
            for (i = 0; i < layers.length; i++) {
                if (layers[i].hasFeatureData() &&  layers[i].isManualRefresh() ) {
                   count++;
                }
            }
            if(count === 1 && layer.isManualRefresh()){
               me.showMessage(me.getLocalization().information.title, me.getLocalization().information.info, me.getLocalization().button.close, render);
            }


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
                 */
                AfterMapMoveEvent: function (event) {
                    if (me.getConfig() && me.getConfig().deferSetLocation) {
                        me.getSandbox().printDebug(
                            'setLocation deferred (to aftermapmove)'
                        );
                        return;
                    }
                    me.mapMoveHandler(null, event);
                },

                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Object} event
                 */
                AfterMapLayerAddEvent: function (event) {
                    me.mapLayerAddHandler(event);
                    // Refresh UI refresh button visible/invisible
                    me.refresh();
                    // Inform user, if manual refresh-load wfs layers in selected map layers
                    // (only for 1st manual refresh layer)
                    me.inform(event);
                },

                /**
                 * @method AfterMapLayerRemoveEvent
                 * @param {Object} event
                 */
                AfterMapLayerRemoveEvent: function (event) {
                    me.mapLayerRemoveHandler(event);
                    // Refresh UI refresh button visible/invisible
                    me.refresh();
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
                 * Refresh manual-refresh-flagged wfs layers
                 * @param event
                 * @constructor
                 */
                WFSRefreshManualLoadLayersEvent: function (event) {
                    me.refreshManualLoadLayersHandler(event);
                },
                /**
                 * @method MapLayerVisibilityChangedEvent
                 * @param {Object} event
                 */
                MapLayerVisibilityChangedEvent: function (event) {
                    me.mapLayerVisibilityChangedHandler(event);
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
        mapMoveHandler: function (reqLayerId, event) {
            var me = this,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                srs = map.getSrsName(),
                bbox = map.getBbox(),
                zoom = map.getZoom(),
                scale = map.getScale(),
                geomRequest = false,
                grid,
                fids,
                layerId,
                layers = [],
                i,
                tiles,
                x;

            // clean tiles for printing
            me._printTiles = {};

            // update location
            grid = this.getGrid();

            // update cache
            this.refreshCaches();
            if(reqLayerId) {
                var layer = sandbox.findMapLayerFromSelectedMapLayers(reqLayerId);
                if(layer) {
                    layers.push(layer);
                }
            }
            else {
                layers = sandbox.findAllSelectedMapLayers();
            }

            for (i = 0; i < layers.length; i += 1) {
                // Clean layer data cache if not in scale
                if ( layers[i].hasFeatureData()  && !me.OLlayerVisibility(layers[i]) ) {
                    me.getOLMapLayer(layers[i], me.__typeNormal).removeBackBuffer();
                    continue;
                }

                if (!layers[i].hasFeatureData() || !layers[i].isVisible() || !layers[i].isInScale(scale)) {
                    continue;
                }

                // clean features lists
                layers[i].setActiveFeatures([]);
                if (grid === null || grid === undefined) {
                    continue;
                }
                layerId = layers[i].getId();
                tiles = me.getNonCachedGrid(layerId, grid);
                me.getIO().setLocation(
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
                me.getMapModule().loadingState(layers[i]._id, false);
                me._tilesLayer.redraw();
            }

            // update zoomLevel and highlight pictures
            // must be updated also in map move, because of hili in bordertiles
            srs = map.getSrsName();
            bbox = map.getBbox();
            zoom = map.getZoom();

            // if no connection or the layer is not registered, get highlight with URL
            for (x = 0; x < me.activeHighlightLayers.length; x += 1) {
                if (me.getConnection().isLazy() &&
                    (!me.getConnection().isConnected() ||
                        !sandbox.findMapLayerFromSelectedMapLayers(me.activeHighlightLayers[x].getId()))) {

                    fids = me.activeHighlightLayers[x].getClickedFeatureIds();
                    me.removeHighlightImages(
                        me.activeHighlightLayers[x]
                    );
                    me.getHighlightImage(
                        me.activeHighlightLayers[x],
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

            layers.forEach(function (layer) {
                if (layer.hasFeatureData()) {
                    fids = me.WFSLayerService.getSelectedFeatureIds(layer.getId());
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
                );

                // add e.g. WMS layer, if configured as linked layer for wfs rendering
                me._addLinkedLayer(layer);

                // send together
                connection.get().batch(function () {
                    me.getIO().addMapLayer(
                        layer.getId(),
                        styleName,
                        layer.isVisible()
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
            //remove loading tiles attached to this layer
            layer.loadingDone(0);

            if (layer.hasFeatureData()) {
                me._isWFSOpen -= 1;
                me.getConnection().updateLazyDisconnect(me.isWFSOpen());
                // remove from transport
                me.getIO().removeMapLayer(layer.getId());
                // remove from OL
                me.removeMapLayerFromMap(layer);

                // remove linked layer  e.g. wms layer for wfs rendering
                me._removeLinkedLayer(layer);


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
                srs,
                geomRequest = true,
                wfsFeatureIds = event.getWfsFeatureIds(),
                zoom;

            me.removeHighlightImages(layer);

            // if no connection or the layer is not registered, get highlight with URl
            if (connection.isLazy() && (!connection.isConnected() || !sandbox.findMapLayerFromSelectedMapLayers(layerId))) {
                srs = map.getSrsName();
                bbox = map.getBbox();
                zoom = map.getZoom();

                this.getHighlightImage(
                    layer,
                    srs, [
                        bbox.left,
                        bbox.bottom,
                        bbox.right,
                        bbox.top
                    ],
                    zoom,
                    wfsFeatureIds
                );
            }

            me.getIO().highlightMapLayerFeatures(
                layerId,
                wfsFeatureIds,
                false,
                geomRequest
            );
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

            var geojson_format = new OpenLayers.Format.GeoJSON();
            var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

            var pixelTolerance = 15;
            var selection = geojson_format.write(point);
            var json = {
                    type: 'FeatureCollection',
                    crs: this.getMap().getProjection(),
                    features: [{
                        type: 'Feature',
                        geometry: JSON.parse(selection),
                        properties : {
                            // add buffer based on resolution
                            buffer_radius : this.getMap().getResolution() * pixelTolerance
                        }
                    }]
                };
            this.getIO().setMapClick({
                lon : lonlat.lon,
                lat : lonlat.lat,
                json : json
            }, keepPrevious, true);
        },

        /**
         * @method changeMapLayerStyleHandler
         * @param {Object} event
         */
        changeMapLayerStyleHandler: function (event) {
            var layer = event.getMapLayer();
            if (!layer.hasFeatureData()) {
                return;
            }
            this.getIO().setMapLayerStyle(
                layer.getId(),
                layer.getCurrentStyle().getName()
            );
            // render "normal" layer with new style
            var OLLayer = this.getOLMapLayer(
                event.getMapLayer(),
                this.__typeNormal
            );
            OLLayer.redraw(true);
        },

        /**
         * @method mapLayerVisibilityChangedHandler
         * @param {Object} event
         */
        mapLayerVisibilityChangedHandler: function (event) {
            var layer = event.getMapLayer(),
                me = this;

            if (!layer.hasFeatureData()) {
                return;
            }
            this.getIO().setMapLayerVisibility(
                layer.getId(),
                layer.isVisible()
            );

            if (layer.isVisible() && this.getConfig() && this.getConfig().deferSetLocation) {
                this.getSandbox().printDebug(
                    'sending deferred setLocation'
                );
                this.mapMoveHandler(layer.getId());
            }
            // Update manual refresh button visibility
            this.refresh();

            // linked WMS layer
            if(layer.getWMSLayerId()){
                me.getSandbox().postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getWMSLayerId(), layer.isVisible()]);
            }
        },

        /**
         * @method afterChangeMapLayerOpacityEvent
         * @param {Object} event
         */
        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                me = this,
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
            // linked WMS layer
            if(layer.getWMSLayerId() ){
                me.getSandbox().postRequestByName('ChangeMapLayerOpacityRequest', [layer.getWMSLayerId(), layer.getOpacity()]);
            }
        },
        /**
         * @method  refreshManualLoadLayersHandler
         * @param {Object} event
         */
        refreshManualLoadLayersHandler: function (event) {
            var me = this,
                layers = [];

            // inform user, if no manual refresh wfs layer visible or  not in scale
            if (me.checkManualRefreshState()){
                return;
            }

            if(event.getLayerId()) {
                layers.push(me.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId()));
            }
            else {
                layers = me.getSandbox().findAllSelectedMapLayers();
            }

            layers.forEach(function (layer) {
                if (layer.hasFeatureData() && layer.isManualRefresh() && layer.isVisible()) {
                   me.refreshLayer(layer.getId(), true);
                }
            });
        },
        /**
         * @method  refreshLayer
         * @param {String} layerID
         * @param {Boolean} noBufferClean  if true
         */
        refreshLayer: function (layerID, noBufferClean) {
            var bbox,
                grid,
                layers = [],
                layerId,
                layer,
                me = this,
                map = me.getSandbox().getMap(),
                scale = map.getScale(),
                srs,
                tiles,
                zoom;

            // update tiles
            srs = map.getSrsName();
            bbox = map.getBbox();
            zoom = map.getZoom();
            grid = me.getGrid();

            if (!layerID) {
                return;
            }

            // update cache
            me.refreshCaches();

            layer = me.getSandbox().findMapLayerFromSelectedMapLayers(layerID);

            // Clean OL buffer
            if (!noBufferClean) {
                me.getOLMapLayer(layer, me.__typeNormal).removeBackBuffer();
            }

            if (layer.hasFeatureData() && layer.isVisible() && layer.isInScale(scale)) {
                // clean features lists
                layer.setActiveFeatures([]);
                if (grid === null || grid === undefined) {
                    return;
                }
                layerId = layer.getId();
                tiles = me.getNonCachedGrid(layerId, grid);
                me.getIO().setLocation(
                    layerId,
                    srs, [
                        bbox.left,
                        bbox.bottom,
                        bbox.right,
                        bbox.top
                    ],
                    zoom,
                    grid,
                    tiles,
                    true
                );
                me._tilesLayer.redraw();

            }
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
            bbox = map.getBbox();
            zoom = map.getZoom();
            grid = me.getGrid();

            // update cache
            me.refreshCaches();

            layers = me.getSandbox().findAllSelectedMapLayers();

            layers.forEach(function (layer) {
                if (layer.hasFeatureData() && layer.isVisible()) {
                    // clean features lists
                    layer.setActiveFeatures([]);
                    if (grid !== null && grid !== undefined) {
                        layerId = layer.getId();
                        tiles = me.getNonCachedGrid(layerId, grid);
                        me.getIO().setLocation(
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
            var keepPrevious = this.getSandbox().isCtrlKeyDown();
            this.getIO().setFilter(event.getGeoJson(), keepPrevious);
        },

        /**
         * @method setPropertyFilterHandler
         * @param {Object} event
         */
        setPropertyFilterHandler: function (event) {
            /// clean selected features lists
            var me = this,
                layers = this.getSandbox().findAllSelectedMapLayers();

            layers.forEach(function (layer) {
                if (layer.hasFeatureData() &&
                    layer.getId() === event.getLayerId()) {
                    me.WFSLayerService.emptyWFSFeatureSelections(layer);
                }
            });

            me.getIO().setPropertyFilter(
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
            );
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
                ols = new OpenLayers.Size(imageSize.width,imageSize.height);
                layerScales = me.getMapModule().calculateLayerScales(layer.getMaxScale(),layer.getMinScale());

                wfsMapImageLayer = new OpenLayers.Layer.Image(
                    layerName,imageUrl,
                    boundsObj, ols, {
                        scales: layerScales,
                        transparent: true,
                        format: 'image/png',
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        buffer: 0 }
                );

                wfsMapImageLayer.opacity = layer.getOpacity() / 100;
                map.addLayer(wfsMapImageLayer);
                wfsMapImageLayer.setVisibility(true);

                // also for draw
                wfsMapImageLayer.redraw(true);

                // if removed set to same index [but if wfsMapImageLayer created
                // in add (sets just in draw - not needed then here)]
                if (layerIndex !== null && wfsMapImageLayer !== null) {
                    map.setLayerIndex(wfsMapImageLayer, layerIndex);
                }

                // highlight picture on top of normal layer images
                normalLayerExp = new RegExp(me.__layerPrefix + layerId + '_' + me.__typeNormal);
                highlightLayerExp = new RegExp(me.__layerPrefix + layerId + '_' + me.__typeHighlight);
                normalLayer = map.getLayersByName(normalLayerExp);
                highlightLayer = map.getLayersByName(highlightLayerExp);

                if (normalLayer.length > 0 && highlightLayer.length > 0) {
                    normalLayerIndex = map.getLayerIndex(normalLayer[normalLayer.length - 1]);
                    map.setLayerIndex(highlightLayer[0],normalLayerIndex + 10);
                }
            } else { // "normal"
                BBOX = boundsObj.toArray(false);
                bboxKey = this.bboxkeyStrip(BBOX);
                style = layer.getCurrentStyle().getName();
                tileToUpdate = me._tilesToUpdate.mget(layerId,'',bboxKey);

                // put the data in cache
                // normal case and cached
                if (!boundaryTile) {
                    me._tileData.mput(layerId,style,bboxKey,imageUrl);
                }
                // temp cached and redrawn if gotten better
                else {
                    //Old temp tile (border tile) cant be used, because it is not valid after map move
                    me._tileDataTemp.mput(layerId,style,bboxKey,imageUrl);
                }
                // QUEUES updates!
                if (tileToUpdate) {
                    tileToUpdate.draw();
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
                layerResolutions = this.getMapModule().calculateLayerResolutions(
                    _layer.getMaxScale(),
                    _layer.getMinScale()
                ),
                key,
                me = this,
                sandbox = me.getSandbox(),
                defaultParams = {
                    layers: '',
                    transparent: true,
                    id: _layer.getId(),
                    styles: _layer.getCurrentStyle().getName(),
                    format: 'image/png'
                },
                defaultOptions = {
                    layerId: _layer.getId(),
                    resolutions: layerResolutions,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: true,
                    visibility: _layer.isInScale(sandbox.getMap().getScale()) && _layer.isVisible(),
                    buffer: 0,
                    _plugin: this,

                    getURL: function (bounds, theTile) {
                        bounds = this.adjustBounds(bounds);

                        var BBOX = bounds.toArray(false);
                        var bboxKey = this._plugin.bboxkeyStrip(BBOX);
                        var layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(this.layerId);
                        var style = layer.getCurrentStyle().getName();
                        var dataForTile = this._plugin._tileData.mget(
                                this.layerId,
                                style,
                                bboxKey
                            );

                        if (dataForTile) {
                            // remove from drawing
                            this._plugin._tilesToUpdate.mdel(
                                this.layerId,
                                '',
                                bboxKey
                            );
                        } else {
                            // temp cache
                            dataForTile = this._plugin._tileDataTemp.mget(
                                this.layerId,
                                style,
                                bboxKey
                            );

                            // put in drawing
                            this._plugin._tilesToUpdate.mput(
                                this.layerId,
                                '',
                                bboxKey,
                                theTile
                            );
                        }

                        return dataForTile;
                    },

                    addTile: function (bounds, position) {
                        var tileOpts = OpenLayers.Util.extend({},
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
                                        worldExtent, {
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
                            bboxKey = this._plugin.bboxkeyStrip(BBOX);

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

            // override redraw with tile cache flush

            var originalRedraw = openLayer.redraw;
            openLayer.redraw = function(forced) {
                var value = originalRedraw.apply(openLayer, arguments);
                if(forced) {
                    openLayer.removeBackBuffer();
                }
                return value;
            }

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
                    'Oskari.mapframework.bundle.mapwfs2.plugin.QueuedTilesStrategy', {
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
            var me = this,
                bounds,
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
                        if (me._isTile(tile) === false) {
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

        /**
         * Checks at tile is ok.
         * @method _isTile
         * @private
         *
         * @param {Object} tile
         *
         * @return {Boolean} is tile ok
         */
         _isTile: function(tile) {
            var b = tile.bounds;
            // true if none of these is undefined
            return !(
                typeof b.left === 'undefined' ||
                typeof b.bottom === 'undefined' ||
                typeof b.right === 'undefined' ||
                typeof b.top === 'undefined');
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
                me = this,
                bboxKey,
                dataForTile;

            for (i = 0; i < grid.bounds.length; i += 1) {
                bboxKey = me.bboxkeyStrip(grid.bounds[i]);
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
            // same size?
            if (old.length !== current.length) {
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
        /*
         * @method showMessage
         *
         * @param {String} message dialog title
         * @param {String} message  message to show to the user
         * @param {String} locale string for OK-button
         * @param {boolean} render manual refresh wfs layers in OK call back, if true
         */
        showMessage: function (title, message, ok, render) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                me = this,
                sandbox = me.getSandbox();
            if(ok) {
                okBtn.setTitle(ok);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    if (render) {
                        var event = sandbox.getEventBuilder('WFSRefreshManualLoadLayersEvent')();
                        sandbox.notifyAll(event);
                    }
                    dialog.close(true);
                });
                dialog.show(title, message, [okBtn]);
            }
            else{
                dialog.show(title, message);
                dialog.fadeout(5000);
            }

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
            if(!featureIds || !featureIds.length) {
                return;
            }
            // helper function for visibleFields
            var me = this,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                contains = function (a, obj) {
                    var i;

                    for (i = 0; i < a.length; i += 1) {
                        if (a[i] === obj) {
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
        },
        /**
         * Strip bbox for unique key because of some inaccucate cases
         * OL computation (init grid in tilesizes)  is inaccurate in last decimal
         * @param bbox
         * @returns {string}
         */
        bboxkeyStrip: function (bbox) {
            var stripbox = [];
            if (!bbox) {
                return;
            }
            for (var i = bbox.length; i--;) {
                stripbox[i] = bbox[i].toPrecision(13);
            }
            return stripbox.join(',');
        },
        OLlayerVisibility: function (layer) {
            var    me = this,
                mapLayers = me.getMapModule().getOLMapLayers(layer.getId()),
                mapLayer = mapLayers.length ? mapLayers[0] : null;
            if(mapLayer){
                return mapLayer.getVisibility();
            }
            return layer.isVisible();
        },
        hasUI: function() {
            return false;
        },
        updateScale: function(layer, minscale, maxscale) {
          var me = this;
          layer.setMinScale(minscale);
          layer.setMaxScale(maxscale);
          var olLayer = this.getOLMapLayers(layer)
          olLayer[0].minScale = minscale;
          olLayer[0].maxScale = maxscale;

          this._dialog = Oskari.clazz.create(
            'Oskari.userinterface.component.Popup'
          );
         var btn = this._dialog.createCloseButton('OK');

         btn.setHandler(function() {
             me._dialog.close();
         });
         this._dialog.show(me._loc.scale_dialog.title, me._loc.scale_dialog.msg, [btn]);
        },
        /*
        * add WMS layer as linked layer, if configured for wfs rendering
         */
        _addLinkedLayer: function(layer) {
            var me = this,
                linkedLayer = null,
                mapLayerService;

            // Remove linked wms layer, if it is not opened internally and reopen it internally
            if(layer.getWMSLayerId() && me.getSandbox().findMapLayerFromSelectedMapLayers(layer.getWMSLayerId())){
                me.getSandbox().postRequestByName('RemoveMapLayerRequest', [layer.getWMSLayerId()]);
            }
            if(layer.getWMSLayerId()) {
                mapLayerService = me.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );
                linkedLayer = mapLayerService.findMapLayer(layer.getWMSLayerId());
                if(linkedLayer){
                    linkedLayer.setLinkedLayer(true);
                }
                me.getSandbox().postRequestByName('AddMapLayerRequest', [layer.getWMSLayerId(), true]);
                mapLayerService.makeLayerSticky(layer.getWMSLayerId(), true);
            }
        },
        /*
         * remove WMS layer, if it was linked to wfs layer and configured for wfs rendering
         */
        _removeLinkedLayer: function(layer) {
            var me = this,
                linkedLayer = null,
                mapLayerService;

            // Remove linked wms layer, if it is opened internally
            if(layer.getWMSLayerId()){
                mapLayerService = me.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );
                linkedLayer = mapLayerService.findMapLayer(layer.getWMSLayerId());
                if(linkedLayer){
                    linkedLayer.setLinkedLayer(false);
                }
                me.getSandbox().postRequestByName('RemoveMapLayerRequest', [layer.getWMSLayerId()]);
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
