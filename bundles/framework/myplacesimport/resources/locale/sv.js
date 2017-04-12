Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "MyPlacesImport",
    "value": {
        "title": "Dataset importering",
        "desc": "Du kan importera dina egna dataset i shape-, gpx- eller mif/mid filformat i zip-paketet eller kmz filformat.",
        "tool": {
            "tooltip": "Importera ditt eget dataset"
        },
        "flyout": {
            "title": "Dataset importering",
            "description": "Du kan importera dina egna dataset i shape-, gpx- eller mif/mid filformat i zip-paketet eller kmz filformat. Du kan importera filer med högst 5000 objekt.",
            "help": "Välj en fil från din dator eller ge en länk till den fil som innehåller ditt dataset. Filen kan vara i shp, zip eller kml / kmz-format. Du kan skapa zip-filer från shapefiler genom zippa filerna med ändelsen shp, SHX, DBF och PRJ till samma zip-fil. \nOckså kml / KMZ-filer från Google maps kan kopplas på samma sätt. \nMif/mid data CRS måste vara kartans CRS",
            "actions": {
                "cancel": "Avbryt",
                "next": "Nästa"
            },
            "file": {
                "submit": "Skicka",
                "fileOverSizeError": {
                    "title": "Fel",
                    "message": "Din datamängd är för stor. Datamängden kan vara högst <xx> mb.",
                    "close": "Stäng"
                }
            },
            "layer": {
                "title": "Spara dataset information:",
                "name": "Namn",
                "desc": "Beskrivning",
                "source": "Datakälla",
                "style": "Dataset stil definitioner:"
            },
            "validations": {
                "error": {
                    "title": "Fel",
                    "message": "Filen har inte valts och namnet på kartlagret saknas."
                }
            },
            "finish": {
                "success": {
                    "title": "Importering av dataset lyckades.",
                    "message": "Du kan hitta kartlagret i menyn \"Mina uppgifter\"."
                },
                "failure": {
                    "title": "Dataset importen lyckades inte. Försök på nytt senare."
                }
            }
        },
        "tab": {
            "title": "Dataset",
            "grid": {
                "name": "Namn",
                "description": "Beskrivning",
                "source": "Datakälla",
                "remove": "Ta bort",
                "removeButton": "Ta bort"
            },
            "confirmDeleteMsg": "Vill du ta bort:",
            "buttons": {
                "ok": "OK",
                "cancel": "Avbryt",
                "delete": "Ta bort"
            },
            "notification": {
                "deletedTitle": "Ta bort dataset",
                "deletedMsg": "Datasetet har tagits bort"
            },
            "error": {
                "title": "Fel!",
                "generic": "Systemfel. Försök på nytt senare."
            }
        },
        "layer": {
            "organization": "Egna dataset",
            "inspire": "Egna dataset"
        }
    }
});
