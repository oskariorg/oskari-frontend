/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ActivateHighlightRequest
 * Requests a WFS highlight enabled or disabled
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.mapwfs2.request.ActivateHighlightRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            enabled Truth value of WFS highlight activation
     */
        function(enabled) {
            this._enabled = enabled;

    }, {
        /** @static @property __name request name */
        __name : "WfsLayerPlugin.ActivateHighlightRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        isEnabled : function() {
            return this._enabled;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
