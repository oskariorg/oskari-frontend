Oskari.registerLocalization(
{
    "lang": "nl",
    "key": "MyPlacesImport",
    "value": {
        "title": "Dataset Import",
        "desc": "U kunt uw eigen gegevens importeren in een shp-, gpx- of mif/mid-bestandsformaat in een zip-bestand of KMZ-bestand formaat (gezipt kml).",
        "help": "Selecteer een bestand van uw computer of geef een link naar het bestand dat je dataset bevat. Het bestand kan zijn een shp, zip of kml/ kmz formaat. U kunt zip-bestanden van shapefiles creëren door het zippen van de bestanden met de extensie shp, shx, dbf en prj naar hetzelfde zip-bestand. Ook kml / kmz bestanden van Google maps kunnen worden gezipped op dezelfde manier.",
        "tool": {
            "tooltip": "Importeer uw eigen dataset"
        },
        "flyout": {
            "title": "Import Dataset",
            "description": "U kunt uw eigen datasets importeren in shp-, gpx- of mif/mid-bestandsformaat in een zip-bestand of in een KMZ-bestand formaat (gezipte kml). U kunt bestanden importeren die hoogstens 5000 kenmerken bevatten",
            "actions": {
                "cancel": "Annuleren",
                "next": "Volgende"
            },
            "file": {
                "submit": "Versturen",
                "fileOverSizeError": {
                    "title": "NOT TRANSLATED",
                    "message": "NOT TRANSLATED",
                    "close": "NOT TRANSLATED"
                }
            },
            "layer": {
                "title": "Opslaan van de dataset informatie:",
                "name": "Naam",
                "desc": "Beschrijving",
                "source": "Data source",
                "style": "Data stijl definities:"
            },
            "validations": {
                "error": {
                    "title": "Fout",
                    "message": "Het bestand is niet geselecteerd en de naam van de kaartlaag mist."
                }
            },
            "finish": {
                "success": {
                    "title": "De dataset import is geslaagd",
                    "message": "De kaartlaag is te vinden via het menu \"Mijn Data\""
                },
                "failure": {
                    "title": "De dataset import niet gelukt. Probeer het later opnieuw."
                }
            }
        },
        "tab": {
            "title": "Datasets",
            "grid": {
                "name": "Naam",
                "description": "Beschrijving",
                "source": "Gegevensbron",
                "remove": "Verwijderen",
                "removeButton": "Verwijderen"
            },
            "confirmDeleteMsg": "Wilt u dit verwijderen:",
            "buttons": {
                "ok": "OK",
                "cancel": "Annuleren",
                "delete": "Verwijderen"
            },
            "notification": {
                "deletedTitle": "Verwijderen Dataset",
                "deletedMsg": "De dataset is verwijderd"
            },
            "error": {
                "title": "Fout!",
                "generic": "Systeemfout opgetreden. Probeer het later opnieuw."
            }
        },
        "layer": {
            "organization": "Eigen Datasets",
            "inspire": "Eigen Datasets"
        }
    }
}
);