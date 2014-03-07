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
        // TODO: replace this with the actual upload url
        return this.sandbox.getAjaxUrl() + '&action_route=GetAppSetup';
    },

    sendLayerData: function(data, successCb, failureCb) {
        if (_.isFunction(successCb)) successCb();
        // TODO: send the layer data to backend
        // TODO: add the response layer to the map layer service
    },

    sendImportCleanUp: function() {
        // TODO: send the clean up request to the backend
    },

    getUserLayers: function(id) {
        // TODO: get the user's layers and act accordingly
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});