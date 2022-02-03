Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "MyPlacesImport",
    "value": {
        "title": "Eget dataset",
        "tool": {
            "tooltip": "Importera ditt eget dataset"
        },
        "flyout": {
            "title": "Dataset importering",
            "description": "Importera en datamängd från din dator som en zip-fil, vilken innehåller alla erforderliga filer utav ett av de följande filformatsalternativen:<ul><li>Shapefile (.shp, .shx, .dbf och .prj, frivilligt .cpg)</li><li>GPX (.gpx)</li><li>MapInfo (.mif och .mid)</li><li>Google Maps (.kml)</li></ul>Zip-filen kan innehålla endast en datamängd och dess storlek kan vara högst {maxSize, number} Mb.",
            "help": "Importera en datamängd från din dator som ett zip-paket. Var vänlig och kontrollera, att alla filerna är i ett lämpligt filformat och koordinatsystem.",
            "submit": "Skicka",
            "success": "Dataset importerade med {count, plural, one {# objekt} other {# objekt}}. Du kan hitta kartlagret i menyn \"Mina uppgifter\".",
            "tabs": {
                "general" : "Allmän",
                "visualization": "Visualisering"
            },
            "layer": {
                "name": "Namnge kartlagret",
                "desc": "Beskrivning",
                "source": "Datakälla",
                "srs": "EPSG-kod"
            },
            "validations": {
                "name": "Namnet på kartlagret saknas",
                "file": "Filen har inte valts"
            },
            "error":{
                "title": "Importerningen av datamängden misslyckades.",
                "timeout": "Importeringen av datamändgen kunde inte slutföras på grund av tidutlösning.",
                "abort": "Importeringen av datamängden avbröts.",
                "generic": "Ett okänt fel uppstod i systemet. Importerningen av datamängden misslyckades.",
                "hasFolders": "Obs! Kontrollera, att filerna är inte lagrade i en mapp inom zip-arkivet.",

                // Parser errors
                "parser_error": "Datamängden kunde inte behandlas.",
                "format_failure": "Hämtade datamängden är inte duglig. Kontrollera datamängdens giltighet och försök igen.",
                "noSrs": "Koordinatsystemet kunde inte identifieras från filen. Kontrollera att koordinatsystemet har definierats rätt eller ange EPSG-koden i nummerform (t.ex. 4326) i textfältet och försök igen.",
                "shpNoSrs": "Koordinatsystemet kunde inte identifieras från SHP-filen. Inkludera prj-filen som fastställer koordinatsystemet i arkivet eller ange EPSG-koden i nummerform (t.ex. 4326) i textfältet och försök ig.",

                // Error codes from backend
                "no_main_file": "Lämpliga filer för importeringen kunde inte hittas från zip-filen. Var vänlig och kontrollera att filformatet understött och att datamänderna är packade till en zip-fil.", 
                "too_many_files": "Zip-arkivet innehöll extra filer. Radera överlopps filerna och lämna endast de nödvändiga filerna enligt anvisningarna.",
                "multiple_extensions": "Filen innehöll flera filer med samma {extensions} filändelse. Filen kan innehålla filerna av endast en datamängd.",
                "multiple_main_file": "Filen innehöll flera olika datamängder ({extensions}). Filen kan innehålla filerna av endast en datamängd.",
                "unable_to_store_data": "Datamängdens objekt kunde inte sparas. Kontrollera att alla obligatoriska filer som filformatet kräver är inom zip-arkivet och att datamängdens objekt inte är felaktiga.",
                "file_over_size": "Den valda filen är för stor. Den högsta tillåtna storleken är {maxSize, number} Mb.",
                "no_features":"Inga objekt hittades från datamängden. Kontrollera att objekternas koordinater är definierade.",
                "invalid_epsg": "EPSG-koden som matades in kunde inte identifieras. Kontrollera, att koden är rätt och i nummerform (t.ex. 4326). Ifall indentifieringen misslyckas oberoende av detta, bör koordinatsystemets uppgifter fogas till datamängden."
            },
            "warning":{
                "features_skipped":"OBS! {count, plural, one {# objekt} other {# objekt}} objekt övergavs vid importeringen på grund av saknande eller felaktiga koordinater eller geometri."
            }
        },
        "tab": {
            "title": "Dataset",
            "editLayer": "Redigera kartlagret",
            "deleteLayer": "Ta bort kartlagret",
            "grid": {
                "name": "Namn",
                "description": "Beskrivning",
                "source": "Datakälla",
                "edit": "Redigera",
                "editButton": "Redigera",
                "remove": "Ta bort",
                "removeButton": "Ta bort"
            },
            "confirmDeleteMsg": "Vill du ta bort \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "save": "Spara",
                "cancel": "Avbryt",
                "delete": "Ta bort",
                "close": "Stäng"
            },
            "notification": {
                "deletedTitle": "Ta bort dataset",
                "deletedMsg": "Datasetet har tagits bort",
                "editedMsg": "Datasetet har uppdaterats"
            },
            "error": {
                "title": "Fel!",
                "generic": "Systemfel. Försök på nytt senare.",
                "deleteMsg": "Systemfel. Försök på nytt senare.",
                "editMsg": "Uppdateringen av datasetet misslyckades på grund av ett fel i systemet. Försök på nytt senare.",
                "getStyle": "Sökningen av den stil som definierats för datasetet misslyckades. På blanketten visas utgångsvärdena. Byt värdena för stilen som definierats för datasetet innan du lagrar ändringarna.",
                "styleName": "Namnge kartlagret och försök sedan på nytt."
            }
        },
        "layer": {
            "organization": "Egna dataset",
            "inspire": "Egna dataset"
        }
    }
});
