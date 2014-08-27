Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Printout",
    "value": {
        "title": "Print the Map view",
        "flyouttitle": "Print the Map view",
        "desc": "",
        "btnTooltip": "Print",
        "BasicView": {
            "title": "Print the Map view",
            "name": {
                "label": "The name of the map",
                "placeholder": "required",
                "tooltip": "Give your map a descriptive name. Please note the language of the user interface."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select the language to be used in the print. Please note the language of the the user interface and the data set."
            },
            "size": {
                "label": "Size",
                "tooltip": "Choose the print size. Updates are shown in the preview image.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portrait",
                        "classForPreview": "preview-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landscape",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portrait",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landscape",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Preview",
                "tooltip": "You can largen the preview image by clicking it.",
                "pending": "Preview will be updated shortly.",
                "notes": {
                    "extent": "You can check the map extent for the printout in the preview image.",
                    "restriction": "Not all map layers are shown in the preview."
                }
            },
            "buttons": {
                "save": "Get Printout",
                "ok": "OK",
                "back": "Previous",
                "cancel": "Cancel"
            },
            "location": {
                "label": "Location and zoom level",
                "tooltip": "Printout scale matches the scale of the map in browser.",
                "zoomlevel": "Printout scale"
            },
            "settings": {
                "label": "More settings",
                "tooltip": "Choose a file format, a title, a scale and a date for the map printout."
            },
            "format": {
                "label": "File format",
                "tooltip": "Select the file format",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG image"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF document"
                    }
                ]
            },
            "mapTitle": {
                "label": "Map Title",
                "tooltip": "Add a title for the map."
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Show Finnish geoportal Paikkatietoikkuna's logo in the printout.",
                        "tooltip": "You can hide Finnish geoportal Paikkatietoikkuna's logo if necessary.",
                        "checked": "checked"
                    },
                    {
                        "id": "pageScale",
                        "label": "Add a scale to the map printout.",
                        "tooltip": "Add a scale to the map, if you want.",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Show a date in the map printout.",
                        "tooltip": "You can add a date to the printout.",
                        "checked": "checked"
                    }
                ]
            },
            "legend": {
                "label": "Map legend",
                "tooltip": "Select a position for the map legend. If any position is not selected, a map legend is not shown in the map printout.",
                "options": [
                    {
                        "id": "oskari_legend_NO",
                        "loca": "NO",
                        "label": "No map legend",
                        "tooltip": "The map legend is not shown in the map printout.",
                        "selected": true
                    },
                    {
                        "id": "oskari_legend_LL",
                        "loca": "LL",
                        "label": "Left lower corner",
                        "tooltip": "The map legend is shown in the left lower corner of the printout."
                    },
                    {
                        "id": "oskari_legend_LU",
                        "loca": "LU",
                        "label": "Left upper corner",
                        "tooltip": "The map legend is shown in the left upper corner of the printout."
                    },
                    {
                        "id": "oskari_legend_RU",
                        "loca": "RU",
                        "label": "Right upper corner",
                        "tooltip": "The map legend is shown in the right upper corner of the printout."
                    },
                    {
                        "id": "oskari_legend_RL",
                        "loca": "RL",
                        "label": "Right lower corner",
                        "tooltip": "The map legend is shown in the right upper corner of the printout."
                    }
                ]
            },
            "help": "Help",
            "error": {
                "title": "Error",
                "size": "Error in size definitions",
                "name": "Name is required information",
                "nohelp": "There is no help available.",
                "saveFailed": "Printing the map view not succeeded. Please try again later.",
                "nameIllegalCharacters": "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView": {
            "text": "You can print out the Map view you just created as a PNG image or a PDF file.",
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
}
);