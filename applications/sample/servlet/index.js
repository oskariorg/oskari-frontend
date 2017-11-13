jQuery(document).ready(function() {
    Oskari.app.loadAppSetup(ajaxUrl + 'action_route=GetAppSetup', window.controlParams, function() {
        jQuery('#mapdiv').append('Unable to start');
    }, function () {

    }, function (appSetup){
                  var l = appSetup.startupSequence.length;
            appSetup.startupSequence[l] = {
                "bundlename":"coordinateconversion" ,
            }
            appSetup.startupSequence[l].metadata= { "Import-Bundle": { "coordinateconversion": { "bundlePath": "/Oskari/packages/paikkatietoikkuna/bundle/" } } };
    });
});
