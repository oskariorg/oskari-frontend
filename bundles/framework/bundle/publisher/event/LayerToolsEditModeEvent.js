/**
 * @class Oskari.mapframework.bundle.publisher.event.LayerToolsEditModeEvent
 *
 * Event is sent when user decides to edit layout order
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.event.LayerToolsEditModeEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (inMode) {
        this._isInMode = inMode;
    }, {
        /** @static @property __name event name */
        __name: 'LayerToolsEditModeEvent',
        /**
         * @method getName
         * @return {String} the name for the event
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getName
         * @return {String} the name for the event
         */
        isInMode: function () {
            return this._isInMode;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
