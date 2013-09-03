define(["oskari", 
			"./event",
			"./common/features-available-event",
			"./common/after-map-layer-add-event",
			"./common/after-map-layer-remove-event",
			"./common/after-map-move-event",
			"./common/after-map-move-start-event",
			"./common/after-show-map-layer-info-event",
			"./common/after-hide-map-marker-event",
			"./common/mouse-hover-event",
			"./common/MapLayerEvent",
			"./common/after-rearrange-selected-map-layer-event",
			"./common/after-change-map-layer-opacity-event",
			"./common/after-change-map-layer-style-event",
			"./common/after-highlight-map-layer-event",
			"./common/after-dim-map-layer-event"],
	function(Oskari) {

		Oskari.bundleCls('event-base');
		Oskari.bundleCls('event-map');
		Oskari.bundleCls('event-map-layer');
	});