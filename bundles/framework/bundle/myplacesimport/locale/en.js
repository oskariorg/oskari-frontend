Oskari.registerLocalization(
{
    "lang": "en",
    "key": "MyPlacesImport",
    "value": {
        "title": "NOT TRANSLATED",
        "desc": "You can import your own datasets in the shape, zip or kml/kmz format.",
        "help": "Anna tämän toiminnon lähtöaineistoksi (Browse...) zip tiedoston nimi tai url-linkki vastaavaan tiedostoon. \nZip-tiedoston saat lataamalla koneellesi shape-siirtoformaatissa olevan aineiston \nja muodostamalla näistä tiedostoista (.shp, . shx, .dbf, .prj) zip-tiedosto \ntai lataa koneellesi Googlen kml/kmz tiedostoja. \ntai käytä tiedoston url-linkkiä. ",
        "tool": {
            "tooltip": "Import your own dataset"
        },
        "flyout": {
            "title": "Dataset Import",
            "description": "You can import your own datasets in the shape, zip or kml/kmz format.",
            "actions": {
                "cancel": "Cancel",
                "next": "Next"
            },
            "file": {
                "submit": "Send"
            },
            "layer": {
                "title": "Save the map layer information:",
                "name": "Name",
                "desc": "Description",
                "source": "Data source",
                "style": "Map layer style"
            },
            "validations": {
                "error": {
                    "title": "Error",
                    "message": "The file and the name of the map layer are missing."
                }
            },
            "finish": {
                "success": {
                    "title": "The map layer import succeeded.",
                    "message": "You can find the map layer from the menu \"My Data\"."
                },
                "failure": {
                    "title": "NOT TRANSLATED"
                }
            }
        },
        "tab": {
            "title": "Datasets",
            "grid": {
                "name": "Name",
                "description": "Description",
                "source": "Data source",
                "remove": "NOT TRANSLATED",
                "removeButton": "Delete"
            },
            "confirmDeleteMsg": "Do you want to delete:",
            "buttons": {
                "ok": "OK",
                "cancel": "Cancel",
                "delete": "Delete"
            },
            "notification": {
                "deletedTitle": "Delete map layer",
                "deletedMsg": "Map layer deleted"
            },
            "error": {
                "title": "Error!",
                "generic": "System error. Please try again later."
            }
        },
        "layer": {
            "organization": "Own datasets",
            "inspire": "Own datasets"
        }
    }
}
);