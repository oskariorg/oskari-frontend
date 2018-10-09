Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MarkerVisibilityRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
    this._log = Oskari.log('MarkerVisibilityRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Change Marker Visibility');

        this.markersPlugin.changeMapMarkerVisibility(request.isVisible(), request.getID());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
