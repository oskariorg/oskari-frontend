/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler', function(sandbox, instance) {

	this.sandbox = sandbox;

	/** @property instance */
	this.instance = instance;
}, {

	/** @method handleRequest dispatches processing to instance */
	handleRequest : function(core, request) {

		this.instance.scheduleShowMetadata(request.getAllMetadata());
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
