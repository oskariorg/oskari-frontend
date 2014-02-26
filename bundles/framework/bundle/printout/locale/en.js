Oskari.registerLocalization({
    "lang": "en",
    "key": "Printout",
    "value": {
        "title": "Print Map view",
        "flyouttitle": "Print Map view",
        "desc": "",
        "btnTooltip": "Print",
        "BasicView": {
            "title": "Print Map view",
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
                "tooltip": "Select the language of the map interface and map data."
            },
            "size": {
                "label": "Size",
                "tooltip": "Choose print layout. Preview map is updated accordingly.",
                "options": [{
                    "id": "A4",
                    "label": "A4 portrait",
                    "classForPreview": "preview-portrait",
                    "selected": true
                }, {
                    "id": "A4_Landscape",
                    "label": "A4 landscape",
                    "classForPreview": "preview-landscape"
                }, {
                    "id": "A3",
                    "label": "A3 portrait",
                    "classForPreview": "preview-portrait"
                }, {
                    "id": "A3_Landscape",
                    "label": "A3 landscape",
                    "classForPreview": "preview-landscape"
                }]
            },
            "preview": {
                "label": "Preview",
                "tooltip": "Click the small preview to open a larger preview",
                "pending": "Preview will be updated shortly",
                "notes": {
                    "extent": "Preview can be used to figure out the map extent for printout",
                    "restriction": "Not all map layers are shown in the preview"
                }

            },

            "buttons": {
                "save": "Get Printout",
                "ok": "OK",
                "cancel": "Cancel"
            },
            "location": {
                "label": "Location and zoom level",
                "tooltip": "Printout scale matches the scale of the map in browser.",
                "zoomlevel": "Zoom level"
            },
            "settings": {
                "label": "More settings",
                "tooltip": "Make additional settings like format, title, and scale"
            },
            "format": {
                "label": "Format",
                "tooltip": "Select file format",
                "options": [{
                    "id": "png",
                    "format": "image/png",
                    "label": "PNG image"
                }, {
                    "id": "pdf",
                    "format": "application/pdf",
                    "selected": true,
                    "label": "PDF document"
                }]
            },
            "mapTitle": {
                "label": "Add title",
                "tooltip": "add a title for the map"
            },
            "content": {
                "options": [{
                    "id": "pageLogo",
                    "label": "Add the logo of Paikkatietoikkuna",
                    "tooltip": "You can hide the logo if necessary",
                    "checked": "checked"
                }, {
                    "id": "pageScale",
                    "label": "Add scale to the map",
                    "tooltip": "Add scale to the map",
                    "checked": "checked"
                }, {
                    "id": "pageDate",
                    "label": "Add date",
                    "tooltip": "You can add date to the printout",
                    "checked": "checked"
                }]
            },
            "legend": {
                "label": "Legend",
                "tooltip": "Select legend position",
                "options": [{
                    "id": "oskari_legend_NO",
                    "loca": "NO",
                    "label": "No legend ",
                    "tooltip": "No legend plot",
                    "selected": true

                }, {
                    "id": "oskari_legend_LL",
                    "loca": "LL",
                    "label": "Left lower corner ",
                    "tooltip": "Legend position in left lower corner of print area"

                }, {
                    "id": "oskari_legend_LU",
                    "loca": "LU",
                    "label": "Left upper corner ",
                    "tooltip": "Legend position in left upper corner of print area"

                }, {
                    "id": "oskari_legend_RU",
                    "loca": "RU",
                    "label": "Right upper corner ",
                    "tooltip": "Legend position in right upper corner of print area"

                }, {
                    "id": "oskari_legend_RL",
                    "loca": "RL",
                    "label": "Right lower corner ",
                    "tooltip": "Legend position in right lower corner of print area"

                }]
            },
            "help": "Help",
            "error": {
                "title": "Error",
                "size": "Error in size definitions",
                "name": "Name is required information",
                "nohelp": "No help is available",
                "saveFailed": "Map printout failed. Try again later.",
                "nameIllegalCharacters": "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView": {
            "text": "You can print the Map view you just created.",
            "info": {
                "maxLayers": "Max layer count for printout is 8",
                "printoutProcessingTime": "Printout processing takes some time when multiple layers are selected."
            },
            "buttons": {
                "continue": "Continue",
                "cancel": "Cancel"
            }
        }
    }
});
