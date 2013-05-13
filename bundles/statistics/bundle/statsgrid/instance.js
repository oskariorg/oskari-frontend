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

        // register plugin for map 
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
            view.showMode(isShown, true);
			view.showContent(isShown);
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
        var me = this, view = this.plugins['Oskari.userinterface.View'];
        var layer = this.sandbox.findMapLayerFromAllAvailable(state.layerId);
        var contentLoadedCallback = function() {
            if(state.indicators.length > 0){

                //send ajax calls and build the grid
                view.getSotkaIndicatorsMeta(state.indicators, function(){

                    //send ajax calls and build the grid
                    view.getSotkaIndicatorsData(state.indicators, function(){

                        if(state.currentColumn != null) {

                            if(state.methodId != null && state.methodId > 0) {
                                var select = me.classifyPlugin.element.find('.classificationMethod').find('.method');
                                select.val(state.methodId);
                                // The manual breaks method:
                                if(state.methodId == 4 && state.manualBreaksInput) {
                                    var manualInput = me.classifyPlugin.element.find('.manualBreaks').find('input[name=breaksInput]');
                                    manualInput.val(state.manualBreaksInput);
                                    me.classifyPlugin.element.find('.classCount').hide();
                                    me.classifyPlugin.element.find('.manualBreaks').show();
                                }
                            }
                            if(state.numberOfClasses != null && state.numberOfClasses > 0) {
                                var slider = me.classifyPlugin.rangeSlider;
                                if(slider != null) {
                                    slider.slider("value", state.numberOfClasses);
                                    slider.parent().find('input#amount_class').val(state.numberOfClasses);
                                }
                            }
                            // current column is needed for rendering map
                            var columns = view.grid.getColumns();
                            for (var i = 0; i < columns.length; i++) {
                                var column = columns[i];
                                if (column.id == state.currentColumn) {
                                    view.sendStatsData(column);
                                }
                            };
                        }
                    });
                });
            }
        };

        // Load the mode and show content if not loaded already.
        if (!view.isVisible) {
            view.showMode(true);
            view.showContent(true, layer, contentLoadedCallback);
        }
        // Otherwise just set the state.
        else {
            contentLoadedCallback();
        }

        if(!view.grid) {
            return;
        }

        view.clearDataFromGrid();

        if(this.state != null && this.state.indicators != null && this.state.indicators.length > 0) {
            this.state.indicators = [];
        }
    },
    getState : function() {
        if(this.sandbox.getUser().isLoggedIn()) {
            return this.state;
        }
    },

	    /**
     * @method showMessage
     * Shows user a message with ok button
     * @param {String} title popup title
     * @param {String} message popup message
     */
    showMessage : function(title, message) {
        var loc = this.getLocalization();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(loc.buttons.ok);
    	okBtn.addClass('primary');
    	okBtn.setHandler(function() {
            dialog.close(true);
    	});
    	dialog.show(title, message, [okBtn]);
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

