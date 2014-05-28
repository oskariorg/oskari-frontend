Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Publisher",
    "value": {
        "title": "Create Map",
        "flyouttitle": "Create Embedded Map",
        "desc": "",
        "published": {
            "title": "Map created to embed",
            "desc": "Map has been created. Embed the map by adding the HTML code below to your website and you have the map on your website:"
        },
        "edit": {
            "popup": {
                "title": "Opening the embedded map for editing",
                "msg": "Updating the data for the previously embedded map."
            }
        },
        "BasicView": {
            "title": "Embed the Map",
            "titleEdit": "Edit the Embedded Map",
            "domain": {
                "title": "Website",
                "label": "Website for embedded map",
                "placeholder": "Website address without the prefix http or www.",
                "tooltip": "Give the domain name of the website e.g. the url-address of the website without the prefixes http or www or the address of the subpage. For example: homepage.com."
            },
            "name": {
                "label": "The name of the map",
                "placeholder": "required",
                "tooltip": "Give your map a descriptive name. Note that the name should be the same language as the map user interface."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select the laguage for the map user interface and data shown on the map."
            },
            "size": {
                "label": "Size",
                "tooltip": "Select or define the size of the map to be embedded on your website. You can see changes in the map preview."
            },
            "tools": {
                "label": "Tools",
                "tooltip": "Select the tools to be shown on the map. You can see the tool placement in the map preview.",
                "ScaleBarPlugin": "Scale bar",
                "IndexMapPlugin": "Index map",
                "PanButtons": "Pan tool",
                "Portti2Zoombar": "Zoom bar",
                "ControlsPlugin": "Pan the map",
                "SearchPlugin": "Addess and place name search",
                "FeaturedataPlugin": "Feature data",
                "GetInfoPlugin": "Query tool for feature data",
                "PublisherToolbarPlugin": "Map tools",
                "selectDrawLayer": "Select layer for new features"
            },
            "toolbarToolNames": {
                "history_back": "Move backwards",
                "history_forward": "Move forward",
                "measureline": "Measure distance",
                "measurearea": "Measure area",
                "drawTools": "Drawing tools",
                "point": "Allow users to add point features.",
                "line": "Allow users to add line features.",
                "area": "Allow users to add area features."
            },
            "toollayout": {
                "label": "Tool Placement",
                "tooltip": "Select the placement for the tool to be shown on the map.",
                "lefthanded": "Lefthanded",
                "righthanded": "Righthanded",
                "userlayout": "Custom layout",
                "usereditmode": "Start editing",
                "usereditmodeoff": "Finish editing"
            },
            "data": {
                "label": "Statistics",
                "tooltip": "Show map statistics",
                "grid": "Show statistics",
                "allowClassification": "Allow classification"
            },
            "layout": {
                "label": "Graphic Layout",
                "fields": {
                    "colours": {
                        "label": "Color scheme",
                        "placeholder": "Select the color scheme.",
                        "buttonLabel": "Select",
                        "light_grey": "Light gray",
                        "dark_grey": "Dark gray",
                        "blue": "Blue",
                        "red": "Red",
                        "green": "Green",
                        "yellow": "Yellow",
                        "custom": "Own color scheme",
                        "customLabels": {
                            "bgLabel": "Identifier background",
                            "titleLabel": "Identifier text",
                            "headerLabel": "Header text",
                            "iconLabel": "Icon",
                            "iconCloseLabel": "Dark",
                            "iconCloseWhiteLabel": "Light"
                        }
                    },
                    "fonts": {
                        "label": "Font style"
                    },
                    "toolStyles": {
                        "label": "Tool style",
                        "default": "Default style",
                        "rounded-dark": "Rounded (dark)",
                        "rounded-light": "Rounded (light)",
                        "sharp-dark": "Angular (dark)",
                        "sharp-light": "Angular (light)",
                        "3d-dark": "Three-dimensional (dark)",
                        "3d-light": "Three-dimensional (light)"
                    }
                },
                "popup": {
                    "title": "Select Color Scheme",
                    "close": "Close",
                    "gfiDialog": {
                        "title": "Feature info",
                        "featureName": "Preview",
                        "featureDesc": "The color scheme only defines the color of the popup windows for the feature info and map layer selection."
                    }
                }
            },
            "layers": {
                "add": "Create new layer for new features.",
                "label": "Map Layers",
                "addselect": "Add a drawing layer to the map",
                "defaultLayer": "(Default map layer)",
                "useAsDefaultLayer": "Use as the default layer."
            },
            "myplaces": {
                "label": "My map layers"
            },
            "sizes": {
                "small": "Small",
                "medium": "Medium",
                "large": "Large",
                "custom": "Custom size",
                "width": "width",
                "height": "height"
            },
            "buttons": {
                "save": "Save",
                "saveNew": "Save new",
                "ok": "OK",
                "replace": "Replace",
                "cancel": "Cancel",
                "add": "Add the map layer"
            },
            "confirm": {
                "replace": {
                    "title": "Do you wish to replace the embedded map?",
                    "msg": "The changes into the previously embedded map will be shown without delay on the map. You do not need to add the HTML-code to your website again."
                }
            },
            "layerselection": {
                "label": "Show map layers at the menu.",
                "info": "Select the background map levels. You can select the default background map level in the map preview.",
                "tooltip": "The background map level is shown at the bottom layer of the map. Only one background map level can be shown at a time. The user can change the background map if there is more map layers selected to background maps. The default backgound map level can be selected in the map preview.",
                "promote": "Do you wish to show also aerial images?"
            },
            "preview": "The embedded map preview",
            "location": "Location and zoom level",
            "zoomlevel": "Zoom level",
            "help": "Help",
            "error": {
                "title": "Error",
                "size": "Error in size definitions.",
                "domain": "The website is required.",
                "domainStart": "Give the website address without prefixes http and www.",
                "name": "The name of the map is required.",
                "nohelp": "The user guide is not available.",
                "saveFailed": "Embedding the map failed. Please try again later.",
                "nameIllegalCharacters": "The name of the map contains illegal characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens.",
                "domainIllegalCharacters": "The name of the website contains illegal characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "NotLoggedView": {
            "text": "You can create embedded maps after you have logged in the service.",
            "signup": "Log in",
            "signupUrl": "/web/en/login",
            "register": "Register",
            "registerUrl": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "StartView": {
            "text": "You can create the map and embed it to your own or your organisation's website.",
            "touLink": "Show Terms of use for Embedded maps",
            "layerlist_title": "Embeddable map layers",
            "layerlist_empty": "Selected map layers cannot be published in a embedded map. Check the rights to publish in the menu \"Selected Map Layers\" before you start creating the map.",
            "layerlist_denied": "The map layer cannot be published in a embedded map.",
            "denied_tooltip": "The data producers have not granted permission to publish selected map layers in a embedded map. Check the rights to publish in the menu \"Selected Map Layers\" before you start creating the map.",
            "myPlacesDisclaimer": "NB. You are publishing your own map layer.",
            "buttons": {
                "continue": "Continue",
                "continueAndAccept": "Accept the Terms of Use and continue",
                "cancel": "Cancel",
                "close": "Close"
            },
            "tou": {
                "notfound": "The Terms of Use could not be found.",
                "reject": "Reject",
                "accept": "Accept"
            }
        },
        "layer": {
            "show": "Show",
            "hide": "Hide",
            "hidden": "The map layer is temporarily hidden.",
            "rights": {
                "can_be_published_map_user": {
                    "label": "The map layer can be published in a embedded map.",
                    "tooltip": "The map layer can be published in a embedded map. The weekly number of users can be limited."
                }
            }
        }
    }
}
);