/**
 * @class Oskari.mapframework.request.common.GenerateHtmlPrintToMapRequest
 *
 * Requests for a html link to a print view. Triggers a 
 * Oskari.mapframework.event.common.AfterGenerateHtmlPrintToMapEvent which provides the requested url.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.GenerateHtmlPrintToMapRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "GenerateHtmlPrintToMapRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
/* Inheritance */