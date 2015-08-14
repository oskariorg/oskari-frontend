/**
 * @class Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler
 * Start drawing has been requested with the given draw mode.
 * This handler delegates the request for the {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin}.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler',
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
     * @param {Oskari.mapframework.bundle.parcel.request.StartDrawingRequest} request
     *          Request that is handled and that contains the draw mode information.
     */
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.drawPlugin.startDrawing({
            drawMode : request.getDrawMode()
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
