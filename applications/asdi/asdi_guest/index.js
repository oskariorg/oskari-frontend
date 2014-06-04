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

  

    /* let's start some ASDI specific ops */
    function startASDI(sb) {


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
                    startASDI();
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