Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.request.MapLayerUpdateRequest', 
    function(layerId, forced) {
    this._layerId = layerId;
    this._forced = forced;
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
    }

}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
