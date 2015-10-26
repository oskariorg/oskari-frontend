jQuery(document).ready(function() {
    var getAppSetupParams = {};

    // populate getappsetup url with possible control parameters
    if (typeof window.controlParams === 'object') {
        for (key in window.controlParams) {
            if (window.controlParams.hasOwnProperty(key)) {
                getAppSetupParams[key] = window.controlParams[key];
            }
        }
    }
    // NOTE! expects global variables language and preloaded from encapsulating page
    if (!(typeof window.language === 'string') || !window.language) {
        // default to english
        window.language = 'en';
    }
    Oskari.setLang(window.language);

    if (typeof window.preloaded !== 'boolean') {
        // default to false
        window.preloaded = false;
    }
    Oskari.setPreloaded(window.preloaded);

    jQuery.ajax({
        type : 'GET',
        dataType : 'json',
        data : getAppSetupParams,
        url: ajaxUrl + 'action_route=GetAppSetup',
        success : function(setup) {
            var app = Oskari.app;
            if (true) for(var i = 0; i < setup.startupSequence.length; ++i) {
                var bundle = setup.startupSequence[i];
                if(bundle.bundlename === 'statsgrid') {
                    bundle.bundlename = "statsgrid2";
                    bundle.bundleinstancename = "statsgrid2";
                    bundle.metadata['Import-Bundle'].statsgrid2 = bundle.metadata['Import-Bundle'].statsgrid;
                    delete bundle.metadata['Import-Bundle'].statsgrid;
                }
            }
            app.setApplicationSetup(setup);
            app.setConfiguration(setup.configuration);
            app.startApplication(function(startupInfos) {
                // all bundles have been loaded
            });
        } 
    });

});