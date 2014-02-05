jQuery(document).ready(function () {
    Oskari.setLang('en');
    Oskari.setLoaderMode('dev');
    var appSetup,
        appConfig,
        downloadConfig = function (notifyCallback) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: '../config.json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (config) {
                    appConfig = config;
                    notifyCallback();
                }
            });
        },
        downloadAppSetup = function (notifyCallback) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: 'appsetup.json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (setup) {
                    appSetup = setup;
                    notifyCallback();
                }
            });
        },
        startApplication = function () {
            // check that both setup and config are loaded
            // before actually starting the application
            if (appSetup && appConfig) {
                var app = Oskari.app;
                app.setApplicationSetup(appSetup);
                app.setConfiguration(appConfig);
                app.startApplication(function (startupInfos) {
                    /*
                    var sandbox = Oskari.getSandbox(),
                        layerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                        wmts = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', layerService);

                    // FROM THE SAME SERVER, so there's no need for HOST info
                    //wmts.readWMTSCapabilites('elf', '/cgi-bin/elfmc/wmts?REQUEST=GetCapabilities', 'LAEA');
                    // FROM A FILE
                    wmts.readWMTSCapabilites('karttakuva', 'wmts.xml', 'ETRS-TM35FIN', function (layers, caps) {
                        sandbox.postRequestByName('AddMapLayerRequest', ['taustakartta', true]);
                        console.log("CAPS", caps);
                        window.caps = caps;
                    });
                    */
                });
            }
        };
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);
});
