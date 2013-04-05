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


}, {
	"extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});
