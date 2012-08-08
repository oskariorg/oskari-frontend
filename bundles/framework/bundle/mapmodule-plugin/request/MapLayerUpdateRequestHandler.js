Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.MapLayerUpdateRequestHandler', function(sandbox, mapModule) {

    this.sandbox = sandbox;
    this.mapModule = mapModule;
}, {
    handleRequest : function(core, request) {
        var layerId = request.getLayerId();
        var forced = request.isForced();
        var olLayerList = this.mapModule.getOLMapLayers(layerId);
        var count = 0;
        if(olLayerList) {
        	count = olLayerList.length;
        	// found openlayers layer -> do update
        	for(var i=0; i < olLayerList.length; ++i) {
        		olLayerList[i].redraw(forced);
        	}
        }
        
        this.sandbox.printDebug("[MapLayerUpdateRequestHandler] update layer " + layerId + ", found " + count);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
