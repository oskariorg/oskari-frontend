/**
 * @class Oskari.mapframework.bundle.mapwfs.service.WfsTileService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs.service.WfsTileService', 
/** 
 * @method create called automatically on construction
 * @static
 * 
 * @param {Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin} plugin
 *      plugin for callbacks
 */
function(plugin) {
    
    this.plugin = plugin;
    /** Size of tile */
    this._TILE_SIZE_IN_PIXELS = 256;

    this._componentName = 'WfsRequestTiler';

    this._mapPollingInterval = 100;

    /** How many simultaneous png request can there be */
    this._simultaneousPngRequest = 4;

    this._wfsMapUpdateRequests = {};

    this._WFSFeaturesSelectedEvent = null;

    this._tileCount = 16;

    /** If this is true, request tiler will send RearrangeSelectedMapLayerRequest
     * after all
     * WFS map tiles are loaded */
    this._doMapLayerReArrange = false;

    this.sandbox = plugin._sandbox;
    this.endpointUrl = this.sandbox.getAjaxUrl();
}, {
    __qname : "Oskari.mapframework.bundle.mapwfs.service.WfsTileService",
    getQName : function() {
        return this.__qname;
    },
    __name : "WfsTileService",
    getName : function() {
        return this.__name;
    },
    // Core methods start
    scheduleMapLayerRearrangeAfterWfsMapTilesAreReady : function() {
        this._doMapLayerReArrange = true;
    },
    removeWFsLayerRequests : function(wfsLayer) {
        var id = wfsLayer.getId();
        if(this._wfsMapUpdateRequests[id] !== null) {
            var td = this._wfsMapUpdateRequests[id];
            this._wfsMapUpdateRequests[id] = null;
            delete td;
        }
    },
    removeWFSMapHighlightRequest : function() {
        this._WFSFeaturesSelectedEvent = null;
    },
    scheduleWFSMapLayerUpdate : function(wfsLayer, bbox, mapWidth, mapHeight, creator) {

        var id = wfsLayer.getId();
        var oldArray = this._wfsMapUpdateRequests[id];
        if(oldArray !== null) {
            this._wfsMapUpdateRequests[id] = null;
            delete oldArray;
        }
        this._wfsMapUpdateRequests[id] = [];

        var splittedBboxes = this.splitBbox(bbox, mapWidth, mapHeight, this._TILE_SIZE_IN_PIXELS);

        this._tileCount = splittedBboxes.length;

        var tileRequestBuilder = Oskari.clazz.builder('Oskari.mapframework.bundle.mapwfs.domain.WfsTileRequest');

        for(var i = 0; i < splittedBboxes.length; i++) {
            var wfsTileRequest = tileRequestBuilder(wfsLayer, splittedBboxes[i], mapWidth, mapHeight, creator, i);
            this._wfsMapUpdateRequests[id].push(wfsTileRequest);
        }

        this._doMapLayerReArrange = true;
    },
    scheduleWFSMapHighlightUpdate : function(pWFSFeaturesSelectedEvent) {
        this._WFSFeaturesSelectedEvent = pWFSFeaturesSelectedEvent;
        this.processHighlightQueue();
    },
    /**
     * This method will split given bbox to parts.
     *
     * @param {OpenLayers.Bounds} bbox actual OpenLayers.Bounds object that must be splitted
     * @param {Number} mapWidthInPixels Current map width in pixels
     * @param {Number} mapHeightInPixels Current map height in pixels
     * @param {Object} tileSizeInPixels Tile size that should be used
     *
     * @return array of OpenLayers.Bounds bboxes
     */
    splitBbox : function(bbox, mapWidthInPixels, mapHeightInPixels, tileSizeInPixels) {
        var map = this.sandbox.getMap();
        var array = [];
        if(map) {
            var tileQueue = this.plugin.getTileQueue(); //map.getTileQueue();
            if(tileQueue) {
                array = tileQueue.getQueue();
            } else {
                // alert("[WfsTileService.splitBox] map.getTileQueue() is
                // null!");
            }
        } else {
            // alert("[WfsTileService.splitBox] _core.getMap() is null!");
        }
        return array;
    },
    processMapQueue : function() {
        var me = this;

        this.sandbox.printDebug("[WfsTileService.processMapQueue]" + 
                              " Looping this._wfsMapUpdateRequests...");

        for(var id in this._wfsMapUpdateRequests) {
            var requestArray = this._wfsMapUpdateRequests[id];
            if(requestArray !== null && requestArray.length > 0) {
                this.sandbox.printDebug("[WfsTileService.processMapQueue]" + 
                                      " Got requestArray of size " + 
                                      requestArray.length + " for id " + id);
                var request = requestArray[0];
                this.sandbox.printDebug("[WfsTileService.processMapQueue]" + 
                                      " Creating request for '" + 
                                      request.getMapLayer().getName() + "'");
                
                /* Create png request */
                var bbox = request.getBbox();
                var mapZoom = this.sandbox.getMap().getZoom();
                var url = this.pngUrl + 
                        "&flow_pm_wfsLayerId=" + request.getMapLayer().getId() + 
                        "&flow_pm_bbox_min_x=" + bbox.bounds.left + 
                        "&flow_pm_bbox_min_y=" + bbox.bounds.bottom + 
                        "&flow_pm_bbox_max_x=" + bbox.bounds.right + 
                        "&flow_pm_bbox_max_y=" + bbox.bounds.top + 
                        "&flow_pm_map_width=" + this._TILE_SIZE_IN_PIXELS + 
                        "&flow_pm_map_height=" + this._TILE_SIZE_IN_PIXELS + 
                        "&flow_pm_zoom_level=" + mapZoom + 
                        "&action_route=GET_PNG_MAP";

                var requestedLayerName = "WFS_LAYER_IMAGE_" + 
                                         request.getMapLayer().getId() + 
                                         "_" + request.getSequenceNumber();
                me.plugin.drawImageTile(request.getMapLayer(), url, bbox, requestedLayerName);

                /* Remove handled element*/
                this.sandbox.printDebug("[WfsTileService.processMapQueue]" + 
                                      " removing handled element");
                requestArray.splice(0, 1);

                /* delete empty array */
                if(requestArray.length === 0) {
                    delete requestArray;
                    this.sandbox.printDebug("[WfsTileService.processMapQueue]" + 
                                          " deleting empty requestArray");
                }
                /* Let next run get next element */
                return;
            }
        }

        /* Check rearrange */
        this.sandbox.printDebug("[WfsTileService.processMapQueue]" + 
                              " _doMapLayerReArrange is " + 
                              this._doMapLayerReArrange);
        if(this._doMapLayerReArrange) {
            
            var b = this.sandbox.getRequestBuilder('RearrangeSelectedMapLayerRequest');
            var req = b();
            this.sandbox.request(this.plugin, req);
            this._doMapLayerReArrange = false;
        }

    },
    processHighlightQueue : function() {
        var event = this._WFSFeaturesSelectedEvent;

        if(!event) {
            /* No scheduled grid updates */
            return;
        }
        try {

            var layer = event.getMapLayer();

            /* Safety check */
            if(!layer.isLayerOfType('WFS')) {
                throw "Trying to highlight feature from layer that is not WFS layer!";
            }
            
            var featureIdList = event.getWfsFeatureIds();
            if(!featureIdList || featureIdList.length == 0) {
                // clear out any previous selection if nothing selected
                if(!event.isKeepSelection()) {
                    this.plugin.removeHighlightOnMapLayer(layer.getId());
                }
                return;
            }
            var map = this.sandbox.getMap();
            var bbox = map.getBbox();

            var mapWidth = map.getWidth();
            var mapHeight = map.getHeight();
            var me = this;
            var url = me.pngUrl + 
                    "&flow_pm_wfsLayerId=" + layer.getId() + 
                    "&flow_pm_bbox_min_x=" + bbox.left + 
                    "&flow_pm_bbox_min_y=" + bbox.bottom + 
                    "&flow_pm_bbox_max_x=" + bbox.right + 
                    "&flow_pm_bbox_max_y=" + bbox.top + 
                    "&flow_pm_map_width="  + mapWidth + 
                    "&flow_pm_map_height=" + mapHeight + 
                    "&action_route=GET_HIGHLIGHT_WFS_FEATURE_IMAGE";
            var recDraw = function(featureId) {
                me.plugin.drawImageTile(layer, url + "&wfsFeatureId=" + featureId, 
                bbox, "HIGHLIGHTED_FEATURE", event.isKeepSelection() || featureIdList.length > 1);
            }
            for(var i = 0 ; i < featureIdList.length; ++i) {
                recDraw(featureIdList[i]);
            }
            
        } finally {
            /* Request handled */
            //this._WFSFeaturesSelectedEvent = null;
        }
    },
    startPollers : function() {
        for( i = 0; i < this._tileCount; i++) {
            this.processMapQueue();
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});