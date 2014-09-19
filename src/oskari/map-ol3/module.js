define([
	"oskari",
	"jquery",
	"libraries/ol3/ol-v3.0.0-debug",
	"libraries/ol3/ol3-ol2-compatibility",
	"css!resources/ol3/bundle/ol3-default/css/ol-v3.0.0.css"
], function(Oskari, jQuery, proj4) {
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