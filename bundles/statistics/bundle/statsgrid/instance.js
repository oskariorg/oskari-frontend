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
        // stats mode can be accessed from stats layers tools
        // to enable a mode triggering tile, you can uncomment the tileClazz on next line
        //"tileClazz": "Oskari.userinterface.extension.DefaultTile",
        "viewClazz": "Oskari.statistics.bundle.statsgrid.StatsView"
    };
}, {
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
			view.showContent(isShown, true);
		}
	}

}, {
	"extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});
