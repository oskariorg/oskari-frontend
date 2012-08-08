Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Sample12BundleInstance",
				function() {
					this.map = null;
					this.mapster = null;
					this.mapmodule = null;

					this.ui = null;

				},
				{
					/**
					 * @method createModulesAndUi
					 * 
					 * implements UserInterfaceManager protocol
					 */
					createModulesAndUi : function(sandbox) {
						var showIndexMap = true;
						var showZoomBar = true;
						var showScaleBar = true;
						var allowMapMovements = true;

						/**
						 * Map
						 * 
						 */
						var mapmodule = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.module.common.MapModule',
										"Main", showIndexMap, showZoomBar,
										showScaleBar, allowMapMovements);
						
						this.mapmodule = mapmodule;

						/**
						 * This creates the Map Implementation (OpenLayers.Map)
						 * returned from module.init() (by design from 2010...)
						 */
						var map = sandbox.register(mapmodule);
						this.map = map;
						
						/**
						 * plugins
						 */
						var plugins = [];
						plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
						plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
						
				        for(var i = 0; i < plugins.length; i++) {
				            var plugin = Oskari.clazz.create(plugins[i]);
				            mapmodule.registerPlugin(plugin);
				        } 


						/**
						 * Mapster container for the Map in ExtJS4 Panel
						 */
						
						var mapster = Ext.createWidget('nlsfimappanel', {
							olmap : map,
							layout : 'absolute'//,
							/*flex : 1,
							height: 768,
							width: 768*/

						});

						/**
						 * Map Controls !Note!: MapControls assumes main map to
						 * be called 'Main'
						 */
						var mapcontrolsmodule = Oskari.clazz
								.create('Oskari.mapframework.ui.module.common.MapControlsModule');
						var mapcontrols = sandbox.register(mapcontrolsmodule);

						mapster.add(mapcontrols);

						/**
						 * UI Panelstry for the UI
						 */

						var pnl = Ext.create('Ext.panel.Panel', {
							layout : 'fit',
							/*height: 768,
							width: 768,*/
							title : 'Map',
							items: [mapster]
						});

						var container = Ext
								.create(
										'Ext.panel.Panel',
										{
											region : 'center',
											layout : 'accordion',
											layoutConfig : {											
												titleCollapse : false,
												animate : true,
												activeOnTop : true

											},
											defaults : {
												bodyStyle : 'padding:15px;background-color: #bbeeff;'
											},
											items : [ pnl, {
												title : 'Another Panel',
												html : 'Sample content'
											} ],
											title : 'Ext Window'
										});

						

						/**
						 * Viewport
						 */

						/*
						 * Ext.create('Ext.container.Viewport', { style : {
						 * padding : '8px', overflow : 'hidden' }, layout :
						 * 'fit', items : [ pnl ] });
						 */
						var ui = Ext.create('Ext.window.Window', {
							style : {
								padding : '8px',
								overflow : 'hidden'
							},
							layout : 'fit',
							items : [ container ],
							width : 1024,
							height : 768,
							title : 'ExtJS4 Window'
						});

						this.ui = ui;
						
					},

					/**
					 * @method implements BundleInstance start methdod
					 * 
					 */
					"start" : function() {
						if( this.started) 
							return;
						this.started = true;

						var me = this;
						var layers = Oskari.clazz
								.create('Oskari.mapframework.complexbundle.NlsFiLayerConfig');
						this.layers = layers;
						var conf = layers.create();
						var startup = conf;

						Oskari.$("startup", conf);

						var userInterfaceLanguage = "fi";

						var services = [];
						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.LanguageService',
								userInterfaceLanguage));
						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.MapLayerService',
								null));

						var enhancements = [];

						var uimanager = me;

						var core = Oskari.clazz
								.create('Oskari.mapframework.core.Core');
						this.core = core;

						core.init(uimanager, services, enhancements,
										conf.layers, userInterfaceLanguage,
										null, false);
			
						this.ui.show();
						core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_27',true,true)); 
						core.processRequest(core.getRequestBuilder('MapMoveRequest')(
						  545108, 6863352, 5,false));
						
					},

					/**
					 * @method update
					 * 
					 * implements bundle instance update method
					 */
					"update" : function() {

					},

					/**
					 * @method stop
					 * 
					 * implements bundle instance stop method
					 */
					"stop" : function() {
						alert('Stopped!');
					}
				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance" ]
				});