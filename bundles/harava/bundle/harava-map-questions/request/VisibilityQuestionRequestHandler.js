/**
 * @class Oskari.harava.bundle.mapquestions.request.VisibilityQuestionRequestHandler
 * Handles Oskari.harava.bundle.mapquestions.request.VisibilityQuestionRequestRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.VisibilityQuestionRequestHandler', function(sandbox, bundle) {

    this.sandbox = sandbox;
    this.bundle = bundle;
}, {
	/**
	 * @method handleRequest 
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapquestions.request.VisibilityQuestionRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.harava.bundle.mapquestions.request.VisibilityQuestionRequest]");
        this.bundle.changeToolVisibility(request.getModuleId(),request.getQuestionId(),request.getEnabled());
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
