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
            //Lisää hierarkinen setuppiin
            /*setup.configuration['hierarchical-layerlist'] = {
                conf: {},
                state: {}
            };
            setup.startupSequence.push({
                bundleinstancename: 'hierarchical-layerlist',
                bundlename: 'hierarchical-layerlist',
                en: 'hierarchical-layerlist',
                fi: 'hierarchical-layerlist',
                sv: 'hierarchical-layerlist',
                title: 'hierarchical-layerlist',
                metadata: {
                    'Import-Bundle': {
                        'hierarchical-layerlist' :{
                            bundlePath: '/Oskari/packages/framework/bundle/'
                        }
                    }
                },
                instanceProps: {}
            });*/
            var app = Oskari.app;
            app.setApplicationSetup(setup);
            app.setConfiguration(setup.configuration);
            app.startApplication(function (startupInfos) {
                // all bundles have been loaded
            });
        };
    downloadAppSetupConfig(startApplication);
});