jQuery(document).ready(function() {
jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        data : window.controlParams,
        url: ajaxUrl + 'action_route=GetAppSetup',
        success: function (appSetup) {
            appSetup.configuration['hierarchical-layerlist'] = {
                conf: {},
                state: {}
            };
            appSetup.startupSequence.push({
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
            });
            var app = Oskari.app;
            if (!appSetup.startupSequence) {
                jQuery('#mapdiv').append('Unable to start');
                return;
            }

            app.setApplicationSetup(appSetup);

            app.startApplication(function () {
                var sb = Oskari.getSandbox();
            });
        },
        error: function (jqXHR, textStatus) {
            if (jqXHR.status !== 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });

});