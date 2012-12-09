Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.SaveDrawingRequestHandler', function(sandbox, drawPlugin) {
    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        if (request.isCancel()) {
            // we wish to clear the drawing without sending further events
            this.drawPlugin.stopDrawing();
        } else {
            // pressed save drawing
            this.drawPlugin.saveDrawing();
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
}); 