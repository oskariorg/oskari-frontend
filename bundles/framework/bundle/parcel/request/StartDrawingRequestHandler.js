Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler', function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.drawPlugin.startDrawing({
            drawMode : request.getDrawMode(),
            geometry : request.getGeometry(),
            isModify : request.isModify(),
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
