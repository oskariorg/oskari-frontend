/**
 * @class Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequestHandler
 * Handles Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequestHandler', function(sandbox, bundle) {

    this.sandbox = sandbox;
    this.bundle = bundle;
}, {
	/**
	 * @method handleRequest 
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.sandbox.printDebug("[Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequest]");
        this.bundle.hideTools();
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
