/**
 * Start when dom ready
 */
jQuery(document).ready(function() {

    if(!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    /* let's load the appsetup and configurations from database */
    jQuery.ajax({
        type : 'GET',
        dataType : 'json',
        data : window.controlParams,
        url : ajaxUrl + 'action_route=GetAppSetup',
        success : function(appSetup) {
            var app = Oskari.app;
            // TODO: move to DB!
            appSetup.configuration.userguide.conf = {
                "flyoutClazz": "Oskari.mapframework.bundle.userguide.SimpleFlyout"
            };
            app.init(appSetup);
            app.startApplication();
        },
        error : function(jqXHR, textStatus) {
            if(jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });

});