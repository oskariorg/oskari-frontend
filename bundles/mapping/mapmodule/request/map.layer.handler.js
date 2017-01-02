/**
 * @class map.layer.handler
 * Handles requests concerning map layers.
 */
Oskari.clazz.define('map.layer.handler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.domain.Map}
     *            mapState reference to state object
     */

    function (mapState, layerService) {
        this.mapState = mapState;
        this.layerService = layerService;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.request.Request} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            if('map.layer.activation' === request.getName()) {
                var layerId = request.getLayerId();
                if(request.isActivated()) {
                    this.mapState.activateLayer(layerId, request._creator);
                } else {
                    this.mapState.deactivateLayer(layerId, request._creator);
                }
            } else if('AddMapLayerRequest' === request.getName()) {
                var layer = this.layerService.findMapLayer(request.getMapLayerId());
                this.mapState.addLayer(layer, request._creator);
            } else if('RemoveMapLayerRequest' === request.getName()) {
                this.mapState.removeLayer(request.getMapLayerId(), request._creator);
            } else if('RearrangeSelectedMapLayerRequest' === request.getName()) {
                this.mapState.moveLayer(request.getMapLayerId(), request.getToPosition(), request._creator);
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });