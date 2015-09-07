/**
 * @class Oskari.mapframework.bundle.publisher2.event.ToolStyleChangedEvent
 *
 * Used to notify tool plugins that the tool style has changed.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.event.ToolStyleChangedEvent',

    /**
     * @method create called automatically on construction
     * @static
     * @param {String} style the id of new style
     */
    function (style) {
        this._style = style;
    }, {
        /** @static @property __name event name */
        __name: 'Publisher2.ToolStyleChangedEvent',
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
         * Returns the id of new style
         * @return {String}
         */
        getStyle: function () {
            return this._style;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
