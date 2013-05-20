/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsToolbar', 
/**
 * @static constructor function
 * @param {Object} localization
 * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
 */
function(localization, instance) {
    this.toolbarId = 'statsgrid';
    this.instance = instance;
    this.localization = localization;
    this._createUI();
}, {
    show : function(isShown) {
        var showHide = isShown ? 'show' : 'hide';
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, showHide]);
    },
    destroy : function() {
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'remove']);
    },
    changeName: function(title) {
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'changeName', title]);
    },
	/**
	 * @method _createUI
	 * sample toolbar for statistics functionality
	 */
	_createUI : function() {

        var view = this.instance.plugins['Oskari.userinterface.View'];
        var me = this;
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'add', {
            title : me.localization.title,
            show : false,
            closeBoxCallback : function() {
                view.showMode(false);
                view.showContent(false);
            }
        }]);
	}
});
