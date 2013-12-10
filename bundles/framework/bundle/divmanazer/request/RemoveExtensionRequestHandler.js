/**
 * @class Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler', function(ui) {
	this.ui = ui;
}, {
	handleRequest : function(core, request) {
		var extension = request.getExtension();

		this.ui.removeExtension(extension);

	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
