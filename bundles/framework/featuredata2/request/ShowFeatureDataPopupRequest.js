/**
 * @class Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataPopupRequest
 * Requests a WFS feature data to be shown in popup
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataPopupRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            id layer identifier so we can select correct tab
     */
        function(layer) {
            this._layer = layer;
    }, {
        /** @static @property __name request name */
        __name : "ShowFeatureDataPopupRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} identifier so we can manage select correct tab
         */
        getLayer : function() {
            return this._layer;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
