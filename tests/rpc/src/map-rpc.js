/*
Switch map URL to test other maps
*/
var mapUrl = 'http://demo.oskari.org/?lang=en&uuid=31a3333b-9670-482d-8d5e-ebbe7c8326c7';

// set source
document.getElementById('map').src = mapUrl;
// set domain (localhost is allowed)
var iFrameDomain = mapUrl.substring(0, mapUrl.indexOf('?'));
// init connection 
var iFrame = document.getElementById('map');
window.channel = OskariRPC.connect(
    iFrame,
    iFrameDomain
);