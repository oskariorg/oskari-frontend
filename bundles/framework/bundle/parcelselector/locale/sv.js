Oskari.registerLocalization({
	"lang" : "sv",
	"key" : "ParcelSelector",
	"value" : {
		"title" : "Kartlager",
		"desc" : "",
		"errors" : {
            "title": "Fel!",
            "generic": "Systemfel. Försök på nytt senare.",
			"loadFailed" : "Fel i laddningen av kartlager. Ladda ned sidan på nytt i din läsare och välj kartlagren.",
            "noResults": "ökningen gav inga resultat."
		},
        "loading" : "Laddar...",
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
