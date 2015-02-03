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
     */
    function () {},
    {
        __name: 'AfterRemoveMarkersEvent',

        getName: function () {
            return this.__name;
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