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
     * @param {String} id drawing id as given in StartDrawingRequest
     * @param {String|Object} shape [dot|line|circle|box|polygon] or geojson object to set for editing
     * @param {Object} options options like
     *                         - buffer [0 to disable dragging a buffer or 1-n for fixed buffer]
     *                         - styles
     *                         - clear drawing after finished
     *                         - show area/line length on map for drawing
     *                         - show text next to the drawing(?)
     */
    function(id, shape, options) {
        this._id = id;
        this._shape = shape;
        this._options = options || {};
    }, {
        /** @static @property __name request name */
        __name: "DrawTools.StartDrawingRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} Id for the feature that is being drawn,
         *                     this will be referenced by the event that will be
         *                     triggered when drawing is finished.
         */
        getId: function () {
            return this._id;
        },
        /**
         * @method getShape
         * @return {String|Object} [dot|line|circle|box|polygon] or geojson object to set for editing
         */
        getShape: function () {
            return this._shape;
        },
        /**
         * @method getOptions
         * @param {String} key optional key for options
         * @return {Object} if key is given returns the key value from options,
         *                     otherwise returns the whole options
         */
        getOptions: function (key) {
            if(key) {
                return this._options[key];
            }
            return this._options;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });