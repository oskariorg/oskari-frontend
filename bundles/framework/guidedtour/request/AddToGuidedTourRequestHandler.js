/**
 * @class Oskari.framework.bundle.guidedtour.AddToGuidedTourRequestHandler
 */
Oskari.clazz.define('Oskari.framework.bundle.guidedtour.AddToGuidedTourRequestHandler', function(tourInstance) {
	this.tour = tourInstance;
}, {
	handleRequest: function(core, request) {
		var delegate = request.getDelegate();

		this.tour.addStep(delegate);
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
