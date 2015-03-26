/**
 * @class Oskari.mapframework.bundle.metadatafeedback.service.AddFeedbackService
 *
 *
 * callbacks
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.service.AddFeedbackService',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchUrl ajax URL to actual metadata catalogue search implementation
 */
function(url) {

    /* searchUrl url that will give us results */
    this._url = url;
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.catalogue.bundle.metadatafeedback.service.AddFeedbackService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "FeedbackService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    addFeedback: function(params, onSuccess, onError) {
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/json");
              }
             },
            url : this._url,
            data : {
                data: JSON.stringify(params)
            },
            error : onError,
            success : onSuccess
        });

    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */