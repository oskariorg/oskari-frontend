jQuery(document).ready(function () {
    Oskari.setLang('en');
    Oskari.setLoaderMode('dev');
    var downloadAppSetupConfig = function (notifyCallback) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: 'appsetupconfig.json',
                success: function (setup) {
                    notifyCallback(setup);
                },
                error: function (xhr, status, error) {
                    alert('Unable to load appsetupconfig!');
                    throw error;
                }
            });
        },
        startApplication = function (setup) {
            // check that both setup and config are loaded 
            // before actually starting the application
            var app = Oskari.app;
            app.setApplicationSetup(setup);
            app.setConfiguration(setup.configuration);
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
        };
    downloadAppSetupConfig(startApplication);
});