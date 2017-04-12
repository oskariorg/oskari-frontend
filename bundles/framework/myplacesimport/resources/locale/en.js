Oskari.registerLocalization(
{
    "lang": "en",
    "key": "MyPlacesImport",
    "value": {
        "title": "Dataset Import",
        "desc": "",
        "tool": {
            "tooltip": "Import your own datasets."
        },
        "flyout": {
            "title": "Dataset Import",
            "description": "Upload a dataset from your computer as a zipped file. The dataset has to be in one of the following file formats: <br/>\r\nShapefile (*.shp, *.shx, *dbf, *prj) <br/>\r\nGPX-file (*.gpx) <br/>\r\nMapInfo (*.mif, *mid) <br/>\r\nGoogle Map (*.kml, *.kmz) <br/>\r\nPlease check that all the files are in the correct coordinate reference system.",
            "help": "Upload a dataset from your computer as a zipped file. Please check that all the files are in the correct file format and coordinate reference system.",
            "actions": {
                "cancel": "Cancel",
                "next": "Next"
            },
            "file": {
                "submit": "Import",
                "fileOverSizeError": {
                    "title": "Virhe",
                    "message": "The selected file is too large. It can be at most <xx> mb.",
                    "close": "Close"
                }
            },
            "layer": {
                "title": "Dataset Information",
                "name": "Name",
                "desc": "Description",
                "source": "Data source",
                "style": "Style definitions"
            },
            "validations": {
                "error": {
                    "title": "Error",
                    "message": "The dataset has not been imported. A file and a name are missing. Please correct them and try again."
                }
            },
            "finish": {
                "success": {
                    "title": "Dataset Import Succeeded",
                    "message": "The dataset has been imported. You can now find it in the \"My data\" menu."
                },
                "failure": {
                    "title": "The dataset could not be imported."
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
            "confirmDeleteMsg": "Do you want to delete the dataset:",
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
                "title": "Error",
                "generic": "A system error occurred."
            }
        },
        "layer": {
            "organization": "Own datasets",
            "inspire": "Own datasets"
        }
    }
});
