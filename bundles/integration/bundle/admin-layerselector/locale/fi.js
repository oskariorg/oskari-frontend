Oskari.registerLocalization({
	"lang" : "fi",
	"key" : "admin-layerselector",
	"value" : {
		"title" : "admin: Karttatasot",
		"desc" : "",
		"flyout" : {
			"title" : "admin: karttatasot"
		},
		"tile" : {
			"title" : "A: karttatasot",
			"tooltip" : "."
		},
		"view" : {
			"title" : "",
			"prompt" : "",
			"templates" : {
			}
		},
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
			"OK" : {
				"tooltip" : "Karttataso on saatavilla tällä hetkellä.",
				"iconClass" : "backendstatus-ok"
			},
			"DOWN" : {
				"tooltip" : "Karttataso ei ole saatavilla tällä hetkellä.",
				"iconClass" : "backendstatus-down"
			},
			"MAINTENANCE" : {
				"tooltip" : "Karttatason saatavuudessa on tiedossa käyttökatkoja lähipäivinä.",
				"iconClass" : "backendstatus-maintenance"
			},
			"UNKNOWN" : {
				"tooltip" : "",
				"iconClass" : "backendstatus-ok"
			}
		},
		"admin" : {
			"addOrganization" 		: "Lisää tiedontuottaja",
			"addOrganizationDesc"	: "Lisää tiedontuottaja eli uusi orgasaatio",
			"addInspire" 			: "Lisää aihe",
			"addInspireDesc" 		: "Lisää aihe eli uusi Inspire-teema",
			"addLayer" 				: "Lisää taso",
			"addLayerDesc"			: "Lisää taso tähän Inspire-teemaan",
			"edit" 					: "Muokkaa", 
			"editDesc" 				: "Muokkaa nimeä",
			"layerType"				: "Tason tyyppi",
			"layerTypeDesc" 		: "Tason tyyppi: WMS, WFS, WMTS",
			"interfaceVersion"		: "Rajapinnan versio",
			"interfaceVersionDesc" 	: "Rajapinnan versio",
			"wmslayer"				: "WMS Taso",
			"wms1_1_1"				: "WMS 1.1.1",
			"wms1_3_0"				: "WMS 1.3.0",
			"wfslayer"				: "WFS Taso",
			"wmtslayer"				: "WMTS Taso",
			"getInfo" 				: "Hae tiedot",

			"wmsInterfaceAddress" 	: "WMS-rajapinnan osoitteet",
			"wmsInterfaceAddressDesc": "WMS-rajapinnan URL-osoitteet pilkulla eroteltuna",
			"wmsServiceMetaId" 		: "WMS metatiedon tunniste",
			"wmsServiceMetaIdDesc" 	: "WMS-palvelun metatiedon tiedostotunniste",
			"layerNameAndDesc" 		: "Tason nimi ja lyhyt kuvaus",

			"metaInfoIdDesc" 		: "Paikkatietohakemiston metatiedon tiedostotunniste, joka yksilöi metatiedon XML kuvailun",
			"metaInfoId" 			: "Metatiedon tiedosto&shy;tunniste",
			"wmsName" 				: "WMS nimi",
			"wmsNameDesc" 			: "WMS taso eli uniikki nimi",

			"addInspireName" 		: "Aiheen nimi",
			"addInspireNameTitle" 	: "Aiheen nimi",
			"addOrganizationName" 	: "Tiedontuottajan nimi",
			"addOrganizationNameTitle" : "Tiedontuottajan nimi",
			"addNewClass" 			: "Lisää uusi teema",
			"addNewLayer" 			: "Lisää uusi karttataso",
			"addNewOrganization" 	: "Lisää uusi tiedontuottaja",
			"addInspireTheme" 		: "Lisää aihe",
			"addInspireThemeDesc" 	: "Lisää InspireTheme:n mukaiset aiheet",
			"opacity" 				: "Läpinäkyvyys",
			"opacityDesc" 			: "Tason läpinäkyvyys",
			"style" 				: "Tyyli",
			"styleDesc" 			: "Tyyli",

			"minScale" 				: "Minimi&shy;mittakaava",
			"minScaleDesc" 			: "Tason minimimittakaava",
			"minScalePlaceholder" 	: "Tason minimimittakaava",
			"maxScale" 				: "Maximi&shy;mittakaava",
			"maxScaleDesc" 			: "Tason maximimittakaava",
			"maxScalePlaceholder" 	: "Tason maximimittakaava",
			"legendaImage" 			: "Legenda-kuvan osoite",
			"legendaImageDesc" 		: "Legenda-kuvan osoite",
			"legendaImagePlaceholder" : "Legenda-kuvan osoite",
			"gfiResponseType" 		: "GFI vastauksen tyyppi",
			"gfiResponseTypeDesc" 	: "Vastauksen tyyppi eli Get Feature Info (GFI)",
			"gfiStyle" 				: "GFI:n tyyli",
			"gfiStyleDesc" 			: "GFI:n tyyli (XSLT)",

			"finnish" 				: "Suomeksi:",
			"finnishTitle" 			: "Fi",
			"finnishPlaceholder" 	: "Nimi suomeksi",
			"finnishDescPlaceholder" : "Kuvaus suomeksi",
			"swedish" 				: "Ruotsiksi:",
			"swedishTitle" 			: "Sv",
			"swedishPlaceholder" 	: "Nimi ruotsiksi",
			"swedishDescPlaceholder" : "Kuvaus ruotsiksi",
			"english" 				: "Englanniksi:",
			"englishTitle" 			: "En",
			"englishPlaceholder" 	: "Nimi englanniksi",
			"englishDescPlaceholder" : "Kuvaus englanniksi"
		},
		"cancel" 	: "Peruuta",
		"add" 		: "Lisää",
		"delete" 	: "Poista"
	}
});
