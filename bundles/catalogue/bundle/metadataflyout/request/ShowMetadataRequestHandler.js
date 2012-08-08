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
		this.sandbox.printDebug("[Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler] Show Metadata: " + request.getUuid());
		this.instance.scheduleShowMetadata(request.getUuid(), request.getRS_Identifier_Code(), request.getRS_Identifier_CodeSpace());
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
