jQuery(document).ready(function () {
    Oskari.setLang('fi');
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
            app.init(setup);
            app.setConfiguration(setup.configuration);
            app.startApplication(function (startupInfos) {
                // all bundles have been loaded
            });
        };
    downloadAppSetupConfig(startApplication);
});