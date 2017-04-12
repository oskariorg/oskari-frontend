/**
 * @class Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest
 * Requests a WFS feature data to be shown
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            id layer identifier so we can select correct tab
     */
        function(id) {
            this._id = id;
    }, {
        /** @static @property __name request name */
        __name : "ShowFeatureDataRequest",
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
        getId : function() {
            return this._id;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
