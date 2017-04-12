/**
 * @class Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceRequest
 * Requests feedback service list with given params
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.feedbackService.request.GetFeedbackServiceRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @params {Object} lang, serviceId
     *
     */
    function(serviceId) {
        this.serviceId = serviceId;
    }, {
        /** @static @property __name request name */
        __name : "GetFeedbackServiceRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getFeedbackParams
         * @return {Object} parameters of current feedback request
         */
        getFeedbackParams : function() {
            if(!this.serviceId) {
                return {
                    "method" : "serviceList"
                };
            }
            return {
                "method" : "serviceDefinition",
                "serviceId": this.serviceId
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
