/**
 * @class Oskari.mapframework.request.common.MapMoveRequest
 *
 * Requests for the map to move to given location and zoom level/bounds.
 * Map sends out Oskari.mapframework.event.common.AfterMapMoveEvent after it has
 * processed the request and the map has been moved.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.MapMoveRequest',
    /**
     * @static @method create called automatically on construction
     *
     *
     * @param {Number} centerX
     *            longitude
     * @param {Number} centerY
     *            latitude
     * @param {Number/OpenLayers.Bounds/Object} zoom (optional)
     *            zoomlevel (0-12) or OpenLayers.Bounds to zoom to or an object with property scale { scale : 10000 }.
     *            If not given the map zoom level stays as it was.
     * @param {Boolean} deprecated
     *            not used for anything
     *
     * @param {string} srsName
     *
     */

    function (centerX, centerY, zoom, deprecated, srsName) {
        this._creator = null;

        this._centerX = centerX;

        this._centerY = centerY;

        this._zoom = zoom;

        this._projectionCode = srsName;

    }, {
        /** @static @property {String} __name request name */
        __name: "MapMoveRequest",

        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
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
         * @return {Number/OpenLayers.Bounds/Object} zoomlevel (0-12) or OpenLayers.Bounds or Object with scale property.
         * to zoom to
         */
        getZoom: function () {
            return this._zoom;
        },
        /**
         * @method getSrsName
         * @return {String} _projectionCode SRS projection code, defaults to 'EPSG:3067'
         */
        getSrsName: function () {
            return this._projectionCode;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });