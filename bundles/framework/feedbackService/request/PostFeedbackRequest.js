/**
 * @class Oskari.mapframework.bundle.feedbackService.request.PostFeedbackRequest
 * Post users feedback data with given params
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.feedbackService.request.PostFeedbackRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @params {Object} lang, serviceId
     *
     */
    function(params) {
        this._feedbackparams = params;
    }, {
        /** @static @property __name request name */
        __name : "PostFeedbackRequest",
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
            return this._feedbackparams;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
