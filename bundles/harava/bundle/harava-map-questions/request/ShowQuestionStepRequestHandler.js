/**
 * @class Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequestHandler
 * Handles Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequest.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequestHandler', function(sandbox, bundle) {

    this.sandbox = sandbox;
    this.bundle = bundle;
}, {
	/**
	 * @method handleRequest
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	var module = request.getModuleId();
        
        this.sandbox.printDebug("[Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequest] Activate question module: " + module);
        this.bundle.showStep(module);
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
