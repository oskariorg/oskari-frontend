/**
 * @class Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance',
/**
 * @static constructor function
 */
function () {
    this.sandbox = null;
    this.started = false;
}, {
    __name: 'feedbackService',

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return this.__name;
    },

    /**
     * @method init
     * Initializes the service
     */
    init: function () {
        var me = this;
        this.requestHandlers = {
            getFeedbackServiceHandler: Oskari.clazz.create('Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceRequestHandler', me),
            getFeedbackServiceDefinitionHandler: Oskari.clazz.create('Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceDefinitionRequestHandler', me),
            getFeedbackHandler: Oskari.clazz.create('Oskari.mapframework.bundle.feedbackService.request.GetFeedbackRequestHandler', me),
            postFeedbackHandler: Oskari.clazz.create('Oskari.mapframework.bundle.feedbackService.request.PostFeedbackRequestHandler', me)
        };
        return null;
    },
    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
    start: function () {
        var me = this,
            conf = me.conf,
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName);

        this.sandbox = sandbox;
        sandbox.register(this);

        sandbox.addRequestHandler('GetFeedbackServiceRequest', this.requestHandlers.getFeedbackServiceHandler);
        sandbox.addRequestHandler('GetFeedbackServiceDefinitionRequest', this.requestHandlers.getFeedbackServiceDefinitionHandler);
        sandbox.addRequestHandler('GetFeedbackRequest', this.requestHandlers.getFeedbackHandler);
        sandbox.addRequestHandler('PostFeedbackRequest', this.requestHandlers.postFeedbackHandler);
    },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },

    /**
     * @method getFeedback
     * Makes the ajax call to get or post the feedback data from/to service
     * @param {Object} parameters of the feedback request. Possible values are:
     *                 method - *required (serviceList, serviceDefinition, getFeedback, postFeedback
     *                 srs - *required when method is postFeedback or getFeedback
     *                 lang - fi/sv/en
     *                 baseUrl - feedback service base url
     *                 serviceId - for serviceDefinition request (Open311 service_code)
     *                 getServiceRequests {JSON}  filterparams for getFeedback method
     *                 postServiceRequest {JSON} data to post to service (postFeedback method)
     */
    getFeedback: function (params) {
        var me = this,
            getFeedbackUrl = this.sandbox.getAjaxUrl() + 'action_route=Feedback';

        // Add view uuid for the request for to access view metadata
        //FIXME: Store current view uuid to Oskari globals and use it via Oskari.
        params['uuid'] = window.controlParams['uuid'];
        jQuery.ajax({
            data: params,
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/json");
              }
             },
            url : getFeedbackUrl,
            error : function (response) {
                var success = false;
                var evt = me.sandbox.getEventBuilder('FeedbackResultEvent')(success, params, response);
                me.sandbox.notifyAll(evt);
            },
            success : function (response) {
                var success = response.success,
                    requestParameters = response.requestParameters,
                    data = response.data;

                var evt = me.sandbox.getEventBuilder('FeedbackResultEvent')(success, requestParameters, data);
                me.sandbox.notifyAll(evt);
            }
        });
    }
});