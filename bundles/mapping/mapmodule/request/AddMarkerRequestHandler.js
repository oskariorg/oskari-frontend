Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
    this._log = Oskari.log('AddMarkerRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Add Marker');

        // Check debricated data
        const data = request.getData();

        if (typeof data !== 'object') {
            this._log.warn('AddMarkerRequest data object is mandatory. Skipping request!');
            return;
        }
        let newData;
        // format old data to new form and inform user about this
        if (data.iconUrl || typeof data.shape === 'object') {
            this._log.warn('AddMarkerRequest data is in deprecated format. Modifying data format before processing request. Please check your request!');
            let shape;
            if (data.iconUrl) {
                shape = data.iconUrl;
            } else if (data.shape && data.shape.data) {
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
                offsetX: (data.shape && data.shape.x && !isNaN(data.shape.x)) ? data.shape.x : undefined,
                offsetY: (data.shape && data.shape.y && !isNaN(data.shape.y)) ? data.shape.y : undefined
            };
        } else {
            // Request data is allready to new format
            newData = data;
        }

        // validations
        if (newData.x) {
            newData.x = parseFloat(Oskari.util.sanitize(newData.x));
        }
        if (newData.y) {
            newData.y = parseFloat(Oskari.util.sanitize(newData.y));
        }
        if (newData.color) {
            newData.color = Oskari.util.sanitize(newData.color);
        }
        if (newData.msg) {
            newData.msg = Oskari.util.sanitize(newData.msg);
        }
        if (newData.size) {
            newData.size = parseFloat(Oskari.util.sanitize(newData.size));
        }
        if (newData.stroke) {
            newData.stroke = Oskari.util.sanitize(newData.stroke);
        }
        if (newData.shape) {
            newData.shape = Oskari.util.sanitize(newData.shape);
        }
        if (newData.offsetX) {
            newData.offsetX = parseFloat(Oskari.util.sanitize(newData.offsetX));
        }
        if (newData.offsetY) {
            newData.offsetY = parseFloat(Oskari.util.sanitize(newData.offsetY));
        }
        this.markersPlugin.addMapMarker(newData, request.getID());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
