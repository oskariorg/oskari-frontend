/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this._localization = null;
}, {
	__name : 'coordinatedisplay',
	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	update : function() {
		var me = this;
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
	 * 		JSON object for complete data depending on localization
	 * 		structure and if parameter key is given
	 */
	getLocalization : function(key) {
		if(!this._localization) {
			this._localization = Oskari.getLocalization(this.getName());
		}
		if(key) {
			return this._localization[key];
		}
		return this._localization;
	},
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	start : function() {
		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;

		// Should this not come as a param?
			var conf = me.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);
		me.setSandbox(sandbox);

		var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
		var conf = {};
		var locale = this.getLocalization('display');
		var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin', conf, locale);
		mapModule.registerPlugin(plugin);
		mapModule.startPlugin(plugin);
		this.plugin = plugin;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	stop : function() {
		this.sandbox = null;
		this.started = false;
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	protocol : ['Oskari.bundle.BundleInstance']
});
