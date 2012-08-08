Oskari.clazz.define("Oskari.poc.bundle.KendoBundleInstance",
		function() {
			this.map = null;
		}, {
			
			getMapModule: function() {
				return this.mapModule;
			},
			
			
			/**
			 * @method createModulesAndUi
			 * 
			 * implements UserInterfaceManager protocol
			 */
			createModulesAndUi : function(sandbox) {
				var showIndexMap = false;
				var showZoomBar = true;
				var showScaleBar = true;
				var allowMapMovements = true;

				var module = Oskari.clazz.create(
					'Oskari.mapframework.ui.module.common.MapModule', "Main",
					showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
				/*
				 * module.setOpts({
				 * 
				 * createMap : true, createMapSketchLayer : false,
				 * createMapMarkersLayer : false, createMapVectorLayer : false,
				 * createMapMoveHandlers : true, addMapControls : true,
				 * registerVectorFormats : false, createMapPanel : true,
				 * createTilesGrid : false, 'WfsLayerPlugin' : false,
				 * 'GetInfoPlugin' : true });
				 */
				this.mapModule = module;
				
				
				var map = sandbox.register(module);
				
				/*
				 * plugins
				 */
				var plugins = [];
				plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
				plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
		        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
				
		        for(var i = 0; i < plugins.length; i++) {
		            var plugin = Oskari.clazz.create(plugins[i]);
		            module.registerPlugin(plugin);
		        } 
				/**
				 * should create a plugin for this
				 */
				map.addControl(new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }));

				map.render('map-div');
				this.map = map;
			
			},
			
			/**
			 * @method implements BundleInstance start methdod
			 * 
			 */
			"start" : function() {
				
				
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
						'Oskari.mapframework.service.MapLayerService', null));

				var enhancements = [];

				var uimanager = me;

				var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
				this.core = core;
				
				core.init(uimanager, services, enhancements, conf.layers,
						userInterfaceLanguage, null, false);


				var sandbox = core.getSandbox();
				
				/*
				 * core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_27',true,true));
				 * core.processRequest(core.getRequestBuilder('MapMoveRequest')(
				 * 449695.09336966, 7097521.8050581, 0,false));
				 */		
				Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement').enhance(core);

				/* core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_35',true,true)); */
				var mapObj = sandbox.getMap();
				
				core.processRequest(core.getRequestBuilder('MapMoveRequest')(
						mapObj.getX(), mapObj.getY(), mapObj.getZoom(),false));			
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
