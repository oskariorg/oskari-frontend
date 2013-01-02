Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StopDrawingRequestHandler', function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        // pressed finished drawing, act like dblclick
        this.drawPlugin.finishSketchDraw();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
