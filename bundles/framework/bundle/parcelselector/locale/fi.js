Oskari.registerLocalization({
	"lang" : "fi",
	"key" : "ParcelSelector",
	"value" : {
		"title" : "Hae",
		"desc" : "",
		"button" : "Hae",
		"errors" : {
            "title": "Virhe!",
            "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin.",
			"loadFailed" : "Tietojen latauksessa tapahtui virhe. Lataa sivu selaimeesi uudelleen.",
			"noResults": "Haulla ei löytynyt yhtään tulosta.",
			"illegalInput" : "Tunnisteen pitää olla numero."
		},
        "loading" : "Ladataan...",
		"filter" : {
			"text" : "Määräalan tunniste",
			"parcel" : "Palsta",
			"registerUnit" : "Rekisteriyksikkö"
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
