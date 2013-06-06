/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance',
/**
 * @static constructor function
 */
function() {
    this.conf =  {
        "name": "StatsGrid",
        "sandbox": "sandbox",
        "stateful" : true,

        // stats mode can be accessed from stats layers tools
        // to enable a mode triggering tile, you can uncomment the tileClazz on next line
        //"tileClazz": "Oskari.userinterface.extension.DefaultTile",
        "viewClazz": "Oskari.statistics.bundle.statsgrid.StatsView"
    };
    this.state = {
        indicators : [],
        layerId : null
    };
}, {
    "start" : function() {
        var me = this;
        var conf = this.conf ;
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
        var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;
        sandbox.register(this);

        /* stateful */
        if(conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        var locale = me.getLocalization();
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.mapModule = mapModule;

        // create the StatisticsService for handling ajax calls
        // and common functionality.
        var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', me);
        sandbox.registerService(statsService);
        this.statsService = statsService;

        // Register stats plugin for map which creates
        // - the indicator selection UI (unless 'published' param in the conf is true)
        // - the grid.
        var gridConf = {
            'state': me.getState(),
            "statistics" : [
                {"id" : "avg", "visible": true},
                {"id" : "max", "visible": true},
                {"id" : "min", "visible": true},
                {"id" : "mde", "visible": true},
                {"id" : "mdn", "visible": true},
                {"id" : "std", "visible": true},
                {"id" : "sum", "visible": true}
            ]
        }
        var gridPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', gridConf, locale);
        mapModule.registerPlugin(gridPlugin);
        mapModule.startPlugin(gridPlugin);
        this.gridPlugin = gridPlugin;

        // Register classification plugin for map.
        var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', conf ,locale);
        mapModule.registerPlugin(classifyPlugin);
        mapModule.startPlugin(classifyPlugin);
        this.classifyPlugin = classifyPlugin;

        this.setState(this.state);
    },    
	"eventHandlers" : {
		/**
		 * @method userinterface.ExtensionUpdatedEvent
		 */
		'userinterface.ExtensionUpdatedEvent' : function(event) {
			var me = this, view = this.plugins['Oskari.userinterface.View'];

			if(event.getExtension().getName() != me.getName()) {
				// not me -> do nothing
				return;
			}

			var isShown = event.getViewState() != "close";
            view.prepareMode(isShown, null, true);
		},
        /**
         * @method MapStats.StatsVisualizationChangeEvent
         */
        'MapStats.StatsVisualizationChangeEvent' : function(event) {
            this._afterStatsVisualizationChangeEvent(event);
        },
        /**
         * @method AfterMapMoveEvent
         */
        'AfterMapMoveEvent': function(event) {
            var view = this.plugins['Oskari.userinterface.View'];
            if (view.isVisible && view._layer) {
                this._createPrintParams(view._layer);
            }
        },
        'AfterMapLayerRemoveEvent': function(event) {
            var layer = event.getMapLayer(),
                layerId = layer.getId(),
                view = this.plugins['Oskari.userinterface.View'];

            if (layerId === view._layer.getId()) {
                view.prepareMode(false);
            }
        }
	},
    /**
     * @method setState
     * Sets the map state to one specified in the parameter. State is bundle specific, check the
     * bundle documentation for details.
     * @param {Object} state bundle state as JSON
     * @param {Boolean} ignoreLocation true to NOT set map location based on state
     */
    setState : function(state, ignoreLocation) {
        var me = this,
            view = this.plugins['Oskari.userinterface.View'],
            container = view.getEl();
        var layer = this.sandbox.findMapLayerFromAllAvailable(state.layerId);

        if(!layer) {
            return;
        }

        // We need to notify the grid of the current state so it can load the right indicators.
        me.gridPlugin.setState(state);

        // Load the mode and show content if not loaded already.
        if (!view.isVisible) {
            view.prepareMode(true, layer);
        }
        // Otherwise just load the indicators in the state.
        else {
            me.gridPlugin.loadStateIndicators(state, container);
        }
    },
    getState : function() {
        return this.state;
    },

    /**
     * Get state parameters.
     * Returns string with statsgrid state. State value keys are before the '-' separator and
     * the indiators are after the '-' separator. The indicators are further separated by ',' and 
     * both state values and indicator values are separated by '+'.
     *
     * @method getStateParameters
     * @return {String} statsgrid state
     */
    getStateParameters : function() {
        // If the state is null or an empty object, nothing to do here!
        if (!this.state || jQuery.isEmptyObject(this.state)) {
            return null;
        }

        var i = null,
            ilen = null,
            ilast = null,
            statsgridState = "statsgrid=",
            valueSeparator = "+",
            indicatorSeparator = ",",
            stateValues = null,
            indicatorValues = null,
            state = this.state,
            keys = ['layerId', 'currentColumn', 'methodId', 'numberOfClasses', 'manualBreaksInput'],
            indicators = state.indicators || [];

        // Note! keys needs to be handled in the backend as well. Therefore the key order is important as well as actual values.
        // 'manualBreaksInput' can be an empty string and must be last.
        for (i = 0, ilen = keys.length, ilast = ilen - 1; i < ilen; i++) {
            value = state[keys[i]];
            if (value == null) {
                // skip undefined and null
            } else {
                stateValues += value;
            }
            if (i != ilast) {
                stateValues += valueSeparator;
            }
        }

        // handle indicators separately
        for (i = 0, ilen = indicators.length, ilast = ilen - 1; i < ilen; i++) {
            indicatorValues += indicators[i].indicator;
            indicatorValues += valueSeparator;
            indicatorValues += indicators[i].year;
            indicatorValues += valueSeparator;
            indicatorValues += indicators[i].gender;
            if (i != ilast) {
                indicatorValues += indicatorSeparator;
            }
        }

        if (stateValues && indicatorValues) {
            return statsgridState + stateValues + "-" + indicatorValues;
        } else {
            return null;
        }
    },

    /**
     * Creates parameters for printout bundle and sends an event to it.
     * Params include the BBOX and the image url of the layer with current
     * visualization parameters.
     *
     * @method _createPrintParams
     * @private
     * @param {Object} layer
     */
    _createPrintParams: function(layer) {
        var oLayer = this.mapModule.getOLMapLayers(layer.getId())[0],
            data = [{
                // The max extent of the layer
                bbox: oLayer.maxExtent.toArray(),
                // URL of the image with current viewport
                // bounds and all the original parameters
                url: oLayer.getURL(oLayer.getExtent())
            }],
            retainEvent,
            eventBuilder;

        // If the event is already defined, just update the data.
        if (this.printEvent) {
            retainEvent = true;
            this.printEvent.setLayer(layer);
            this.printEvent.setTileData(data);
        }
        // Otherwise create the event with the data.
        else {
            retainEvent = false;
            eventBuilder = this.sandbox.getEventBuilder('Printout.PrintableContentEvent');
            if (eventBuilder) {
                this.printEvent = eventBuilder(this.getName(), layer, data);
            }
        }

        this.sandbox.notifyAll(this.printEvent, retainEvent);
    },

    /**
     * Saves params to the state and sends them to the print service as well.
     *
     * @method _afterStatsVisualizationChangeEvent
     * @private
     * @param {Object} event
     */
    _afterStatsVisualizationChangeEvent: function(event) {
        var params = event.getParams(),
            layer = event.getLayer();

        // Saving state
        this.state.methodId = params.methodId;
        this.state.numberOfClasses = params.numberOfClasses;
        this.state.manualBreaksInput = params.manualBreaksInput;
        this.state.colors = params.colors;
        // Send data to printout bundle
        this._createPrintParams(layer);
    }
}, {
	"extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});

