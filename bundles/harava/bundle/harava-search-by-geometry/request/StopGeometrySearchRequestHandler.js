Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequestHandler', function(sandbox, searchPlugin) {

    this.sandbox = sandbox;
    this.searchPlugin = searchPlugin;
}, {
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.StopGeometrySearchRequest] Stop drawing search");
        this.searchPlugin.removeAllDrawings();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
