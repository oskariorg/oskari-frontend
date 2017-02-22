/**
 * @class map.layer.activation.event
 *
 * Triggers when a given map layer has been requested to be
 * "highlighted"/activated or deactivated on map. This means f.ex. WFS layers
 *  featuretype grid should be shown and selection clicks on map enabled.
 */
Oskari.clazz.define('map.layer.activation.event',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.domain.AbstractLayer} mapLayer activated maplayer
     * @param {Boolean}                                  isActivated true if activated, false if deactivated
     */

    function (layer, isActivated) {
        this._layer = layer;
        this._isActivated = isActivated === true;
    }, {
        /** @static @property __name event name */
        __name: "map.layer.activation",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getMapLayer
         * @return
         * {Oskari.mapframework.domain.AbstractLayer}
         * activated or deactivated maplayer
         */
        getMapLayer: function () {
            return this._layer;
        },
        /**
         * @method isActivated
         * @return {Boolean} true if activated, false if deactivated
         */
        isActivated: function () {
            return this._isActivated;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
