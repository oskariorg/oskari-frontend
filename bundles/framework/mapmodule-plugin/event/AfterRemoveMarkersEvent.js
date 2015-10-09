/**
 * @class Oskari.mapframework.bundle.mapmodule.event.AfterRemoveMarkersEvent
 *
 * Event is sent after map markers are removed
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.event.AfterRemoveMarkersEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param  {String} id optional id for marker that was removed, all markers cleared if undefined
     */
    function (id) {
        this._id = id;
    },
    {
        __name: 'AfterRemoveMarkersEvent',

        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} optional id for marker that was removed, refers to all if undefined
         */
        getId: function () {
            return this._id;
        }
    },
    {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    }
);