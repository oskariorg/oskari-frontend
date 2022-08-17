/**
 * @class Oskari.mapframework.mapmodule.getinfoplugin.request.SwipeStatusRequest
 * Saves swipe tool status to GetInfoPlugin.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
    */
Oskari.clazz
    .define('Oskari.mapframework.mapmodule.getinfoplugin.request.SwipeStatusRequest',
        /**
         * @method create called automatically on construction
         * @static
         *
         * @param {Number} layerId layer ID
         * @param {Number} cropX swipe tool X position
         */
        function (layerId, cropX) {
            this._layerId = layerId;
            this._cropX = cropX;
        }, {
            /** @static @property __name request name */
            __name: 'GetInfoPlugin.SwipeStatusRequest',
            /**
             * @method getName
             * @return {String} request name
             */
            getName: function () {
                return this.__name;
            },
            /**
             * @method getlayerId
             * @return {Number} layer ID
             */
            getLayerId: function () {
                return this._layerId;
            },
            /**
             * @method getCropX
             * @return {Number} swipe tool X position
             */
            getCropX: function () {
                return this._cropX;
            }
        }, {
            /**
             * @property {String[]} protocol array of superclasses as {String}
             * @static
             */
            'protocol': ['Oskari.mapframework.request.Request']
        });
