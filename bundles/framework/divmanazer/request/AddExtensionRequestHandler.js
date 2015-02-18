/**
 *
 * @class Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler', function(ui) {
	this.ui = ui;

}, {
	handleRequest : function(core, request) {
		var extension = request.getExtension();

		this.ui.addExtension(extension);
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
