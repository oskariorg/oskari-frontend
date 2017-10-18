/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.timeseries.TimeseriesAnimationPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance",
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._sandbox;
        this.started = false;
        this._controlPlugin;
        this._timeseriesService;
        this._timeseriesLayerService;
    }, {
        __name: 'timeseries',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            var sandboxName = (me.conf ? me.conf.sandbox : null) || 'sandbox';
            var sandbox = me._sandbox = Oskari.getSandbox(sandboxName);

            me._timeseriesService = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesService');
            sandbox.registerService(me._timeseriesService);

            me._timeseriesLayerService = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesLayerService', sandbox, me._timeseriesService);
            sandbox.registerService(me._timeseriesLayerService);
            me._timeseriesLayerService.registerLayerType('wms', 'Oskari.mapframework.bundle.timeseries.WMSAnimator');

            Oskari.on('app.start', function() {
                me._timeseriesService.on('activeChanged', me._updateControl.bind(me));
                me._timeseriesLayerService.updateTimeseriesLayers();
            });

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
        },
        /**
        * @method init
        * implements Module protocol init method - initializes request handlers
        */
        init: function(){
        },
        _updateControl: function(active) {
            if(active){
                this._createControlPlugin(active.delegate, active.conf);
            } else {
                this._removeControlPlugin();
            }
        },
        _createControlPlugin: function (delegate, conf){
            this._removeControlPlugin();
            var mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            var controlPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin', delegate, conf);
            mapModule.registerPlugin(controlPlugin);
            mapModule.startPlugin(controlPlugin);
            this._controlPlugin = controlPlugin;
        },
        _removeControlPlugin: function () {
            if(!this._controlPlugin) {
                return;
            }
            var mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.stopPlugin(this._controlPlugin);
            mapModule.unregisterPlugin(this._controlPlugin);
            this._controlPlugin = null;
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var me = this;
            me.started = false;
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }
            this._removeControlPlugin();
            me._sandbox = null;
        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        eventHandlers: {
            /*,
            'ProgressEvent': function(event) {
                if(event.getStatus() && this._plugin.getCurrentLayerId() === event.getId()) {
                    console.log('progressevent. hass cb:', !!this._doneCallback)
                    //this._plugin.advancePlayback();
                    if(this._doneCallback){
                        this._doneCallback();
                        this._doneCallback = null;                                             
                    }
                }
            }
            */
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });