/**
 * Start when dom ready
 */
jQuery(document).ready(function() {

    if(!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    // populate url with possible control parameters
    var getAppSetupParams = {};
    if( typeof window.controlParams == 'object') {
        for(var key in controlParams) {
            getAppSetupParams[key] = controlParams[key];
        }
    }
    if (!language) {
        // default to english
        language = 'en';
    }
    Oskari.setLang(language);
    Oskari.setLoaderMode('dev');
 
    /* let's start the app after config has been loaded successfully */
    function start(appSetup, appConfig, cb) {
        var app = Oskari.app;
        app.setApplicationSetup(appSetup);
        // TODO: move to DB!
        appConfig.userguide.conf = {
            "flyoutClazz": "Oskari.mapframework.bundle.userguide.SimpleFlyout"
        };

        app.setConfiguration(appConfig);
        app.startApplication();
    }

    /* let's load the appsetup and configurations from database */
    jQuery.ajax({
        type : 'POST',
        dataType : 'json',
        data : getAppSetupParams,
        url : ajaxUrl + 'action_route=GetAppSetup',
        success : function(app) {
            if(app.startupSequence && app.configuration) {
                var appSetup = {
                    "startupSequence" : app.startupSequence
                };
                start(appSetup, app.configuration);
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