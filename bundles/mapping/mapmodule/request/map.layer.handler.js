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
        this.layerQueue = [];
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
            const sandbox = this.layerService.getSandbox();

            if (request.getName() === 'activate.map.layer') {
                const layerId = request.getLayerId();
                if (request.isActivated()) {
                    this.mapState.activateLayer(layerId, request._creator);
                } else {
                    this.mapState.deactivateLayer(layerId, request._creator);
                }
            } else if (request.getName() === 'AddMapLayerRequest') {
                this._addToMap(request.getMapLayerId(), request._creator);
            } else if (request.getName() === 'RemoveMapLayerRequest') {
                this.mapState.removeLayer(request.getMapLayerId(), request._creator);
            } else if (request.getName() === 'RearrangeSelectedMapLayerRequest') {
                this.mapState.moveLayer(request.getMapLayerId(), request.getToPosition(), request._creator);
            } else if (request.getName() === 'ChangeMapLayerOpacityRequest') {
                const layer = this.mapState.getSelectedLayer(request.getMapLayerId());
                const opacity = request.getOpacity();
                if (!layer || isNaN(opacity)) {
                    return;
                }
                layer.setOpacity(Number(opacity));

                const evt = Oskari.eventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
                evt._creator = request._creator;
                sandbox.notifyAll(evt);
            } else if (request.getName() === 'ChangeMapLayerStyleRequest') {
                const layer = this.mapState.getSelectedLayer(request.getMapLayerId());
                if (!layer) {
                    return;
                }
                layer.selectStyle(request.getStyle());

                const evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                evt._creator = request._creator;
                sandbox.notifyAll(evt);
            }
        },
        /**
         * Triggers loading additional info for layers (when needed) and adding them to a queue to be added to map.
         * Adding can be asynchronous for some layers, but the order the method is called will be respected
         * @param {String} layerId id for layer to add
         * @param {String} triggeredBy (optional) what triggered the add
         */
        _addToMap: function (layerId, triggeredBy) {
            const layer = this.layerService.findMapLayer(layerId);
            const layerStatus = {
                layer,
                triggeredBy,
                ready: false
            };
            // use queue so the layers are added to map in the same order as they are added with the request
            // otherwise layers would be added to map in the order where the additional metadata loading was completed
            this.layerQueue.push(layerStatus);
            const done = () => {
                // change status for this layer
                layerStatus.ready = true;
                // add layers from front of queue to map
                this.__processLayerQueue();
            };
            this._loadLayerInfo(layer, done);
        },
        /**
         * Processes the queue for layers to add to map in the order they were requested to be added.
         * The queue is used to ensure order even when theres some asynchronous loading happening between
         * request and actual adding to the map
         */
        __processLayerQueue: function () {
            let nextLayer = this.layerQueue[0];
            while (nextLayer && nextLayer.ready) {
                this.mapState.addLayer(nextLayer.layer, nextLayer.triggeredBy);
                this.layerQueue.shift();
                nextLayer = this.layerQueue[0];
            }
        },

        _loadLayerInfo: function (layer, done) {
            if (typeof layer.getDescribeLayerStatus !== 'function') {
                // layer type doesn't support this
                done();
                return;
            }
            const layerId = layer.getId();
            const status = layer.getDescribeLayerStatus();
            // only layers that have numeric ids can have reasonable response for DescribeLayer
            if (isNaN(layerId) || status === DESCRIBE_LAYER.LOADED) {
                done();
                return;
            }
            if (status === DESCRIBE_LAYER.PENDING) {
                return;
            }
            layer.setDescribeLayerStatus(DESCRIBE_LAYER.PENDING);
            this.layerService.getDescribeLayer(layer, info => {
                if (!info) {
                    layer.setDescribeLayerStatus(DESCRIBE_LAYER.ERROR);
                    if (layer.requiresDescribeLayer()) {
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
                done();
            });
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
