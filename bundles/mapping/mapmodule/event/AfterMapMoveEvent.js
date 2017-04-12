/**
 * @class Oskari.mapframework.event.common.AfterMapMoveEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.MapMoveRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapMoveEvent',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Number} centerX
     *            longitude
     * @param {Number} centerY
     *            latitude
     * @param {Number} zoom
     *            map zoomlevel (0-12)
     * @param {Number} scale
     *            map scale
     * @param {String} creator
     *            class identifier of an object that sends an event
     */
    function (centerX, centerY, zoom, scale, creator) {
        this._creator = creator || null;
        this._centerX = centerX;
        this._centerY = centerY;
        this._zoom = zoom;
        this._scale = scale;
    }, {
        /** @static @property __name event name */
        __name: "AfterMapMoveEvent",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getCreator
         * @return {String} identifier for the event sender
         */
        getCreator: function () {
            return this._creator;
        },
        /**
         * @method getCenterX
         * @return {Number} longitude
         */
        getCenterX: function () {
            return this._centerX;
        },
        /**
         * @method getCenterY
         * @return {Number} latitude
         */
        getCenterY: function () {
            return this._centerY;
        },
        /**
         * @method getZoom
         * @return {Number} zoomlevel (0-12)
         */
        getZoom: function () {
            return this._zoom;
        },
        /**
         * @method getScale
         * @return {Number} map scale
         */
        getScale: function () {
            return this._scale;
        },

        getParams: function () {
            var me = this;
            return {
                centerX: me._centerX,
                centerY: me._centerY,
                zoom: me._zoom,
                scale: me._scale
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
