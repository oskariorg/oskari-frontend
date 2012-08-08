/**
 * @class Oskari.mapframework.service.OgcSearchService
 * @deprecated 
 */
Oskari.clazz.define('Oskari.mapframework.service.OgcSearchService', function(endpointUrl, core) {

    /** Size of tile */
    this._TILE_SIZE_IN_PIXELS = 256;

    this._componentName = 'WfsRequestTiler';

    this._mapPollingInterval = 100;

    /** Timer interval for wfs grid */
    this._gridPollingInterval = 200;

    /** How many simultaneous png request can there be */
    this._simultaneousPngRequest = 4;

    this._wfsMapUpdateRequests = {};

    this._wfsMapHighlightRequest = null;

    this._gridQuery = null;
    this._wfsGridUpdateRequest = null;

    this._tileCount = 16;

    this._core = core;

    /** If this is true, request tiler will send RearrangeSelectedMapLayerRequest
     * after all
     * WFS map tiles are loaded */
    this._doMapLayerReArrange = false;

    var sandbox = Oskari.$('sandbox');
    //this.endpointUrl = endpointUrl;
    this.endpointUrl = sandbox.getAjaxUrl();
    this.pngUrl = this.endpointUrl.replace('ajax.jsp&', 'png.jsp');
    this.pngUrl = this.pngUrl.replace('p_p_lifecycle=1', 'p_p_lifecycle=2');
    this.pngUrl = this.pngUrl.replace('p_p_state=exclusive', 'p_p_state=normal');
    
    //this._wfsRequestTiler = wfsRequestTiler;

    /*
     setInterval(function() { this.processMapQueue(); },
     this._mapPollingInterval);
     setInterval(function() { this.processGridQueue(); },
     this._gridPollingInterval);
     setInterval(function() { this.processHighlightQueue(); },
     this._mapPollingInterval);*/

}, {
    __qname : "Oskari.mapframework.service.OgcSearchService",
    getQName : function() {
        return this.__qname;
    },
    __name : "OgcSearchService",
    getName : function() {
        return this.__name;
    },
    processGetFeaturesJsonFlowForTableFormat : function(mapLayer, onReady, minX, minY, maxX, maxY, mapWidth, mapHeight, wfsTableQueryId) {
        var mapLayerId = mapLayer.getId();

        var url = "&flow_pm_wfsLayerId=" + mapLayerId + "&flow_pm_bbox_min_x=" + minX + "&flow_pm_bbox_min_y=" + minY + "&flow_pm_bbox_max_x=" + maxX + "&flow_pm_bbox_max_y=" + maxY + "&flow_pm_map_width=" + mapWidth + "&flow_pm_map_heigh=" + mapHeight + "&flow_pm_map_wfs_query_id=" + wfsTableQueryId + "&actionKey=QUERY_FIND_RAW_DATA_TO_TABLE";
		this._gridQuery =  jQuery.ajax({
            dataType : "json",
            type : "POST",
            url : this.endpointUrl + url,
            data : url,
            success : onReady
        });
    },
    processGetFeatureTypeIdsJsonForTableFormat : function(parameters, onReady, mapWidth, mapHeight) {
        var url = parameters + "&flow_pm_map_width=" + mapWidth + "&flow_pm_map_heigh=" + mapHeight + "&actionKey=GET_HIGHLIGHT_WFS_FEATURE_IMAGE_BY_POINT";

        jQuery.ajax({
            dataType : "json",
            type : "POST",
            url : this.endpointUrl + url,
            data : url,
            success : onReady
        });
    },
    processGetFeaturesPngImageForMapFormat : function(mapLayer, onReady, minX, minY, maxX, maxY, mapWidth, mapHeight, mapZoom) {
        var mapLayerId = mapLayer.getId();

        var url = this.pngUrl + "&flow_pm_wfsLayerId=" + mapLayerId + "&flow_pm_bbox_min_x=" + minX + "&flow_pm_bbox_min_y=" + minY + "&flow_pm_bbox_max_x=" + maxX + "&flow_pm_bbox_max_y=" + maxY + "&flow_pm_map_width=" + mapWidth + "&flow_pm_map_heigh=" + mapHeight + "&flow_pm_zoom_level=" + mapZoom + "&actionKey=GET_PNG_MAP";

        onReady(url);
    },
    processGetHighlightWFSFeatureImageUrl : function(wfsLayerId, wfsFeatureId, minX, minY, maxX, maxY, mapWidth, mapHeight) {
        if(wfsLayerId !== null && wfsFeatureId !== null) {
            var url = this.pngUrl + "&flow_pm_wfsLayerId=" + wfsLayerId + "&wfsFeatureId=" + wfsFeatureId + "&flow_pm_bbox_min_x=" + minX + "&flow_pm_bbox_min_y=" + minY + "&flow_pm_bbox_max_x=" + maxX + "&flow_pm_bbox_max_y=" + maxY + "&flow_pm_map_width=" + mapWidth + "&flow_pm_map_heigh=" + mapHeight + "&actionKey=GET_HIGHLIGHT_WFS_FEATURE_IMAGE";

            return url;
        } else {
            throw "Cannot do processGetHighlightWFSFeatureImageUrl " + "because wfsLayerId or wfsFeatureId is null.";
        }
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
    removeWFSLayerGridRequests : function(wfsLayer) {
    	if(this._gridQuery) {
    		this._gridQuery.abort();
    	}
        this._wfsGridUpdateRequest = null;
    },
    removeWFSMapHighlightRequest : function() {
        this._wfsMapHighlightRequest = null;
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

        var tileRequestBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.WfsTileRequest');

        for(var i = 0; i < splittedBboxes.length; i++) {
            var wfsTileRequest = tileRequestBuilder(wfsLayer, splittedBboxes[i], mapWidth, mapHeight, creator, i);
            this._wfsMapUpdateRequests[id].push(wfsTileRequest);
        }

        this._doMapLayerReArrange = true;
    },
    scheduleWFSGridUpdate : function(wfsLayer, bbox, mapWidth, mapHeight, creator) {
        this._wfsGridUpdateRequest = Oskari.clazz.create('Oskari.mapframework.domain.WfsGridScheduledRequest', wfsLayer, bbox, mapWidth, mapHeight, creator);
       	var me = this;
       	// throttle requests with small delay
		setTimeout(function() { me.processGridQueue(); }, this._gridPollingInterval);
    },
    scheduleWFSMapHighlightUpdate : function(request) {
        this._wfsMapHighlightRequest = request;
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
        var map = this._core.getMap();
        var array = [];
        if(map) {
            var tileQueue = map.getTileQueue();
            if(tileQueue) {
                array = tileQueue.getQueue();
            } else {
                // alert("[OgcSearchService.splitBox] map.getTileQueue() is
                // null!");
            }
        } else {
            // alert("[OgcSearchService.splitBox] _core.getMap() is null!");
        }
        return array;
    },
    processMapQueue : function() {

        this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                              " Looping this._wfsMapUpdateRequests...");

        for(var id in this._wfsMapUpdateRequests) {
            var requestArray = this._wfsMapUpdateRequests[id];
            if(requestArray !== null && requestArray.length > 0) {
                this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                                      " Got requestArray of size " + 
                                      requestArray.length + " for id " + id);
                var request = requestArray[0];
                this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                                      " Creating request for '" + 
                                      request.getMapLayer().getName() + "'");
                var core = this._core;

                // Create png request
                var bbox = request.getBbox();
                var mapZoom = core._map.getZoom();

                this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                                      " Calling" + 
                                      " processGetFeaturesPngImageForMapFormat" + 
                                      " with");
                this._core.printDebug("     request.getMapLayer() : " + 
                                      request.getMapLayer().getName());
                                      
                this._core.printDebug("          bbox.bounds.left : " + bbox.bounds.left);
                this._core.printDebug("        bbox.bounds.bottom : " + bbox.bounds.bottom);
                this._core.printDebug("         bbox.bounds.right : " + bbox.bounds.right);
                this._core.printDebug("           bbox.bounds.top : " + bbox.bounds.top);
                this._core.printDebug("      _TILE_SIZE_IN_PIXELS : " + this._TILE_SIZE_IN_PIXELS);
                this._core.printDebug("                   mapZoom : " + mapZoom);
                
                var mapLayerId = request.getMapLayer().getId();
                
                
                var url = this.pngUrl + 
                    "&flow_pm_wfsLayerId=" + mapLayerId + 
                    "&flow_pm_bbox_min_x=" + bbox.bounds.left + 
                    "&flow_pm_bbox_min_y=" + bbox.bounds.bottom + 
                    "&flow_pm_bbox_max_x=" + bbox.bounds.right + 
                    "&flow_pm_bbox_max_y=" + bbox.bounds.top + 
                    "&flow_pm_map_width=" + this._TILE_SIZE_IN_PIXELS + 
                    "&flow_pm_map_heigh=" + this._TILE_SIZE_IN_PIXELS + 
                    "&flow_pm_zoom_level=" + mapZoom + 
                    "&actionKey=GET_PNG_MAP";
                    
                var requestedLayerName = "WFS_LAYER_IMAGE_" + mapLayerId + 
                                         "_" + request.getSequenceNumber();
                var event = 
                    core.getEventBuilder('AfterWfsGetFeaturesPngImageForMapEvent')
                                        (request.getMapLayer(), 
                                         url, 
                                         request.getBbox(), 
                                         requestedLayerName);
                core.copyObjectCreatorToFrom(event, request);
                core.dispatch(event);

                /* Remove handled element*/
                this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                                      " removing handled element");
                requestArray.splice(0, 1);

                /* delete empty array */
                if(requestArray.length === 0) {
                    delete requestArray;
                    this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                                          " deleting empty requestArray");
                }
                /* Let next run get next element */
                return;
            }
        }

        /* Check rearrange */
        this._core.printDebug("[OGCSearchService.processMapQueue]" + 
                              " _doMapLayerReArrange is " + 
                              this._doMapLayerReArrange);
        if(this._doMapLayerReArrange) {
            var b = this._core.getRequestBuilder('RearrangeSelectedMapLayerRequest');
            var r = b();
            this._core.processRequest(r);
            this._doMapLayerReArrange = false;
        }

    },
    processGridQueue : function() {
        /** Get json for table */
        var request = this._wfsGridUpdateRequest;
        var core = this._core;

        if(request == null) {
            /* No scheduled grid updates */
            return;
        }
        // cancel existing request
    	if(this._gridQuery) {
    		this._gridQuery.abort();
    	}
        try {
            core.actionInProgressWfsGrid();
            var onReady = function(response) {
                if(response.error == "true") {
                    core.printWarn("Error while querying data to table.");
                }

                /* Check at wfs query id is same at latest */
                if(core.getLatestWfsTableQueryId() == parseInt(response.wfsQueryId) || response.error == "true") {
                    /* Check at getted json response is same as selected wfs
                     * layer */
                    if(core.isMapLayerAlreadyHighlighted(request.getMapLayer().getId())) {
                        var event = core.getEventBuilder('AfterWfsGetFeaturesJsonFlowForTableFormatEvent')(request.getMapLayer(), response, request.getBbox());
                        core.copyObjectCreatorToFrom(event, request);
                        core.dispatch(event);
                    } else {
                        core.printWarn("WFS feature response json layer (" + request.getMapLayer().getName() + ") not match of highlighted layer --> Skipping response.");
                        core.processRequest(core.getRequestBuilder('ActionReadyRequest')("WFS_GRID", false));
                    }

                } else {
                    core.printWarn("WFS GetFeaturesJsonFlowForTableFormat response id not match to latest wfs query id --> Skipping response.");
                }
            };
            //console(request.getBbox().left +','+ request.getBbox().bottom +','+
            // request.getBbox().right +','+ request.getBbox().top);
            this.processGetFeaturesJsonFlowForTableFormat(request.getMapLayer(), onReady, request.getBbox().left, request.getBbox().bottom, request.getBbox().right, request.getBbox().top, request.getMapWidth(), request.getMapHeight(), core.generateWfsTableQueryId());
        } finally {
            /* Request handled */
            this._wfsGridUpdateRequest = null;
        }
    },
    processHighlightQueue : function() {
        var request = this._wfsMapHighlightRequest;

        if(request === null) {
            /* No scheduled grid updates */
            return;
        }
        try {

            /*
             var mapWidth = this._core._openLayersMapComponent.getSize().w;
             var mapHeight = this._core._openLayersMapComponent.getSize().h;
             */

            var featureId = request.getWFSFeatureId();
            var layer = this._core.findMapLayerFromAllAvailable(request.getMapLayerId());

            /* Safety check */
            if(!layer.isLayerOfType('WFS')) {
                throw "Trying to highlight feature from layer that is not WFS layer!";
            }

            var core = Oskari.$().sandbox._core;

            var bbox = core._map.getBbox();

            var mapWidth = core._map.getWidth();
            var mapHeight = core._map.getHeight();

            var url = this.processGetHighlightWFSFeatureImageUrl(layer.getId(), featureId, bbox.left, bbox.bottom, bbox.right, bbox.top, mapWidth, mapHeight);

            var event = this._core.getEventBuilder('AfterWfsGetFeaturesPngImageForMapEvent')(layer, url, this._core._map.getBbox(), "HIGHLIGHTED_FEATURE");
            this._core.copyObjectCreatorToFrom(event, request);
            this._core.dispatch(event);
        } finally {
            /* Request handled */
            this._wfsMapHighlightRequest = null;
        }
    },
    startPollers : function() {
        for( i = 0; i < this._tileCount; i++) {
            this.processMapQueue();
        }
    }
    //coreMehods end
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */