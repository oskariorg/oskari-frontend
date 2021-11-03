/**
 * @class Oskari.mapframework.mapmodule.getinfoplugin.event.DataForMapLocationEvent
 *
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.getinfoplugin.event.DataForMapLocationEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (x, y, content, layerId, type) {
        this._x = x;
        this._y = y;
        this._content = content;
        this._layerId = layerId;
        this._type = type;
    }, {
        /** @static @property __name event name */
        __name: 'DataForMapLocationEvent',
        /**
         * @method getName
         * @return {String} the name for the event
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getX
         */
        getX: function () {
            return this._x;
        },

        /**
         * @method getY
         */
        getY: function () {
            return this._y;
        },

        /**
         * @method getContent
         */
        getContent: function () {
            return this._content;
        },

        /**
         * @method getLayerId
         */
        getLayerId: function () {
            return this._layerId;
        },

        /**
         * @method getType
         */
        getType: function () {
            return this._type;
        },

        /**
         * Serialization for RPC
         * @return {Object} object has following keys:
         *      - x which has the clicked x position
         *      - y which has the clicked y position
         *      - content which has popup content (json, geojson or text)
         *      - layerId which has layer id where result come
         *      - type which has content type: json, geojson or text
         */
        getParams: function () {
            return {
                x: this.getX(),
                y: this.getY(),
                content: this.getContent(),
                layerId: this.getLayerId(),
                type: this.getType()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
