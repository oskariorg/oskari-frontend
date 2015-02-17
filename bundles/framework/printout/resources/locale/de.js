Oskari.registerLocalization({
    "lang" : "de",
    "key" : "Printout",
    "value" : {
        "title" : "Kartenansicht drucken",
        "flyouttitle" : "Kartenansicht drucken",
        "desc" : "",
        "btnTooltip" : "Drucken",
        "BasicView" : {
            "title" : "Kartenansicht drucken",
            "name" : {
                "label" : "The name of the map",
                "placeholder" : "required",
                "tooltip" : "Give your map a descriptive name. Please note the language of the user interface."
            },
            "language" : {
                "label" : "Sprache",
                "options" : {
                    "fi": "Finnisch",
                    "sv": "Schwedisch",
                    "en": "Englisch",
                    "de" : "Deutsch",
                    "es" : "Spanisch",
                    "cs" : "Tschechisch"
                },
                "tooltip" : "Select the language of the map interface and map data."
            },
            "size" : {
                "label" : "Größe",
                "tooltip" : "Wählen Sie das Druck-Layout. Die Vorschau wird entsprechend aktualisiert.",
                "options" : [{
                    "id" : "A4",
                    "label" : "A4 Hochformat",
                    "classForPreview" : "preview-portrait",
                    "selected" : true
                }, {
                    "id" : "A4_Landscape",
                    "label" : "A4 Querformat",
                    "classForPreview" : "preview-landscape"
                }, {
                    "id" : "A3",
                    "label" : "A3 Hochformat",
                    "classForPreview" : "preview-portrait"
                }, {
                    "id" : "A3_Landscape",
                    "label" : "A3 Querformat",
                    "classForPreview" : "preview-landscape"
                }]
            },
            "preview" : {
                "label" : "Vorschau",
                "tooltip" : "Klicken Sie auf die Vorschau, um eine vergrößerte Ansicht zu erhalten.",
                "pending" : "Die Vorschau wird in Kürze aktualisiert",
                "notes" : {
                    "extent" : "Die Vorschau kann verwendet werden, um die Größe des Druckbereichs festzustellen.",
                    "restriction" : "Es werden nicht alle Kartenebenen in der Vorschau angezeigt."
                }

            },

            "buttons" : {
                "save" : "Ausdruck erstellen",
                "ok" : "OK",
                "back" : "NOT TRANSLATED",
                "cancel" : "Abbrechen"
            },
            "location" : {
                "label" : "Ort und Zoomstufe",
                "tooltip" : "Der Maßstab des Ausdrucks entspricht dem der Karte im Browser.",
                "zoomlevel" : "Zoomstufe"
            },
            "settings" : {
                "label" : "Weitere Einstellungen",
                "tooltip" : "Geben Sie weitere Einstellungen ein: Format, Titel und Maßstab"
            },
            "format" : {
                "label" : "Format",
                "tooltip" : "Dateiformat auswählen",
                "options" : [{
                    "id" : "png",
                    "format" : "image/png",
                    "label" : "PNG-Bild"
                }, {
                    "id" : "pdf",
                    "format" : "application/pdf",
                    "selected" : true,
                    "label" : "PDF-Dokument"
                }]
            },
            "mapTitle" : {
                "label" : "Titel hinzufügen",
                "tooltip" : "Fügen Sie der Karte einen Titel hinzu"
            },
            "content" : {
                "options" : [{
                    "id" : "pageLogo",
                    "label" : "Paikkatietoikkuna-Logo hinzufügen",
                    "tooltip" : "Sie können das Logo bei Bedarf verbergen",
                        "checked" : "checked"
                }, {
                    "id" : "pageScale",
                    "label" : "Maßstab zur Karte hinzufügen",
                    "tooltip" : "Maßstab zur Karte hinzufügen",
                        "checked" : "checked"
                }, {
                    "id" : "pageDate",
                    "label" : "Datum hinzufügen",
                    "tooltip" : "Sie können dem Ausdruck ein Datum hinzufügen",
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
            "help" : "Hilfe",
            "error" : {
                "title" : "Fehler",
                "size" : "Error in size definitions",
                "name" : "Name is required information",
                "nohelp" : "Keine Hilfe verfügbar",
                "saveFailed" : "Ausdrucken der Karte fehlgeschlagen. Bitte versuchen Sie es später noch mal.",
                "nameIllegalCharacters" : "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView" : {
            "text" : "Sie können die gerade von Ihnen erzeugte Kartenansicht ausdrucken.",
            "info" : {
                "maxLayers" : "Sie können maximal 8 Kartenebenen gleichzeitg drucken.",
                "printoutProcessingTime" : "Das Ausdrucken nimmt etwas mehr Zeit in Anspruch, wenn mehrere Kartenebenen ausgewählt sind."
            },
            "buttons" : {
                "continue" : "Weiter",
                "cancel" : "Abbrechen"
            }
        }
    }
});
