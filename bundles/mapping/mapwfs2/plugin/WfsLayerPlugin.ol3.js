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

        // state
        me._isWFSOpen = 0;

        // Manual refresh ui location
        me._defaultLocation = 'top right';

        // printing
        me._printTiles = {};

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


        me.tempVectorLayer = null;

        me.__layersByName = {};

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
            me.createTileGrid();
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

            //What's this do?
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
                AfterMapMoveEvent: function () {
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
         * Returns the requested layer IF it's one of the selected layers on map.
         * If params is undefined, returns all selected layers.
         * @param  {String} reqLayerId optional id
         * @return {Oskari.mapframework.domain.AbstractLayer}  layers array
         */
        _getLayers : function(reqLayerId) {
            var sb = this.getSandbox();

            if(!reqLayerId) {
                return sb.findAllSelectedMapLayers();
            }
            var layer = sb.findMapLayerFromSelectedMapLayers(reqLayerId);
            if(layer) {
                return [layer];
            }
            return [];
        },
        /**
         * @method mapMoveHandler
         */
        mapMoveHandler: function (reqLayerId) {
            var me = this,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                srs = map.getSrsName(),
                bbox = me.ol2ExtentOl3Transform(map.getBbox()),
                zoom = map.getZoom(),
                scale = map.getScale(),
                layers = this._getLayers();

            // clean tiles for printing
            me._printTiles = {};

            // update location
            var grid = this.getGrid();
            layers.forEach(function (layer) {
                if (!layer.hasFeatureData() || !layer.isVisible() || !layer.isInScale(scale)) {
                    return;
                }
                // clean features lists
                layer.setActiveFeatures([]);
                if (grid === null || grid === undefined) {
                    return;
                }
                var ollayer = me.getOLMapLayer(layer);
                var tiles = ollayer.getSource().getNonCachedGrid(grid);
                me.getIO().setLocation(layer.getId(),
                    srs, bbox, zoom, grid, tiles
                );
            });

            // update highlight pictures
            // must be updated also in map move, because of hili in bordertiles

            // if no connection or the layer is not registered, get highlight with URL
            me.activeHighlightLayers.forEach(function (layer) {
                if (me.getConnection().isLazy() &&
                    (!me.getConnection().isConnected() || !sandbox.findMapLayerFromSelectedMapLayers(layer.getId()))) {

                    var fids = layer.getClickedFeatureIds();
                    me.removeHighlightImages(layer);
                    me.getHighlightImage(layer, srs, bbox, zoom, fids);
                }

            });

            layers.forEach(function (layer) {
                if (!layer.hasFeatureData()) {
                    return;
                }
                var fids = me.WFSLayerService.getSelectedFeatureIds(layer.getId());
                me.removeHighlightImages(layer);
                if (me._highlighted) {
                    me.getIO().highlightMapLayerFeatures(layer.getId(),fids, false, true);
                }
            });
        },
        /**
         * @method ol2ExtentOl3Transform
         *
         * Transforms an ol2 - style extent object to an ol3 - style array. If extent is already in the array form, return the original.
         */
        ol2ExtentOl3Transform: function(ol2Extent) {
            if (ol2Extent && ol2Extent.hasOwnProperty('left') && ol2Extent.hasOwnProperty('bottom') && ol2Extent.hasOwnProperty('right') && ol2Extent.hasOwnProperty('top')) {
                return [
                    ol2Extent.left,
                    ol2Extent.bottom,
                    ol2Extent.right,
                    ol2Extent.top
                ];
            } else if (ol2Extent && ol2Extent.length && ol2Extent.length === 4) {
                //supposedly already in ol3 form -> just return as is.
                return ol2Extent;
            }
            return null;
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
                keepPrevious = event.getParams().ctrlKeyDown;

            var point = new ol.geom.Point([lonlat.lon, lonlat.lat]);
            var geojson = new ol.format.GeoJSON(this.getMap().getView().getProjection());
            var pixelTolerance = 15;
            var json = {
                type: 'FeatureCollection',
                crs: this.getMap().getView().getProjection().getCode(),
                features: [{
                    type: 'Feature',
                    geometry: JSON.parse(geojson.writeGeometry(point)),
                    properties : {
                        // add buffer based on resolution
                        buffer_radius : this.getMap().getView().getResolution() * pixelTolerance
                    }
                }]
            };

            this.getIO().setMapClick({
                lon : lonlat.lon,
                lat : lonlat.lat,
                json : json
            }, keepPrevious);
        },

        /**
         * @method changeMapLayerStyleHandler
         * @param {Object} event
         */
        changeMapLayerStyleHandler: function (event) {

            if (event.getMapLayer().hasFeatureData()) {
                // render "normal" layer with new style
                var OLLayer = this.getOLMapLayer(
                    event.getMapLayer()
                );
                if (typeof OLLayer.getSource().refresh ==='function'){
                    OLLayer.getSource().refresh();
                }

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
            var layer = event.getMapLayer();
            if (layer.hasFeatureData()) {
                this.getIO().setMapLayerVisibility(
                    layer.getId(),
                    layer.isVisible()
                );

                if (event.getMapLayer().isVisible() && this.getConfig() && this.getConfig().deferSetLocation) {
                    this.getSandbox().printDebug(
                        'sending deferred setLocation'
                    );
                    this.mapMoveHandler(event.getMapLayer().getId());
                }
                // Update manual refresh button visibility
                this.refresh();
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
         * @method  refreshManualLoadLayersHandler
         * @param {Object} event
         */
        refreshManualLoadLayersHandler: function (event) {
            var bbox,
                grid,
                layerId,
                layers = [],
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

            // inform user, if no manual refresh wfs layer visible or  not in scale --> return
            if (me.checkManualRefreshState()){
                return;
            }

            if(event.getLayerId()){

                layers.push(me.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId()));
            }
            else {
                layers = me.getSandbox().findAllSelectedMapLayers();
            }

            layers.forEach(function (layer) {
                if (layer.hasFeatureData() && layer.isManualRefresh() && layer.isVisible() && layer.isInScale(scale)) {
                    // clean features lists
                    layer.setActiveFeatures([]);
                    if (grid !== null && grid !== undefined) {
                        layerId = layer.getId();
                        var ollayer = me.getOLMapLayer(layer);
                        tiles = ollayer.getSource().getNonCachedGrid(grid);
                        //tiles = me.getNonCachedGrid(layerId, grid);
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
                       // not in OL3 me._tilesLayer.redraw();
                    }
                }
            });
        },
        /**
         * @method mapSizeChangedHandler
         * @param {Object} event
         */
        mapSizeChangedHandler: function (event) {
            var me = this;
            me.getIO().setMapSize(event.getWidth(), event.getHeight());

            // update tiles
            var grid = me.getGrid();
            if (grid === null || grid === undefined) {
                return;
            }

            var map = me.getSandbox().getMap();
            var srs = map.getSrsName();
            var bbox = map.getBbox();
            var zoom = map.getZoom();
            var layers = me.getSandbox().findAllSelectedMapLayers();

            layers.forEach(function (layer) {
                if (!layer.hasFeatureData()) {
                    return;
                }
                // clean features lists
                layer.setActiveFeatures([]);
                var ollayer = me.getOLMapLayer(layer);
                if(!ollayer) {
                    return;
                }
                var tiles = ollayer.getSource().getNonCachedGrid(grid);
                //tiles = me.getNonCachedGrid(layerId, grid);
                me.getIO().setLocation(
                    layer.getId(),
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

            var me = this;
            var removeLayer = me.getOLMapLayer(layer, me.__typeHighlight);
            me.getMapModule().removeLayer(removeLayer);
        },

        /**
         * @method removeMapLayerFromMap
         * @param {Object} layer
         */
        removeMapLayerFromMap: function (layer) {
            var me = this,
                layers = this.getOLMapLayers(layer) || [];

            _.each(layers, function (ollayer) {
                // clear references
                var name = me.getLayerName(layer, me.__typeNormal);
                me.__layersByName[name] = null;
                delete me.__layersByName[name];
                name = me.getLayerName(layer, me.__typeHighlight);
                me.__layersByName[name] = null;
                delete me.__layersByName[name];

                // remove from map
                me.getMapModule().removeLayer(ollayer);
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

            var me = this;
            var result = [];
            var normallayer = me.getOLMapLayer(layer, this.__typeNormal);
            if(normallayer) {
                result.push(normallayer);
            }
            var highlightlayer = me.getOLMapLayer(layer, this.__typeHighlight);
            if(highlightlayer) {
                result.push(highlightlayer);
            }

            return result;
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
            type = type || this.__typeNormal;
            return this.layerByName(this.__layerPrefix + layer.getId() + '_' + type);
        },
        /**
         * @method createTileGrid
         *
         * Creates the base tilegrid for use with any Grid operations
         *
         */
        createTileGrid: function() {
            var tileSize = this.getTileSize();
            this._tileGrid = new ol.tilegrid.TileGrid({
                extent: this.ol2ExtentOl3Transform(this.getMapModule().getMaxExtent()),
                tileSize: [tileSize.width, tileSize.height],
                resolutions : this.getMapModule().getResolutionArray()
            });
        },

        getTileSize: function () {
            return {
                width : 256,
                height : 256
            };
        },
        getGrid: function () {
            var me = this,
                sandbox = me.getSandbox(),
                resolution = me.getMap().getView().getResolution(),
                mapExtent = me.ol2ExtentOl3Transform(sandbox.getMap().getBbox()),
                z = me.getMapModule().getMapZoom(),
                tileGrid = this._tileGrid,
                grid = {
                    bounds: [],
                    rows: null,
                    columns: null
                },
                rowidx = 0,
                colidx = 0;
            var tileRangeExtentArray = tileGrid.getTileRangeForExtentAndZoomWrapper(mapExtent, z);
            var tileRangeExtent = {
                minX: tileRangeExtentArray[0],
                minY: tileRangeExtentArray[1],
                maxX: tileRangeExtentArray[2],
                maxY: tileRangeExtentArray[3]
            };

            for (var iy = tileRangeExtent.minY; iy <= tileRangeExtent.maxY; iy++) {
                for (var ix = tileRangeExtent.minX; ix <= tileRangeExtent.maxX; ix++) {
                    var zxy = [z,ix,iy];
                    var tileBounds = tileGrid.getTileCoordExtent(zxy);
                    grid.bounds.push(tileBounds);
                    colidx++;
                }
                rowidx++;
            }
            grid.rows = rowidx;
            grid.columns = colidx;
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
        hasUI: function() {
            return false;
        },
        updateScale: function(layer, minscale, maxscale) {
          var me = this;
          layer.setMinScale(minscale);
          layer.setMaxScale(maxscale);
          var olLayer = this.getOLMapLayers(layer)
          var layerResolutions = this.getMapModule().calculateLayerResolutions(maxscale, minscale);
          olLayer[0].setMinResolution(layerResolutions[0]);
          olLayer[0].setMaxResolution(layerResolutions[layerResolutions.length -1]);

          this._dialog = Oskari.clazz.create(
            'Oskari.userinterface.component.Popup'
          );
         var btn = this._dialog.createCloseButton('OK');

         btn.setHandler(function() {
             me._dialog.close();
         });
         this._dialog.show(me._loc.scale_dialog.title, me._loc.scale_dialog.msg, [btn]);
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

            var me = this;
            var layerName =
                this.__layerPrefix + _layer.getId() + '_' + layerType,
                key,
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
            var projection = ol.proj.get(me.getMapModule().getProjection());

            //var tileSrc = new ol.source.TileImage({
            var tileSrc = new ol.source.OskariAsyncTileImage({
                layerId: _layer.getId(),
                projection: projection,
                tileGrid: this._tileGrid
            });
            var openLayer = new ol.layer.Tile({
                source: tileSrc
            });
            openLayer.setVisible(_layer.isVisible());

            openLayer.setOpacity(_layer.getOpacity() / 100);
            me._registerLayerEvents(openLayer, _layer);
            me.getMapModule().addLayer(openLayer, _layer, layerName);
            me.layerByName(layerName, openLayer);
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function(layer, oskariLayer){
          var me = this;
          var source = layer.getSource();

          source.on('tileloadstart', function() {
            me.getMapModule().loadingState( oskariLayer.getId(), true);
          });

          source.on('tileloadend', function() {
            me.getMapModule().loadingState( oskariLayer.getId(), false);
          });

          source.on('tileloaderror', function() {
            me.getMapModule().loadingState( oskariLayer.getId(), null, true );
          });

      },
        drawImageTile: function (layer, imageUrl, imageBbox, imageSize, layerType, boundaryTile, keepPrevious) {
            var me = this,
                map = me.getMap(),
                mapmodule = me.getMapModule(),
                layerId = layer.getId(),
                layerIndex = null,
                layerName = me.__layerPrefix + layerId + '_' + layerType,
                layerScales,
                normalLayerIndex,
                highlightLayer,
                boundsObj = imageBbox,
                ols,
                wfsMapImageLayer,
                normalLayer = me.getOLMapLayer(layer);

            /** Safety checks */
            if (!imageUrl || !boundsObj) {
                return;
            }
            if (layerType === me.__typeHighlight) {
                ols = [imageSize.width,imageSize.height];  //ol.Size
                layerScales = me.getMapModule().calculateLayerScales(layer.getMaxScale(),layer.getMinScale());

                wfsMapImageLayer = new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                        url: imageUrl,
                        imageExtent: boundsObj,
                        imageSize: ols,
                        logo: false,
                        crossOrigin : layer.getAttributes('crossOrigin')
                    }),
                    title: layerName
                });
                wfsMapImageLayer.setOpacity(layer.getOpacity() / 100);
                me.layerByName(layerName, wfsMapImageLayer);
                me.getMapModule().addLayer(wfsMapImageLayer, layer, layerName);
                wfsMapImageLayer.setVisible(true);

                // if removed set to same index [but if wfsMapImageLayer created
                // in add (sets just in draw - not needed then here)]
                if (layerIndex !== null && wfsMapImageLayer !== null) {
                    map.setLayerIndex(wfsMapImageLayer, layerIndex);
                }

                // highlight picture on top of normal layer images (if both are available)
                // for example postprocessor bundle can highlight without the "normal layer"
                if (normalLayer && highlightLayer) {
                    var layerToMove = me.getOLMapLayer(layer, me.__typeHighlight);
                    var higlightLayerIndex = mapmodule.getLayerIndex(layerToMove);
                    highlightLayer = map.getLayers().removeAt(higlightLayerIndex);

                    normalLayerIndex = mapmodule.getLayerIndex(normalLayer);
                    map.getLayers().insertAt(normalLayerIndex, highlightLayer);
                }
            } else { // "normal"
                var ollayer = normalLayer;
                ollayer.getSource().setupImageContent(boundsObj, imageUrl, ollayer, map, boundaryTile);
            }
        },
        getLayerName : function(layer, type) {
            type = type || this.__typeNormal;
            return this.__layerPrefix + layer.getId() + '_' + type;
        },
        layerByName : function(name, value) {
            if(!value) {
                return this.__layersByName[name];
            }
            this.__layersByName[name] = value;
        },
        /*
         * @method deleteTileCache
         *
         * @param layerId
         * @param styleName
         */
        deleteTileCache: function (layerId, styleName) {
            // TODO: force reload of tiles - required for custom style change
            // now layer's source is refreshed in changeMapLayerStyleHandler
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
