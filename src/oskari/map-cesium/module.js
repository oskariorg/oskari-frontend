define([
	"oskari",
	"jquery",
	"libraries/cesium/cesium-b30/Build/CesiumUnminified/Cesium",
	"libraries/leaflet/leaflet-ol2-compatibility",
	"libraries/Proj4js/proj4js-2.2.1/proj4-src",
	"./Proj4jsProjection",
	"css!libraries/cesium/cesium-b30/Build/CesiumUnminified/Widgets/widgets.css"
], function(Oskari, jQuery, Cesium, olcomp, Proj4js) {
	window.Proj4js = Proj4js;
	return Oskari.bundleCls("cesium").category({
		'__name': 'lib-cesium',
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
			// delete Cesium...just joking
		}
	})
});