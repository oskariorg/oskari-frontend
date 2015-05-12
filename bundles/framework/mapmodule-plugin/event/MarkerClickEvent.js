/**
 * @class Oskari.mapframework.bundle.mapmodule.event.MarkerClickEvent
 *
 * Event is sent after a map marker is clicked
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.MarkerClickEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (id) {
        this._id = id;
    }, {
        __name: 'MarkerClickEvent',

        getName: function () {
            return this.__name;
        },
        getID: function () {
            return this._id;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has key id which has the marker id
         */
        getParams: function () {
            return {
                id: this.getID()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
