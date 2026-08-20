Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "myfeatures",
    "value": {
        "title": "Eget dataset",
        "tool": {
            "tooltip": "Importera ditt eget dataset"
        },
        "flyout": {
            "title": "Dataset importering",
            "description": "Importera en datamängd från din dator. GPX (.gpx), KML (.kml), GeoJSON (.json eller .geojson) och GeoPackage (.gpkg) kan laddas upp som enskilda filer. Filformat som kräver flera filer ska laddas upp som en zip-fil som innehåller alla nödvändiga filer i något av följande format:<ul><li>Shapefile (.shp, .shx, .dbf och .prj, frivilligt .cpg)</li><li>GPX (.gpx)</li><li>KML (.kml)</li><li>GeoPackage (.gpkg)</li><li>GeoJSON (.json eller .geojson)</li><li>MapInfo (.mif och .mid)</li></ul>Den uppladdade filen får endast innehålla en datamängd och dess storlek får vara högst {maxSize, number} Mb. Enskilda filer som extraheras från zip-arkiv får vara högst {unzippedMaxSize, number} Mb stora.",
            "help": "Importera en datamängd från din dator. GPX-, KML-, GeoJSON- och GeoPackage-filer kan laddas upp som enskilda filer. För filformat som kräver flera filer ska du kontrollera att alla nödvändiga filer finns i zip-paketet och att data har rätt filformat och koordinatsystem.",
            "submit": "Skicka",
            "success": "Dataset importerade med {count, plural, one {# objekt} other {# objekt}}. Du kan hitta kartlagret i menyn \"Mina uppgifter\".",
            "tabs": {
                "general" : "Basuppgifter",
                "visualization": "Visualisering",
                "layerFields": "Attributer"
            },
            "layer": {
                "name": "Datamängdens namn",
                "desc": "Beskrivning",
                "source": "Datakälla",
                "srs": "EPSG-kod"
            },
            "validations": {
                "name": "Namnet på kartlagret saknas",
                "file": "Filen har inte valts",
                "epsg": "EPSG code has to be number",
                "layerFields": "At least one attribute field is required for layer"
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
            "title": "Dataset (Beta)",
            "editLayer": "Redigera kartlagret",
            "deleteLayer": "Ta bort kartlagret",
            "grid": {
                "name": "Namn",
                "desc": "Beskrivning",
                "source": "Datakälla",
                "edit": "Redigera",
                "editButton": "Redigera",
                "remove": "Ta bort",
                "removeButton": "Ta bort",
                "actions": "Handlingar",
                "createDate": "Skapad",
                "contentEditor": "Sisältöeditori"
            },
            "confirmDeleteMsg": "Vill du ta bort \"{name}\"?",
            "downloadTooltip": "Download dataset",
            "confirmDeleteFieldMsg": "Vill du ta bort \"{name}\"?",
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
                "editedMsg": "Datasetet har uppdaterats",
                "createdMsg": "The dataset has been created"
            },
            "error": {
                "title": "Fel!",
                "generic": "Systemfel. Försök på nytt senare.",
                "deleteMsg": "Systemfel. Försök på nytt senare.",
                "editMsg": "Uppdateringen av datasetet misslyckades på grund av ett fel i systemet. Försök på nytt senare.",
                "createMsg": "Creating the dataset failed due to an error in the system. Please try again later.",
                "getStyle": "Sökningen av den stil som definierats för datasetet misslyckades. På blanketten visas utgångsvärdena. Byt värdena för stilen som definierats för datasetet innan du lagrar ändringarna.",
                "styleName": "Namnge kartlagret och försök sedan på nytt."
            }
        },
        "featureEditor": {
            "title": "Feature editor",
            "addFeatureTool": "Lägg till objekt",
            "deleteFeatureTool": "Delete feature",
            "confirmDelete": "Do you want to delete the feature?",
            "featureUpdate": {
                "success": "Feature properties updated successfully",
                "error": "Error occured during feature properties update"
            },
            "featureDelete": {
                "success": "Feature deleted successfully",
                "error": "Error occured during feature delete"
            },
            "featureLayer": {
                "new": "Ny datamängd",
                "addFeature": "Lägg till objekt",
                "fieldName": "Namn",
                "fieldType": "Typ",
                "typeHelp": "Typen påverkar hur attribut visas i användargränssnittet.",
                "typeHelpNew": "Du kan lägga till attribut endast innan du har sparat datamängden.",
                "errors": {
                    "fieldAlreadyExists": "Field already exists",
                    "isValidJSONKey": "Illegal characters."
                },
                "actions": {
                    "hideField": "Dölj för användaren",
                    "showField": "Visa för användaren",
                    "moveUp": "Flytta upp",
                    "moveDown": "Flytta ned",
                    "editLocale": "Redigera attributnamn på olika språk.",
                    "editFormat": "Välj attributtyp och hur informationen ska visas i  användargränssnittet.",
                },
                "modal": {
                    "locale": {
                        "title": "Märkningar för attribut"
                    },
                    "format": {
                        "title": "Formatera värden för attribut"
                    }
                }
            },
            "types": {
                "String": "Text",
                "Integer": "Heltal",
                "Double": "Decimaltal",
                "Date": "Datum",
                "Timestamp": "Datum och tid",
                "Boolean": "Boolean"
            },
            "layerSelectionPanel": {
                "setCurrentLayerTitle": "Välj en datamängd eller lägg till en ny datamängd",
                "buttons": {
                    "setCurrentLayer": "Välj datamängd",
                    "addNewLayer": "Ny datamängd"
                }
            }
        },
        "layer": {
            "organization": "Egna dataset",
            "group": "Egna dataset"
        }
    }
});
