/**
 * @class Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest
 * Forces filtering of the layers based on publishing rights for example.
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            id layer identifier so we can select correct tab
     */
        function(filterFunction) {
            this._filterFunction = filterFunction;
    }, {
        /** @static @property __name request name */
        __name : "AddLayerListFilterRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getFilterFunction
         * @return {String} a function used for filtering shown map layers by a function
         */
        getFilterFunction : function() {
            return this._filterFunction;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
