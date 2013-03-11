/**
 * @class Oskari.mapframework.bundle.featuredata.service.GridJsonService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.service.GridJsonService', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            endpointUrl URL which to poll to get WFS Data
 */
function(endpointUrl) {

    // Timer interval for wfs grid
    this._gridPollingInterval = 200;
    this.endpointUrl = endpointUrl;
    this.pendingOperations = {};
    // Latest WFS table query id
    this._wfsTableQueryId = 0;
    
}, {
    __qname : "Oskari.mapframework.bundle.featuredata.service.GridJsonService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    __name : "GridJsonService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method cancelWFSGridUpdateForLayer
     * @param {String} layerId
     * Cancels any pending and aborts requests for WFS data for the given layer
     */
    cancelWFSGridUpdateForLayer : function(layerId) {
        var operation = this.pendingOperations[layerId]; 
        if(operation) {
            if(operation.timer) {
                clearTimeout(operation.timer);
            }
            if(operation.query) {
                operation.query.abort();
            }
            this.pendingOperations[layerId] = null;
            delete this.pendingOperations[layerId];
        }
    },
    /**
     * @method scheduleWFSGridUpdate
     * @param {Oskari.mapframework.domain.WfsLayer} wfsLayer
     * @param {String} features selected on map 
     * @param {Number} mapWidth width of the map window
     * @param {Number} mapHeight height of the map window
     * @param {Function} onReady callback to call when data has been loaded
     * Schedules an update for the WFS grid data. The update will begin after 
     * #_gridPollingInterval ms.
     */
    scheduleWFSGridUpdate : function(wfsLayer, selectionGeometry, mapWidth, mapHeight, onReady) {
        // remove/abort any earlier operation for the layers
        this.cancelWFSGridUpdateForLayer(wfsLayer.getId());
        var params = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.domain.WfsGridUpdateParams', wfsLayer, selectionGeometry, mapWidth, mapHeight, onReady);
        //this._wfsGridUpdateRequest = Oskari.clazz.create('Oskari.mapframework.domain.WfsGridScheduledRequest', wfsLayer, bbox, mapWidth, mapHeight, onReady);
        
        var me = this;
        // throttle requests with small delay
        var timer = setTimeout(function() { 
                me._processGridUpdate(params); 
            }, this._gridPollingInterval);
        
        this.pendingOperations[wfsLayer.getId()] = {
            timer : timer
        }
    },
    /**
     * @method _processGridUpdate
     * @private
     * @param {Oskari.mapframework.bundle.featuredata.domain.WfsGridUpdateParams} params
     * 
     * Calls the #endpointUrl for the WFS grid data with the params given.
     */
    _processGridUpdate : function(params) {
        var me = this;
        var mapLayer = params.getMapLayer();
        
        // clear timer that called this method
        this.pendingOperations[mapLayer.getId()].timer = null;
        delete this.pendingOperations[mapLayer.getId()].timer;
         
        // Get json for table
        var onReady = function(response) {
            me.cancelWFSGridUpdateForLayer(mapLayer.getId());
            if(response.error == "true") {
                //me.sandbox.printWarn("Error while querying data to table.");
                return;
            }

            // Check at wfs query id is same at latest
            if(me._getLatestWfsTableQueryId() == parseInt(response.wfsQueryId)) {
                params.getCallback()(response);
            } else {
                //me.sandbox.printWarn("WFS _processGridUpdate response id not match to latest wfs query id --> Skipping response.");
            }
        };
        var query =  jQuery.ajax({
            dataType : "json",
            type : "POST",
            
            data : {
                layerIds:mapLayer.getId(),
                flow_pm_map_width  : params.getMapWidth(),
                flow_pm_map_height : params.getMapHeight(),
                mode: "data_to_table", 
                geojson : params.getGeometry(),
                flow_pm_map_wfs_query_id : me._generateWfsTableQueryId()
            },
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            
            url : this.endpointUrl + "action_route=GetWfsFeatureData", //url, // "&actionKey=QUERY_FIND_RAW_DATA_TO_TABLE",
            success : onReady
        });
        this.pendingOperations[mapLayer.getId()].query = query;
    },
    /**
     * @method _getLatestWfsTableQueryId
     * @private
     * @return {Number}
     * 
     * Returns the latest query id so we can match it to a response from server.
     * This way we know that we are working with the latest query data and will not overwrite 
     * current data with old one.
     */
    _getLatestWfsTableQueryId : function() {
        return this._wfsTableQueryId;
    },

    /**
     * @method _generateWfsTableQueryId
     * @private
     * @return {Number} 
     * 
     * Updates query id for a new ajax request and returns it
     */
    _generateWfsTableQueryId : function() {
        this._wfsTableQueryId++;
        return this._wfsTableQueryId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});