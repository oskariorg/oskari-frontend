Oskari.registerLocalization({
	"lang" : "fi",
	"key" : "LayerSelector",
	"value" : {
		"title" : "Karttatasot",
		"desc" : "",
		"errors" : {
            "title": "Virhe!",
            "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin.",
			"loadFailed" : "Karttatasojen latauksessa tapahtui virhe. Lataa sivu selaimeesi uudelleen ja valitse karttatasot.",
			"noResults": "Haulla ei löytynyt yhtään tulosta."
		},
        "loading" : "Ladataan...",
		"filter" : {
			"text" : "Hae karttatasoja",
			"inspire" : "Aiheittain",
			"organization" : "Tiedontuottajittain",
			"published" : "Käyttäjät"
		},
		"published" : {
			"organization" : "Julkaistu taso",
			"inspire" : "Julkaistu taso"
		},
		"tooltip" : {
			"type-base" : "Taustakartta",
			"type-wms" : "Karttataso",
			"type-wfs" : "Tietotuote"
		},
		"backendStatus" : {
			"DOWN" : {
				"tooltip" : "Karttataso ei ole saatavilla tällä hetkellä.",
				"iconClass" : "backendstatus-down"
			},
			"MAINTENANCE" : {
				"tooltip" : "Karttatason saatavuudessa on tiedossa käyttökatkoja lähipäivinä.",
				"iconClass" : "backendstatus-maintenance"
			}
		}
	}
});
