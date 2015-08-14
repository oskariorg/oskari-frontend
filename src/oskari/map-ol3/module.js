define([
	"oskari",
	"jquery",
	"libraries/ol3/base",
//	"libraries/ol3/ol-20130912",
	"libraries/ol3/ol-v3.0.0-beta.2-whitespace",
	"libraries/ol3/ol3-ol2-compatibility",
	"libraries/proj4js-1.0.1/proj4js-compressed",
	"css!resources/ol3/bundle/ol3-default/css/ol.css"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("ol3").category({
		'__name': 'lib-ol3',
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
			// delete OpenLayers...just joking
		}
	})
});