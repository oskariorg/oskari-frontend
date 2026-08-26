Oskari.registerLocalization(
{
    "lang": "en",
    "key": "myfeatures",
    "value": {
        "title": "Own datasets",
        "tool": {
            "tooltip": "Import your own datasets"
        },
        "flyout": {
            "title": "Dataset Import",
            "description": "Upload a dataset from your computer. GPX (.gpx), KML (.kml), GeoJSON (.json or .geojson) and GeoPackage (.gpkg) can be uploaded as a single file. Multi-file formats must be uploaded as a zipped file that contains all required files from one of the following file formats: <ul><li>Shapefile (.shp, .shx, .dbf and .prj, optionally .cpg)</li><li>GPX (.gpx)</li><li>KML (.kml)</li><li>GeoPackage (.gpkg)</li><li>GeoJSON (.json or .geojson)</li><li>MapInfo (.mif and .mid)</li></ul>The uploaded file can contain only one dataset and it can be at most {maxSize, number} Mb. Files extracted from zip archives cannot exceed {unzippedMaxSize, number} Mb in size.",
            "help": "Upload a dataset from your computer. GPX, KML, GeoJSON and GeoPackage can be uploaded as a single file. For multi-file formats, check that all required files are packaged in a zip file and that the data is in the correct file format and coordinate reference system.",
            "success": "The dataset has been imported with {count, plural, one {# feature} other {# features}}. You can now find it in the \"My data\" menu.",
            "tabs": {
                "general": "Basic information",
                "visualization": "Visualization",
                "layerFields": "Attributes"
            },
            "layer": {
                "name": "Dataset name",
                "desc": "Description",
                "source": "Data source",
                "srs": "EPSG code"
            },
            "validations": {
                "name": "The map layer name is missing",
                "file":  "A file is missing",
                "epsg": "EPSG code has to be number",
                "layerFields": "At least one attribute field is required for layer"
            },
            "error":{
                "title": "The dataset could not be imported.",
                "timeout": "The dataset import couldn't be finished because of a time-out error.",
                "abort": "The dataset import were aborted.",
                "generic": "The dataset import failed.",
                "hasFolders": "NB! Check that the files of the input data are not stored inside a folder within the zip file.",

                // Parser errors
                "parser_error": "Couldn't process dataset.",
                "format_failure": "The imported file is not valid. Verify the validity of the data and try again.",
                "noSrs": "Unable to identify the coordinate system from the file. Check that the coordinate system is correctly specified in the data or enter the ESPG code in number format (e.g. 4326) and try again.",
                "shpNoSrs": "The coordinate system could not be identified based on the shapefile. Include the .prj file that specifies the coordinate system in the compressed folder or enter the ESPG code in number format (e.g. 4326) and try again.",

                // Error codes from backend
                "no_main_file": "Couldn't find valid import file in the zip file. Please check that the file format is supported and it's a zipped file.",
                "too_many_files": "The zip file contained redundant files. Remove the redundant files and keep only those that are required according to the instructions.",
                "multiple_extensions":"Multiple files with the same {extensions} file extension were found from the input data. The input data can only contain data sets of one file.",
                "multiple_main_file": "Multiple different data sets ({extensions}) were found from the input data. The input data can only contain data of one file.",
                "unable_to_store_data":"Unable to save the features of the input data. Check that all files required by the file format are inside a zip file and that the features of the input data are valid.",
                "file_over_size": "The selected file is too large. It can be at most {maxSize, number} Mb.",
                "no_features":"Couldn't find features in the input data. Check that the coordinates of the features are defined.",
                "invalid_epsg": "The entered ESPG code was not identified. Check that it is correct and in number format (e.g. 4326). If the code can't be identified despite this, the coordinate system information needs to be added to the data."
            },
            "warning":{
                "features_skipped":"Caution! During import {count, plural, one {# feature} other {# features}} where rejected because of missing or corrupted coordinates or geometry"
            }
        },
        "tab": {
            "title": "Datasets (Beta)",
            "editLayer": "Edit map layer",
            "deleteLayer": "Delete map layer",
            "grid": {
                "name": "Name",
                "desc": "Description",
                "source": "Data source",
                "edit": "Edit",
                "editButton": "Edit",
                "remove": "Delete",
                "removeButton": "Delete",
                "actions": "Actions",
                "createDate": "Created",
                "contentEditor": "Content editor"
            },
            "confirmDeleteMsg": "Do you want to delete the dataset \"{name}\"?",
            "downloadTooltip": "Download dataset",
            "confirmDeleteFieldMsg": "Do you want to delete the field  \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "save": "Save",
                "cancel": "Cancel",
                "delete": "Delete",
                "close": "Close"
            },
            "notification": {
                "deletedTitle": "Dataset Delete",
                "deletedMsg": "The dataset has been deleted.",
                "editedMsg": "The dataset has been updated.",
                "createdMsg": "The dataset has been created"
            },
            "error": {
                "title": "Error",
                "generic": "A system error occurred.",
                "deleteMsg": "Deleting the dataset failed due to an error in the system. Please try again later.",
                "editMsg": "Updating the dataset failed due to an error in the system. Please try again later.",
                "createMsg": "Creating the dataset failed due to an error in the system. Please try again later.",
                "getStyle": "The style defined for the dataset was not found. Default values are shown on the form. Change the style definitions before saving the changes.",
                "styleName": "Give the map layer a name and try again."
            }
        },
        "featureEditor": {
            "title": "Feature editor",
            "addFeatureTool": "Add feature",
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
                "new": "New dataset",
                "addFeature": "Add feature",
                "fieldName": "Name",
                "fieldType": "Type",
                "typeHelp": "The type affects how data in the attribute will be dispalyed in the user interface.",
                "typeHelpNew": "You can add attributes to the dataset only before saving it.",
                "errors": {
                    "fieldAlreadyExists": "Field already exists",
                    "isValidJSONKey": "Field contains illegal characters."
                },
                "actions": {
                    "hideField": "Hide from user",
                    "showField": "Show to user",
                    "moveUp": "Move up",
                    "moveDown": "Move down",
                    "editLocale": "Edit attribute name in different languages.",
                    "editFormat": "Select the attribute type and edit how the data will be displayed in the user interface.",
                },
                "modal": {
                    "locale": {
                        "title": "Labels for properties",
                    },
                    "format": {
                        "title": "Formatting values of properties",
                    }
                }
            },
            "types": {
                "String": "Text",
                "Integer": "Integer number",
                "Double": "Decimal number",
                "Date": "Date",
                "Timestamp": "Date and time",
                "Boolean": "Boolean"
            },
            "layerSelectionPanel": {
                "setCurrentLayerTitle": "Select dataset or add new dataset",
                "buttons": {
                    "setCurrentLayer": "Select dataset",
                    "addNewLayer": "New dataset"
                }
            }
        },
        "layer": {
            "organization": "Own datasets",
            "group": "Own datasets"
        }
    }
});
