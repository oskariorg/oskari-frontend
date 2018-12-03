/**
 * @class Oskari.mapframework.bundle.mapmodule.event.UserLocationEvent
 *
 * Event is sent after a user location is getted
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.UserLocationEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (lon, lat, accuracy) {
        this._lon = lon;
        this._lat = lat;
        this._accuracy = accuracy;
    }, {
        __name: 'UserLocationEvent',

        getName: function () {
            return this.__name;
        },

        getLon: function () {
            return this._lon;
        },
        getLat: function () {
            return this._lat;
        },
        getAccuracy: function () {
            return this._accuracy;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has key id which has the marker id of the clicked
         */
        getParams: function () {
            return {
                lon: this.getLon(),
                lat: this.getLat(),
                accuracy: this.getAccuracy()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
