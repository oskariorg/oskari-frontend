define([
	"oskari",
	"jquery",
	"libraries/proj4js-1.0.1/proj4js-compressed",
	"libraries/OpenLayers/OpenLayers.2_13_1-full-map",
	"css!resources/openlayers/theme/default/style.css"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("ol2").category({
		create: function() {
			return this;
		},
		update: function(manager, bundle, bi, info) {

		},
		start: function() {},
		stop: function() {
			// delete OpenLayers...just joking
		}
	})
});