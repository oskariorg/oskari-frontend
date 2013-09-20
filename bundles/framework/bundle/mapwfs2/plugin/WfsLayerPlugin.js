/**
 * @class Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin',
/**
 * @method create called automatically on construction
 * @static

 * @param {Object} config
 */
function(config) {
    this.config = config;

    this._sandbox = null;
    this._map = null;

    this.mapModule = null;
    this.pluginName = null;

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

    this._mapClickData = { comet: false, ajax: false, wfs: [] };

    this.errorTriggers = { 
        "connection_not_available" : { limit: 1, count: 0 },
        "connection_broken" : { limit: 1, count: 0 },
    };

    /* templates */
    this.template = {};
    for (p in this.__templates ) {
        this.template[p] = jQuery(this.__templates[p]);
    }
}, {
    __name : 'WfsLayerPlugin',

    __templates : {
        "getinfo_result_header" : '<div class="getinforesult_header"><div class="icon-bubble-left"></div>',
        "getinfo_result_header_title" : '<div class="getinforesult_header_title"></div>',
        "wrapper" : '<div></div>',
        "getinfo_result_table" : '<table class="getinforesult_table"></table>',
        "link_outside" : '<a target="_blank"></a>',
        "tableRow" : '<tr></tr>',
        "tableCell" : '<td></td>'
    },

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.pluginName;
    },

    /**
     * @method getMapModule
     * @return {Object} map module
     */
    getMapModule : function() {
        return this.mapModule;
    },

    /**
     * @method setMapModule
     * @param {Object} map module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },

    /**
     * @method init
     *
     * Initiliazes the connection to the CometD servlet and registers the domain model
     */
    init : function() {
        var sandboxName = ( this.config ? this.config.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);
        this._sandbox = sandbox;

        // service init
        if(this.config) {
            if(this.config.hostname == "localhost") {
                this.config.hostname = location.hostname;
            }
            if(this.config.port.length > 0) {
                this.config.port = ":" + this.config.port;
            }
        }
        this._connection = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.Connection', this.config, this);
        this._io = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.Mediator', this.config, this);

        // register domain model
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if(mapLayerService) {
            mapLayerService.registerLayerModel('wfslayer', 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder', sandbox);
            mapLayerService.registerLayerModelBuilder('wfslayer', layerModelBuilder);
        }

        // tiles to draw  - key: layerId + bbox
        this._tilesToUpdate = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.plugin.TileCache');
        // data for tiles - key: layerId + bbox
        this._tileData = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.plugin.TileCache');
    },

    /**
     * @method register
     *
     * Registers plugin into mapModule
     */
    register : function() {
        this.getMapModule().setLayerPlugin('wfslayer', this);
    },

    /**
     * @method unregister
     *
     * Removes registration of the plugin from mapModule
     */
    unregister : function() {
        this.getMapModule().setLayerPlugin('wfslayer', null);
    },

    /**
     * @method startPlugin
     *
     * Creates grid and registers event handlers
     */
    startPlugin : function(sandbox) {
        this._map = this.getMapModule().getMap();

        this.createTilesGrid();
        sandbox.register(this);
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },

    /**
     * @method stopPlugin
     *
     * Removes event handlers from register
     */
    stopPlugin : function(sandbox) {
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
    },

    /*
     * @method start called from sandbox
     */
    start : function(sandbox) {
    },

    /**
     * @method stop called from sandbox
     *
     */
    stop : function(sandbox) {
    },

    /**
     * @method getSandbox
     * @return {Object} sandbox
     */
    getSandbox: function() {
        return this._sandbox;
    },

    /**
     * @method getConnection
     * @return {Object} connection
     */
    getConnection : function() {
        return this._connection;
    },

    /**
     * @method getIO
     * @return {Object} io
     */
    getIO: function() {
        return this._io;
    },

    /**
     * @method getmapClickData
     * @return {Object} map click data
     */
    getmapClickData: function() {
        return this._mapClickData;
    },

    /**
     * @static
     * @property eventHandlers
     */
    eventHandlers : {
        /**
         * @method AfterMapMoveEvent
         * @param {Object} event
         */
        "AfterMapMoveEvent" : function(event) {
            this.mapMoveHandler();
        },

        /**
         * @method AfterMapLayerAddEvent
         * @param {Object} event
         */
        'AfterMapLayerAddEvent' : function(event) {
            this.mapLayerAddHandler(event);
        },

        /**
         * @method AfterMapLayerRemoveEvent
         * @param {Object} event
         */
        'AfterMapLayerRemoveEvent' : function(event) {
            this.mapLayerRemoveHandler(event);
        },

        /**
         * @method WFSFeaturesSelectedEvent
         * @param {Object} event
         */
        'WFSFeaturesSelectedEvent' : function(event) {
            this.featuresSelectedHandler(event);
        },

        /**
         * @method MapClickedEvent
         * @param {Object} event
         */
        'MapClickedEvent' : function(event) {
            this.mapClickedHandler(event);
        },

        /**
         * @method GetInfoResultEvent
         * @param {Object} event
         */
        'GetInfoResultEvent' : function(event) {
            this.getInfoResultHandler(event);
        },

        /**
         * @method AfterChangeMapLayerStyleEvent
         * @param {Object} event
         */
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this.changeMapLayerStyleHandler(event);
        },

        /**
         * @method MapLayerVisibilityChangedEvent
         * @param {Object} event
         */
        'MapLayerVisibilityChangedEvent' : function(event) {
            this.mapLayerVisibilityChangedHandler(event);
        },

        /**
         * @method AfterChangeMapLayerOpacityEvent
         * @param {Object} event
         */
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },


        /**
         * @method MapSizeChangedEvent
         * @param {Object} event
         */
        'MapSizeChangedEvent' : function(event) {
            this.mapSizeChangedHandler(event);
        },

        /**
         * @method WFSSetFilter
         * @param {Object} event
         */
        'WFSSetFilter' : function(event) {
            this.setFilterHandler(event);
        },

        /**
         * @method WFSImageEvent
         * @param {Object} event
         */
        'WFSImageEvent' : function(event) {
            this.drawImageTile(
                event.getLayer(),
                event.getImageUrl(),
                event.getBBOX(),
                event.getSize(),
                event.getLayerPostFix(),
                event.isKeepPrevious()
            );
        }
    },

    /**
     * @method onEvent
     * @param {Object} event
     * @return {Function} event handler
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [ event ]);
    },

    /**
     * @method mapMoveHandler
     */
    mapMoveHandler : function() {
        var srs = this.getSandbox().getMap().getSrsName();
        var bbox = this.getSandbox().getMap().getExtent();
        var zoom = this.getSandbox().getMap().getZoom();

        // clean tiles for printing
        this._printTiles = {};

        // update location
        var grid = this.getGrid();

        // update cache
        this.refreshCaches();

        var layers = this.getSandbox().findAllSelectedMapLayers();
        for (var i = 0; i < layers.length; ++i) {
            if (layers[i].hasFeatureData()) {
                layers[i].setActiveFeatures([]); /// clean features lists
                if(grid != null) {
                    var layerId = layers[i].getId();
                    var tiles = this.getNonCachedGrid(layerId, grid);
                    this.getIO().setLocation(layerId, srs, [bbox.left,bbox.bottom,bbox.right,bbox.top], zoom, grid, tiles);
                    this._tilesLayer.redraw();
                }
            }
        }

        // update zoomLevel and highlight pictures
        if(this.zoomLevel != zoom) {
            this.zoomLevel = zoom;
            for (var j = 0; j < layers.length; ++j) {
                if (layers[j].hasFeatureData()) {
                    // get all feature ids
                    var fids = layers[j].getClickedFeatureIds().slice(0);
                    for(var k = 0; k < layers[j].getSelectedFeatures().length; ++k) {
                        fids.push(layers[j].getSelectedFeatures()[k][0]);
                    }
                    this.removeHighlightImage(layers[j]);
                    this.getIO().highlightMapLayerFeatures(layers[j].getId(), fids, false);
                }
            }
        }
    },

    /**
     * @method mapLayerAddHandler
     */
    mapLayerAddHandler : function(event) {
        if(event.getMapLayer().hasFeatureData()) {
            if(this.getConnection().isLazy() && !this.getConnection().isConnected()) {
                this.getConnection().connect();
            }

            this._isWFSOpen++;
            this.getConnection().updateLazyDisconnect(this.isWFSOpen());

            var styleName = null;
            if(event.getMapLayer().getCurrentStyle()) {
                styleName = event.getMapLayer().getCurrentStyle().getName();
            }
            if(styleName == null || styleName == "") {
                styleName = "default";
            }

            this.addMapLayerToMap(event.getMapLayer(), 'normal'); // add WMS layer

            // send together
            var self = this;
            this.getConnection().get().batch(function() {
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
    mapLayerRemoveHandler : function(event) {
        var layer = event.getMapLayer();

        if(layer.hasFeatureData()) {
            this._isWFSOpen--;
            this.getConnection().updateLazyDisconnect(this.isWFSOpen());

            this.getIO().removeMapLayer(layer.getId()); // remove from transport
            this.removeMapLayerFromMap(layer); // remove from OL

            // clean tiles for printing
            this._printTiles[layer.getId()] = [];

            // delete possible error triggers
            delete this.errorTriggers["wfs_no_permissions_" + layer.getId()];
            delete this.errorTriggers["wfs_configuring_layer_failed_" + layer.getId()];
            delete this.errorTriggers["wfs_request_failed_" + layer.getId()];
            delete this.errorTriggers["features_parsing_failed_" + layer.getId()];
        }
    },

    /**
     * @method featuresSelectedHandler
     */
    featuresSelectedHandler : function(event) {
        if(event.getMapLayer().hasFeatureData()) {
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getMapLayer().getId());
            var ids = layer.getClickedFeatureListIds();
            var tmpIds = event.getWfsFeatureIds();
            if(!event.isKeepSelection()) {
                layer.setClickedFeatureListIds(event.getWfsFeatureIds());
            } else {
                var isFound = false;
                for (var i = 0; i < tmpIds.length; ++i) {
                    isFound = false;
                    for (var j = 0; j < ids.length; ++j) {
                        if(tmpIds[i] == ids[j]) {
                            isFound = true;
                            continue;
                        }
                    }
                    if(!isFound) {
                        ids.push(tmpIds[i]);
                    }

                }
            }
            this.getIO().highlightMapLayerFeatures(event.getMapLayer().getId(), event.getWfsFeatureIds(), event.isKeepSelection());
        }
    },

    /**
     * @method mapClickedHandler
     */
    mapClickedHandler : function(event) {
        // don't process while moving
        if(this.getSandbox().getMap().isMoving()) {
            return;
        }

        var lonlat = event.getLonLat();
        var keepPrevious = this.getSandbox().isCtrlKeyDown();
        this.getIO().setMapClick(lonlat.lon, lonlat.lat, keepPrevious);
    },

    /**
     * @method getInfoResultHandler
     */
    getInfoResultHandler : function(event) {

        this._mapClickData.ajax = true;
        this._mapClickData.data = event.getData();
        if(!this.isWFSOpen() || this._mapClickData.comet) {
            this.showInfoBox();
        }
    },

    /**
     * @method changeMapLayerStyleHandler
     */
    changeMapLayerStyleHandler : function(event) {
        if(event.getMapLayer().hasFeatureData()) {
            // render "normal" layer with new style
            var OLLayer = this.getOLMapLayer(event.getMapLayer(), "normal");
            OLLayer.redraw();

            this.getIO().setMapLayerStyle(
                event.getMapLayer().getId(),
                event.getMapLayer().getCurrentStyle().getName()
            );
        }
    },

    /**
     * @method mapLayerVisibilityChangedHandler
     */
    mapLayerVisibilityChangedHandler : function(event) {
        if(event.getMapLayer().hasFeatureData()) {
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
    afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if (!layer.hasFeatureData()) {
            return;
        }
        var layers = this.getOLMapLayers(layer);
        for ( var i = 0; i < layers.length; i++) {
            layers[i].setOpacity(layer.getOpacity() / 100);

        }
    },

    /**
     * @method mapSizeChangedHandler
     */
    mapSizeChangedHandler : function(event) {
        this.getIO().setMapSize(event.getWidth(), event.getHeight());

        // update tiles
        var srs = this.getSandbox().getMap().getSrsName();
        var bbox = this.getSandbox().getMap().getExtent();
        var zoom = this.getSandbox().getMap().getZoom();
        var grid = this.getGrid();

        // update cache
        this.refreshCaches();

        var layers = this.getSandbox().findAllSelectedMapLayers();
        for (var i = 0; i < layers.length; ++i) {
            if (layers[i].hasFeatureData()) {
                layers[i].setActiveFeatures([]); /// clean features lists
                if(grid != null) {
                    var layerId = layers[i].getId();
                    var tiles = this.getNonCachedGrid(layerId, grid);
                    this.getIO().setLocation(layerId, srs, [bbox.left,bbox.bottom,bbox.right,bbox.top], zoom, grid, tiles);
                    this._tilesLayer.redraw();
                }
            }
        }
    },

    /**
     * @method setFilterHandler
     */
    setFilterHandler : function(event) {
        /// clean selected features lists
        var layers = this.getSandbox().findAllSelectedMapLayers();
        for (var i = 0; i < layers.length; ++i) {
            if (layers[i].hasFeatureData()) {
                layers[i].setSelectedFeatures([]);
            }
        }

        this.getIO().setFilter(event.getGeoJson());
    },

    /**
     * @method clearConnectionErrorTriggers
     */
    clearConnectionErrorTriggers : function() {
        this.errorTriggers["connection_not_available"] = { limit: 1, count: 0 };
        this.errorTriggers["connection_broken"] = { limit: 1, count: 0 };
    },

    /**
     * @method showInfoBox
     *
     * Wraps data to html and makes ShowInfoBoxRequest
     */
    showInfoBox : function() {
        if(this._mapClickData.data == undefined) { // error
            return;
        }

        var data = this._mapClickData.data;
        var wfs = this._mapClickData.wfs;
        var wfsFeatures = this.formatWFSFeaturesForInfoBox(wfs);

        data.fragments = data.fragments.concat(wfsFeatures);

        // empty result
        if(data.fragments.length == 0) {
            this._mapClickData = { comet: false, ajax: false, wfs: [] };
            return;
        }

        var content = {};
        var wrapper = this.template.wrapper.clone();

        content.html = '';
        content.actions = {};
        for (var di = 0; di < data.fragments.length; di++) {
            var fragment = data.fragments[di]
            var fragmentTitle = fragment.layerName;
            var fragmentMarkup = fragment.markup;

            var contentWrapper = this.template.wrapper.clone();

            var headerWrapper = this.template.getinfo_result_header.clone();
            var titleWrapper = this.template.getinfo_result_header_title.clone();

            titleWrapper.append(fragmentTitle);
            headerWrapper.append(titleWrapper);
            contentWrapper.append(headerWrapper);


            if (fragmentMarkup) {
                contentWrapper.append(fragmentMarkup);
            }
            wrapper.append(contentWrapper);
        }
        content.html = wrapper;

        // show info box
        var request = this.getSandbox().getRequestBuilder("InfoBox.ShowInfoBoxRequest")(
            data.popupid,
            data.title,
            [content],
            data.lonlat,
            true
        );
        this.getSandbox().request(this, request);

        // clear the data
        this._mapClickData = { comet: false, ajax: false, wfs: [] };
    },

    /**
     * @method formatWFSFeaturesForInfoBox
     */
    formatWFSFeaturesForInfoBox  : function(wfsLayers) {
        var result = [];
        var type = "wfslayer";

        var layerId;
        var layer;
        var layerName;
        var markup;

        for(var x = 0; x < wfsLayers.length; x++) {
            if(wfsLayers[x].features == "empty") {
                continue;
            }
            // define layer specific information
            layerId = wfsLayers[x].layerId;
            layer = this.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            if(layer == null) {
                continue;
            }
            layerName = layer ? layer.getName() : '';

            var features = [];
            var feature;
            var values;
            var fields = layer.getFields().slice(0);

            // replace fields with locales
            var locales = layer.getLocales();
            if(locales != null) {
                for(var l = 0; l < fields.length; l++) {
                    if(locales.length >= 1) {
                        fields[l] = locales[l];
                    }
                }
            }

            // helper function for visibleFields
            var contains = function(a, obj) {
                for(var i = 0; i < a.length; i++) {
                    if(a[i] == obj)
                        return true;
                }
                return false;
            }

            var hiddenFields = [];
            hiddenFields.push("__fid");
            hiddenFields.push("__centerX");
            hiddenFields.push("__centerY");

            // key:value
            for(var i = 0; i < wfsLayers[x].features.length; i++) {
                feature = {};
                values = wfsLayers[x].features[i];
                for(var j = 0; j < fields.length; j++) {
                    if(contains(hiddenFields, fields[j])) { // skip hidden
                        continue;
                    }
                    if(values[j] == null || values[j] == "") {
                        feature[fields[j]] = "";
                    } else {
                        feature[fields[j]] = values[j];
                    }
                }
                features.push(feature);
            }

            for(var k = 0; k < features.length; k++) {
                markup = this._json2html(features[k]);

                result.push({
                    markup : markup,
                    layerId : layerId,
                    layerName : layerName,
                    type : type
                });
            }
        }

        return result;
    },

    /**
     * @method _json2html
     * @private
     * Parses and formats a WFS layers JSON GFI response
     * @param {Object} node response data to format
     * @return {String} formatted HMTL
     */
    _json2html : function(node) {
        if (node == null) {
            return '';
        }
        var even = true;

        var html = this.template.getinfo_result_table.clone();
        var row = null;
        var keyColumn = null;
        var valColumn = null;

        for (var key in node) {
            var value = node[key];
            if(!value || !key) {
                continue;
            }
            var vType = (typeof value).toLowerCase();
            var vPres = ''
            switch (vType) {
                case 'string':
                    if (value.indexOf('http://') == 0) {
                        valpres = this.template.link_outside.clone();
                        valpres.attr('href', value);
                        valpres.append(value);
                    } else {
                        valpres = value;
                    }
                    break;
                case 'undefined':
                    valpres = 'n/a';
                    break;
                case 'boolean':
                    valpres = ( value ? 'true' : 'false');
                    break;
                case 'number':
                    valpres = '' + value + '';
                    break;
                case 'function':
                    valpres = '?';
                    break;
                case 'object':
                    // format array
                    if(jQuery.isArray(value)) {
                        var valueDiv = this.template.wrapper.clone();
                        for(var i=0; i < value.length;++i) {
                            var innerTable = this._json2html(value[i]);
                            valueDiv.append(innerTable);
                        }
                        valpres = valueDiv;
                    } else {
                        valpres = this._json2html(value);
                    }
                    break;
                default:
                    valpres = '';
            }
            even = !even;

            row = this.template.tableRow.clone();
            if(!even) {
                row.addClass("odd");
            }

            keyColumn = this.template.tableCell.clone();
            keyColumn.append(key);
            row.append(keyColumn);

            valColumn = this.template.tableCell.clone();
            valColumn.append(valpres);
            row.append(valColumn);

            html.append(row);
        }
        return html;
    },

    /**
     * @method preselectLayers
     */
    preselectLayers : function(layers) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if (!layer.hasFeatureData()) {
                continue;
            }

            this.getSandbox().printDebug("[WfsLayerPlugin] preselecting " + layerId);
        }
    },

    /**
     * @method removeMapLayerFromMap
     * @param {Object} layer
     */
    removeMapLayerFromMap : function(layer) {
        var removeLayers = this.getOLMapLayers(layer);
        for (var i = 0; i < removeLayers.length; i++) {
            removeLayers[i].destroy();
        }
    },

    /**
     * @method getOLMapLayers
     * @param {Object} layer
     */
    getOLMapLayers : function(layer) {
        if (layer && !layer.hasFeatureData()) {
            return;
        }
        var layerPart = '';
        if(layer) {
            layerPart = layer.getId();
        }

        var wfsReqExp = new RegExp('wfs_layer_' + layerPart + '*', 'i');
        return this._map.getLayersByName(wfsReqExp);
    },

    /**
     * @method getOLMapLayer
     * @param {Object} layer
     * @param {String} type
     */
    getOLMapLayer : function(layer, type) {
        if (!layer || !layer.hasFeatureData()) {
            return null;
        }

        var layerName = "wfs_layer_" + layer.getId() + "_" + type;
        var wfsReqExp = new RegExp(layerName);
        return this._map.getLayersByName(wfsReqExp)[0];
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
     * @param {String} layerPostFix
     *           postfix so we can identify the tile as highlight/normal
     * @param {Boolean} keepPrevious
     *           true to not delete existing tile
     */
    drawImageTile : function(layer, imageUrl, imageBbox, imageSize, layerPostFix, keepPrevious) {
        var layerName = "wfs_layer_" + layer.getId() + "_" + layerPostFix;
        var boundsObj = new OpenLayers.Bounds(imageBbox);

        /** Safety checks */
        if (!(imageUrl && layer && boundsObj)) {
            return;
        }

        var layerScales = this.mapModule.calculateLayerScales(
            layer.getMaxScale(),
            layer.getMinScale()
        );

        var layerIndex = null;

        var ols = new OpenLayers.Size(imageSize.width, imageSize.height);

        if (layerPostFix == "highlight") {
            var wfsMapImageLayer = new OpenLayers.Layer.Image(
                layerName,
                imageUrl,
                boundsObj,
                ols,
                {
                    scales : layerScales,
                    transparent : true,
                    format : "image/png",
                    isBaseLayer : false,
                    displayInLayerSwitcher : false,
                    visibility : true,
                    buffer : 0
                }
            );

            wfsMapImageLayer.opacity = layer.getOpacity() / 100;
            this._map.addLayer(wfsMapImageLayer);
            wfsMapImageLayer.setVisibility(true);
            wfsMapImageLayer.redraw(true); // also for draw

            // if removed set to same index [but if wfsMapImageLayer created in add (sets just in draw - not needed then here)]
            if (layerIndex !== null && wfsMapImageLayer !== null) {
                this._map.setLayerIndex(wfsMapImageLayer, layerIndex);
            }

            // highlight picture on top of normal layer images
            var normalLayerExp = new RegExp("wfs_layer_" + layer.getId() + "_normal");
            var highlightLayerExp = new RegExp("wfs_layer_" + layer.getId() + "_highlight");
            var normalLayer = this._map.getLayersByName(normalLayerExp);
            var highlightLayer = this._map.getLayersByName(highlightLayerExp);
            if (normalLayer.length > 0 && highlightLayer.length > 0) {
                var normalLayerIndex = this._map.getLayerIndex(normalLayer[normalLayer.length - 1]);
                this._map.setLayerIndex(highlightLayer[0], normalLayerIndex+10);
            }
        } else { // "normal"
            var BBOX = boundsObj.toArray(false);
            var bboxKey = BBOX.join(',');

            var style = layer.getCurrentStyle().getName();
            var tileToUpdate = this._tilesToUpdate.mget(layer.getId(), bboxKey, "");
                          
            if (tileToUpdate && imageUrl) {
                this._tileData.mput(layer.getId(), bboxKey, style, imageUrl);
                tileToUpdate.draw(); // QUEUES updates! 
            } else if (imageUrl) {
                //console.log("UPDATING DATA FOR NON-EXISTING TILE?", bboxKey, style);
                this._tileData.mput(layer.getId(), bboxKey, style, imageUrl);
            }
        }

    },

    /**
     * @method addMapLayerToMap
     *
     * @param {Object} layer
     * @param {String} layerPostFix
     */
    addMapLayerToMap : function(_layer, layerPostfix) {
        var layerName = "wfs_layer_" + _layer.getId() + "_" + layerPostfix;
        var layerScales = this.getMapModule().calculateLayerScales(_layer.getMaxScale(), _layer.getMinScale());

        // default params and options
        var defaultParams = {
            layers : '',
            transparent : true,
            id : _layer.getId(),
            styles : _layer.getCurrentStyle().getName(),
            format : "image/png"
        }, defaultOptions = {
            layerId : _layer.getId(),
            scales : layerScales,
            isBaseLayer : false,
            displayInLayerSwitcher : true,
            visibility : true,
            buffer : 0,
            _plugin : this,

            getURL : function(bounds, theTile) {
                bounds = this.adjustBounds(bounds);
                
                var BBOX = bounds.toArray(false);
                var bboxKey = BBOX.join(',');
                
                var layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(this.layerId);
                var style = layer.getCurrentStyle().getName();
                var dataForTile = this._plugin._tileData.mget(this.layerId, bboxKey, style);
                if (dataForTile) {
                     this._plugin._tilesToUpdate.mdel(this.layerId, bboxKey, ""); // remove from drawing
                } else {
                    this._plugin._tilesToUpdate.mput(this.layerId, bboxKey, "", theTile); // put in drawing
                    // DEBUG image (red)
                    //dataForTile = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
                }

                return dataForTile;
            },

            addTile : function(bounds, position) {
                var tileOpts = OpenLayers.Util.extend({}, this.tileOptions);
                OpenLayers.Util.extend(tileOpts, {
                    setBounds: function(bounds) {
                        bounds = bounds.clone();
                        if (this.layer.map.baseLayer.wrapDateLine) {
                            var worldExtent = this.layer.map.getMaxExtent(),
                                tolerance = this.layer.map.getResolution();
                            bounds = bounds.wrapDateLine(worldExtent, {
                                leftTolerance: tolerance,
                                rightTolerance: tolerance
                            });
                        }
                        this.bounds = bounds;
                    },
                    renderTile : function() {
                        this.layer.div.appendChild(this.getTile());
                        if (this.layer.async) {
                            // Asynchronous image requests call the asynchronous getURL method
                            // on the layer to fetch an image that covers 'this.bounds'.
                            var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
                            this.layer.getURLasync(this.bounds, function(url) {
                                if (id == this.asyncRequestId) {
                                    this.url = url;
                                    this.initImage();
                                }
                            }, this);
                        } else {
                            // synchronous image requests get the url immediately.
                            this.url = this.layer.getURL(this.bounds, this);
                            this.initImage();
                        }
                    }
                });

                var tile = new this.tileClass(this, position, bounds, null, this.tileSize, tileOpts);

                this._plugin._tiles[tile.id] = tile;

                var BBOX = bounds.toArray(false);
                var bboxKey = BBOX.join(',');
                var layer = this._plugin.getSandbox().findMapLayerFromSelectedMapLayers(this.layerId);
                var style = layer.getCurrentStyle().getName();
                this._plugin._tilesToUpdate.mput(this.layerId, bboxKey, "", tile);

                tile.events.register("beforedraw", this, this.queueTileDraw);
                return tile;
            },

            destroyTile : function(tile) {
                this.removeTileMonitoringHooks(tile);
                delete this._plugin._tiles[tile.id];

                tile.destroy();
            }
        }, layerParams = _layer.getParams(), layerOptions = _layer.getOptions();

        // override default params and options from layer
        for (var key in layerParams) {
            defaultParams[key] = layerParams[key];
        }
        for (var key in layerOptions) {
            defaultOptions[key] = layerOptions[key];
        }

        var openLayer = new OpenLayers.Layer.WMS(layerName, '', defaultParams, defaultOptions);
        openLayer.opacity = _layer.getOpacity() / 100;

        this._map.addLayer(openLayer);
    },

    /**
     * @method removeHighlightImage
     *
     * Removes a tile from the Openlayers map
     *
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that we want to update
     */
    removeHighlightImage : function(layer) {
        var layerName = "wfs_layer_" + layer.getId() + "_highlight";

        var removeLayers = this._map.getLayersByName(layerName);
        for ( var i = 0; i < removeLayers.length; i++) {
            layerIndex = this._map.getLayerIndex(removeLayers[i]);
            removeLayers[i].destroy();
        }
    },

// from tilesgridplugin

    /**
     * @method createTilesGrid
     *
     * Creates an invisible layer to support Grid operations
     * This manages sandbox Map's TileQueue
     *
     */
    createTilesGrid: function() {
        var tileQueue = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.domain.TileQueue");

        var strategy = Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.plugin.QueuedTilesStrategy",{
                tileQueue: tileQueue
        });
        strategy.debugGridFeatures = false;
        this.tileQueue = tileQueue;
        this.tileStrategy = strategy;

        var styles = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                pointRadius: 3,
                strokeColor: "red",
                strokeWidth: 2,
                fillColor: '#800000'
            }),
            "tile": new OpenLayers.Style({
                strokeColor: "#008080",
                strokeWidth: 5,
                fillColor: "#ffcc66",
                fillOpacity: 0.5
            }),
            "select": new OpenLayers.Style({
                fillColor: "#66ccff",
                strokeColor: "#3399ff"
            })
        });

        this._tilesLayer = new OpenLayers.Layer.Vector(
                "Tiles Layer", {
                    strategies: [strategy],
                    styleMap: styles,
                    visibility: true
                });
        this._map.addLayer(this._tilesLayer);
        this._tilesLayer.setOpacity(0.3);
    },

    getTileSize : function() {
        var OLGrid = this.tileStrategy.getGrid().grid;
        this.tileSize = null;

        if (OLGrid) {
            this.tileSize = {};
            this.tileSize.width = OLGrid[0][0].size.w;
            this.tileSize.height = OLGrid[0][0].size.h;
        }

        return this.tileSize;
    },

    getGrid : function() {
        var grid = null;

        // get grid information out of tileStrategy
        this.tileStrategy.update();
        var OLGrid = this.tileStrategy.getGrid().grid;

        if (OLGrid) {
            grid = { rows: OLGrid.length, columns: OLGrid[0].length, bounds: [] };
            for(var iRow=0, len = OLGrid.length; iRow < len; iRow++) {
                var row = OLGrid[iRow];
                for(var iCol=0, clen = row.length; iCol < clen; iCol++) {
                    var tile = row[iCol];

                    // if failed grid
                    if(typeof tile.bounds.left == "undefined" ||
                        typeof tile.bounds.bottom == "undefined" ||
                        typeof tile.bounds.right == "undefined" ||
                        typeof tile.bounds.top == "undefined") {
                        return null;
                    }

                    // left, bottom, right, top
                    var bounds = [];
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
    getPrintTiles : function() {
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
    setPrintTile : function(layer, bbox, imageUrl) {
        if(typeof this._printTiles[layer.getId()] == "undefined") {
            this._printTiles[layer.getId()] = [];
        }
        this._printTiles[layer.getId()].push({"bbox": bbox, "url": imageUrl});
    },

    /*
     * @method refreshCaches
     */
    refreshCaches : function() {
        this._tileData.purgeOffset(4*60*1000);
    },


    /*
     * @method getNonCachedGrid
     *
     * @param grid
     */
    getNonCachedGrid : function(layerId, grid) {
        var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        var style = layer.getCurrentStyle().getName();
        var result = [];
        for(var i = 0; i < grid.bounds.length; i++) {
            var bboxKey = grid.bounds[i].join(',');
            var dataForTile = this._tileData.mget(layerId, bboxKey, style);
            if(!dataForTile) {
                result.push(grid.bounds[i]);
            }
        }

        return result;
    },

    /*
     * @method isWFSOpen
     */
    isWFSOpen : function() {
        if(this._isWFSOpen > 0)
            return true;
        return false;
    },

    /*
     * @method getLayerCount
     */
    getLayerCount : function() {
        return this._isWFSOpen;
    },

    /**
     * @method _isArrayEqual
     * @param {String[]} current
     * @param {String[]} old
     *
     * Checks if the arrays are equal
     */
    isArrayEqual : function(current, old) {
        if(old.length != current.length) { // same size?
            return false;
        }

        for(var i = 0; i < current.length; i++) {
            if(current[i] != old[i]) {
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
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization("MapWfs2");
        }
        if(key) {
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
    showErrorPopup : function(message, layer, once) {
        if(once == true) {
            if(this.errorTriggers[message]) {
                if(this.errorTriggers[message].count >= this.errorTriggers[message].limit) {
                    return;
                }
                this.errorTriggers[message].count++;
            } else {
                if(this.errorTriggers[message + "_" + layer.getId()]) {
                    return;
                } else {
                    this.errorTriggers[message + "_" + layer.getId()] = true;
                }
            }
        }

        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var popupLoc = this.getLocalization("error").title;
        var content = this.getLocalization("error")[message]; 
        if(layer) {
            content = content.replace(/\{layer\}/, layer.getName());
        }
        var okBtn = dialog.createCloseButton( this.getLocalization().button.close);

        okBtn.addClass('primary');
        dialog.addClass('error_handling');
        dialog.show(popupLoc, content, [okBtn]);
        dialog.fadeout(5000);
    }

}, {
    'protocol' : [ "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
