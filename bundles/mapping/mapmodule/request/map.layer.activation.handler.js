/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler
 * Handles MapModulePlugin.MapLayerUpdateRequest requests
 */
Oskari.clazz.define('map.layer.activation.handler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.domain.Map}
     *            mapState reference to state object
     */

    function (mapState) {
        this.mapState = mapState;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var layerId = request.getLayerId();
            if(request.isActivated()) {
                this.mapState.activateLayer(layerId, request._creator);
            } else {
                this.mapState.deactivateLayer(layerId, request._creator);
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });