/**
 * Let's create a bundle to embed AKP mapplettools from 2003
 * 
 * 
 */

/**
 * Bundle Instance
 * 
 * @class Oskari.mapframework.bundle.NlsFiMappletToolsBundleInstance
 * 
 * This class is POC for adding 3rd party maps to mapframework UI
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.NlsFiMappletToolsBundleInstance",
/**
 * @constructor
 */
function(b) {
	this.name = 'mapplettools';
	this.mediator = null;
	this.sandbox = null;
	this.conf = null;

	this.impl = null;

	this.ui = null;
},
		/*
		 * 
		 */
		{

			/**
			 * @method init start bundle instance
			 * 
			 */

			"init" : function() {

			},

		
			createToolsPanel: function() {
				
			},
			

			/**
			 * @method start
			 * 
			 * starts the bundle registers events creates map, map container and
			 * ui panel
			 */
			"start" : function() {

				if (this.mediator.getState() == "started")
					return;

				this.libs = {
					ext : Oskari.$("Ext")
				};

				var conf = Oskari.$("startup");
				var facade = Oskari.$('UI.facade');
				this.facade = facade;
				var sandbox = facade.getSandbox();
				this.sandbox = sandbox;

				sandbox.register(this);
				for (p in this.eventHandlers) {
					sandbox.registerForEventByName(this, p);
				}

				this.conf = conf;
				var pnl = this.createToolsPanel();
			

				var def = this.facade.appendExtensionModule(this, 'mapplettools',
						this.eventHandlers, this, 'W', {
							'fi' : {
								title : ''
							},
							'sv' : {
								title : '?'
							},
							'en' : {
								title : ''
							}

						}, pnl);

				this.def = def;


				this.mediator.setState("started");
				return this;
			},

			

			/**
			 * @method update notifications from bundle manager
			 */
			"update" : function(manager, b, bi, info) {
			},

			/**
			 * @method stop
			 * 
			 * stop bundle instance
			 */
			"stop" : function() {

				this.facade.removeExtensionModule(this.impl, 'mapplettools', {},
						this, this.def);

				this.def = null;
			
				for (p in this.eventHandlers) {
					this.sandbox.unregisterFromEventByName(this, p);
				}

				this.sandbox.unregister(this);

				this.mediator.setState("stopped");

				return this;
			},

			/*
			 * @method onEvent
			 * 
			 * dispatches events to eventhandler methods
			 */
			onEvent : function(event) {
				return this.eventHandlers[event.getName()].apply(this,
						[ event ]);
			},

			/*
			 * eventHandlers to be bound to map framework
			 */
			eventHandlers : {

			},

			/**
			 * @method getName
			 * 
			 */
			getName : function() {
				return this.__name;
			},
			__name : "Oskari.mapframework.bundle.NlsFiMappletToolsBundleInstance"

		}, {
			"protocol" : [ "Oskari.bundle.BundleInstance",
					"Oskari.mapframework.bundle.extension.Extension" ]
		});
