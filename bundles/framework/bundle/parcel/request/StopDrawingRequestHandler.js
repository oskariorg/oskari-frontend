/**
 * @class Oskari.mapframework.bundle.parcel.request.StopDrawingRequestHandler
 * Stop to draw has been requested for the parcel.
 * This handler delegates the request for the {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin}.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StopDrawingRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin} drawPlugin
 */
function(drawPlugin) {
    this.drawPlugin = drawPlugin;
}, {
    /**
     * @method handleRequest
     * Handle request by forwarding the call to DrawPlugin.
     * @param {Object} core
     * @param {Oskari.mapframework.bundle.parcel.request.StopDrawingRequest} request Request that is handled.
     */
    handleRequest : function(core, request) {
        // pressed finished drawing, act like dblclick
        this.drawPlugin.finishSketchDraw();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
