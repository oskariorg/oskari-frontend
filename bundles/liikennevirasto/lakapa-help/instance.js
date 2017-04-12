/**
 * @class Oskari.liikenenvirasto.bundle.lakapa.HelpFlyoutBundleInstance
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.HelpFlyoutBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.plugins = {};
	this._locale = null;
	this._requestHandlers = {};

	this.layerPlugin = null;
	this.layer = null;
}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'LakapaHelpBundle',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	getLocale : function() {
		return this._locale;
	},
	/**
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {
		var me = this;
		if(me.started)
			return;

		me.started = true;

		/* locale */
		me._locale = Oskari.getLocalization(this.getName());

		var conf = me.conf;

		/* sandbox */
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);
        me.sandbox = sandbox;

        // register to sandbox as a module
        sandbox.register(me);

        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        if(reqBuilder) {

            // got builder -> toolbar is loaded
            sandbox.request(me, reqBuilder('help', 'lakapahelptools', {
                iconCls : 'tool-lakapa-help-icon',
                tooltip: me._locale.tooltips.helptool,
                sticky: false,
                callback : function() {
                	me.showHelp();
                }
            }));
        }

		for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}

		/* request handler */
		this._requestHandlers['TransportChangedRequest'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.help.request.TransportChangedRequestHandler', sandbox, this);
		sandbox.addRequestHandler('TransportChangedRequest', this._requestHandlers['TransportChangedRequest']);
		this._requestHandlers['ShowHelpRequest'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.help.request.ShowHelpRequestHandler', sandbox, this);
		sandbox.addRequestHandler('ShowHelpRequest', this._requestHandlers['ShowHelpRequest']);
		this._requestHandlers['ChangeLanguageRequest'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequestHandler', sandbox, this);
		sandbox.addRequestHandler('ChangeLanguageRequest', this._requestHandlers['ChangeLanguageRequest']);

		var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		/* stateful */
		sandbox.registerAsStateful(this.mediator.bundleId, this);



	},
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 *
	 * implements bundle instance update method
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 */
	onEvent : function(event) {
		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;
		return handler.apply(this, [event]);

	},
	/**
	 * @property eventHandlers
	 * @static
	 *
	 */
	eventHandlers : {},

	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {

		var sandbox = this.sandbox;

		/* request handler cleanup */
		sandbox.removeRequestHandler('TransportChangedRequest', this._requestHandlers['TransportChangedRequest']);
		sandbox.removeRequestHandler('ShowHelpRequest', this._requestHandlers['ShowHelpRequest']);
		sandbox.removeRequestHandler('ChangeLanguageRequest', this._requestHandlers['ChangeLanguageRequest']);
		/* sandbox cleanup */

		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	setSandbox : function(sandbox) {
		this.sandbox = null;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.help.Flyout', this, this.getLocale()['flyout'], this.conf);
	},
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
	},
	getTitle : function() {
		return this.getLocale()['title'];
	},
	getDescription : function() {
		return "Help";
	},
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method showHelp
	 */
	showHelp : function() {
		/** update flyout content */
		this.plugins['Oskari.userinterface.Flyout'].showHelp();
		this.getSandbox().requestByName(this, 'userinterface.UpdateExtensionRequest', [this, 'detach']);
	},
	/**
	 * @method setState
	 * @param {Object} state bundle state as JSON
	 */
	setState : function(state) {
		this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
	},
	/**
	 * @method getState
	 * @return {Object} bundle state as JSON
	 */
	getState : function() {
		return this.plugins['Oskari.userinterface.Flyout'].getContentState();
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
