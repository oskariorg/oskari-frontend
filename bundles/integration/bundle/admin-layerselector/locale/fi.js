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
			"selectLayer" 			: "Valitse ylätaso",
			"selectSubLayer"		: "Valitse alataso",

			"addOrganization" 		: "Lisää tiedontuottaja",
			"addOrganizationDesc"	: "Lisää tiedontuottaja eli uusi orgasaatio",
			"addInspire" 			: "Lisää aihe",
			"addInspireDesc" 		: "Lisää aihe eli uusi Inspire&shy;-teema",
			"addLayer" 				: "Lisää taso",
			"addLayerDesc"			: "Lisää taso tähän Inspire&shy;-teemaan",
			"edit" 					: "Muokkaa", 
			"editDesc" 				: "Muokkaa nimeä",
			"layerType"				: "Tason tyyppi",
			"layerTypeDesc" 		: "Tason tyyppi: WMS, WFS, WMTS",
			"type"					: "Tason tyyppi",
			"typePlaceholder"		: "Valitse tason tyyppi",
			"normalLayer"			: "Normaali taso",
			"baseLayer"				: "Taustataso",
			"groupLayer"			: "Ryhmätaso",
			"interfaceVersion"		: "Rajapinnan versio",
			"interfaceVersionDesc" 	: "Rajapinnan versio",
			"wmslayer"				: "WMS Taso",
			"wms1_1_1"				: "WMS 1.1.1",
			"wms1_3_0"				: "WMS 1.3.0",
			"wfslayer"				: "WFS Taso",
			"wmtslayer"				: "WMTS Taso",
			"getInfo" 				: "Hae tiedot",
			"selectClass" 			: "Valitse aihe",
			"selectClassDesc" 		: "Valitse aihe",

			"baseName"				: "Taustatason nimi",
			"groupName"				: "Ryhmätason nimi",
			"subLayers" 			: "Alatasot",
			"addSubLayer"			: "Lisää alataso",

			"wmsInterfaceAddress" 	: "WMS&shy;-rajapinnan osoitteet",
			"wmsInterfaceAddressDesc": "WMS&shy;-rajapinnan URL-osoitteet pilkulla eroteltuna",
			"wmsServiceMetaId" 		: "WMS metatiedon tunniste",
			"wmsServiceMetaIdDesc" 	: "WMS&shy;-palvelun metatiedon tiedostotunniste",
			"layerNameAndDesc" 		: "Tason nimi ja lisätieto",

			"metaInfoIdDesc" 		: "Paikkatieto&shy;hakemiston metatiedon tiedostotunniste, joka yksilöi metatiedon XML kuvailun",
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
			"minScaleDesc" 			: "Tason minimimittakaava (1:5669294)",
			"minScalePlaceholder" 	: "5669294 (1:5669294) Minimimittakaava",
			"maxScale" 				: "Maximi&shy;mittakaava",
			"maxScaleDesc" 			: "Tason maximimittakaava (1:1)",
			"maxScalePlaceholder" 	: "1 (1:1) Maximimittakaava ",
			"srsName"				: "Koordinaatti&shy;järjestelmä",
			"srsNamePlaceholder"	: "Koordinaattijärjestelmä",
			"legendImage" 			: "Legenda&shy;-kuvan osoite",
			"legendImageDesc" 		: "Legenda-kuvan osoite",
			"legendImagePlaceholder" : "Legenda-kuvan osoite",
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
			"englishDescPlaceholder" : "Kuvaus englanniksi",

			"interfaceAddress" 		: "Rajapinnan osoite",
			"interfaceAddressDesc" 	: "WMS&shy;-tasomäärittelyjen osoite",
			"viewingRightsRoles" 	: "Katseluoikeudet rooleille"
		},
		"cancel" 	: "Peruuta",
		"add" 		: "Tallenna",
		"delete" 	: "Poista"
	}
});
