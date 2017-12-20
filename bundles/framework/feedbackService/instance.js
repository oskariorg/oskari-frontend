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
    init: function () {},
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

        sandbox.addRequestHandler('GetFeedbackServiceRequest', this);
        sandbox.addRequestHandler('GetFeedbackRequest', this);
        sandbox.addRequestHandler('PostFeedbackRequest', this);
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
     * @method handleRequest
     * Gets feedback data from the service
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.feedbackService.request.GetFeedbackRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var params = request.getFeedbackParams() || {};
        var name = request.getName();
        if(name === 'GetFeedbackServiceRequest') {
            // recognized, but nothing to add
        } else if(name === 'GetFeedbackRequest') {
            params.method = "getFeedback";
        } else if(name === 'PostFeedbackRequest') {
            params.method = "postFeedback";
        } else {
            return;
        }
        this.getFeedback(params);
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
     *                 payload {JSON}  filterparams for getFeedback method or data to post to service (postFeedback method)
     */
    getFeedback: function (params) {
        var me = this;
        params = params || {};
        // Add view uuid for the request for to access view metadata
        params['uuid'] = Oskari.app.getUuid();
        if(typeof params.payload === 'object') {
            params.payload = JSON.stringify(params.payload);
        }
        jQuery.ajax({
            data: params,
            dataType : "json",
            type : "POST",
            url : this.sandbox.getAjaxUrl('Feedback'),
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