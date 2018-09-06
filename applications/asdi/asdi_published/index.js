/**
 * Start when dom ready
 */
jQuery(document).ready(function () {
    function onSuccess () {
        var service = Oskari.getSandbox().getService('Oskari.map.DataProviderInfoService');
        service.addGroup('gepco', 'IHO-IOC GEBCO', [
            { 'id': 'gepco.acknowledgement', 'name': 'Gazetteer of Undersea Feature Names, www.gebco.net' }
        ]);
    }
    function onError () {
        jQuery('#mapdiv').append('Unable to start');
    }
    Oskari.app.loadAppSetup(ajaxUrl + 'action_route=GetAppSetup', window.controlParams, onError, onSuccess);
});