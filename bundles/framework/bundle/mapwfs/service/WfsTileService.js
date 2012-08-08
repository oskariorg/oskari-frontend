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
    //this.endpointUrl = endpointUrl;
    this.endpointUrl = this.sandbox.getAjaxUrl();
    this.pngUrl = this.endpointUrl.replace('ajax.jsp&', 'png.jsp');
    this.pngUrl = this.pngUrl.replace('p_p_lifecycle=1', 'p_p_lifecycle=2');
    this.pngUrl = this.pngUrl.replace('p_p_state=exclusive', 'p_p_state=normal');
}, {
    __qname : "Oskari.mapframework.bundle.mapwfs.service.WfsTileService",
    getQName : function() {
        return this.__qname;
    },
    __name : "WfsTileService",
    getName : function() {
        return this.__name;
    },
    processGetFeaturesPngImageForMapFormat : function(mapLayer, onReady, minX, minY, maxX, maxY, mapWidth, mapHeight, mapZoom) {
        var mapLayerId = mapLayer.getId();

        var url = this.pngUrl + "&flow_pm_wfsLayerId=" + mapLayerId + "&flow_pm_bbox_min_x=" + minX + "&flow_pm_bbox_min_y=" + minY + "&flow_pm_bbox_max_x=" + maxX + "&flow_pm_bbox_max_y=" + maxY + "&flow_pm_map_width=" + mapWidth + "&flow_pm_map_heigh=" + mapHeight + "&flow_pm_zoom_level=" + mapZoom + "&actionKey=GET_PNG_MAP";

        onReady(url);
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
                // sandbox.getOpenLayersMapComponent().getZoom();
                // sandbox.printDebug("              imageOnReady : " +
                // imageOnReady);
                /*
                this.sandbox.printDebug("          bbox.bounds.left : " + bbox.bounds.left);
                this.sandbox.printDebug("        bbox.bounds.bottom : " + bbox.bounds.bottom);
                this.sandbox.printDebug("         bbox.bounds.right : " + bbox.bounds.right);
                this.sandbox.printDebug("           bbox.bounds.top : " + bbox.bounds.top);
                this.sandbox.printDebug("      _TILE_SIZE_IN_PIXELS : " + this._TILE_SIZE_IN_PIXELS);
                this.sandbox.printDebug("                   mapZoom : " + mapZoom);
*/
                var url = this.pngUrl + 
                        "&flow_pm_wfsLayerId=" + request.getMapLayer().getId() + 
                        "&flow_pm_bbox_min_x=" + bbox.bounds.left + 
                        "&flow_pm_bbox_min_y=" + bbox.bounds.bottom + 
                        "&flow_pm_bbox_max_x=" + bbox.bounds.right + 
                        "&flow_pm_bbox_max_y=" + bbox.bounds.top + 
                        "&flow_pm_map_width=" + this._TILE_SIZE_IN_PIXELS + 
                        "&flow_pm_map_heigh=" + this._TILE_SIZE_IN_PIXELS + 
                        "&flow_pm_zoom_level=" + mapZoom + 
                        "&actionKey=GET_PNG_MAP";

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
            
            var featureId = event.getWfsFeatureIds()[0];
            if(!featureId) {
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
            var url = this.pngUrl + 
                    "&flow_pm_wfsLayerId=" + layer.getId() + 
                    "&wfsFeatureId=" + featureId + 
                    "&flow_pm_bbox_min_x=" + bbox.left + 
                    "&flow_pm_bbox_min_y=" + bbox.bottom + 
                    "&flow_pm_bbox_max_x=" + bbox.right + 
                    "&flow_pm_bbox_max_y=" + bbox.top + 
                    "&flow_pm_map_width=" + mapWidth + 
                    "&flow_pm_map_heigh=" + mapHeight + 
                    "&actionKey=GET_HIGHLIGHT_WFS_FEATURE_IMAGE";
            this.plugin.drawImageTile(layer, url, bbox, "HIGHLIGHTED_FEATURE", event.isKeepSelection());
            
        } finally {
            /* Request handled */
            this._WFSFeaturesSelectedEvent = null;
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