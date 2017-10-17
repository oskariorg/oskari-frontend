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
        this.sandbox = null;
        this.started = false;
        this._plugin = null;
        this._controlPlugin = null;
        this._layer;
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
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
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

            var conf = me.conf || {},
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            me.setSandbox(sandbox);

            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesAnimationPlugin', mapModule);
            mapModule.registerPlugin(plugin);
            mapModule.startPlugin(plugin);
            this._plugin = plugin;

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            //because of timing issues, the eventhandlers may or may not be initialised by the time a time series layer is added ->
            //so check this out manually the first time around and set the eventhandlers only after.
            me._checkIfTimeseriesLayersExist();
        },
        /**
        * @method init
        * implements Module protocol init method - initializes request handlers
        */
        init: function(){
            var me = this;
            var sandbox = me.getSandbox();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        },
        /**
         * @method initTimeSeries
         * inits the timeline ui with values of a layer supporting times
         */
        initTimeseries: function(layer) {
            this._layer = layer;
            if(!this._controlPlugin) {
                this._createControlPlugin();
            }
        },
        _createControlPlugin: function (){
            var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            var controlPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin', this);
            mapModule.registerPlugin(controlPlugin);
            mapModule.startPlugin(controlPlugin);
            this._controlPlugin = controlPlugin;
        },
        _removeControlPlugin: function () {
            if(!this._controlPlugin) {
                return;
            }
            var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.stopPlugin(this._controlPlugin);
            mapModule.unregisterPlugin(this._controlPlugin);
            this._controlPlugin = null;
        },
        getTimes: function() {
            var times = this._layer.getAttributes().times;
            if(!Array.isArray(times)) {
                var interval = moment.duration(times.interval);
                var end = moment(times.end);
                var t = moment(times.start);
                times = [t.toISOString()];
                while(t.add(interval) < end) {
                    times.push(t.toISOString());
                }
                times.push(end.toISOString());
            }
            return times;
        },
        getCurrentTime: function() {
            var times = this.getTimes();
            return times[times.length-1];
        },
        requestNewTime: function(newTime, nextTime, doneCallback) {
            this._plugin.configureTimeseriesPlayback(this._layer.getId(), newTime, false, 500, moment.duration(1, 'minutes'));
            this._doneCallback = doneCallback;
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
                    me.sandbox.unregisterFromEventByName(me, p);
                }
            }
            var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.stopPlugin(this._plugin);
            mapModule.unregisterPlugin(this._plugin);

            this._removeControlPlugin();

            me.sandbox = null;
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
            'MapLayerEvent': function(event) {
                this._checkIfTimeseriesLayersExist();
            },
            'AfterMapLayerAddEvent': function (event) {
                this._checkIfTimeseriesLayersExist();
            },
            'AfterMapLayerRemoveEvent': function(event) {
                this._checkIfTimeseriesLayersExist();
            },
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
        },
        /**
         * @method @private _checkIfTimeseriesLayersExist
         * when map layers are added / removed, check if layers supporting time series are found and toggle the timeline accordingly.
         */
        _checkIfTimeseriesLayersExist: function() {
            var me = this,
                layers = me.sandbox.findAllSelectedMapLayers();
            for (var i = 0; i < layers.length; i++) {
                //the first layer to have times set, we'll use!
                if (layers[i].hasTimeseries()) {
                    if (me._controlPlugin) {
                        this._removeControlPlugin();
                    }
                    me.initTimeseries(layers[i]);
                    //time series layer found -> nothing more to do.
                    return;
                }
            }
            // no timeseries, remove control
            this._removeControlPlugin();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
       "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });