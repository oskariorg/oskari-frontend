/**
 * @class Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequest
 * Adds filterin button to layerlist.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Function} filterFunction layer list filter function
     */
        function(callback) {
            this._callback = callback;
    }, {
        /** @static @property __name request name */
        __name : "GetInfoPlugin.ResultHandlerRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getCallback
         * @return {Function} a callback
         */
        getCallback : function() {
            return this._callback;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
