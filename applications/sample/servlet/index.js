jQuery(document).ready(function() {
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        data : window.controlParams,
        url: window.ajaxUrl + 'action_route=GetAppSetup',
        success: function (appSetup) {
        	var bundle = appSetup.startupSequence[11].metadata['Import-Bundle'];
        	bundle.statsgrid.bundlePath = "/Oskari/packages/statistics/";

            Oskari.app.setApplicationSetup(appSetup);
            Oskari.app.startApplication(function () {

                Oskari.app.playBundle({
                    "bundlename" : "statsgraphs",
                    "metadata" : {
                        "Import-Bundle": {
                            "statsgraphs": {
                                "bundlePath": "/Oskari/packages/statistics/"
                            }
                        }
                    }
                });
            });
        },
        error: function (jqXHR, textStatus) {
            if (jqXHR.status !== 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});
