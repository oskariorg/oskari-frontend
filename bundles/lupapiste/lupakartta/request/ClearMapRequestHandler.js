Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.request.ClearMapRequestHandler', function(sandbox, markersPlugin) {
	this.sandbox = sandbox;
	this.markersPlugin = markersPlugin;
}, {
	handleRequest : function(core, request) {
		this.sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.request.ClearMapRequestHandler] Clear map");
		this.markersPlugin.clearMapMarkers();
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
}); 