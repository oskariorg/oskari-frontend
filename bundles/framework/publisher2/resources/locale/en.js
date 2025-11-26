Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Publisher2",
    "value": {
        "tile": {
            "title": "Map publishing"
        },
        "flyout": {
            "title": "Publish a map to your website"
        },
        "published": {
            "title": "The embedded map is ready for publishing",
            "desc": "Publish the map by embedding the HTML code below on your website:",
            "copy": "Copy to the clipboard"
        },
        "snippet": {
            "title": "HTML code",
            "desc": "Copy the HTML code below to your html code and the map will be visible on your website.",
            "params": "Use published map from current map location and zoom level",
            "paramsTip": "By default, the center of the map is the one in the map window at the time of publication."
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
            "title": "Map publishing",
            "titleEdit": "Update Embedded Map",
            "transfer": {
                "label": "Transfer configuration",
                "PublishTransfer": "Enable transfer"
            },
            "generalInfo": {
                "label": "Basic settings",
                "domain": {
                    "label": "Allow publication only at the following web address:",
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
                    "label": "Language of user interface",
                    "options": {
                        "fi": "Finnish",
                        "sv": "Swedish",
                        "en": "English"
                    },
                    "tooltip": "Select a language to be used on the final map. It affects the user interface and text on the map. Note! The language selection is not visible on the preview.",
                    "languageChangedDisclaimer": "Note! The language selection is not visible on the preview."
                }
            },
            "mapPreview": {
                "label": "Map Size",
                "tooltip": "Determine the size of the map. The recommendation is to use the option \"Scalable/ Responsive\". Otherwise, the width should be from {minWidth} to {maxWidth} pixels and the height from {minHeight} to {maxHeight} pixels."
            },
            "tools": {
                "label": "Tools",
                "additional": "Additional tools",
                "tooltip": "Select available map tools. Check a placement in the map preview."
            },
            "toolLayout": {
                "label": "Tool Placement",
                "tooltip": "Select a placement for map tools.",
                "swapUI": "Swap sides",
                "userlayout": "Custom placement",
                "usereditmodeoff": "Save placement"
            },
            "statsgrid": {
                "label": "Thematic maps",
                "tooltip": "Show thematic maps on the map."
            },
            "layout": {
                "label": "Graphic Layout",
                "title": {
                    "popup": "Popup window",
                    "buttons": "Buttons",
                    "infobox": "Feature query tool"
                },
                "fields": {
                    "toolStyles": {
                        "rounded-dark": "Rounded (dark)",
                        "rounded-light": "Rounded (light)",
                        "sharp-dark": "Angular (dark)",
                        "sharp-light": "Angular (light)",
                        "3d-dark": "Three-dimensional (dark)",
                        "3d-light": "Three-dimensional (light)"
                    },
                    "font": "Font",
                    "popupHeaderColor": "Title background color",
                    "popupHeaderTextColor": "Title font color",
                    "infoboxHeaderColor": "Title background color",
                    "infoboxHeaderTextColor": "Title font color",
                    "infoboxPreview": "Preview",
                    "buttonBackgroundColor": "Background color",
                    "buttonTextColor": "Icon color",
                    "buttonAccentColor": "Icon effect color",
                    "buttonRounding": "Button rounding",
                    "effect": "Effect",
                    "3d": "Three-dimensional",
                    "presets": "Preset styles"
                },
                "gfiDialog": {
                    "title": "Feature data",
                    "featureName": "Preview",
                    "featureDesc": "The selected layout options affects a graphic layout of feature and map layer popup info windows."
                }
            },
            "sizes": {
                "small": "Small",
                "medium": "Medium",
                "large": "Large",
                "fill": "Responsive",
                "custom": "Custom size",
                "width": "width",
                "height": "height",
                "separator": "x"
            },
            "buttons": {
                "save": "Save",
                "saveNew": "Save new map",
                "replace": "Update map"
            },
            "confirm": {
                "replace": {
                    "title": "Do you want to update this map?",
                    "msg": "Do you want to update this map? Updates are shown immediately on the map. You do not need to update the html code on your website unless you have changed the size of the map."
                }
            },
            "rpc": {
                "label": "Programmatic use (RPC API)",
                "info": "With the RPC API you can utilize published maps. For more information https://oskari.org/documentation/features/rpc/"
            },
            "layers": {
                "label": "Map layers",
                "tools": "Tools",
                "selectAsBaselayer": "Select as background map",
                "otherLayers": "Selected map layers",
                "selectLayers": "Select map layers",
                "layersDisplay": "Edit map layers",
                "baseLayers": "Background maps",
                "noBaseLayers": "No background maps selected",
                "noLayers": "No selected map layers"
            },
            "error": {
                "title": "Error",
                "size": "The map size is invalid. The width must be {minWidth} - {maxWidth} pixels and height {minHeight} - {maxHeight} pixels.",
                "domain": "The website is required. Please type an address and try again.",
                "domainStart": "The website is invalid. Please type an address without http or www prefixes and try again.",
                "name": "The map name is required. Please type a name and try again.",
                "nohelp": "The user guide is not available.",
                "saveFailed": "The embedded map could not be saved.",
                "nameIllegalCharacters": "The map name contains illegal characters (e.g. html-tags). Please correct the name and try again.",
                "domainIllegalCharacters": "The website address contains illegal characters. Type a website URL-address without prefixes or a subpage address. For example: homepage.com. Allowed characters are letters (a-z, A-Z, å, ä, ö, Å, Ä, Ö), numbers (0-9) and special characters (-, _, ., !, ~, *, ' and ()). Please correct the address and try again.",
                "enablePreview": "An error occured while opening preview. The preview might have additional tools that will not be part of the embedded map.",
                "disablePreview": "An error occured while returning from preview mode. Page reload is recommended."
            },
            "noUI": "Hide user interface (Use RPC interface)"
        },
        "NotLoggedView": {
            "text": "Create an embeddable map and publish it on your own website. Please log in or register first.",
            "signup": "Log in",
            "register": "Register"
        },
        "StartView": {
            "text": "Create an embeddable map and publish it on your own website.",
            "touLink": "Terms of use for map publishing",
            "layerlist_title": "Publishable map layers open in map window:",
            "layerlist_empty": "No publishable map layers are open in the map window. Please check publishable map layers in the Selected Layers menu.",
            "layerlist_denied": "Unpublishable map layers open in map window:",
            "denied_tooltip": "These map layers are not publishable in embedded maps. Data producers have not granted permissions for publishing or the current map projection is unsupported. Please check publishable map layers in the Selected Layers menu.",
            "userDataLayerDisclaimer": "NOTE! If you are using this map layer in an embedded map, the map layer will be published.",
            "hasUserDataDisclaimer": "NOTE! If you are using your own map layers in an embedded map, the map layers will be published.",
            "noRights": "no permission",
            "buttons": {
                "continue": "Continue",
                "continueAndAccept": "Accept and continue"
            },
            "tou": {
                "title": "Terms of Use",
                "notfound": "Terms of Use could not be found.",
                "reject": "Reject",
                "accept": "Accept"
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
