Oskari.registerLocalization(
    {
        "lang": "en",
        "key": "Printout",
        "value": {
            "title": "Print map",
            "flyouttitle": "Print map",
            "desc": "",
            "BasicView": {
                "title": "Print map",             
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
                    "tooltip": "Select or define the size of the map to be embedded on your website. The map preview is displayed in the selected size."
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
                	"zoomlevel": "Zoom level",
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
                "text": "You can print the map view you just created.",
                "buttons": {
                    "continue": "Continue",
                    "cancel": "Cancel"
                }
            }
        }
    });