import { DESCRIBE_LAYER } from '../domain/constants';
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
        this.log = Oskari.log('map.layer.handler');
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
                const addLayer = () => this.mapState.addLayer(layer, request._creator);
                this._loadLayerInfo(layer, addLayer);
            } else if (request.getName() === 'RemoveMapLayerRequest') {
                this.mapState.removeLayer(request.getMapLayerId(), request._creator);
            } else if (request.getName() === 'RearrangeSelectedMapLayerRequest') {
                this.mapState.moveLayer(request.getMapLayerId(), request.getToPosition(), request._creator);
            } else if (request.getName() === 'ChangeMapLayerOpacityRequest') {
                layer = this.mapState.getSelectedLayer(request.getMapLayerId());
                const opacity = request.getOpacity();
                if (!layer || isNaN(opacity)) {
                    return;
                }
                layer.setOpacity(Number(opacity));

                evt = Oskari.eventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
                evt._creator = request._creator;
                sandbox.notifyAll(evt);
            } else if (request.getName() === 'ChangeMapLayerStyleRequest') {
                layer = this.mapState.getSelectedLayer(request.getMapLayerId());
                if (!layer) {
                    return;
                }
                layer.selectStyle(request.getStyle());

                evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                evt._creator = request._creator;
                sandbox.notifyAll(evt);
            }
        },
        _loadLayerInfo: function (layer, addLayer) {
            if (typeof layer.getDescribeLayerStatus !== 'function') {
                // layer type doesn't support this
                addLayer();
                return;
            }
            const layerId = layer.getId();
            if (isNaN(layerId)) {
                // only layers that have numeric ids can have reasonable response for DescribeLayer
                addLayer();
                return;
            }
            const status = layer.getDescribeLayerStatus();
            if (status === DESCRIBE_LAYER.LOADED || status === DESCRIBE_LAYER.PENDING) {
                return;
            }
            layer.setDescribeLayerStatus(DESCRIBE_LAYER.PENDING);
            this.layerService.getDescribeLayer(layerId, info => {
                if (!info) {
                    layer.setDescribeLayerStatus(DESCRIBE_LAYER.ERROR);
                    if (layer.requiresDescripeLayer()) {
                        // notify user here or in implementations
                        this.log.error('Attempt to add layer that requires more info. Skipping id: ' + layerId);
                        return;
                    }
                }
                layer.setDescribeLayerStatus(DESCRIBE_LAYER.LOADED);
                const sandbox = this.layerService.getSandbox();
                layer.handleDescribeLayer(info);
                sandbox.findRegisteredModuleInstance('MainMapModule').handleDescribeLayer(layer, info);
                const event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
                sandbox.notifyAll(event);
                addLayer();
            });
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
