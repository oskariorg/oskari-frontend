Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug('[Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler] Add Marker');

        // Check debricated data
        var data = request.getData();
        var newData = {};

		// Request data is allready to new format
        if(data && !data.iconUrl && data.shape && typeof data.shape !== 'object') {
        	newData = data;
        }
        // Else format old data to new forma and inform user about this
        else {
        	this.sandbox.printWarn('AddMarkerRequest data is debricated format, formatted this to the new format before processing request. Please check your request!');
            var shape  = null;
            if(data.iconUrl) {
                shape = data.iconUrl;
            } else if(data.shape && data.shape.data){
                shape = data.shape.data;
            }
        	newData = {
        		// Allready supported properties
        		x: data.x,
        		y: data.y,
        		color: data.color,
        		msg: data.msg,
        		size: data.size,
        		stoke: data.stroke,
        		// Converted properties
        		shape: shape,
        		offsetX: (data.shape && data.shape.x) ? data.shape.x : null,
        		offsetY: (data.shape && data.shape.y) ? data.shape.y : null
        	};
    	}
        this.markersPlugin.addMapMarker(newData, request.getID());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
