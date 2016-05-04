/**
 * @class Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceDefinitionRequestHandler
 * Handles Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceDefinitionRequest.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceDefinitionRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance} feedbackService
     *          reference to feedbackService
     */
    function(feedbackService) {
        this.feedbackService = feedbackService;
    }, {
        /**
         * @method handleRequest
         * Gets feedback data from the service
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.feedbackService.request.GetFeedbackRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            var params = request.getFeedbackParams();

            params.method = "serviceDefinition";
            this.feedbackService.getFeedback(params);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
