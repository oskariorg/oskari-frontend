/**
 * @class Oskari.mapframework.bundle.publisher.event.FontChangedEvent
 *
 * Used to notify tool plugins that the font has changed.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.event.FontChangedEvent',

    /**
     * @method create called automatically on construction
     * @static
     * @param {String} style the id of new font
     */
    function (font) {
        this._font = font;
    }, {
        /** @static @property __name event name */
        __name: 'Publisher.FontChangedEvent',
        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getFont
         * Returns the id of new fonts
         * @return {String}
         */
        getFont: function () {
            return this._font;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });