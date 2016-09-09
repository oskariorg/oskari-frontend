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
        if(data && !data.iconUrl && (data.shape || typeof data.shape === 'number') && typeof data.shape !== 'object') {
        	newData = data;
        }
        // Else format old data to new form and inform user about this
        else {
        	this.sandbox.printWarn('AddMarkerRequest data is debricated format, formatted this to the new format before processing request. Please check your request!');
            var shape  = null;
            if(data.iconUrl) {
                shape = data.iconUrl;
            } else if(data.shape && data.shape.data){
                shape = data.shape.data;
            } else if(data.shape) {
                shape = data.shape;
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
        		offsetX: (data.shape && data.shape.x && !isNaN(data.shape.x)) ? data.shape.x : null,
        		offsetY: (data.shape && data.shape.y && !isNaN(data.shape.y)) ? data.shape.y : null
        	};
    	}

        // validations
        if(newData.x) {
            newData.x = parseFloat(Oskari.util.sanitize(newData.x));
        }
        if(newData.y) {
            newData.y = parseFloat(Oskari.util.sanitize(newData.y));
        }
        if(newData.color) {
            newData.color = Oskari.util.sanitize(newData.color);
        }
        if(newData.msg) {
            newData.msg = Oskari.util.sanitize(newData.msg);
        }
        if(newData.size) {
            newData.size = parseFloat(Oskari.util.sanitize(newData.size));
        }
        if(newData.stroke) {
            newData.stroke = Oskari.util.sanitize(newData.stroke);
        }
        if(newData.shape) {
            newData.shape = Oskari.util.sanitize(newData.shape);
        }
        if(newData.offsetX) {
            newData.offsetX = parseFloat(Oskari.util.sanitize(newData.offsetX));
        }
        if(newData.offsetY) {
            newData.offsetY = parseFloat(Oskari.util.sanitize(newData.offsetY));
        }
        this.markersPlugin.addMapMarker(newData, request.getID());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
