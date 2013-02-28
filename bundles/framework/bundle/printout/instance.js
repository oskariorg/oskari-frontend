/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.printout.PrintoutBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
	this.printout = null;
	this.buttonGroup = 'viewtools';
	this.ignoreEvents = false;
	this.dialog = null;
	this.printoutHandler = null;
	this.backendConfiguration = {
		formatProducers : {
			"application/pdf" : 
				"http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.pdf?",
			"image/png" : 
				"http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.png?"
		}
	};
	var me = this;

}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Printout',
	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method getLocalization
	 * Returns JSON presentation of bundles localization data for current language.
	 * If key-parameter is not given, returns the whole localization data.
	 *
	 * @param {String} key (optional) if given, returns the value for key
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
	 * Implements BundleInstance protocol start method
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;
				var conf = this.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);

		me.sandbox = sandbox;

		this.localization = Oskari.getLocalization(this.getName());

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		// requesthandler
		this.printoutHandler = Oskari.clazz.create('Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler', sandbox, function() {
			me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);
		});
		sandbox.addRequestHandler('printout.PrintMapRequest', this.printoutHandler);
		// request toolbar to add buttons
		var addBtnRequestBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
		var btns = {
			'print' : {
				iconCls : 'tool-print',
				tooltip : '',
				sticky : true,
				callback : function() {
					me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
				}
			}
		};
		for(var tool in btns) {
			sandbox.request(this, addBtnRequestBuilder(tool, this.buttonGroup, btns[tool]));
		}

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
		sandbox.request(this, request);

		//sandbox.registerAsStateful(this.mediator.bundleId, this);
		// draw ui
		me._createUi();
	},
	/**
	 * @method init
	 * Implements Module protocol init method - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * Implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 */
	onEvent : function(event) {
		var handler = this.eventHandlers[event.getName()];
		if(!handler) {
			return;
		}
		return handler.apply(this, [event]);
	},
	/**
	 * @property {Object} eventHandlers
	 * @static
	 */
	eventHandlers : {
		'MapLayerVisibilityChangedEvent' : function(event) {
			if(this.printout) {
				this.printout.refresh();
			}
		}
	},
	/**
	 * @method stop
	 * Implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.removeRequestHandler('printout.PrintMapRequest', this.printoutHandler);
		this.printoutHandler = null;

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
		sandbox.request(this, request);

		//this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout 
	 * Oskari.mapframework.bundle.printout.Flyout
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.printout.Flyout', this);
		/*this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.printout.Tile', this);*/
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		/*this.plugins['Oskari.userinterface.Tile'] = null;*/
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle
	 * @return {String} localized text for the title of the component
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription
	 * @return {String} localized text for the description of the component
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method _createUi
	 * @private
	 * (re)creates the UI for "printout" functionality
	 */
	_createUi : function() {
		var me = this;
		this.plugins['Oskari.userinterface.Flyout'].createUi();
		/*this.plugins['Oskari.userinterface.Tile'].refresh();*/
	},
	/**
	 * @method setPublishMode
	 * Transform the map view to printout mode if parameter is true and back to normal if false.
	 * Makes note about the map layers that the user cant publish, removes them for publish mode and
	 * returns them when exiting the publish mode.
	 *
	 * @param {Boolean} blnEnabled
	 */
	setPublishMode : function(blnEnabled) {
		var me = this;
		var map = jQuery('#contentMap');
		var tools = jQuery('#maptools');

		if(blnEnabled == true) {
			this.oskariLang = Oskari.getLang();

			me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);

			// proceed with printout view
			this.printout = Oskari.clazz.create('Oskari.mapframework.bundle.printout.view.BasicPrintout', this, this.getLocalization('BasicView'), this.backendConfiguration);
			this.printout.render(map);
			this.printout.setEnabled(true);
		} else {
			Oskari.setLang(this.oskariLang);
			if(this.printout) {
				this.printout.setEnabled(false);
				this.printout.destroy();
				this.printout = null;
			}
		}
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
