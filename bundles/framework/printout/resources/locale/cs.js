Oskari.registerLocalization({
    "lang" : "cs",
    "key" : "Printout",
    "value" : {
        "title" : "Tisknout zobrazení mapy",
        "flyouttitle" : "Tisknout zobrazení mapy",
        "desc" : "",
        "btnTooltip" : "Tisk",
        "BasicView" : {
            "title" : "Tisknout zobrazení mapy",
            "name" : {
                "label" : "The name of the map",
                "placeholder" : "required",
                "tooltip" : "Give your map a descriptive name. Please note the language of the user interface."
            },
            "language" : {
                "label" : "Jazyk",
                "options" : {
                    "fi": "finština",
                    "sv": "švédština",
                    "en": "angličtina",
                    "de" : "němčina",
                    "es" : "španělština",
                    "cs" : "čeština"
                },
                "tooltip" : "Select the language of the map interface and map data."
            },
            "size" : {
                "label" : "Velikost",
                "tooltip" : "Vyberte rozložení tisku| Současně je aktualizován náhled mapy.",
                "options" : [{
                    "id" : "A4",
                    "label" : "A4 na výšku",
                    "classForPreview" : "preview-portrait",
                    "selected" : true
                }, {
                    "id" : "A4_Landscape",
                    "label" : "A4 na šířku",
                    "classForPreview" : "preview-landscape"
                }, {
                    "id" : "A3",
                    "label" : "A3 na výšku",
                    "classForPreview" : "preview-portrait"
                }, {
                    "id" : "A3_Landscape",
                    "label" : "A3 na šířku",
                    "classForPreview" : "preview-landscape"
                }]
            },
            "preview" : {
                "label" : "Náhled",
                "tooltip" : "Klikněte na malý náhled pro zvětšení",
                "pending" : "Náhled bude rychle aktualizován",
                "notes" : {
                    "extent" : "Náhled lze použít pro výpočet rozsahu mapy výtisku",
                    "restriction" : "V náhledu nejsou zobrazeny všechny mapové vrstvy"
                }

            },

            "buttons" : {
                "save" : "Získat výtisk",
                "ok" : "OK",
                "back" : "NOT TRANSLATED",
                "cancel" : "Storno"
            },
            "location" : {
                "label" : "Umístění a úroveň přiblížení",
                "tooltip" : "Měřítko výtisku odpovídá měřítku mapy v prohlížeči.",
                "zoomlevel" : "Úroveň přiblížení"
            },
            "settings" : {
                "label" : "Více nastavení",
                "tooltip" : "Provést dodatečná nastavení jako formát, titul a měřítko"
            },
            "format" : {
                "label" : "Format",
                "tooltip" : "Vyberte formát souboru",
                "options" : [{
                    "id" : "png",
                    "format" : "image/png",
                    "label" : "Obrázek PNG"
                }, {
                    "id" : "pdf",
                    "format" : "application/pdf",
                    "selected" : true,
                    "label" : "Dokument PDF"
                }]
            },
            "mapTitle" : {
                "label" : "Vložit název",
                "tooltip" : "vložit název mapy"
            },
            "content" : {
                "options" : [{
                    "id" : "pageLogo",
                    "label" : "Přidat logo Paikkatietoikkuna",
                    "tooltip" : "Je-li to nezbytné, lze logo skrýt",
                        "checked" : "checked"
                }, {
                    "id" : "pageScale",
                    "label" : "Vložit do mapy měřítko",
                    "tooltip" : "Vložit do mapy měřítko",
                        "checked" : "checked"
                }, {
                    "id" : "pageDate",
                    "label" : "Vložit datum",
                    "tooltip" : "Do výtisku lze vložit datum",
                        "checked" : "checked"
                }]
            },
                "legend" : {
                "label" : "Legend",
                "tooltip" : "Select legend position",
                "options" : [{
                        "id" : "oskari_legend_NO",
                        "loca" : "NO",
                        "label" : "No legend ",
                        "tooltip" : "No legend plot",
                        "selected" : true
                       
                    },{
                        "id" : "oskari_legend_LL",
                        "loca" : "LL",
                        "label" : "Left lower corner ",
                        "tooltip" : "Legend position in left lower corner of print area"
                       
                    },{
                        "id" : "oskari_legend_LU",
                         "loca" : "LU",
                        "label" : "Left upper corner ",
                        "tooltip" : "Legend position in left upper corner of print area"
                       
                    },{
                        "id" : "oskari_legend_RU",
                         "loca" : "RU",
                        "label" : "Right upper corner ",
                        "tooltip" : "Legend position in right upper corner of print area"
                       
                    },{
                        "id" : "oskari_legend_RL",
                         "loca" : "RL",
                        "label" : "Right lower corner ",
                        "tooltip" : "Legend position in right lower corner of print area"
                       
                    }
                ]
            },
            "help" : "Nápověda",
            "error" : {
                "title" : "Chyba",
                "size" : "Error in size definitions",
                "name" : "Name is required information",
                "nohelp" : "Nápověda není dostupná",
                "saveFailed" : "Tisk mapy selhal. Zkuste to později.",
                "nameIllegalCharacters" : "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView" : {
            "text" : "Zobrazení mapy, které jste právě vytvořili, lze vytisknout.",
            "info" : {
                "maxLayers" : "Najednou lze vytisknout maximálně 8 vrstev.",
                "printoutProcessingTime" : "Pokud je vybrán soutisk více vrstev, tisk trvá déle."
            },
            "buttons" : {
                "continue" : "Pokračuj",
                "cancel" : "Storno"
            }
        }
    }
});
