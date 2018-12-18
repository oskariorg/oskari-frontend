/**
 * @class Oskari.mapframework.bundle.mapmodule.request.StopUserLocationTrackingRequestHandler
 * Handles StopUserLocationTrackingRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.StopUserLocationTrackingRequestHandler', function (sandbox, mapmodule) {
    this.sandbox = sandbox;
    this.mapmodule = mapmodule;
    this._log = Oskari.log('StopUserLocationTrackingRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Stop user location tracking');
        var opts = request.getOptions() || {};
        if (opts.clearMap !== false) {
            this._removeLocationsFromMap();
        }
        if (opts.removePath !== false) {
            this.mapmodule.clearLocationPath();
        }
        this.mapmodule.stopUserLocationWatch();
    },
    _removeLocationsFromMap: function () {
        Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'USER_LOCATION_LAYER']);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
