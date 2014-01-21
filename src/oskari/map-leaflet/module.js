define([
	"oskari",
	/* leaflet */
	"libraries/leaflet/leaflet-src",
	"libraries/leaflet/leaflet-ol2-compatibility",
	"libraries/proj4js-1.0.1/proj4js-compressed",
	"css!libraries/leaflet/leaflet.css"
], function(Oskari) {
	return Oskari.bundleCls("leaflet").category({
		'__name': 'lib-leaflet',
		getName: function() {
			return this.__name;
		},
		create: function() {
			return this;
		},
		update: function(manager, bundle, bi, info) {

		},
		start: function() {},
		stop: function() {
			// delete Leaflet...just joking
		}
	});
});