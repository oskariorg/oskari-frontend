/**
 * @class Oskari.mapframework.bundle.parcel.request.CancelDrawingRequestHandler
 * 
 * Handle cancel drawing cancel request by forwarding the call to the {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin}.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.CancelDrawingRequestHandler', function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    /**
     * @method handleRequest
     * Handle request by forwarding the call to DrawPlugin.
     * @param {Object} core
     * @param {Oskari.mapframework.bundle.parcel.request.SaveDrawingRequest} request Request that is handled.
     */
    handleRequest : function(core, request) {
        // we wish to cancel the drawing without sending further events
        this.drawPlugin.cancelDrawing();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
