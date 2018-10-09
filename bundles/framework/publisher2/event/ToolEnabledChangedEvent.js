/**
 * @class Oskari.mapframework.bundle.publisher2.event.ToolEnabledChangedEvent
 *
 * Used to notify the layout panel that tools have been added / removed from the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.event.ToolEnabledChangedEvent',

    /**
     * @method create called automatically on construction
     * @static
     * @param {String} tool the tool whose enabled-property changed
     */
    function (tool) {
        this._tool = tool;
    }, {
        /** @static @property __name event name */
        __name: 'Publisher2.ToolEnabledChangedEvent',
        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getTool
         * Returns the tool whose enabled-state has changed
         * @return {String}
         */
        getTool: function () {
            return this._tool;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
