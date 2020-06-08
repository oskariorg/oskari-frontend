Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Printout",
    "value": {
        "title": "Print",
        "flyouttitle": "Print",
        "desc": "",
        "btnTooltip": "Print the current map view to a PNG image or a PDF file.",
        "BasicView": {
            "title": "Print Map View",
            "name": {
                "label": "Map name",
                "placeholder": "required",
                "tooltip": "Type a name for your print-out. Please note the language used in the map layers."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select a language for your print-out. Please note the language used in the user interface and map layers."
            },
            "size": {
                "label": "Size and direction",
                "tooltip": "Select a print size and direction. You can see updates in the preview image.",
                "options": {
                    "A4": "A4 portrait",
                    "A4_Landscape": "A4 landscape",
                    "A3": "A3 portrait",
                    "A3_Landscape": "A3 landscape"
                }
            },
            "preview": {
                "label": "Preview",
                "pending": "The preview image will be updated shortly.",
                "notes": {
                    "extent": "Check the map extent area in the preview image."
                }
            },
            "buttons": {
                "save": "Print",
                "ok": "OK",
                "back": "Previous",
                "cancel": "Cancel"
            },
            "location": {
                "label": "Location and scale",
                "tooltip": "The printout scale matches the scale used in the preview map.",
                "zoomlevel": "Scale"
            },
            "settings": {
                "label": "Additional settings",
                "tooltip": "Select settings for your print-out."
            },
            "format": {
                "label": "File format",
                "tooltip": "Select a file format for your print-out.",
                "options": {
                    "png": "PNG image",
                    "pdf": "PDF document"
                }
            },
            "mapTitle": {
                "label": "Map Title",
                "tooltip": "Add a title for the map."
            },
            "content": {
                "pageLogo": {
                    "label": "Include logo",
                    "tooltip": "You can hide the logo if necessary."
                },
                "pageScale": {
                    "label": "Add a scale to the map printout",
                    "tooltip": "Add a scale to the map, if you want."
                },
                "pageDate": {
                    "label": "Include current date",
                    "tooltip": "You can add a date to the printout."
                },
                "pageTimeSeriesTime": {
                    "label": "Include time series timestamp",
                    "tooltip": "You can add a time series timestamp to the printout.",
                    "printLabel": "Time series time"
                }
            },
            "help": "Help",
            "error": {
                "title": "Error",
                "size": "Error in size definitions",
                "name": "Name is required information",
                "nohelp": "There is no help available.",
                "saveFailed": "Printing the map view not succeeded. Please try again later.",
                "nameIllegalCharacters": "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            },
            "scale": {
                "label": "Scale",
                "tooltip": "Specify the scale to be used for printing",
                "map": "Use the map scale",
                "defined": "Select a scale",
                "unsupportedLayersMessage": "The following maplayers are not shown on the printout",
                "unsupportedLayersTitle": "The printout does not show all layers"
            }
        },
        "StartView": {
            "text": "You can make a print of your map in PDF and PNG formats.",
            "info": {
                "maxLayers": "You can use at most eight map layers in the printout.",
                "printoutProcessingTime": "Printing out the map view may take some time when multiple layers are selected."
            },
            "buttons": {
                "continue": "Continue",
                "cancel": "Cancel"
            }
        }
    }
});
