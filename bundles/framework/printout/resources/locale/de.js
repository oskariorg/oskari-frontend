Oskari.registerLocalization(
{
    "lang": "de",
    "key": "Printout",
    "value": {
        "title": "Kartenansicht drucken",
        "flyouttitle": "Kartenansicht drucken",
        "desc": "",
        "btnTooltip": "Drucken",
        "BasicView": {
            "title": "Kartenansicht drucken",
            "name": {
                "label": "Kartenname",
                "placeholder": "erforderlich",
                "tooltip": "Geben Sie der Karte einen beschreibenden Namen. Bitte achten Sie auf die Sprache der Nutzeroberfläche."
            },
            "language": {
                "label": "Sprache",
                "options": {
                    "fi": "Finnisch",
                    "sv": "Schwedisch",
                    "en": "Englisch"
                },
                "tooltip": "Wählen Sie die Sprache für den Ausdruck. Bitte achten Sie auf die Sprache der Nutzeroberfläche."
            },
            "size": {
                "label": "Größe",
                "tooltip": "Wählen Sie das Druck-Layout. Die Vorschau wird entsprechend aktualisiert.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 Hochformat",
                        "classForPreview": "Vorschau Hochformat",
                        "selected": true
                    },
                    {
                        "id": "A4_Querformat",
                        "label": "A4 Querformat",
                        "classForPreview": "Vorschau Querformat"
                    },
                    {
                        "id": "A3",
                        "label": "A3 Hochformat",
                        "classForPreview": "Vorschau Hochformat"
                    },
                    {
                        "id": "A3_Querformat",
                        "label": "A3 Querformat",
                        "classForPreview": "Vorschau Querformat"
                    }
                ]
            },
            "preview": {
                "label": "Vorschau",
                "tooltip": "Klicken Sie auf die Vorschau, um eine vergrößerte Ansicht zu erhalten.",
                "pending": "Die Vorschau wird in Kürze aktualisiert",
                "notes": {
                    "extent": "Die Vorschau kann verwendet werden, um die Größe des Druckbereichs festzustellen.",
                    "restriction": "Es werden nicht alle Kartenebenen in der Vorschau angezeigt."
                }
            },
            "buttons": {
                "save": "Ausdruck erstellen",
                "ok": "OK",
                "back": "Zurück",
                "cancel": "Abbrechen"
            },
            "location": {
                "label": "Ort und Zoomstufe",
                "tooltip": "Der Maßstab des Ausdrucks entspricht dem der Karte im Browser.",
                "zoomlevel": "Zoomstufe"
            },
            "settings": {
                "label": "Weitere Einstellungen",
                "tooltip": "Geben Sie weitere Einstellungen ein: Dateiformat, Titel und Maßstab"
            },
            "format": {
                "label": "Dateiformat",
                "tooltip": "Dateiformat auswählen",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG-Bild"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF-Dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Titel hinzufügen",
                "tooltip": "Fügen Sie der Karte einen Titel hinzu"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Paikkatietoikkuna-Logo hinzufügen",
                        "tooltip": "Sie können das Logo bei Bedarf verbergen",
                        "checked": "checked"
                    },
                    {
                        "id": "pageScale",
                        "label": "Maßstab zur Karte hinzufügen",
                        "tooltip": "Maßstab zur Karte hinzufügen",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Datum hinzufügen",
                        "tooltip": "Sie können dem Ausdruck ein Datum hinzufügen",
                        "checked": "checked"
                    }
                ]
            },
            "help": "Hilfe",
            "error": {
                "title": "Fehler",
                "size": "Fehler bei der Definition der Größe",
                "name": "Namensinformation wird benötigt",
                "nohelp": "Keine Hilfe verfügbar",
                "saveFailed": "Ausdrucken der Karte fehlgeschlagen. Bitte versuchen Sie es später noch mal.",
                "nameIllegalCharacters": "Der Name enthält unerlaubte Zeichn. Erlaubte Zeichen sind Buchstaben a-z, Sonderbuchstaben, Ziffern, Rücksatz und Bindestrich."
            }
        },
        "StartView": {
            "text": "Sie können die gerade von Ihnen erzeugte Kartenansicht ausdrucken.",
            "info": {
                "maxLayers": "Sie können maximal 8 Kartenebenen gleichzeitg drucken.",
                "printoutProcessingTime": "Das Ausdrucken nimmt etwas mehr Zeit in Anspruch, wenn mehrere Kartenebenen ausgewählt sind."
            },
            "buttons": {
                "continue": "Fortfahren",
                "cancel": "Abbrechen"
            }
        }
    }
});
