Oskari.registerLocalization({
    lang: 'en',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Add',
            cancel: 'Cancel',
            close: 'Close',
            delete: 'Delete',
            edit: 'Edit',
            save: 'Save',
            submit: 'Submit',
            import: 'Import',
            yes: 'Yes',
            no: 'No',
            next: 'Next',
            previous: 'Previous',
            print: 'Print',
            search: 'Search',
            reset: 'Reset',
            copy: 'Copy to clipboard',
            clear: 'Clear',
            accept: 'Accept',
            reject: 'Reject',
            info: 'Show more information',
            move: 'Move'
        },
        messages: {
            confirm: 'Are you sure you want to continue?',
            confirmDelete: 'Are you sure you wish to delete?',
            copied: 'Copied'
        },
        error: {
            generic: 'Something went wrong'
        },
        table: {
            sort: {
                desc: 'Click to sort descending',
                asc: 'Click to sort ascending',
                cancel: 'Click to cancel sorting'
            },
            emptyText: 'No data.'
        },
        ColorPicker: {
            tooltip: 'Choose color',
            moreColors: 'More colors'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Geometry type',
                name: 'Style name',
                style: 'Style',
                pointTab: 'Point',
                lineTab: 'Line',
                areaTab: 'Area'
            },
            tooltips: {
                transparent: 'No fill',
                solid: 'Solid fill',
                thin_diagonal: 'Thin diagonal line',
                thick_diagonal: 'Thick diagonal line',
                thin_horizontal: 'Thin horizontal line',
                thick_horizontal: 'Thick horizontal line'
            },
            fill: {
                color: 'Fill colour',
                area: {
                    pattern: 'Fill pattern'
                }
            },
            image: {
                shape: 'Icon',
                size: 'Size',
                fill: {
                    color: 'Colour'
                }
            },
            stroke: {
                color: 'Colour',
                lineCap: 'Endings',
                lineDash: 'Dash',
                lineJoin: 'Corners',
                width: 'Width',
                area: {
                    color: 'Line colour',
                    lineDash: 'Line dash',
                    lineJoin: 'Line corners',
                    width: 'Line width'
                }
            }
        },
        FileInput: {
            drag: 'Drag {maxCount, plural, one {a file} other {files}} here or select by browsing.',
            noFiles: 'No file selected.',
            error: {
                invalidType: 'File format is not allowed.',
                allowedExtensions: 'Allowed file extensions: {allowedExtensions}.',
                multipleNotAllowed: 'Only single file is allowed to be uploaded.',
                fileSize: 'The selected file is too large. It can be at most {maxSize, number} Mb.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Other languages',
            othersTip: 'Translations will be shown when using the service in different languages',
            locale: {
                generic: 'in ({0})',
                fi: 'in Finnish',
                en: 'in English',
                sv: 'in Swedish'
            }
        },
        Spin: {
            loading: 'Loading...'
        },
        FeatureFilter: {
            single: 'One property',
            and: 'AND operator',
            or: 'OR operator',
            range: {
                true: 'Don\'t use value range',
                false: 'Use value range'
            },
            addTooltip: 'Add new row for filter',
            clearTooltip: 'Clear filter',
            caseSensitive: {
                true: 'Case sensitive',
                false: 'Case insensitive'
            },
            operators: {
                value: 'is',
                in: 'in',
                notIn: 'not in',
                like: 'like',
                notLike: 'not like',
                greaterThan: 'greater than',
                atLeast: 'at least',
                lessThan: 'less than',
                atMost: 'at most'
            }
        },
        coordinates: {
            lon: "Lon",
            lat: "Lat",
            n: "N",
            e: "E",
            p: "N",
            i: "E",
            crs: {
              'EPSG:3067': "ETRS89-TM35FIN coordinates",
              'EPSG:3575': "North Pole LAEA Europe coordinates",
              'EPSG:3857': "WGS 84 / Pseudo-Mercator coordinates",
              default: "{crs} coordinates"
          },
        },
        layerTooltipTitle: {
            'wms': 'Raster layer',
            'wmts': 'Raster layer',
            'arcgis93': 'Raster layer',
            'arcgis': 'Raster layer',
            'vectortile': 'Raster layer',
            'bingmaps': 'Raster layer',
            'wfs': 'Vector layer',
            'vector': 'Vector layer',
            'userlayer': 'Own dataset',
            'myplaces': 'My map layer',
            'analysislayer': 'Own analysis',
            'tiles3d': '3D layer'
        },
        "FeatureEditorView": {
            "title": "Feature editor",
            "info": {
                "layerLabel": "Modifying layer",
                "featureModifyInfo": "Choose a feature to modify by clicking it on the map.",
                "loading": "Loading layer metadata...",
                "problem": "Insufficient metadata for layer!"
            },
            "newTitle": "New feature",
            "editTitle": "Edit feature",
            "setCurrentLayerTitle": "Select map layer",
            "geometrylist": {
                "title": "Geometry",
                "empty": "Draw feature on the map",
                "notRecognized": "Geometry type ({type}) not recognized. Allowing all types to be added. Make sure the interface is ok with this.",
                "editing": "Draw on the map",
                "Point": "Point",
                "LineString": "Line",
                "Polygon": "Area",
            },
            "editConfirm": {
                "title": "The feature to edit is being switched",
                "msg": "Unsaved changes will be lost. Do you want to switch?"
            },
            "exitConfirm": "Unsaved changes will be lost. Do you want to exit?",
            "originalValue": "Original value",
            "missingValue": "Value missing",
            "modified": "Modified",
            "restoreOriginal": "Restore original value",
            "multipleFeatureModifyInfo": "You can also choose multiple features from the map by pressing the ctrl-button on your keyboard.",
            "toolInfo": "Choose point, line or polygon tool to draw new geometries.",
            "geometryModifyInfo": "With geometry editing tool you can edit feature geometry.",
            "geometryDeleteInfo": "With geometry delete tool you can remove one geometry from feature with multiple geometries.",
            "buttons": {
                "save": "Save",
                "cancel": "Cancel",
                "close": "Close",
                "ok": "Ok",
                "delete": "Delete",
                "addFeature": "Add feature",
                "editFeature": "Edit feature",
                "editMultipleFeatures": "Edit multiple features",
                "deleteFeature": "Delete feature",
                "yes": "Yes",
                "no": "No",
            },
            "tools": {
                "point": "Point",
                "line": "Line",
                "area": "Area",
                "geometryEdit": "Edit geometry on the map",
                "finishSketch": "Finish drawing",
                "remove": "Remove one geometry"
            },
            "featureUpdate": {
                "header": "Feature update",
                "success": "Feature properties updated successfully",
                "error": "Error occured during feature properties update"
            },
            "multipleFeaturesUpdate": {
                "header": "Feature update",
                "success": "Features properties updated successfully",
                "error": "Error occured during features properties update"
            },
            "featureDelete": {
                "header": "Feature delete",
                "success": "Feature deleted successfully",
                "error": "Error occured during feature delete"
            },
            "geometryDelete": {
                "header": "Geometry delete",
                "success": "Geometry deleted successfully",
                "error": "Error occured during geometry delete"
            },
            "unsavedChanges": {
                "title": "Unsaved changes",
                "text": "There are some unsaved changes. Please select below action to perform."
            },
            "deleteGeometryDialog": {
                "title": "Delete geometry",
                "text": "Are you sure you want to delete geometry?"
            },
            "deleteFeature": {
                "title": "Delete feature",
                "text": "Are you sure you want to delete feature?"
            },
            "formValidationError": {
                "title": "Form validation error",
                "text": "Please correct selected field values"
            },
            "formValidationNumberError": {
                "title": "Number validation error",
                "text": "Please put correct number value"
             },
            "modifyMultipleFeaturesConfirmation": {
                "title": "Confirm",
                "text": "Are you sure you want to set the given value for all the selected features?"
            },
            "messages": {
                "cannot_save_all_features": "Cannot save all features"
            }
        },
        "VectorLayerPresentation": {
            "attributes": {
                "label": "Attributes",
                "properties": "Using properties of features",
                "presentation": "Presentation",
                "presentationTooltip": "Presentation affects GetFeatureInfo request and feature data table.",
                "showAll": "Show all properties",
                "idProperty": "Use feature property as identifier",
                "idPropertyTooltip": "Service should return unique identifier for features. Firstly ask service provider to use unique identifiers. Works only for 'Big objects' type (GeoJSON).",
                "geometryType": {
                    "label": "Geometry type",
                    "sourceAttributes": "Source: layer attributes",
                    "sourceCapabilities": "Source: layer capabilities",
                    "unknown":"Unknown",
                    "point": "Point",
                    "line": "Line",
                    "area":"Area",
                    "collection":"Collection"
                },
                "featureFilter": {
                    "title": "Filter requested features by properties",
                    "button": "Feature filter"
                },
                "filter": {
                    "title": "Display of properties",
                    "lang": "Select properties displayed and order",
                    "default": "for default filter",
                    "fromDefault": "No filter added for the selected language. The default filter is used for the selected language. Edit the options to create your own filter for the language.",
                    "button": "Select properties"
                },
                "locale": {
                    "title": "Labels for properties",
                    "button": "Labeling",
                    "defaultNameProperty": {
                        "en": "Name",
                        "fi": "Nimi",
                        "sv": "Namn"
                    }
                },
                "format": {
                    "title": "Formatting values of properties",
                    "button": "Formatting",
                    "type": {
                        "label": "Type",
                        "typeFormats": "Value type",
                        "textFormats": "Text formatting",
                        "link": "Link",
                        "image": "Image",
                        "number": "Number",
                        "phone": "Phone number"
                    },
                    "options": {
                        "noLabel": "Show only value",
                        "skipEmpty": "Skip empty value"
                    },
                    "params": {
                        "link": "Show as link",
                        "fullUrl": "Show full URL",
                        "label": "Label for link"
                    }
                },
                "messages": {
                    "noFeatureProperties": "Layer doesn't have feature properties information."
                }
            },
        }
    }
});
