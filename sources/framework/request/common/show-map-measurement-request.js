/**
 * @class Oskari.mapframework.request.common.ShowMapMeasurementRequest
 *
 * Requests for the given value to be shown in UI.
 *
 * TODO: This could and propably should be refactored into a common show message
 * request since it could be used to show any message/this is actually not
 * measure tool specific.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */

Oskari.clazz.define('Oskari.mapframework.request.common.ShowMapMeasurementRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            value message to be shown
 */
function(value) {
    this._creator = null;
    this._value = value;
}, {
    /** @static @property __name request name */
    __name : "ShowMapMeasurementRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getValue
     * @return {String} value
     */
    getValue : function() {
        return this._value;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */