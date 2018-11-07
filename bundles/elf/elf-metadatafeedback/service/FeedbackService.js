/**
 * @class Oskari.mapframework.bundle.metadatafeedback.service.FeedbackService
 *
 *
 * callbacks
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.service.FeedbackService',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchUrl ajax URL to actual metadata catalogue search implementation
 */
    function (addFeedbackAjaxUrl, fetchFeedbackAjaxUrl) {
    /* searchUrl url that will give us results */
        this._addFeedbackAjaxUrl = addFeedbackAjaxUrl;
        this._fetchFeedbackAjaxUrl = fetchFeedbackAjaxUrl;
    }, {
    /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.catalogue.bundle.metadatafeedback.service.FeedbackService',
        /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: 'FeedbackService',
        /**
     * @method getName
     * @return {String} service name
     */
        getName: function () {
            return this.__name;
        },
        addFeedback: function (params, onSuccess, onError) {
            jQuery.ajax({
                dataType: 'json',
                type: 'POST',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/json');
                    }
                },
                url: this._addFeedbackAjaxUrl,
                data: {
                    data: JSON.stringify(params)
                },
                error: onError,
                success: onSuccess
            });
        },
        fetchFeedback: function (params, onSuccess, onError) {
            jQuery.ajax({
                dataType: 'json',
                type: 'GET',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/json');
                    }
                },
                url: this._fetchFeedbackAjaxUrl,
                data: {
                    data: JSON.stringify(params)
                },
                error: onError,
                success: onSuccess
            });
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        'protocol': ['Oskari.mapframework.service.Service']
    });

/* Inheritance */
