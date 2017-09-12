/**
 * @class Oskari.Sandbox.abstractionMethods
 *
 * This category class adds abstraction methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.Sandbox', 'abstraction-methods', {
    /**
     * @method domSelector
     * Abstraction method for DOM selector f.ex. jQuery
     * @param {Object} argument for the concrete domSelector f. ex. jQuery
     * @return {Object} concrete domSelector return value
     */
    domSelector: function (arg) {
        return jQuery(arg);
    },
    /**
     * @method ajax
     *
     * Abstraction method for ajax calls f.ex. jQuery.ajax
     * Makes an ajax request to url with given callbacks.
     * Detects available framework and uses it to make the call.
     * TODO: complete and data params not implemented
     * @deprecated implementation will propably change
     *
     * @param {String} url
     *      URL to call
     * @param {Function} success
     *      callback for succesful action
     * @param {Function} failure
     *      callback for failed action
     * @param {Object} data (optional)
     *      data to post
     * @param {Function} complete - NOTE! NOT IMPLEMENTED YET
     *      callback on action completed (optional)
     */
    ajax: function (url, success, failure, data, complete) {
        var userIsLoggedIn = Oskari.user().isLoggedIn();
        // default to jQuery
        if (jQuery && jQuery.ajax) {
            var failureWrapper = function (jqXHR, textStatus, err) {
                if (jqXHR.status === 403 && userIsLoggedIn) {
                    // user was logged in but still unauthorized ->
                    // session might have been expired.
                    // FIXME: use more sophisticated, localized message instead.
                    alert('Session expired. Please log in again.');
                } else {
                    failure(jqXHR, textStatus, err);
                }
            };
            // if data != null -> type = POST
            var type = 'GET';
            if (data) {
                type = 'POST';
            }

            jQuery.ajax({
                type: type,
                url: url,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                data: data,
                success: success,
                error: failureWrapper
            });
        } else {
            // TODO: fallback to Openlayers?
            failure();
        }
    },

    /**
     * @method getDefer
     * Abstraction method for getting a defer object from Q
     * or undefined Q is not available.
     * @return {Object} Q defer or undefined if Q is not available
     */
    getDefer: function () {
        var ret;
        // Use Q if available
        if (window.Q && window.Q.defer) {
            ret = window.Q.defer();
        } else {
            ret = undefined;
        }
        return ret;
    }
});
