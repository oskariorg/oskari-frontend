/**
 * @class Oskari.mapping.drawtools.request.StartDrawingRequest
 *
 * Start drawing a given shape for given functionality (id).
 *
 * Available shapes: dot, line, circle as polygon, box, polygon.
 * Dot and line can have a buffer.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapping.drawtools.request.StartDrawingRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     * @param {String} shape
     * @param {Object} options
     */
    function (id, shape, options) {
        this._id = id;
        this._shape = shape;
        this._options = options || {};
    }, {
        /** @static @property __name request name */
        __name: 'DrawTools.StartDrawingRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} Id
         */
        getId: function () {
            return this._id;
        },
        /**
         * @method getShape
         * @return {String}
         */
        getShape: function () {
            return this._shape;
        },
        /**
         * @method getOptions
         * @return {Object} options
         */
        getOptions: function () {
            return this._options;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
