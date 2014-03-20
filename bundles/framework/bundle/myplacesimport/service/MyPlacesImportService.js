/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
    this.urls = {};

    var ajaxUrl = this.sandbox.getAjaxUrl() + '&action_route=';
    this.urls.create = (ajaxUrl + 'CreateUserLayer');
    this.urls.get = (ajaxUrl + 'GetUserLayers');
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
     * Initializes the service (does nothing atm).
     * 
     * @method init
     */
    init: function() {
    },
    /**
     * Returns the url used to send the file data to.
     * 
     * @method getFileImportUrl
     * @return {String}
     */
    getFileImportUrl: function() {
        return this.urls.create;
    },
    /**
     * Retrieves the user layers (with the id param only the specified layer)
     * from the backend and adds them to the map layer service.
     * 
     * @method getUserLayers
     * @param  {Function} successCb (optional)
     * @param  {Function} errorCb (optional)
     * @param  {String} id (optional)
     */
    getUserLayers: function(successCb, errorCb, id) {
        var me = this,
            url = this.urls.get;

        if (id) url += ('&id=' + id);

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
                if (_.isFunction(errorCb) && jqXHR.status !== 0) {
                    errorCb(jqXHR, textStatus);
                }
            }
        });
    },
    /**
     * Adds the layers to the map layer service.
     * 
     * @method _addLayersToService
     * @private
     * @param {JSON[]} layers
     * @param {Function} cb
     */
    _addLayersToService: function(layers, cb) {
        var me = this;
        _.each(layers, function(layerJson) {
            me.addLayerToService(layerJson);
        });
        if (_.isFunction(cb)) cb();
    },
    /**
     * Adds one layer to the map layer service
     * and calls the cb with the added layer model if provided.
     * 
     * @method addLayerToService
     * @param {JSON} layerJson
     * @param {Function} cb (optional)
     */
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