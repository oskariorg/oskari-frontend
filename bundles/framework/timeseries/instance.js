/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.timeseries.TimeseriesPlaybackPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this._localization = null;
        this._modules = {};
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
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
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

            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            me.setSandbox(sandbox);
            this.localization = Oskari.getLocalization(this.getName());

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
            var locale = this.getLocalization('timeseriesplayback');
            var playback = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesPlayback', this, me.conf, locale, mapModule, sandbox);
            me._modules.playback = playback;
        },
        /**
         * @method initTimeSeries
         * inits the timeline ui with values of a layer supporting times
         */
        initTimeseries: function(layer) {
            var me = this,
                times = layer.getAttributes().times,
                layerId = layer.getId();

            //set the initial state, don't start playing yet.
            me.play(layerId, times, false, 'TIME', 'ISO8601');
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var me = this;
            me.started = false;
            if(me._modules.playback) {
                me._modules.playback.removeSlider();
            }
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.unregisterFromEventByName(me, p);
                }
            }
            me.sandbox = null;
        },
        /**
         * @method play
         * init the timeline and slider + optionally start playing. Defaults to false.
         */
        play: function(layerId, times, autoPlay, dimensionName, units) {
            this._modules.playback.showSlider(layerId, times, autoPlay, dimensionName, units);
        },
        /**
         * @method  @private _handleMapSizeChanged handle map size change event
         * @param  {Object} size map size
         */
        _handleMapSizeChanged: function(size){
            var me = this;
            if(me._modules.playback) {
                me._modules.playback.handleMapSizeChanged(size);
            }
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
            MapSizeChangedEvent: function (evt) {
                this._handleMapSizeChanged({width:evt.getWidth(), height:evt.getHeight()});
            },
            'MapLayerEvent': function(event) {
                this._checkIfTimeseriesLayersExist();
            },
            'AfterMapLayerAddEvent': function (event) {
                this._checkIfTimeseriesLayersExist();
            },
            'AfterMapLayerRemoveEvent': function(event) {
                this._checkIfTimeseriesLayersExist();
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
                if (layers[i].getAttributes().times) {
                    //only reinitialise if the control has not yet been initialised with the data of this layer
                    if (!(me._modules.playback.getControl()) ||
                        !(me._modules.playback.getSelectedLayerId()) ||
                         (me._modules.playback.getSelectedLayerId() && me._modules.playback.getSelectedLayerId() !== layers[i].getId())) {
                            me.initTimeseries(layers[i]);
                    }
                    //time series layer found -> nothing more to do.
                    return;
                }
            }
            //no layers found -> remove the control
            me._modules.playback.removeSlider();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
       "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });