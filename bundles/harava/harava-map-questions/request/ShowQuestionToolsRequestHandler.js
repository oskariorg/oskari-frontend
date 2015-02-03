/**
 * @class Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequestHandler
 * Handles Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequestHandler', function(sandbox, bundle) {

    this.sandbox = sandbox;
    this.bundle = bundle;
}, {
	/**
	 * @method handleRequest 
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequest]");
        this.bundle.showTools(request.getFast());
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
