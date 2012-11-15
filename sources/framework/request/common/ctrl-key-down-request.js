/**
 * @class Oskari.framework.request.common.CtrlKeyDownRequest
 *
 * Requests for core to handle ctrl button key press.
 * Opposite of Oskari.mapframework.request.common.CtrlKeyUpRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.CtrlKeyDownRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name request name */
    __name : "CtrlKeyDownRequest",
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