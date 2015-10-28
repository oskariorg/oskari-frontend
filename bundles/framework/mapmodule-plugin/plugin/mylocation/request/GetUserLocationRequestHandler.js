/**
 * @classOskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler
 * Handles MyLocationPlugin.GetUserLocationRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler', function (myLocationPlugin) {
    this.myLocationPlugin = myLocationPlugin;
}, {
    handleRequest: function (core, request) {
        this.myLocationPlugin.getUserLocation(request.getCenterMap());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});