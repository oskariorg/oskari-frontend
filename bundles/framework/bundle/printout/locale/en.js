Oskari.registerLocalization(
    {
        "lang": "en",
        "key": "Printout",
        "value": {
            "title": "Print Map view",
            "flyouttitle": "Print Map view",
            "desc": "",
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
                    "tooltip": "Select size of the printout. The map preview is displayed in the selected size."
                },
   				"preview": {
                    "label": "Preview",
                    "tooltip": "Click the small preview to open a larger preview"
                },
                "sizes": {
                    "A4": "A4-portrait",
                    "A4_Landscape": "A4-landscape",
                    "A3": "A3-portrait",
                    "A3_Landscape": "A3-landscape"
                },
                "buttons": {
                    "save": "Get PDF Printout",
                    "ok": "OK",
                    "cancel": "Cancel"
                },
                "location": {
                	"label" : "Location and zoom level",
                	"tooltip" : "Printout scale matches the scale of the map in browser.",
                	"zoomlevel": "Zoom level"
                },
                "settings": {
                    "label" : "More settings",
                    "tooltip" : "Make additional settings like format, title, and scale"
                },
                "format": {
                    "label" : "Format",
                    "tooltip" : "Select file format"
                },
                "formats": {
                    "png": "PNG image",
                    "pdf": "PDF document"
                },
                "mapTitle": {
                    "label" : "Add title",
                    "tooltip" : "add a title for the map"
                },
                "mapLogo": {
                    "label" : "Add the logo of Paikkatietoikkuna",
                    "tooltip" : "You can hide the logo if necessary"
                },
                "mapScale": {
                    "label" : "Add scale to the map",
                    "tooltip" : "Add scale to the map"
                },
                "mapDate": {
                    "label" : "Add date",
                    "tooltip" : "You can add date to the print"
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
                "buttons": {
                    "continue": "Continue",
                    "cancel": "Cancel"
                }
            }
        }
    });