Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug("[Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequestHandler] Remove markers");
        this.markersPlugin.removeMarkers();
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});