Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Publisher2",
    "value": {
        "tile": {
            "title": "Map publishing"
        },
        "flyout": {
            "title": "Create Embedded Map"
        },
        "published": {
            "title": "Embedded Map Saved",
            "desc": "The embedded map has been saved. Publish it on your website by copying this code to the html code on your website:",
            "copy": "Copy to the clipboard"
        },
        "edit": {
            "popup": {
                "title": "Opening embedded map…",
                "msg": "Updating embedded map…",
                "published": {
                    "msg": "Opening embedded map for editing. Please wait a moment!",
                    "error": {
                        "title": "Error",
                        "common": "Opening embedded map failed.",
                        "login": "Please log in to edit embedded map."
                    }
                }
            }
        },
        "BasicView": {
            "title": "Create Embedded Map",
            "titleEdit": "Update Embedded Map",
            "transfer": {
                "label": "Transfer configuration",
                "PublishTransfer": "Enable transfer"
            },
            "domain": {
                "title": "Basic settings",
                "label": "Restrict embedding only to the following web address:",
                "placeholder": "Allowed domain",
                "tooltip": "Type a website URL-address without prefixes or a subpage address. For example: homepage.com.",
                "inputWarning": "Verify typed web address"
            },
            "name": {
                "label": "Map name (required)",
                "placeholder": "Map name",
                "tooltip": "Type a map name. Please note the language used on the map."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select a language to be used on the final map. It affects the user interface and text on the map. Note! The language selection is not visible on the preview.",
                "languageChangedDisclaimer": "Note! The language selection is not visible on the preview."
            },
            "size": {
                "label": "Map Size",
                "tooltip": "Determine the size of the map. The recommendation is to use the option \"Scalable/ Responsive\". Otherwise, the width should be from {minWidth} to {maxWidth} pixels and the height from {minHeight} to {maxHeight} pixels."
            },
            "maptools": {
                "label": "Additional tools",
                "tooltip": "Select available map tools. Check a placement in the map preview.",
                "GetInfoPlugin": "Feature query tool",
                "selectDrawLayer": "Select map layer",
                "LayerSelectionPlugin": "Map layers menu",
                "MapLegend": "Show map legend",
                "MapRotator": "Enable map rotation",
                "toolbarToolNames": {
                    "history": "Move to previous or next view",
                    "history_back": "Move to previous view",
                    "history_forward": "Move to next view",
                    "measureline": "Measure distance",
                    "measurearea": "Measure area",
                    "drawTools": "Drawing tools",
                    "point": "Adding own places",
                    "line": "Allow point features",
                    "area": "Allow line features"
                },
                "layers": {
                    "add": "Allow area features",
                    "label": "Map Layers",
                    "addselect": "Add a drawing layer to map layers.",
                    "defaultLayer": "(Default map layer)",
                    "useAsDefaultLayer": "Use as default"
                },
                "myplaces": {
                    "label": "My map layers"
                },
                "layerselection": {
                    "selectAsBaselayer": "Select as baselayer",
                },
                "mylocation": {
                    "modes": {
                        "single": "Single",
                        "continuous": "Continuous"
                    },
                    "titles": {
                        "mode": "Mode",
                        "mobileOnly": "Enable functionality only for mobile devices",
                        "centerMapAutomatically": "Center map on user location at startup"
                    }
                },
            },
            "toollayout": {
                "label": "Tool Placement",
                "tooltip": "Select a placement for map tools.",
                "swapUI": "Swap sides",
                "userlayout": "Custom placement",
                "usereditmode": "Start editing",
                "usereditmodeoff": "Finish editing"
            },
            "statsgrid": {
                "label": "Thematic maps",
                "tooltip": "Show thematic maps on the map."
            },
            /* for deprecated statsgrid2016 */
            "data": {
                "label": "Thematic maps",
                "tooltip": "Show thematic maps on the map.",
                "grid": "Show thematic data in table",
                "allowClassification": "Allow classification",
                "transparent": "Set classification background transparent",
                "displayDiagram" : "Display charts",
                "allowHidingClassification" : "Allow hiding classification",
                "allowHidingSeriesControl" : "Allow hiding series player"
            },
            "layout": {
                "label": "Graphic Layout",
                "title": {
                    "popup": "Popup window",
                    "buttons": "Buttons"
                },
                "fields": {
                    "colours": {
                        "label": "Color scheme",
                        "placeholder": "Color scheme",
                        "buttonLabel": "Select",
                        "light_grey": "Light gray",
                        "dark_grey": "Dark gray",
                        "blue": "Blue",
                        "red": "Red",
                        "green": "Green",
                        "yellow": "Yellow",
                        "custom": "My colour scheme",
                        "customLabels": {
                            "bgLabel": "Identifier background",
                            "titleLabel": "Identifier text",
                            "headerLabel": "Placename",
                            "iconLabel": "Icon",
                            "iconCloseLabel": "Dark",
                            "iconCloseWhiteLabel": "Light"
                        }
                    },
                    "fonts": {
                        "label": "Font style"
                    },
                    "toolStyles": {
                        "rounded-dark": "Rounded (dark)",
                        "rounded-light": "Rounded (light)",
                        "sharp-dark": "Angular (dark)",
                        "sharp-light": "Angular (light)",
                        "3d-dark": "Three-dimensional (dark)",
                        "3d-light": "Three-dimensional (light)"
                    },
                    "popupHeaderColor": "Title background color",
                    "popupHeaderTextColor": "Title color",
                    "buttonBackgroundColor": "Background color",
                    "buttonTextColor": "Icon color",
                    "buttonAccentColor": "Icon effect color",
                    "buttonRounding": "Button rounding",
                    "effect": "Effect",
                    "3d": "3D",
                    "presets": "Style presets"
                },
                "popup": {
                    "title": "Select Color Scheme",
                    "close": "Close",
                    "gfiDialog": {
                        "title": "Feature Info",
                        "featureName": "Preview",
                        "featureDesc": "The selected color scheme affects a graphic layout of feature and map layer popup info windows."
                    }
                }
            },
            "sizes": {
                "small": "Small",
                "medium": "Medium",
                "large": "Large",
                "fill": "Scalable / Responsive",
                "custom": "Custom size",
                "width": "width",
                "height": "height",
                "separator": "x"
            },
            "buttons": {
                "save": "Save",
                "saveNew": "Save new map",
                "ok": "OK",
                "replace": "Update map",
                "cancel": "Cancel",
                "add": "Add map layer"
            },
            "confirm": {
                "replace": {
                    "title": "Do you want to update this map?",
                    "msg": "Do you want to update this map? Updates are shown immediately on the map. You do not need to update the html code on your website unless you have changed the size of the map."
                }
            },
            "layerselection": {
                "label": "Map Layers",
                "info": "Select the map layers to show on the published map",
                "tooltip": "The background layer is shown at the bottom layer on the map. If you select several background maps, only one of them can be visible at a time. User can select a background layer in the user interface. Please select a default background map in the map preview.",
                "promote": "Do you want to show also orthophotos on the map?"
            },
            "rpc": {
                "label": "Programmatic use (RPC API)",
                "info": "With the RPC API you can utilize published maps. For more information https://oskari.org/documentation/features/rpc/"
            },
            "mapLayers": {
                "label": "Map layers",
                "otherLayers": "Other maps",
                "selectLayers": "Select map layers",
                "layersDisplay": "Layer presentation",
                "baseLayers": "Background maps",
                "noBaseLayers": "No selected background maps",
                "noLayers": "No selected map layers"
            },
            "tools": {
                "label": "Tools"
            },
            "preview": "Map preview",
            "location": "Location and zoom level",
            "zoomlevel": "Zoom level",
            "help": "Help",
            "error": {
                "title": "Error",
                "size": "The map size is invalid. The width should be from {minWidth} to {maxWidth} pixels and the height from {minHeight} to {maxHeight} pixels.",
                "domain": "The website is required. Please type an address and try again.",
                "domainStart": "The website is invalid. Please type an address without http or www prefixes and try again.",
                "name": "The map name is required. Plese type a name and try again.",
                "nohelp": "The user guide is not available.",
                "saveFailed": "The embedded map could not be saved.",
                "nameIllegalCharacters": "The map name contains illegal characters (e.g. html-tags). Please correct the name and try again.",
                "domainIllegalCharacters": "The website address contains illegal characters. Type a website URL-address without prefixes or a subpage address. For example: homepage.com. Allowed characters are letters (a-z, A-Z, å, ä, ö, Å, Ä, Ö), numbers (0-9) and special characters (-, _, ., !, ~, *, ' and ()). Please correct the address and try again.",
                "enablePreview": "An error occured while opening preview. The preview might have additional tools that will not be part of the embedded map.",
                "disablePreview": "An error occured while returning from preview mode. Page reload is recommended.",
            },
            "noUI": "Hide user interface (Use RPC interface)"
        },
        "NotLoggedView": {
            "text": "Welcome to publish embedded map on your website. Please log in or register first.",
            "signup": "Log in",
            "register": "Register"
        },
        "StartView": {
            "text": "Welcome to publish embedded map on your website.",
            "touLink": "Show Terms of Use",
            "layerlist_title": "Publishable map layers open in map window:",
            "layerlist_empty": "No publishable map layers are open in the map window. Please check publishable map layers in the Selected Layers menu.",
            "layerlist_denied": "Unpublishable map layers open in map window:",
            "denied_tooltip": "These map layers are not publishable in embedded maps. Data producers have not granted permissions for publishing or the current map projection is unsupported. Please check publishable map layers in the Selected Layers menu.",
            "myPlacesDisclaimer": "NOTE! If you are using this map layer in an embedded map, the map layer will be published.",
            "noRights": "no permission",
            "buttons": {
                "continue": "Continue",
                "continueAndAccept": "Accept and continue",
                "cancel": "Cancel",
                "close": "Close"
            },
            "tou": {
                "notfound": "Terms of Use could not be found.",
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
                    "label": "Publishable",
                    "tooltip": "The map layer is publishable in embedded maps. The weekly user amount can be limited."
                }
            }
        },
        "layerFilter": {
            "buttons": {
                "publishable": "Publishable"
            },
            "tooltips": {
                "publishable": "Show only publishable map layers."
            }
        },
        "guidedTour": {
            "title": "Map Publishing",
            "message": "In the Map Publishing menu you can publish embedded maps on your own website. <br/><br/> Select map layers, define a website, select tools and desing a layout. Click Save and your map is ready for publishing. Just copy one line html code to your website. <br/><br/> If you want to update the map, you can find it in the My Data menu. Updates are shown immediately on your map. <br/><br/> Map Publishing is available only for logged-in users.",
            "openLink": "Show Map Publishing",
            "closeLink": "Hide Map Publishing",
            "tileText": "Map Publishing"
        }
    }
});
