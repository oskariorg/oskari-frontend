Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug('[Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler] Add Marker');
        this.markersPlugin.addMapMarker(request.getData(), request.getID(), request.getEvents());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
