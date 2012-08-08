/**
 * @class Oskari.mapframework.event.common.AfterGetFeatureInfoEvent
 *
 * Triggers on GetFeatureInfoRequest.
 * See Oskari.mapframework.request.common.GetFeatureInfoRequest and
 * Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterGetFeatureInfoEvent',

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} response
 * 			true if not a wfs layer and has selected layers e.g. we can expect some
 * response from the service in the following
 * Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
 * @param {Boolean} wfsSelected
 * 			is a wfs layer selected
 */
function(response, wfsSelected) {
    this._creator = null;
    this._response = response;
    this._wfsSelected = wfsSelected;
}, {
    /** @static @property __name event name */
    __name : "AfterGetFeatureInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getResponse
     * @return {Boolean} true if not a wfs layer and has selected layers e.g. we can expect some
	 * response from the service in the following
	 * Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
     */
    getResponse : function() {
        return this._response;
    },
    /**
     * @method getResponse
     * @return {Boolean} is a wfs layer selected
     */
    isWfsSelected : function() {
        return this._wfsSelected;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */