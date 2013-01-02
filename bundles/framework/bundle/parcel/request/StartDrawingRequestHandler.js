Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler', function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.drawPlugin.startDrawing({
            drawMode : request.getDrawMode()
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
