Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequestHandler', function (sandbox, markersPlugin) {
    this.sandbox = sandbox;
    this.markersPlugin = markersPlugin;
    this._log = Oskari.log('RemoveMarkersRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Remove markers');
        this.markersPlugin.removeMarkers(false, request.getId());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
