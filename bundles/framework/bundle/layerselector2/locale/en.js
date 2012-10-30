Oskari.registerLocalization({
	"lang" : "en",
	"key" : "LayerSelector",
	"value" : {
		"title" : "Map layers",
		"desc" : "",
		"errors" : {
			"loadFailed" : "Error loading map layers. Reload the page in your browser and select map layers."
		},
		"filter" : {
			"text" : "Search map layers",
			"inspire" : "By theme",
			"organization" : "By data providers",
			"published" : "Users"
		},
		"tooltip" : {
			"type-base" : "Background map",
			"type-wms" : "Map layer",
			"type-wfs" : "Data product"
		},
		"backendStatus" : {
			"DOWN" : {
				"tooltip" : "The map layer is currently unavailable.",
				"iconClass" : "backendstatus-down"
			},
			"MAINTENANCE" : {
				"tooltip" : "The map layer may be periodically unavailable during the next few days.",
				"iconClass" : "backendstatus-maintenance"
			}
		}
	}
});
