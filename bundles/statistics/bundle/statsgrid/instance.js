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
        'MapStats.StatsVisualizationChangeEvent' : function(event) {
            this._afterStatsVisualizationChangeEvent(event);
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
        console.log("statsgrid state: ", state);
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
        return statsgridState + stateValues + "-" + indicatorValues;
    },
    _afterStatsVisualizationChangeEvent: function(event) {
        var params = event.getParams();
        this.state.methodId = params.methodId;
        this.state.numberOfClasses = params.numberOfClasses;
        this.state.manualBreaksInput = params.manualBreaksInput;
    }
}, {
	"extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});

