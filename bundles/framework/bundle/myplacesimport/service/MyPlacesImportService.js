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
        return this.sandbox.getAjaxUrl() + '&action_route=GetAppSetup';
    },

    sendLayerData: function(data, successCb, failureCb) {
        if (_.isFunction(successCb)) successCb();
    },

    sendImportCleanUp: function() {}
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});