Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.request.AddMarkerRequestHandler', function(sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
}, {
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.request.AddMarkerRequestHandler] Add Marker");
        this.markersPlugin.addMapMarker(request.getX(), request.getY(), request.getID(), request.getEvents(), request.getIconUrl());
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
}); 