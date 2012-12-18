Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.CancelDrawingRequestHandler', function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        // we wish to cancel the drawing without sending further events
        this.drawPlugin.cancelDrawing();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
