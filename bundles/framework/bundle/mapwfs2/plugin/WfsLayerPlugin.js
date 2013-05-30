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
    this._io = null;
    this._connection = null;

    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
    this.config = config;
    this.tileSize = null;

    this._mapClickData = { comet: false, ajax: false, wfs: [] };
}, {
    __name : 'WfsLayerPlugin',

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
        this._io = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.Mediator', this.config, this);
        this._connection = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.Connection', this.config, this._io);

        // register domain model
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if(mapLayerService) {
            mapLayerService.registerLayerModel('wfslayer', 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder', sandbox);
            mapLayerService.registerLayerModelBuilder('wfslayer', layerModelBuilder);
        }
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
            var srs = this.getSandbox().getMap().getSrsName();
            var bbox = this.getSandbox().getMap().getExtent();
            var zoom = this.getSandbox().getMap().getZoom();

            /// clean features lists
            var layers = this.getSandbox().findAllSelectedMapLayers(); // get array of AbstractLayer (WFS|WMS..)
            for (var i = 0; i < layers.length; ++i) {
                if (layers[i].isLayerOfType('WFS')) {
                    layers[i].setActiveFeatures([]);
                }
            }

            var grid = this.getGrid();
            if(grid != null) {
                this.getIO().setLocation(srs, [bbox.left,bbox.bottom,bbox.right,bbox.top], zoom, grid);
                this._tilesLayer.redraw();
            }

            var creator = this.getSandbox().getObjectCreator(event);
            this._sandbox.printDebug("[WfsLayerPlugin] got AfterMapMoveEvent from " + creator);
        },

        /**
         * @method AfterMapLayerAddEvent
         * @param {Object} event
         */
        'AfterMapLayerAddEvent' : function(event) {
            // TODO: add style info when ready [check if coming for WFS]
            if(event.getMapLayer().isLayerOfType("WFS")) {
                var styleName = "default";
                if(event.getMapLayer().getCurrentStyle()) {
                    styleName = event.getMapLayer().getCurrentStyle();
                }

                this.getIO().addMapLayer(
                    event.getMapLayer().getId(),
                    styleName
                );
            }
        },

        /**
         * @method AfterMapLayerRemoveEvent
         * @param {Object} event
         */
        'AfterMapLayerRemoveEvent' : function(event) {
            var layer = event.getMapLayer();
            if(layer.isLayerOfType("WFS")) {
                this.getIO().removeMapLayer(layer.getId());
                this.removeMapLayerFromMap(layer);
            }
        },

        /**
         * @method WFSFeaturesSelectedEvent
         * @param {Object} event
         */
        'WFSFeaturesSelectedEvent' : function(event) {
            if(event.getMapLayer().isLayerOfType("WFS")) {
                this.getIO().highlightMapLayerFeatures(event.getMapLayer().getId(), event.getWfsFeatureIds(), event.isKeepSelection());
            }
        },

        /**
         * @method MapClickedEvent
         * @param {Object} event
         */
        'MapClickedEvent' : function(event) {
            // don't process while moving
            if(this.getSandbox().getMap().isMoving()) {
                return;
            }

            var lonlat = event.getLonLat();
            var keepPrevious = this.getSandbox().isCtrlKeyDown();
            this.getIO().setMapClick(lonlat.lon, lonlat.lat, keepPrevious);
        },

        /**
         * @method GetInfoResultEvent
         * @param {Object} event
         */
        'GetInfoResultEvent' : function(event) {
            //console.log(event, this); // DEBUG

            // TODO: remove this and do changes @ backend when ready (don't get WFS..)
            /*
            var data = event.getData();
            for (var i = 0; i < data.fragments.length; ++i) {
                if(data.fragments[i].type == "wfslayer") {
                    data.fragments.splice(i, 1);
                }
            }
            */

            this._mapClickData.ajax = true;
            this._mapClickData.data = event.getData();
            if(this._mapClickData.comet) {
                console.log("show info - cometd was before");
                this.showInfoBox();
            }

        },

        /**
         * @method AfterChangeMapLayerStyleEvent
         * @param {Object} event
         */
        'AfterChangeMapLayerStyleEvent' : function(event) { // TODO: check out where thrown that doesn't block WFS layers..
            if(event.getMapLayer().isLayerOfType("WFS")) {
                this.getIO().setMapLayerStyle(
                    event.getMapLayer().getId(),
                    event.getMapLayer().getCurrentStyle().getName() // TODO: @BACKEND make sure if changed or coming from the event itself
                );
            }
        },

        /**
         * @method MapLayerVisibilityChangedEvent
         * @param {Object} event
         */
        'MapLayerVisibilityChangedEvent' : function(event) {
            if(event.getMapLayer().isLayerOfType("WFS")) {
                this.getIO().setMapLayerVisibility(
                    event.getMapLayer().getId(),
                    event.getMapLayer().isVisible()
                );
            }
        },

        /**
         * @method AfterChangeMapLayerOpacityEvent
         * @param {Object} event
         */
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },

        /**
         * @method WFSSetFilter
         * @param {Object} event
         */
        'WFSSetFilter' : function(event) {
            /// clean features lists
            var layers = this.getSandbox().findAllSelectedMapLayers(); // get array of AbstractLayer (WFS|WMS..)
            for (var i = 0; i < layers.length; ++i) {
                if (layers[i].isLayerOfType('WFS')) {
                    layers[i].setActiveFeatures([]);
                }
            }

            this.getIO().setFilter(event.getGeoJson());
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
     * @method showInfoBox
     *
     * Wraps data to html and makes ShowInfoBoxRequest
     */
    showInfoBox : function() {
        //console.log(this._mapClickData);
        var wfs = this._mapClickData.wfs;
        var data = this._mapClickData.data;

        // MOVE THIS TO _createInfoBoxContent eg..
        this.templateHeader = jQuery('<div class="getinforesult_header">' +
                '<div class="icon-bubble-left"></div>');
        this.templateHeaderTitle = jQuery('<div class="getinforesult_header_title"></div>');
        var content = {};
        var wrapper = jQuery('<div></div>');
        content.html = '';
        content.actions = {};
        for (var di = 0; di < data.fragments.length; di++) {
            var fragment = data.fragments[di]
            var fragmentTitle = fragment.layerName;
            var fragmentMarkup = fragment.markup;

            var contentWrapper = jQuery('<div></div>');

            var headerWrapper = this.templateHeader.clone();
            var titleWrapper = this.templateHeaderTitle.clone();
            titleWrapper.append(fragmentTitle);
            headerWrapper.append(titleWrapper);
            contentWrapper.append(headerWrapper);


            if (fragmentMarkup) {
                contentWrapper.append(fragmentMarkup);
            }
            wrapper.append(contentWrapper);
        }
        content.html = wrapper;

        var request = this.getSandbox().getRequestBuilder("InfoBox.ShowInfoBoxRequest")(
            data.popupid,
            data.title,
            [content],
            data.lonlat,
            true
        );
        this.getSandbox().request(this, request);
    },

    /**
     * @method preselectLayers
     */
    preselectLayers : function(layers) {
        var sandbox = this._sandbox;

        for ( var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if (!layer.isLayerOfType('WFS')) {
                continue;
            }

            sandbox.printDebug("[WfsLayerPlugin] preselecting " + layerId);
        }
    },

    /**
     * @method afterChangeMapLayerOpacityEvent
     * @param {Object} event
     */
    afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if (!layer.isLayerOfType('WFS')) {
            return;
        }
        var layers = this.getOLMapLayers(layer);
        for ( var i = 0; i < layers.length; i++) {
            layers[i].setOpacity(layer.getOpacity() / 100);

        }
    },

    /**
     * @method removeMapLayerFromMap
     * @param {Object} layer
     */
    removeMapLayerFromMap : function(layer) {
        var removeLayers = this.getOLMapLayers(layer);
        for ( var i = 0; i < removeLayers.length; i++) {
            removeLayers[i].destroy();
        }
    },

    /**
     * @method getOLMapLayers
     * @param {Object} layer
     */
    getOLMapLayers : function(layer) {
        if (layer && !layer.isLayerOfType('WFS')) {
            return;
        }
        var layerPart = '';
        if(layer) {
            layerPart = '_' + layer.getId();
        }

        var wfsReqExp = new RegExp('wfs_layer' + layerPart + '_*', 'i');
        return this._map.getLayersByName(wfsReqExp);
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
        //console.log(layer, imageUrl, imageBbox, layerPostFix, keepPrevious); // TODO: remove
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

        /** remove old wfs layers from map */
        if(!keepPrevious) {
            // TODO: make remove layer methods better so we can use them here
            var removeLayers = this._map.getLayersByName(layerName);
            for ( var i = 0; i < removeLayers.length; i++) {
                layerIndex = this._map.getLayerIndex(removeLayers[i]);
                removeLayers[i].destroy();
            }
        }

        var ols = new OpenLayers.Size(imageSize.width, imageSize.height);

        // TODO: could be optimized by moving to addLayer (or would it work? - just update params here if works.. TEST)
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

        // MAKE A NEW PLUGIN THAT HANDLES "Markers" layer -> GO TO TOP
        /**
        var opLayersLength = this._map.layers.length;
        var changeLayer = this._map.getLayersByName('Markers');
        if (changeLayer.length > 0) {
            this._map.setLayerIndex(changeLayer[0], opLayersLength);
            opLayersLength--;
        }
        **/

        // if removed set to same index [but if wfsMapImageLayer created in add (sets just in draw - not needed then here)]
        if (layerIndex !== null && wfsMapImageLayer !== null) {
            this._map.setLayerIndex(wfsMapImageLayer, layerIndex);
        }

        // highlight picture on top of normal layer images
        if(layerPostFix == "normal") {
            var highlightLayerExp = new RegExp("wfs_layer_" + layer.getId() + "_highlight");
            var highlightLayer = this._map.getLayersByName(highlightLayerExp);
            var normalLayer = this._map.getLayersByName(layerName);

            if (normalLayer.length > 0 && highlightLayer.length > 0) {
                var normalLayerIndex = this._map.getLayerIndex(normalLayer[normalLayer.length - 1]);
                this._map.setLayerIndex(highlightLayer[0], normalLayerIndex+1);
            }
        }
    },

    /**
     * Generates all WFS related queries
     *
     * @param {Object}
     *            mapLayer
     */
    doWfsLayerRelatedQueries : function(mapLayer) {

        if(!mapLayer.isInScale()) {
            return;
        }
        var map = this._sandbox.getMap();
        var bbox = map.getBbox();

        var mapWidth = map.getWidth();
        var mapHeight = map.getHeight();
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
        var me = this;
        var sandbox = me._sandbox;

        var tileQueue =
            Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs2.domain.TileQueue");

        //sandbox.getMap().setTileQueue(tileQueue);

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
    }

}, {
    'protocol' : [ "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
