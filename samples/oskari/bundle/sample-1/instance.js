Oskari.clazz.define("Oskari.mapframework.bundle.Sample1BundleInstance",
		function() {
			this.map = null;
		}, {
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
					'Oskari.mapframework.ui.module.common.MapModule', "Sample1",
					showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
			
				
				var map = sandbox.register(module);
				
				/**
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

				map.render('map-div');
				this.map = map;
			
			},
			
			/**
			 * @method 
			 * implements BundleInstance start methdod
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
