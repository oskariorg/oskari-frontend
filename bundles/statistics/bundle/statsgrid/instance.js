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
    this.state = {};
}, {
    "init" : function() {
    	var me = this;
        var conf = me.conf ;
        var locale = me.getLocalization();
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

        // create the StatisticsService for handling ajax calls
        // and common functionality.
        var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', me);
        sandbox.registerService(statsService);
        this.statsService = statsService;

        // Register stats plugin for the map which creates
        // - the indicator selection UI (unless 'published' param in the conf is true)
        // - the grid.
        var gridConf = {
            'state': me.getState()
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
        return null;
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
        var me = this,
            view = this.plugins['Oskari.userinterface.View'],
            container = view.getEl();
        var layer = this.sandbox.findMapLayerFromAllAvailable(state.layerId);

        // We need to notify the grid of the current state so it can load the right indicators.
        me.gridPlugin.setState(state);

        // Load the mode and show content if not loaded already.
        if (!view.isVisible) {
            view.prepareMode(true, layer);
        }
        // Otherwise just load the indicators in the state.
        else {
            me.gridPlugin.loadStateIndicators(container, state);
        }

        if(this.state != null && this.state.indicators != null && this.state.indicators.length > 0) {
            this.state.indicators = [];
        }
    },
    getState : function() {
        if(this.sandbox.getUser().isLoggedIn()) {
            return this.state;
        }
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

