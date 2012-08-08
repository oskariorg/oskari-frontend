/**
 * Let's create a bundle to embed AKP Mapplet from 2003
 * 
 * 
 */

/**
 * Bundle Instance
 * 
 * @class Oskari.mapframework.bundle.NlsFiMappletBundleInstance
 * 
 * This class is POC for adding 3rd party maps to mapframework UI
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.NlsFiMappletBundleInstance",
/**
 * @constructor
 */
function(b) {
	this.name = 'mapplet';
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

			/**
			 * @method createProjs
			 * 
			 * create any required projection objects
			 * 
			 */
			createProjs : function() {
				var me = this;

				/*
				 * projection support
				 */
				/*
				 * projection support
				 */
				me.projs = {
					"EPSG:4326" : new Proj4js.Proj("EPSG:4326"),
					"EPSG:3067" : new Proj4js.Proj("EPSG:3067")
				};
			},
			/**
			 * @method createMapPanel creates (Ext) map panel
			 */
			createMapPanel : function() {
				var me = this;
				var xt = this.libs.ext;
				var pnl = xt.create('Ext.Panel', {
					height : 384,
					region : 'center',
					layout : 'fit',
					items : [],
					lbar : [ {
						iconCls: 'siirra',
						enableToogle: true,
		                textAlign: 'left',
		                enableToggle: true,
		                toggleGroup: 'mapplettools',
		                handler: function() {
							me.getMap().getMapplet().asetaTyokalu('siirra', 0);
						}
					},{
						iconCls: 'suurenna',
						tooltip : 'Button 1',
		                textAlign: 'left',
		                enableToggle: true,
		                toggleGroup: 'mapplettools',
		                handler: function() {
							me.getMap().getMapplet().asetaTyokalu('suurenna', 0);
						}
					},{
						iconCls: 'pienenna',
						tooltip : 'Button 1',
		                textAlign: 'left',
		                enableToggle: true,
		                toggleGroup: 'mapplettools',
		                handler: function() {
							me.getMap().getMapplet().asetaTyokalu('pienenna', 0);
						}
					} ]
				});

				return pnl;

			},
			createOrientPanel : function() {
				var xt = this.libs.ext;
				var pnl = xt.create('Ext.Panel', {
					width : "148",
					height : "220",
					region : 'center',
					layout : 'fit',
					items : []
				});

				return pnl;

			},

			/**
			 * @method createMap
			 * 
			 * creates openstreetmap
			 */
			createMap : function() {

				var mapplet = Oskari.clazz.create('Oskari.mapplet.Adapter',
						'map');

				return mapplet;
			},
			createOrient : function() {

				var mapplet = Oskari.clazz.create('Oskari.mapplet.Adapter',
						'overview');

				return mapplet;
			},
			
			getMap: function() {
				return this.mapplet;
			},
			
				

			/**
			 * @method createMapContainer
			 * 
			 * Creates NLSFI Mappplet Widget for the map
			 */
			createMapContainer : function(mapplet) {
				var xt = this.libs.ext;
				var mapster = {
					html : mapplet.mappletTagTemplate

				};

				return mapster;
			},
			createOrientContainer : function(mapplet) {
				var xt = this.libs.ext;
				var mapster = {
					html : mapplet.orientTagTemplate

				};

				return mapster;
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

				var showIndexMap = false;
				var showZoomBar = false;
				var showScaleBar = false;
				var allowMapMovements = false;

				this.createProjs();

				var pnl = this.createMapPanel();
				var orientPnl = this.createOrientPanel();
				this._panel = pnl;
				this._orientPanel = orientPnl;

				var def = this.facade.appendExtensionModule(this, 'mapplet',
						{}, this, 'Center', {
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

				this.mapplet = this.createMap();
				this.orient = this.createOrient();

				var mapster = this.createMapContainer(this.mapplet);
				this._mapster = mapster;
				pnl.add(mapster);

				var orienter = this.createOrientContainer(this.orient);
				this._orienter = orienter;
				orientPnl.add(orienter);

				// facade.registerPart('mapplet',this._mapster);
				var orientDef = this.facade.appendExtensionModule(this,
						'orient', {}, this, 'NW', {
							'fi' : {
								title : ''
							},
							'sv' : {
								title : '?'
							},
							'en' : {
								title : ''
							}

						}, orientPnl);

				this.orientDef = orientDef;

				this.mediator.setState("started");
				return this;
			},

			/**
			 * @method centerMap
			 * 
			 * centers map
			 */
			centerMap : function(n, e, isAfterMove, mainMapZoom) {
				if (!isAfterMove)
					return;

				/*
				 * this.map.setCenter( );
				 */
				this.mapplet.setCenter(n, e, mainMapZoom);
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

				this.facade.removeExtensionModule(this.impl, 'mapplet', {},
						this, this.def);

				this.def = null;
				this.facade.removeExtensionModule(this.impl, 'orient', {},
						this, this.orientDef);

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
				/*
				 * @method MouseHoverEvent
				 */
				/*"MouseHoverEvent" : function(event) {
					var n = event.getLat();
					var e = event.getLon();

					this.centerMap(n, e, false, 8);

				},*/

				/**
				 * @method AfterMapMoveEvent
				 */
				/*"AfterMapMoveEvent" : function(event) {

					var n = event.getCenterY();
					var e = event.getCenterX();

					this.centerMap(n, e, true, event.getZoom());
				},*/
				
				/**
				 * @method Mapplet.MappletStateChangedEvent
				 */
				"Mapplet.MappletStateChangedEvent" : function(event) {
					/*
					 * 
					 */
				var sandbox = this.sandbox;				
					var isMouseMove = event.getMsg().indexOf("doHandleClick") != -1;
					if( !isMouseMove ) {
						sandbox.printDebug("Skipping !isMouseMove from Legacy");
						return;
					}
					

					sandbox.printDebug("GOT MappletStateChangedEvent");
					
					var mapplet = this.mapplet;
					
					var scale = mapplet.getScale();
					var c = mapplet.getCenter();
					var z = mapplet.getZoom();
					
					sandbox.printDebug("E/N/Z"+c.x+"/"+c.y+"/"+z);
					
					/**
					 * Let's dispatch 
					 */
					 
					 var event = sandbox.getEventBuilder('AfterMapMoveEvent')(c.x,c.y,z,false,16000);
					 sandbox.notifyAll(event);
					
					
				}
			},

			/**
			 * @method getName
			 * 
			 */
			getName : function() {
				return this.__name;
			},
			__name : "Oskari.mapframework.bundle.NlsFiMappletBundleInstance"

		}, {
			"protocol" : [ "Oskari.bundle.BundleInstance",
					"Oskari.mapframework.bundle.extension.Extension" ]
		});
