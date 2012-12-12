Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequestHandler', function(sandbox, searchPlugin) {

    this.sandbox = sandbox;
    this.searchPlugin = searchPlugin;
}, {
    handleRequest : function(core, request) {
        var searchMode = request.getSearchMode();
        this.sandbox.printDebug("[Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequest] Start Searching: " + searchMode);
        this.searchPlugin.startSearch(request.getSearchMode());
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
