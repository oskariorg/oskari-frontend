Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.MapLayerUpdateRequestHandler', function(sandbox, mapModule) {

    this.sandbox = sandbox;
    this.mapModule = mapModule;
}, {
	
	
    handleRequest : function(core, request) {
        var layerId = request.getLayerId();
        var forced = request.isForced();
        var params = request.getParameters();
        
        var sandbox = this.sandbox;
        var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
            return ;
        }

		if( params && layer.isLayerOfType("WMS") ) {
			var olLayerList = this.mapModule.getOLMapLayers(layerId);
        	var count = 0;
        	if(olLayerList) {
	        	count = olLayerList.length;
    	    	for(var i=0; i < olLayerList.length; ++i) {
        			olLayerList[i].mergeNewParams(params);
	        	}
    	    }
    	    this.sandbox.printDebug("[MapLayerUpdateRequestHandler] WMS layer / merge new params: " + layerId + ", found " + count);
    	    
		} else {             
	        var olLayerList = this.mapModule.getOLMapLayers(layerId);
        	var count = 0;
        	if(olLayerList) {
	        	count = olLayerList.length;
    	    	for(var i=0; i < olLayerList.length; ++i) {
        			olLayerList[i].redraw(forced);
	        	}
    	    }
    	    this.sandbox.printDebug("[MapLayerUpdateRequestHandler] Layer / update layer " + layerId + ", found " + count);
		}        
        
    }
    
   
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
