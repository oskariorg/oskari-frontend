jQuery(document).ready(function() {

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)',
            value = RegExp(re).exec(location.search);
        if (value && value.length && value.length > 1) {
            value = value[1];
        }
        if (value) {
            return decodeURI(value);
        }
        return null;
    }

    var lang = getURLParameter('lang');
    Oskari.setLang(lang || 'fi');
    Oskari.setLoaderMode('dev');
    var appSetup,
        appConfig;

    /*if( getURLParameter('ts') ) {
     Oskari.setInstTs(getURLParameter('ts'));
     } else {
     Oskari.setInstTs('DEV');
     } */

    var downloadConfig = function (notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : 'config.json',
            beforeSend : function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function (config) {
                appConfig = config;
                notifyCallback();
            }
        });
    };
    var downloadAppSetup = function (notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : 'appsetup.json',
            beforeSend : function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function (setup) {
                appSetup = setup;
                notifyCallback();
            }
        });
    };

    var startApplication = function () {
        // check that both setup and config are loaded
        // before actually starting the application
        if (appSetup && appConfig) {
            var app = Oskari.app;
            app.setApplicationSetup(appSetup);
            app.setConfiguration(appConfig);
            app.startApplication(function (startupInfos) {
                var sandbox = Oskari.getSandbox();

                /* Let's load WMTS layers from WMTS Caps document */
                var layerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                    wmts = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', layerService);
                wmts.readWMTSCapabilites('statkart.no', 'statkart-wmts.xml', 'EPSG:3035', function () {
                    sandbox.postRequestByName('AddMapLayerRequest', ['elf_basemap', true]);
                });
                wmts.readWMTSCapabilites('ELF', 'elf-wmts.xml', 'LAEA');
            });
        }
    };
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);

});

