/**
 * Start when dom ready
 */
jQuery(document).ready(function() {
	
	if( jQuery.cookie('JSESSIONID') === undefined ||
			jQuery.cookie('JSESSIONID') === '' ) {
	jQuery.cookie('JSESSIONID','_'+(new Date().getTime()));
	}

    if(!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    if(!window.console) {
        window.console = {
            log : function() {
            },
            dir : function() {
            }
        };
    }

    // remove host part from url
    if(ajaxUrl.indexOf('http') == 0) {
        var hostIdx = ajaxUrl.indexOf('://') + 3;
        var pathIdx = ajaxUrl.indexOf('/', hostIdx);
        ajaxUrl = ajaxUrl.substring(pathIdx);
    }

    // populate url with possible control parameters
    var getAppSetupParams = {};
    if( typeof window.controlParams == 'object') {
        for(var key in controlParams) {
            getAppSetupParams[key] = controlParams[key];
        }
    }

    if(!language) {
        // default to english
        language = 'en';
    }
    Oskari.setLang(language);

    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(preloaded);

    function startELFSettingsCallback(appConfigElf) {

        var sandbox = Oskari.getSandbox();

        /* temporary fix to ELF WMTS services not working properly zoomed out - forcing minScale on layers */
        Oskari.clazz.category('Oskari.mapframework.wmts.service.WMTSLayerService', 'fix', {
            parseCapabilitiesToLayers : function(wmtsName, caps, matrixSet) {

                var me = this;
                var mapLayerService = this.mapLayerService;
                var getTileUrl = null;
                if(caps.operationsMetadata.GetTile.dcp.http.getArray) {
                    getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
                } else {
                    getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
                }
                var capsLayers = caps.contents.layers;
                var contents = caps.contents;
                var matrixSet = contents.tileMatrixSets[matrixSet];
                var layersCreated = [];

                for(var n = 0; n < capsLayers.length; n++) {

                    var spec = capsLayers[n];

                    var mapLayerId = spec.identifier;
                    var mapLayerSysId = mapLayerId.split('.').join('_');
                    var mapLayerName = spec.identifier;

                    var minScale = appConfigElf.conf.layers && appConfigElf.conf.layers[mapLayerSysId] ? appConfigElf.conf.layers[mapLayerSysId].minScale : undefined;

                    var mapLayerJson = {
                        wmtsName : mapLayerId,
                        descriptionLink : "",
                        orgName : wmtsName,
                        type : "wmtslayer",
                        legendImage : "",
                        formats : {
                            value : "text/html"
                        },
                        isQueryable : true,
                        minScale : minScale,
                        style : "",
                        dataUrl : "",
                        name : mapLayerId,
                        title : spec.title,
                        opacity : 100,
                        inspire : wmtsName,
                        maxScale : 1
                    };

                    var layer = Oskari.clazz.create('Oskari.mapframework.wmts.domain.WmtsLayer');

                    layer.setAsNormalLayer();
                    layer.setId(mapLayerSysId);
                    layer.setName(mapLayerJson.title);
                    layer.setWmtsName(mapLayerJson.wmtsName);
                    layer.setOpacity(mapLayerJson.opacity);
                    layer.setMaxScale(mapLayerJson.maxScale);
                    layer.setMinScale(mapLayerJson.minScale);
                    layer.setDescription(mapLayerJson.info);
                    layer.setDataUrl(mapLayerJson.dataUrl);
                    layer.setOrganizationName(mapLayerJson.orgName);
                    layer.setInspireName(mapLayerJson.inspire);
                    layer.setWmtsMatrixSet(matrixSet)
                    layer.setWmtsLayerDef(spec);
                    layer.setVisible(true);

                    layer.addWmtsUrl(getTileUrl);

                    var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

                    var styleSpec;

                    for(var i = 0, ii = spec.styles.length; i < ii; ++i) {
                        styleSpec = spec.styles[i];
                        var style = styleBuilder();
                        style.setName(styleSpec.identifier);
                        style.setTitle(styleSpec.identifier);

                        layer.addStyle(style);
                        if(styleSpec.isDefault) {
                            layer.selectStyle(styleSpec.identifier);
                            break;
                        }
                    }

                    mapLayerService.addLayer(layer, false);
                    layersCreated.push(layer);

                }
            }
        });

      

        /* TEMPORARY: */
        /* Let's load WMTS layers from WMTS Caps documents defined in ELF.json */
        var layerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'), 
        	wmts = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', layerService);

        var wmtsLayerSources = appConfigElf.conf.WMTS;
        if(wmtsLayerSources )  {
          var wlen = wmtsLayerSources.length;

          for(var w = 0; w < wlen; w++) {
            var wobj = wmtsLayerSources[w], wid = wobj.id, 
            	wresource = wobj.resource, wtilematrixset = wobj.TileMatrixSet, wbasemap = wobj.baseLayer;

            var wmtsScope = wobj;
            wmts.readWMTSCapabilites(wid, wresource, wtilematrixset, function() {
                var sandbox = Oskari.getSandbox();

                if(this.baseLayer) {
                    sandbox.postRequestByName('AddMapLayerRequest', [this.baseLayer, true]);
                }

            }, {
                scope : wmtsScope
            });

          }
          
        }
        
        /* TEMPORARY: */
  
        /* TEMPORARY: */
        /* Let's load WMTS EU WFS stuff from JSON */
        /*var wfsLayerSources = appConfigElf.conf.WFS;
        
        if( wfsLayerSources ) {
        	 var wlen = wfsLayerSources.length;

             for(var w = 0; w < wlen; w++) {
               var wobj = wfsLayerSources[w]
        	
               var wfsLayerDef = layerService.createMapLayer( wobj );
               layerService.addLayer(wfsLayerDef);
             }
        
        }
        */
        

    }

    /* let's start some ELF specific ops - config and loading of WMTS capabilities from XML */
    function startELF(sb) {

        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            beforeSend : function(x) {
                if(x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            url : "/Oskari/applications/elf/ELF.json",
            success : function(appConfigElf) {
                startELFSettingsCallback(appConfigElf);
            },
            error : function(jqXHR, textStatus) {
                if(jqXHR.status != 0) {
                    jQuery('#mapdiv').append('Unable to start');
                }
            }
        });

    }
 
    /* let's start the app after config has been loaded successfully */
    function start(appSetup, appConfig, cb) {
        var app = Oskari.app;

        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            var instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if(cb) {
                cb(instance);
            }
        });
    }


    /* let's load the appsetup and configurations from database */
    jQuery.ajax({
        type : 'POST',
        dataType : 'json',
        beforeSend : function(x) {
            if(x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        data : getAppSetupParams,
        url : ajaxUrl + 'action_route=GetAppSetup',
        success : function(app) {
            if(app.startupSequence && app.configuration) {
                var appSetup = {
                    "startupSequence" : app.startupSequence
                };
                start(appSetup, app.configuration, function(instance) {
                    startELF();
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error : function(jqXHR, textStatus) {
            if(jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});