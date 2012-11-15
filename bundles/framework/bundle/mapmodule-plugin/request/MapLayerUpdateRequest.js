
/**
 * @class Oskari.framework.mapmodule-plugin.request.MapLayerUpdateRequest
 * 
 * class for requesting map layer update / refresh
 *  
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.request.MapLayerUpdateRequest', 
    function(layerId, forced,optParameters) {
    this._layerId = layerId;
    this._forced = forced;
    this._parameters = optParameters;
}, {
    __name : "MapModulePlugin.MapLayerUpdateRequest",
    getName : function() {
        return this.__name;
    },
    getLayerId : function() {
        return this._layerId;
    },
    isForced : function() {
        // check for null
        if(this._forced) {
            return this._forced;
        }
        return false;
    },
    getParameters: function() {
    	return this._parameters;
    },
    setParameters: function(p) {
    	this._parameters = p;
    }

}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
