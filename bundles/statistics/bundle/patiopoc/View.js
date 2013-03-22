/**
 * @class Oskari.statistics.bundle.patiopoc.View
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.patiopoc.View',
/**
 * @static constructor function
 */
function() {

}, {

	/**
	 * @method startPlugin
	 * called by host to start view operations
	 */
	startPlugin : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();

		var tbid = 'patiopoc';
		sandbox.requestByName(me.instance, 'Toolbar.ToolbarRequest', [tbid, 'add', {
			title : this.getTitle(),
			show : false,
			closeBoxCallback : function() {
				sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
			}
		}]);
		me.createToolbar(tbid);

		var el = me.getEl();
		el.addClass("patiopoc");

	},
	showContent : function(isShown) {
		var sandbox = this.instance.getSandbox();
		
		var tbid = 'patiopoc';
		var showHide = isShown ? 'show' : 'hide';
		sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [tbid, showHide]);

		var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
		var map = mapModule.getMap();
		

		if(isShown) {
			/** ENTER The Mode */

			/** set map to stats mode */
			this._setMapStatsMode();

			/** show our mode view */
			this._attachToMainView(this.getEl());

			/** show some content in our mode view */
			this._setupViewContent(this.getEl());

			/** a hack to notify openlayers of map size change */
			map.updateSize();

		} else {
			/** EXIT The Mode */

			/** set map to stats mode */
			this._setMapNormalMode();

			this._detachFromMainView(this.getEl());

			/** a hack to notify openlayers of map size change */
			map.updateSize();

		}

	},
	/**
	 * @method stopPlugin
	 * called by host to stop view operations
	 */
	stopPlugin : function() {
		var sandbox = this.instance.getSandbox();
		sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', ['patiopoc', 'remove']);
	}
}, {
	"protocol" : ["Oskari.userinterface.View"],
	"extend" : ["Oskari.userinterface.extension.DefaultView"]
});
