/**
 * @class Oskari.mapframework.bundle.mapfull.request.MapSizeUpdateRequestHandler
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapfull.request.MapSizeUpdateRequestHandler',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Reference to application sandbox
     *
     */
    function (mapfull) {
        this.mapfull = mapfull;
    }, {
        /**
         * @method handleRequest
         * Tells the map module that it should update/refresh its size.
         *
         *
         */
        handleRequest: function (core, request) {
            this.mapfull.updateSize();
        }
    }, {
        /**
         * @static @property {string[]} protocol
         * Array of superclasses as {string}
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
