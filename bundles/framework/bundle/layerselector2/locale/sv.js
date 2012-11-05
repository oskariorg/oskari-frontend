Oskari.registerLocalization({
	"lang" : "sv",
	"key" : "LayerSelector",
	"value" : {
		"title" : "Kartlager",
		"desc" : "",
		"errors" : {
			"loadFailed" : "Fel i laddningen av kartlager. Ladda ned sidan på nytt i din läsare och välj kartlagren."
		},
		"filter" : {
			"text" : "Sök kartlager",
			"inspire" : "Enligt tema",
			"organization" : "Enligt dataproducent",
			"published" : "Användare"
		},
        "published" : {
            "organization" : "Publicerad kartlager",
            "inspire" : "Publicerad kartlager"
        },
		"tooltip" : {
			"type-base" : "Bakgrundskarta",
			"type-wms" : "kartlager",
			"type-wfs" : "Dataprodukt"
		},
		"backendStatus" : {
			"DOWN" : {
				"tooltip" : "Kartlagret är inte tillgängligt just nu.",
				"iconClass" : "backendstatus-down"
			},
			"MAINTENANCE" : {
				"tooltip" : "Avbrott i kartlagrets tillgänglighet är att vänta inom de närmaste dagarna.",
				"iconClass" : "backendstatus-maintenance"
			}
		}
	}
});
