/**
 * @classOskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler
 * Handles MapModulePlugin.GetUserLocationRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler', function (sandbox, myLocationPlugin) {
    this.sandbox = sandbox;
    this.myLocationPlugin = myLocationPlugin;
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug('[Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler] Get user location');
        this.myLocationPlugin.getLocation();
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});