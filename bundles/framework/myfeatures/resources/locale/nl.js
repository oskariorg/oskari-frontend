Oskari.registerLocalization(
{
    "lang": "nl",
    "key": "MyFeatures",
    "value": {
        "title": "Dataset Import",
        "desc": "U kunt uw eigen gegevens importeren in een shp-, gpx- of mif/mid-bestandsformaat in een zip-bestand of KMZ-bestand formaat (gezipt kml).",
        "tool": {
            "tooltip": "Importeer uw eigen dataset"
        },
        "flyout": {
            "title": "Import Dataset",
            "description": "U kunt uw eigen datasets importeren in shp-, gpx- of mif/mid-bestandsformaat in een zip-bestand of in een KMZ-bestand formaat (gezipte kml). U kunt bestanden importeren die hoogstens 5000 kenmerken bevatten",
            "help": "Selecteer een bestand van uw computer of geef een link naar het bestand dat uw dataset bevat. Het bestand kan in shp, zip of kml / kmz formaat. U kunt zip-bestanden uit shapefiles maken door de bestanden te zippen met suffix shp, SHX, dbf en PRJ naar hetzelfde zip-bestand.\r\n Ook kml / kmz bestanden van Google maps kunnen worden gezipped op dezelfde manier.\r\n Mif / mid gegevens moeten in de huidige CRS kaart - bekijk huidige CRS onder zoombar",
            "actions": {
                "cancel": "Annuleren",
                "next": "Volgende",
                "close": "Sluiten",
                "submit": "Versturen"
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
                "desc": "Beschrijving",
                "source": "Gegevensbron",
                "remove": "Verwijderen",
                "removeButton": "Verwijderen"
            },
            "confirmDeleteMsg": "Wilt u dit verwijderen \"{name}\"?",
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
});
