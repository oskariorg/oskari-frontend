/**
 * @class Oskari.mapframework.request.common.CtrlKeyUpRequest
 *
 * Requests for core to handle ctrl button key release
 * Opposite of Oskari.mapframework.request.common.CtrlKeyDownRequest
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.CtrlKeyUpRequest',
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {}, {
        /** @static @property __name request name */
        __name: "CtrlKeyUpRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });