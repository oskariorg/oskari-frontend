/**
 * @class Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
 *
 * Triggers on GetFeatureInfoRequest after AfterGetFeatureInfoEvent.
 * See Oskari.mapframework.request.common.GetFeatureInfoRequest and
 * Oskari.mapframework.event.common.AfterGetFeatureInfoEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent',

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} header
 *          header text (e.g. layer name)
 * @param {String} message
 * 			response content for GetFeatureInfo request 
 */
function(header, message) {
    this._creator = null;

    this._header = header;
    this._message = message;
}, {
    /** @static @property __name event name */
    __name : "AfterAppendFeatureInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getHeader
     * @return {String} header text (e.g. layer name)
     */
    getHeader : function() {
        return this._header;
    },
    /**
     * @method getMessage
     * @return {String} response content for GetFeatureInfo request 
     */
    getMessage : function() {
        return this._message;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */