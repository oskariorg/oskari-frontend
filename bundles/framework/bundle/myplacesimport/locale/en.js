Oskari.registerLocalization(
{
    "lang": "en",
    "key": "MyPlacesImport",
    "value": {
        "title": "Dataset Import",
        "desc": "You can import your own datasets in shp-, gpx- or mif/mid file format in a zip file or in kmz file format (zipped kml).",
        "help": "Select a file from your computer or give a link to the file that contains your dataset. The file can be in the shp, zip or kml/kmz format. You can create zip files from shapefiles by zipping the files with suffix shp, shx, dbf and prj to the same zip file. Also kml/kmz files from Google maps can be zipped same way.",
        "tool": {
            "tooltip": "Import your own dataset"
        },
        "flyout": {
            "title": "Dataset Import",
            "description": "You can import your own datasets in shp-, gpx- or mif/mid file format in a zip file or in kmz file format (zipped kml).",
            "actions": {
                "cancel": "Cancel",
                "next": "Next"
            },
            "file": {
                "submit": "Send"
            },
            "layer": {
                "title": "Save the dataset information:",
                "name": "Name",
                "desc": "Description",
                "source": "Data source",
                "style": "Dataset style definitions:"
            },
            "validations": {
                "error": {
                    "title": "Error",
                    "message": "The file has not been selected and the map layer name is missing."
                }
            },
            "finish": {
                "success": {
                    "title": "The dataset import succeeded.",
                    "message": "You can find the map layer from the menu \"My Data\"."
                },
                "failure": {
                    "title": "The dataset import did not succeed. Please try again later."
                }
            }
        },
        "tab": {
            "title": "Datasets",
            "grid": {
                "name": "Name",
                "description": "Description",
                "source": "Data source",
                "remove": "Delete",
                "removeButton": "Delete"
            },
            "confirmDeleteMsg": "Do you want to delete:",
            "buttons": {
                "ok": "OK",
                "cancel": "Cancel",
                "delete": "Delete"
            },
            "notification": {
                "deletedTitle": "Dataset Delete",
                "deletedMsg": "The dataset has been deleted."
            },
            "error": {
                "title": "Error!",
                "generic": "System error occurred. Please try again later."
            }
        },
        "layer": {
            "organization": "Own Datasets",
            "inspire": "Own Datasets"
        }
    }
}
);