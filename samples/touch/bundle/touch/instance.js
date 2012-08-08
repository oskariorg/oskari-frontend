Oskari.clazz.define("Oskari.mapframework.bundle.TouchBundleInstance",
		function() {
			this.map = null;
		}, {
			getMap: function() {
				return this.map;
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
					'Oskari.mapframework.ui.module.common.MapModule', "Touch",
					showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
				module.setOpts({
			        createMap : true,
			        createMapSketchLayer : false,
			        createMapMarkersLayer : false,
			        createMapVectorLayer : false,
			        createMapMoveHandlers : true,
			        addMapControls : true,
			        registerVectorFormats : false,
			        createMapPanel : true,
			        createTilesGrid : false,
			        'WfsLayerPlugin' : false,
			        'GetInfoPlugin' : true
			    });
				
				var map = sandbox.register(module);

				map.addControl(
				                           new OpenLayers.Control.TouchNavigation({
				                               dragPanOptions: {
				                                   enableKinetic: true
				                               }
				                           }));
				
				//map.addControl(new OpenLayers.Control.ZoomPanel());
				
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

				core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_27',true,true));
				// map.setCenter(new OpenLayers.LonLat(545108, 6863352));
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
