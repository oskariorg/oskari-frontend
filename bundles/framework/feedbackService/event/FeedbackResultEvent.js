/**
 * @class Oskari.mapframework.bundle.feedbackService.event.FeedbackResultEvent
 *
 * Used to notify feedbackUI that feedback renponse has been got successfully from the service
 */
Oskari.clazz.define('Oskari.mapframework.bundle.feedbackService.event.FeedbackResultEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} success succesfully received response
 * @param {JSON} requestParameters request parameters
 * @param {JSON} feedback response data
 */
function(success, requestParameters, data) {
    this._success = success;
    this._requestParameters = requestParameters;
    this._data = data;
}, {
    /** @static @property __name event name */
    __name : "FeedbackResultEvent",

    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSuccess
     * Returns the success  info
     * @return {Boolean}
     */
    getSuccess : function() {
        return this._success;
    },
    /**
     * @method getData
     * Returns the response data JSON
     * @return {JSON}
     */
    getData : function() {
        return this._data;
    },
    /**
     * @method getRequestParameters
     * Returns request paremeters
     * @return {JSON}
     */
    getRequestParameters : function() {
        return this._requestParameters;
    },

    getParams: function () {
        return {
            success: this._success,
            data: this._data,
            requestParameters: this._requestParameters
        };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});