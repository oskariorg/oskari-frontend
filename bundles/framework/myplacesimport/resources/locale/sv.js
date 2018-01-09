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
            "description": "Importera en datamängd från din dator som en zip-fil, vilken innehåller alla erforderliga filer utav ett av de följande filformatsalternativen:<ul><li>Shapefile (.shp, .shx och .dbf, frivilligt .prj och .cpg)</li><li>GPX (.gpx)</li><li>MapInfo (.mif och .mid)</li><li>Google Map (.kml eller .kmz)</li></ul>Zip-filen kan innehålla endast en datamängd och dess storlek kan vara högst <xx> Mb.",
            "help": "Importera en datamängd från din dator som ett zip-paket. Var vänlig och kontrollera, att alla filerna är i ett lämpligt filformat och koordinatsystem.",
            "actions": {
                "cancel": "Avbryt",
                "next": "Nästa",
                "close": "Stäng"
            },
            "file": {
                "submit": "Skicka",
                "fileOverSizeError": {
                    "title": "Fel",
                    "message": "Din datamängd är för stor. Datamängden kan vara högst <xx> mb."
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
                    "message": "Dataset importerade med <xx> objekt. Du kan hitta kartlagret i menyn \"Mina uppgifter\"."
                },
                "failure": {
                    "title": "Dataset importen lyckades inte. Försök på nytt senare."
                }
            },
            "error":{
                "title": "Importerningen av datamängden misslyckades.",
                "unknown_projection": "Datamängdens koordinatsystem kunde inte identifieras. Kontrollera att datamängden är antingen i kartans koordinatsystem eller försäkra, att datamängden innehåller de nödvändiga uppgifterna av koordinatsystemet.",
                "invalid_file": "Lämpliga filer för importeringen kunde inte hittas från zip-filen. Var vänlig och kontrollera att filformatet understött och att datamänderna är packade till en zip-fil.",
                "unable_to_store_data": "Objekten kunde inte sparas till databasen eller den inmatade datamängden innehöll inga objekt.",
                "short_file_prefix": "Hämtningen av datamängderna från zip-filen misslyckades. Kontrollera, att prefixerna av de packade filerna innehåller åtminstone tre tecken.",
                "file_over_size": "Den valda filen är för stor. Den högsta tillåtna storleken är <xx> Mb.",
                "malformed": "Kontrollera, att filnamnen inte innehåller diakritiska tecken (t.ex. bokstäverna Å,Ä,Ö).",
                "kml": "Ett kartlager kunde inte skapas från KML-filen.",
                "shp": "Ett kartlager kunde inte skapas från SHP-filen.",
                "mif": "Ett kartlager kunde inte skapas från MIF-filen.",
                "gpx": "Ett kartlager kunde inte skapas från GPX-filen.",
                "timeout": "Importeringen av datamändgen kunde inte slutföras på grund av tidutlösning.",
                "abort": "Importeringen av datamängden avbröts.",
                "parsererror": "Datamängden kunde inte behandlas.",
                "generic": "Ett okänt fel uppstod i systemet. Importerningen av datamängden misslyckades."
            },
            "warning":{
                "features_skipped":"OBS! <xx> objekt övergavs vid importeringen på grund av saknande eller felaktiga koordinater eller geometri."
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
            "confirmDeleteMsg": "Vill du ta bort \"{name}\"?",
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
