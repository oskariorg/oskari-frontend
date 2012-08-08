/* This is a unpacked Oskari bundle (bundle script version Thu Mar 01 2012 10:59:29 GMT+0200 (Suomen normaaliaika)) */ 
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
				plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
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
/**
 * This enchancement adds all preselected layers on map
 *
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement', function() {
}, {
    enhance : function(core) {
        core.printDebug("Checking if map is started with link...");

        var coord = core.getRequestParameter('coord');
        var zoomLevel = core.getRequestParameter('zoomLevel');

        var mapLayers = core.getRequestParameter('mapLayers');
        var markerVisible = core.getRequestParameter('showMarker');
        var keepLayersOrder = core.getRequestParameter('keepLayersOrder');

        if(keepLayersOrder === null) {
            keepLayersOrder = true;
        } 

        core.getMap().setMarkerVisible(markerVisible == 'true');

        if(coord === null || zoomLevel === null) {
            // not a link
            return;
        }

        /* This seems like a link start */
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or
         * old "%20"
         */
        if(coord.indexOf("_") >= 0) {
            splittedCoord = coord.split("_");
        } else {
            splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if(longitude === null || latitude === null) {
            core.printDebug("Could not parse link location. Skipping.");
            return;
        }
        core.getMap().moveTo(longitude, latitude, zoomLevel);
        //core.processRequest(core.getRequestBuilder('MapMoveRequest')(longitude,
        // latitude, 0, showMarker));

        core.printDebug("This is startup by link, moving map...");

        if(mapLayers !== null && mapLayers !== "") {
            core.printDebug("Continuing by adding layers...");
            var layerStrings = mapLayers.split(",");

            for(var i = 0; i < layerStrings.length; i++) {
                var splitted = layerStrings[i].split("+");
                var layerId = splitted[0];
                var opacity = splitted[1];
                var style = splitted[2];
                if((layerId.indexOf("_") != -1) && 
                   (layerId.indexOf("base_") == -1) && 
                   (layerId.indexOf("BASE_") == -1)) {
                    var subIds = layerId.split("_");
                    layerId = null;
                    var baseLayer = null;
                    for(var subId in subIds) {
                        if (subId) {
                            baseLayer = 
                                core.findBaselayerBySublayerIdFromAllAvailable(subIds[subId]);
                            if(baseLayer) {
                                layerId = baseLayer.getId();
                                break;
                            }
                        }
                    }
                }
                if(layerId !== null) {
                    var rb = null;
                    var r = null;
                    rb = core.getRequestBuilder('AddMapLayerRequest');
                    r = rb(layerId, keepLayersOrder);
                    core.processRequest(r);
                    rb = core.getRequestBuilder('ChangeMapLayerOpacityRequest');
                    r = rb(layerId, opacity);
                    core.processRequest(r);
                    rb = core.getRequestBuilder('ChangeMapLayerStyleRequest');
                    r = rb(layerId, style);
                    core.processRequest(r);
                } else {
                    core.printWarn("[StartMapWithLinkEnhancement] " + 
                                   "Could not find baselayer for " + 
                                   layerId);
                }
            }
        }
        //core.scheduleMapLayerRearrangeAfterWfsMapTilesAreReady();
    }
}, {
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */
