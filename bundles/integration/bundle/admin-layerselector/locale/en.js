Oskari.registerLocalization({
	"lang" : "en",
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
			"selectLayer"			: "Select layer",
			"selectSubLayer"		: "Select sublayer",

			"addOrganization" 		: "Add organization",
			"addOrganizationDesc"	: "Add organization i.e. new content producer",
			"addInspire" 			: "Add class",
			"addInspireDesc" 		: "Add class i.e. a new Inspire theme",
			"addLayer" 				: "Add layer",
			"addLayerDesc"			: "Add layer into this Inspire theme",
			"edit" 					: "Edit", 
			"editDesc" 				: "Edit name",
			"layerType"				: "Layer type",
			"layerTypeDesc" 		: "Layer type: WMS, WFS, WMTS",
			"interfaceVersion"		: "Interface version",
			"interfaceVersionDesc" 	: "Interface version",
			"wmslayer"				: "WMS layer",
			"wms1_1_1"				: "WMS 1.1.1",
			"wms1_3_0"				: "WMS 1.3.0",
			"wfslayer"				: "WFS layer",
			"wmtslayer"				: "WMTS layer",
			"getInfo" 				: "Get info",
			"selectClass" 			: "Select class",
			"selectClassDesc" 		: "Select Inspire theme",


			"wmsInterfaceAddress" 	: "WMS interface URL",
			"wmsInterfaceAddressDesc": "WMS interface URL-addresses separated with commas",
			"wmsServiceMetaId" 		: "WMS metadata id",
			"wmsServiceMetaIdDesc" 	: "Metadata id of WMS service",
			"layerNameAndDesc" 		: "Name and description of the layer",

			"metaInfoIdDesc" 		: "Metadata id to identify xml description of this metadata",
			"metaInfoId" 			: "Metadata Id",
			"wmsName" 				: "WMS name",
			"wmsNameDesc" 			: "WMS layer i.e. unique name",

			"addInspireName" 		: "Class name",
			"addInspireNameTitle" 	: "Name of the Inspire class",
			"addOrganizationName" 	: "Organization",
			"addOrganizationNameTitle" : "Name of the organization",
			"addNewClass" 			: "Add new class",
			"addNewLayer" 			: "Add new layer",
			"addNewOrganization" 	: "Add new organization",
			"addInspireThemes" 		: "Add class",
			"addInspireThemesDesc" 	: "Add classes (Inspire themes)",
			"opacity" 				: "Opacity",
			"opacityDesc" 			: "Layer opacity",
			"style" 				: "Style",
			"styleDesc" 			: "Style",

			"minScale" 				: "Minimum scale",
			"minScaleDesc" 			: "Layer's minimum scale",
			"minScalePlaceholder" 	: "Layer's minimum scale",
			"maxScale" 				: "Maximum scale",
			"maxScaleDesc" 			: "Layer's maximum scale",
			"maxScalePlaceholder" 	: "Layer's maximum scale",
			"legendImage" 			: "Legenda image",
			"legendImageDesc" 		: "URL for legenda image",
			"legendImagePlaceholder" : "URL for legenda image",
			"gfiResponseType" 		: "GFI response type",
			"gfiResponseTypeDesc" 	: "Response type for Get Feature Info (GFI)",
			"gfiStyle" 				: "GFI style",
			"gfiStyleDesc" 			: "GFI style (XSLT)",

			"finnish" 				: "Finnish:",
			"finnishTitle" 			: "Fi",
			"finnishPlaceholder" 	: "Name in Finnish",
			"finnishDescPlaceholder" : "Description in Finnish",
			"swedish" 				: "Swedish",
			"swedishTitle" 			: "Sv",
			"swedishPlaceholder" 	: "Name in Swedish",
			"swedishDescPlaceholder" : "Description in Swedish",
			"english" 				: "English:",
			"englishTitle" 			: "En",
			"englishPlaceholder" 	: "Name in English",
			"englishDescPlaceholder" : "Description in English",

			"interfaceAddress" 		: "interface URL",
			"interfaceAddressDesc" 	: "URL for WMS layer definitions"
		},
		"cancel" 	: "Cancel",
		"add" 		: "Add",
		"delete" 	: "Remove"
	}
});
