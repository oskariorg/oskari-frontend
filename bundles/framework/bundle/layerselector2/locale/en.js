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
				"tooltip" : "??? Karttataso ei ole saatavilla tällä hetkellä.",
				"iconClass" : "backendstatus-down"
			},
			"MAINTENANCE" : {
				"tooltip" : "??? Karttatason saatavuudessa on tiedossa käyttökatkoja lähipäivinä.",
				"iconClass" : "backendstatus-maintenance"
			}
		}
	}
});
