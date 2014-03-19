/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService', 

/**
 * @method create called automatically on construction
 * @static
 * 
 */
function(instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
    this.ajaxUrl = this.sandbox.getAjaxUrl() + '&action_route=';
    this.createUrl = 'CreateUserLayer';
    this.getUrl = 'GetUserLayers';
}, {
    __name: "MyPlacesImport.MyPlacesImportService",
    __qname : "Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService",

    getQName : function() {
        return this.__qname;
    },

    getName: function() {
        return this.__name;
    },

    /**
     * @method init
     * Initializes the service
     */
    init: function() {
    },

    getFileImportUrl: function() {
        return this.ajaxUrl + this.createUrl;
    },

    getUserLayers: function(successCb, errorCb, id) {
        var me = this,
            url = this.ajaxUrl + this.getUrl;

        if (id) url = (url + '&id=' + id);

        jQuery.ajax({
            url : url,
            type : 'GET',
            dataType : 'json',
            beforeSend: function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success: function(response) {
                if (response) {
                    me._addLayersToService(response.userlayers, successCb);
                }
            },
            error: function(jqXHR, textStatus) {
                if (typeof errorCb === 'function' && jqXHR.status !== 0) {
                    errorCb(jqXHR, textStatus);
                }
            }
        });
        // TODO: get the user's layers and act accordingly
    },
    _addLayersToService: function(layers, cb) {
        var me = this;
        _.each(layers, function(layerJson) {
            me.addLayerToService(layerJson);
        });
        if (_.isFunction(cb)) cb();
    },
    addLayerToService: function(layerJson, cb) {
        var mapLayerService = this.sandbox
                .getService('Oskari.mapframework.service.MapLayerService'),
            // Create the layer model
            mapLayer = mapLayerService.createMapLayer(layerJson);
        // Add the layer to the map layer service
        mapLayerService.addLayer(mapLayer);
        if (_.isFunction(cb)) cb(mapLayer);

        return mapLayer;
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});