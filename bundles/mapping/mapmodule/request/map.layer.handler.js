import { DESCRIBE_LAYER } from '../domain/constants';
import { Messaging } from 'oskari-ui/util';
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

    function (mapState, layerService, getMsg) {
        this.mapState = mapState;
        this.getMsg = getMsg;
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
                this._addToMap(request.getMapLayerId(), request.getOptions(), request._creator);
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
        _addToMap: function (layerId, opts = {}, triggeredBy) {
            const layer = this.layerService.findMapLayer(layerId);
            const layerStatus = {
                layer,
                triggeredBy,
                ready: false
            };
            // use queue so the layers are added to map in the same order as they are added with the request
            // otherwise layers would be added to map in the order where the additional metadata loading was completed
            this.layerQueue.push(layerStatus);
            const done = (error) => {
                // change status for this layer
                if (error) {
                    // filter layerStatus out from queue so it doesn't block other layers from being added to the map
                    this.layerQueue = this.layerQueue.filter(status => status !== layerStatus);
                    Messaging.error(this.getMsg('layerUnsupported.unavailable', { name: layer.getName() }));
                } else {
                    layerStatus.ready = true;
                }
                // add layers from front of queue to map
                this.__processLayerQueue();
                // zoom to content or center/supported zoom level
                const sandbox = this.layerService.getSandbox();
                if (opts.zoomContent) {
                    sandbox.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layerId, opts.zoomContent]);
                }
                if (typeof opts.toPosition === 'number') {
                    sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [layerId, opts.toPosition]);
                }
            };
            this._loadLayerInfo(layer, opts, done);
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

        _loadLayerInfo: function (layer, opts, done) {
            if (typeof layer.getDescribeLayerStatus !== 'function') {
                // layer type doesn't support this
                done();
                return;
            }
            const layerId = layer.getId();
            const status = layer.getDescribeLayerStatus();
            if (status === DESCRIBE_LAYER.LOADED) {
                // already processed, we can proceed with adding the layer to map
                done();
                return;
            }
            if (typeof layerId === 'string' && layerId.startsWith('userlayer')) {
                // process coverage WKT for userlayers
                // it is included in the layer data for userlayers and DescribeLayer is not used
                this.__handleLayerInfoSuccess(layer, {
                    coverage: layer.getGeometryWKT()
                });
            }
            if (typeof layerId === 'string' && layerId.startsWith('myplaces')) {
                // myplaces layer in embedded maps/links has the type wfslayer
                // since they have their style in options but are NOT run through the myplaces modelbuilder
                // we need to parse the styles here...
                layer.setStylesFromOptions(layer.getOptions());
                this.__handleLayerInfoSuccess(layer, {});
            }
            // only layers that have numeric ids can have reasonable response for DescribeLayer
            if (isNaN(layerId)) {
                done();
                return;
            }
            if (status === DESCRIBE_LAYER.PENDING) {
                return;
            }
            layer.setDescribeLayerStatus(DESCRIBE_LAYER.PENDING);
            this.layerService.getDescribeLayer(layer, opts, info => {
                if (!info) {
                    layer.setDescribeLayerStatus(DESCRIBE_LAYER.ERROR);
                    if (layer.requiresDescribeLayer()) {
                        this.log.error('Attempt to add layer that requires more info. Skipping id: ' + layerId);
                        done(true);
                        return;
                    }
                }
                this.__handleLayerInfoSuccess(layer, info);
                done();
            });
        },
        __handleLayerInfoSuccess: function (layer, describeInfo) {
            const sandbox = this.layerService.getSandbox();
            const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            layer.setDescribeLayerStatus(DESCRIBE_LAYER.LOADED);
            layer.handleDescribeLayer(describeInfo);
            mapModule.handleDescribeLayer(layer, describeInfo);
            const event = Oskari.eventBuilder('MapLayerEvent')(layer.getId(), 'update');
            sandbox.notifyAll(event);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
