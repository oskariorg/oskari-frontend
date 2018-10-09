/**
 * @class Oskari.mapframework.bundle.mapmodule.request.RemoveFeaturesFromMapRequest
 *
 * Class for requesting removes features from map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RemoveFeaturesFromMapRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} identifier the identifier
     * @param {String} value the identifier value
     * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
     */
    function (identifier, value, layer) {
        this._creator = null;
        this._identifier = identifier;
        this._value = value;
        this._layer = layer;
    }, {
        /** @static @property __name request name */
        __name: 'MapModulePlugin.RemoveFeaturesFromMapRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getIdentifier
         * @return {String} identifier
         */
        getIdentifier: function () {
            return this._identifier;
        },
        /**
         * @method getValue
         * @return {String} value
         */
        getValue: function () {
            return this._value;
        },
        /**
         * @method getLayer
         * @return {Oskari.mapframework.domain.VectorLayer} layer
         */
        getLayer: function () {
            return this._layer;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    }
);
