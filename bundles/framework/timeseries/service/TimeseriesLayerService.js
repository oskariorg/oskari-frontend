/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesLayerService
 *
 * Keeps track of visible layers that have timeseries functionality
 * Registers clazzes to be used as animators for specific layer types in timeseries
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.timeseries.TimeseriesLayerService',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    function (sandbox, timeseriesService) {
        var me = this,
            p;

        me._layerTypeAnimators = {};
        me._timeseriesService = timeseriesService;
        me._sandbox = sandbox;
        for (p in me.__eventHandlers) {
            if (me.__eventHandlers.hasOwnProperty(p)) {
                me._sandbox.registerForEventByName(me, p);
            }
        }
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.mapframework.bundle.timeseries.TimeseriesLayerService',
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: "TimeseriesLayerService",
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @static @property {Object} __eventHandlers
         */
        __eventHandlers: {
            'AfterRearrangeSelectedMapLayerEvent': function (event) {
                console.log('AfterRearrangeSelectedMapLayerEvent', event)
                this.updateTimeseriesLayers();
            },
            'AfterMapLayerAddEvent': function (event) {
                console.log('AfterMapLayerAddEvent', event)
                this.updateTimeseriesLayers();
            },
            'AfterMapLayerRemoveEvent': function (event) {
                console.log('AfterMapLayerRemoveEvent', event)
                this.updateTimeseriesLayers();
                var series = this._timeseriesService.unregisterTimeseries(event.getMapLayer().getId(), 'layer');
                series.delegate.destroy();
            }
        },
        /**
         * @public @method onEvent
         * Event is handled forwarded to correct eventHandlers if found or discarded if not.
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.__eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        registerLayerType: function (type, className) {
            this._layerTypeAnimators[type] = className;
        },
        _layerDelegateFactory: function (layerId, layerType) {
            var animatorClassName = this._layerTypeAnimators[layerType];
            if (!animatorClassName) {
                throw new Error('No animator defined for layer type "' + layerType + '"!');
            }
            return Oskari.clazz.create(animatorClassName, this._sandbox, layerId);
        },
        updateTimeseriesLayers: function () {
            var me = this,
                layers = me._sandbox.findAllSelectedMapLayers();
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].hasTimeseries()) {
                    var layer = layers[i];
                    var series = this._timeseriesService.getTimeseries(layer.getId(), 'layer');
                    if (!series) {
                        var delegate = me._layerDelegateFactory(layer.getId(), layer.getLayerType());
                        this._timeseriesService.registerTimeseries(layer.getId(), 'layer', -i, delegate);
                    } else {
                        this._timeseriesService.updateTimeseriesPriority(layer.getId(), 'layer', -i);
                    }
                }
            }
        }
    });
