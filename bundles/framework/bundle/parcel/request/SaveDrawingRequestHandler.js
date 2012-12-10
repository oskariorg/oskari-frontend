/**
 * Save has been requested for the parcel.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.SaveDrawingRequestHandler', function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        // pressed save drawing
        this.drawPlugin.saveDrawing();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
