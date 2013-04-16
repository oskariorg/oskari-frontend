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
debugger;
        alert(state.foo);
    },
    getState : function() {
debugger;
        return this.state;
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
        var layer = event.getLayer();
        var params = event.getParams();
debugger;
    }
}, {
	"extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});

