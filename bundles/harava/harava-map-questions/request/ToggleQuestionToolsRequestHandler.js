/**
 * @class Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequestHandler
 * Handles Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequestHandler', function(sandbox, bundle) {

    this.sandbox = sandbox;
    this.bundle = bundle;
}, {
	/**
	 * @method handleRequest 
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequest]");
        this.bundle.toggleTools();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
