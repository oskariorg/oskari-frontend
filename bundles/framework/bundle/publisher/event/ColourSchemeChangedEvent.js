/**
 * @class Oskari.mapframework.bundle.publisher.event.ColourSchemeChangedEvent
 *
 * Used to notify getinfo plugin that the colour scheme has changed.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.event.ColourSchemeChangedEvent',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} colourScheme the new colour scheme
     */

    function (colourScheme) {
        this._colourScheme = colourScheme;
    }, {
        /** @static @property __name event name */
        __name: "Publisher.ColourSchemeChangedEvent",
        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getStyle
         * Returns the new colour scheme
         * @return {Object}
         */
        getColourScheme: function () {
            return this._colourScheme;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });