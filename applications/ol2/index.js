jQuery(document).ready(function() {
    Oskari.setLang('fi');
    Oskari.setLoaderMode('dev');
    var appSetup;
    var appConfig;

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)';
        var value = RegExp(re).exec(location.search);
        if (value && value.length && value.length > 1) {
            value = value[1];
        }
        if (value) {
            return decodeURI(value);
        }
        return null;
    }

    /*if( getURLParameter('ts') ) {
     Oskari.setInstTs(getURLParameter('ts'));
     } else {
     Oskari.setInstTs('DEV');
     } */

    var downloadConfig = function(notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : 'config.json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(config) {
                appConfig = config;
                notifyCallback();
            }
        });
    };
    var downloadAppSetup = function(notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : 'appsetup.json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(setup) {
                appSetup = setup;
                notifyCallback();
            }
        });
    };

    var startApplication = function() {
        // check that both setup and config are loaded
        // before actually starting the application
        if (appSetup && appConfig) {
            var app = Oskari.app;
            app.setApplicationSetup(appSetup);
            app.setConfiguration(appConfig);
            app.startApplication(function(startupInfos) {
                // all bundles have been loaded
          

                Oskari.getSandbox().enableDebug();
                Oskari.clazz.category('Oskari.mapframework.bundle.search.service.SearchService', 'hack', {
                    doSearch : function(searchString, onSuccess, onError) {
                        var lang = Oskari.getLang();
                        jQuery.ajax({
                            dataType : "json",
                            type : "GET",
                            beforeSend : function(x) {
                                if (x && x.overrideMimeType) {
                                    x.overrideMimeType("application/json");
                                }
                            },
                            url : this._searchUrl,
                            data : "searchKey=" + searchString + "&Language=" + lang,
                            error : onError,
                            success : onSuccess
                        });
                    }
                });

            });
        }
    };
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);

});
