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
            "description": "Upload a dataset from your computer as a zipped file which contains all required files from one of the following file formats: <ul><li>Shapefile (.shp, .shx and .dbf, optionally .prj and .cpg)</li><li>GPX-file (.gpx)</li><li>MapInfo (.mif and .mid)</li><li>Google Map (.kml or .kmz)</li></ul>The zipped file can contain only one dataset and it can be at most <xx> Mb.",
            "help": "Upload a dataset from your computer as a zipped file. Please check that all the files are in the correct file format and coordinate reference system.",
            "actions": {
                "cancel": "Cancel",
                "next": "Next",
                "close": "Close"
            },
            "file": {
                "submit": "Import",
                "fileOverSizeError": {
                    "title": "Error",
                    "message": "The selected file is too large. It can be at most <xx> Mb."
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
                    "message": "The dataset has been imported with <xx> features. You can now find it in the \"My data\" menu."
                },
                "failure": {
                    "title": "The dataset could not be imported."
                }
            },
            "error":{
                "title": "The dataset could not be imported.",
                "unknown_projection":"Uknown projection data in the source import file. Please check that all the files are in the maps coordinate reference system or check that the files contains required transformation information.",
                "invalid_file":"Couldn't find valid import file in the zip file. Please check that the file format is supported and it's a zipped file.",
                "unable_to_store_data":"Couldn't store user data into database or no features in the input data.",
                "short_file_prefix":"Couldn't get the import file set - Prefix string too short",
                "file_over_size": "The selected file is too large. It can be at most <xx> Mb.",
                "no_features":"Couldn't find features in the input data",
                "malformed":"Please check that the file names are in the correct format (no Scandinavian alphabets).",
                "kml":"Couldn't create dataset from the KML file.",
                "shp":"Couldn't create dataset from the Shapefile.",
                "mif":"Couldn't create dataset from the MIF file.",
                "gpx":"Couldn't create dataset from the GPX file.",
                "timeout": "The dataset import couldn't be finished because of a time-out error.",
                "abort": "The dataset import were aborted.",
                "parsererror": "Couldn't process dataset.",
                "generic": "The dataset import failed."
            },
            "warning":{
                "features_skipped":"Caution! During import <xx> features where rejected because of missing or corrupted coordinates or geometry"
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
            "confirmDeleteMsg": "Do you want to delete the dataset \"{name}\"?",
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
