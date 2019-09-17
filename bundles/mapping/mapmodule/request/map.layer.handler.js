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
            var sandbox = this.layerService.getSandbox();
            var layer;
            var evt;

            if (request.getName() === 'activate.map.layer') {
                var layerId = request.getLayerId();
                if (request.isActivated()) {
                    this.mapState.activateLayer(layerId, request._creator);
                } else {
                    this.mapState.deactivateLayer(layerId, request._creator);
                }
            } else if (request.getName() === 'AddMapLayerRequest') {
                layer = this.layerService.findMapLayer(request.getMapLayerId());
                this.mapState.addLayer(layer, request._creator);
            } else if (request.getName() === 'RemoveMapLayerRequest') {
                this.mapState.removeLayer(request.getMapLayerId(), request._creator);
            } else if (request.getName() === 'RearrangeSelectedMapLayerRequest') {
                this.mapState.moveLayer(request.getMapLayerId(), request.getToPosition(), request._creator);
            } else if (request.getName() === 'ChangeMapLayerOpacityRequest') {
                layer = this.mapState.getSelectedLayer(request.getMapLayerId());
                if (!layer) {
                    return;
                }
                layer.setOpacity(request.getOpacity());

                evt = Oskari.eventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
                evt._creator = request._creator;
                sandbox.notifyAll(evt);
            } else if (request.getName() === 'ChangeMapLayerStyleRequest') {
                if (request.getStyle() === '!default!') {
                    // Check for magic string - should propably be removed...
                    return;
                }
                layer = this.mapState.getSelectedLayer(request.getMapLayerId());
                if (!layer) {
                    return;
                }
                layer.selectStyle(request.getStyle());

                evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                evt._creator = request._creator;
                sandbox.notifyAll(evt);
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
