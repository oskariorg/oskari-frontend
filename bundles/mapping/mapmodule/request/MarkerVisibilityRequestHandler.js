Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MarkerVisibilityRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug('[Oskari.mapframework.bundle.mapmodule.request.MarkerVisibilityRequestHandler] Change Marker Visibility');

        this.markersPlugin.changeMapMarkerVisibility(request.isVisible(),request.getID());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});