/**
 * @class Oskari.poc.jquery.bundle.FeatureInfoBundleInstance
 *
 */
Oskari.clazz.define("Oskari.poc.jquery.bundle.PublisherBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.template = null;
	this.plugins = {};

	/**
	 * @property injected yuilibrary property (by bundle)
	 */
	this.yuilibrary = null;

}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'PublisherWizard',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 *
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method start
	 *
	 * implements BundleInstance start methdod
	 *
	 * Note this is async as DOJO requires are resolved and
	 * notified by callback
	 *
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		
		this.localization = Oskari.getLocalization(this.getName());

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		/**
		 * Let's extend UI
		 */
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		/**
		 * let's load dependencies me
		 */
		me.mediator.bundle.require(function() {
			me.refresh();
		});
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
	 * @method afterChangeMapLayerOpacityEvent
	 */
	afterChangeMapLayerOpacityEvent : function(event) {

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
	eventHandlers : {
		'AfterMapLayerAddEvent' : function(event) {
			//this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			//this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapMoveEvent' : function(event) {

		},
		/**
		 * @method AfterChangeMapLayerOpacityEvent
		 */
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			if(this.sandbox.getObjectCreator(event) != this.getName()) {
				/* someone changed opacity */
				this.afterChangeMapLayerOpacityEvent(event);
			}
		}
	},

	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	},
	setSandbox : function(sandbox) {
		this.sandbox = null;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.jquery.publisher.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.jquery.publisher.Tile', this);
	},
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	getTitle : function() {
		return this.localization.title;
	},
	getDescription : function() {
		return "Sample";
	},
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method refresh
	 *
	 * (re)creates selected layers to a hardcoded DOM div
	 * #featureinfo This
	 */
	refresh : function() {
		var me = this;

		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
