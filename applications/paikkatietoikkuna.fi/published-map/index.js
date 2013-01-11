/**
 * @class Oskari.paikkatietoikkuna.Main
 *
 * Launcher class for a paikkatietoikkuna.fi map window
 */
Oskari.clazz.define('Oskari.paikkatietoikkuna.Published', function() {

    this.args = null;
    this.styleBndl = null;
}, {

    /**
     * @method processArgs
     *
     * applies page args to this instance
     */
    processArgs : function(args) {
        this.args = args;
        this.styleBndl = args.style;
    },
    /**
     * @method start
     *
     * starts the application with bundle definitions declared
     * in property appSetup.startupSequence
     */
    start : function(cb) {

        var me = this;

        var appSetup = this.appSetup;
        var appConfig = this.appConfig;
        var app = Oskari.app;

        /* me.applyStyle(appSetup,'ui'); */

        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            me.instance = startupInfos.bundlesInstanceInfos['mapfull'].bundleInstance;
            if(cb) {
                cb(me.instance);
            }
        });
    },
    /**
     * @static
     * @property appConfig
     */
    appConfig : {
        // bundle id
        'mapfull' : {
            // properties that will be made available before bundle start()
            // 'key' : 'value'
            // can be accessed in mapfull.start() like: alert('This should return
            // "value" :' + this.key);
        }
    },

    /**
     * @static
     * @property appSetup.startupSequence
     */
    appSetup : {

        startupSequence : [
        // openlayers
        {
            // style selection may be done with CSS Links also - just for demo
            title : 'OpenLayers',
            fi : 'OpenLayers',
            sv : '?',
            en : 'OpenLayers',
            bundlename : 'openlayers-default-theme',
            bundleinstancename : 'openlayers-default-theme',
            metadata : {
                "Import-Bundle" : {
                    "openlayers-single-full" : {
                        bundlePath : '/Oskari/packages/openlayers/bundle/'
                    },
                    "openlayers-default-theme" : {
                        bundlePath : '/Oskari/packages/openlayers/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        },
        {
            title : 'OskariUI',
            fi : 'OskariUI',
            sv : 'OskariUI',
            en : 'OskariUI',
            bundlename : 'oskariui',
            bundleinstancename : 'oskariui',
            metadata : {
                "Import-Bundle" : {
                    "oskariui" : {
                        bundlePath : '/Oskari/packages/framework/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        },

        // main app
        {
            title : 'Map',
            fi : 'Map',
            sv : '?',
            en : 'Map',
            bundlename : 'mapfull',
            bundleinstancename : 'mapfull',
            metadata : {
               "Import-Bundle":{
                  "mapwmts":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "mapwfs":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "service-base":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "event-map-layer":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "request-map-layer":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "mapmodule-plugin":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "event-base":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "mapfull":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "core-base":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "request-base":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "domain":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "core-map":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "request-map":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "sandbox-base":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "service-map":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "sandbox-map":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  },
                  "event-map":{
                     "bundlePath":"/Oskari/packages/framework/bundle/"
                  }
               },
               "Require-Bundle-Instance" : []

            },
            instanceProps : {}
        }, {
            title : 'Info Box',
            fi : 'infobox',
            sv : '?',
            en : '?',
            bundlename : 'infobox',
            bundleinstancename : 'infobox',
            metadata : {
                "Import-Bundle" : {
                    "infobox" : {
                        bundlePath : '/Oskari/packages/framework/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        },{
            title : 'PostProcessor',
            fi : 'PostProcessor',
            sv : 'PostProcessor',
            en : 'PostProcessor',
            bundlename : 'postprocessor',
            bundleinstancename : 'postprocessor',
            metadata : {
                "Import-Bundle" : {
                    "postprocessor" : {
                        bundlePath : '/Oskari/packages/framework/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        }]
    }
});

/**
 * Start when dom ready
 */
jQuery(document).ready(function() {

    function getURLParameter(name) {
    	var value = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    	if(value) {
        	return decodeURI(value);
    	}
    }
	// returns empty string if parameter doesn't exist
	// otherwise returns '<param>=<param value>&'
    function getAdditionalParam(param) {
        var value = getURLParameter(param);
        if (value) {
            return param + '=' + value + '&';
        }
        return '';
    }

    var args = {
        oskariLoaderMode : 'yui',
        style : 'style1'
    };
    if(!ajaxUrl) {
        jQuery('#mapdiv').append('Unable to start');
    	return;
    } 
    if(!language) {
    	// default to finnish
    	language = 'fi';
    }
    // populate url with possible control parameters
    ajaxUrl += getAdditionalParam('zoomLevel');
    ajaxUrl += getAdditionalParam('coord');
    ajaxUrl += getAdditionalParam('mapLayers');
    ajaxUrl += getAdditionalParam('oldId');
    ajaxUrl += "viewId=" + viewId + "&"; //getAdditionalParam('viewId');
    
    ajaxUrl += getAdditionalParam('isCenterMarker');
    ajaxUrl += getAdditionalParam('address')
    ajaxUrl += getAdditionalParam('showGetFeatureInfo');
    ajaxUrl += getAdditionalParam('nationalCadastralReference');
    
    ajaxUrl += getAdditionalParam('nationalCadastralReferenceHighlight');
    ajaxUrl += getAdditionalParam('wfsFeature');
    ajaxUrl += getAdditionalParam('wfsHighlightLayer');
        
    Oskari.setLang(language);

    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(false);

    if (args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
        Oskari.setSupportBundleAsync(true);
    }

    var main = Oskari.clazz.create('Oskari.paikkatietoikkuna.Published');
    main.processArgs(args);

    if (ajaxUrl.indexOf('http') == 0) {        
        var hostIdx = ajaxUrl.indexOf('://') + 3;
        var pathIdx = ajaxUrl.indexOf('/', hostIdx);
        ajaxUrl = ajaxUrl.substring(pathIdx);
    }

    var gfiParamHandler = function(sandbox) {
        if(getURLParameter('showGetFeatureInfo') != 'true') {
            return;
        }
        var lon  = sandbox.getMap().getX();
        var lat  = sandbox.getMap().getY();
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var px = mapModule.getMap().getViewPortPxFromLonLat({lon : lon, lat: lat});
        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
    }
    
    jQuery.ajax({
        type : 'GET',
        dataType : 'json',
        beforeSend : function(x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        url : ajaxUrl + 'action_route=GetAppSetup&noSavedState=true',
        success : function(appSetup) {
            if (appSetup.startupSequence && appSetup.configuration) {
                main.appSetup.startupSequence = appSetup.startupSequence;
                main.appConfig = appSetup.configuration;
                main.start(function(instance) {
                    var sb = instance.getSandbox();
                    gfiParamHandler(sb);
                });
            }
        },
        error : function(jqXHR, textStatus) {
            if (jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });

}); 