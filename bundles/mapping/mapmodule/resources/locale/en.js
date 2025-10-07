Oskari.registerLocalization(
{
    "lang": "en",
    "key": "MapModule",
    "value": {
        "status_update_map": "Loading the map...",
        "zoombar_tooltip": {
            "zoomLvl-0": "Background map",
            "zoomLvl-1": "Country",
            "zoomLvl-2": "Province",
            "zoomLvl-3": "",
            "zoomLvl-4": "Town",
            "zoomLvl-5": "",
            "zoomLvl-6": "",
            "zoomLvl-7": "Town district",
            "zoomLvl-8": "",
            "zoomLvl-9": "",
            "zoomLvl-10": "Street",
            "zoomLvl-11": "",
            "zoomLvl-12": ""
        },
        "styles": {
            "defaultTitle": "Default style"
        },
        "plugin": {
            "LogoPlugin": {
                "terms": "Terms of Use",
                "dataSources": "Data Sources",
                "layersHeader": "Map Layers"
            },
            "DataSourcePlugin": {
                "link": "Data source",
                "popup": {
                    "title": "Data Sources",
                    "content": ""
                },
                "button": {
                    "close": "Close"
                }
            },
            "BackgroundLayerSelectionPlugin": {
                "emptyOption": "No selection"
            },
            "LayerSelectionPlugin": {
                "title": "Map layers",
                "chooseDefaultBaseLayer": "Select background map",
                "headingBaseLayer": "Background map",
                "chooseOtherLayers": "Select other map layers",
                "style": "Style"
            },
            "SearchPlugin": {
                "placeholder": "Search location",
                "search": "Search",
                "title": "Search Results",
                "close": "Close search results.",
                "noresults": "No results could be found. Please check your search term and try again.",
                "searchResultCount": "Your search returned {count, plural, one {# result} other {# results}}.",
                "searchMoreResults": "Search returned more results than are shown ({count}). Please refine you search term.",
                "autocompleteInfo": "Similar search ideas",
                "column_name": "Name",
                "column_region": "Region",
                "column_village": "Municipality",
                "column_type": "Type",

                "selectResult": "Show result on map",
                "deselectResult": "Remove result from map",
                "selectResultAll": "Show all results on map",
                "deselectResultAll": "Remove all results from map",
                "options": {
                    "title": "Search options",
                    "description": "Refine search criteria by choosing data sources"
                },
                "resultBox": {
                    "close": "Close",
                    "title": "Search Results",
                    "alternatives": "This location has the following alternative place names:"
                }
            },
            "GetInfoPlugin": {
                "title": "Feature Data",
                "layer": "Map layer",
                "places": "Features",
                "description": "Description",
                "link": "Web address",
                "name": "Name",
                "noAttributeData": "No attributes to show, please open feature data to see hidden attributes."
            },
            "PublisherToolbarPlugin": {
                "history": {
                    "reset": "Move to the original map view",
                    "back": "Move to previous view",
                    "next": "Move to next view"
                },
                "measure": {
                    "line": "Measure distance",
                    "area": "Measure area"
                }
            },
            "MarkersPlugin": {
                "title": "Map Marker",
                "tooltip": "Add map marker",
                "form": {
                    "style": "Map Marker Style",
                    "message": {
                        "label": "Text visible on map",
                        "hint": "Name or description"
                    }
                },
                "dialog": {
                    "message": "Select a new location for your map marker by clicking the map.",
                    "clear": "Delete all markers"
                }
            },
            "MyLocationPlugin": {
                "tooltip": "Center map to your location",
                "error": {
                    "title": "Error for getting location!",
                    "timeout": "Getting a location takes longer than excepted...",
                    "denied": "The site has blocked location. Please enable location and try again",
                    "noLocation": "Failed to determine location",
                    "close": "Close"
                }
            },
            "PanButtonsPlugin": {
                "center" : {
                    "tooltip": "Move to the original map view",
                    "confirmReset": "Do you wish to return to the original view?"
                }
            },
            "Tiles3DLayerPlugin": {
                "layerFilter": {
                    "text": "3D layers",
                    "tooltip": "Show only 3D-datasets"
                }
            },
            "WfsVectorLayerPlugin": {
                "editLayer": "Edit map layer",
                "layerFilter": {
                    "tooltip": "Show only vector layers",
                    "featuredata": "Vector layers"
                }
            }
        },
        "layerVisibility": {
            "notInScale": "The map layer \"{name}\" has no visible features in this zoom level. Move to a suitable map level.",
            "notInGeometry": "The map layer \"{name}\" has no features in this area. Move to a better location on map."
        },
        "layerUnsupported": {
            "common": "Map Layer cannot be shown.",
            "srs": "Map layer cannot be shown with the current map projection.",
            "dimension": "Map layer cannot be shown with {dimension} map view.",
            "unavailable": 'Map layer "{name}" cannot be shown.'
        },
        "guidedTour": {
            "help1": {
                "title": "Pan Map View",
                "message": "You can pan the map view in several ways. <br/><br/>  Select a hand tool and drag the map view with a mouse.<br/><br/>  Use arrow keys on your keyboard."
            },
            "help2": {
                "title": "Zoom In and Out Map View",
                "message": "You can zoom in and out the map view in several ways. <br/><br/> Select a scale from the zoom bar. You can also click (+) and (-) buttons in the heads of the zoom bar. <br/> <br/> Use (+) and (-) keys in your keyboard. <br/> <br/> Double-click the map view or use a \"magnifier tool\" to zoom in the map view."
            }
        },
        "layerCoverageTool": {
            "name": "Show coverage area",
            "removeCoverageFromMap": "Hide coverage area"
        },
        "publisherTools": {
            "ScaleBarPlugin": "Scale bar",
            "MyLocationPlugin": {
                "toolLabel": "Center to location",
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
            "PanButtons": {
                "toolLabel": "Move to the original map view",
                "titles": {
                    "showArrows": "Pan tool"
                }
            },
            "GetInfoPlugin": {
                "toolLabel": "Feature query tool"
            },
            "IndexMapPlugin": {
                "toolLabel": "Index map",
            },
            "Zoombar": {
                "toolLabel": "Zoom bar"
            },
            "CrosshairTool": {
                "toolLabel": "Show map focal point"
            },
            "LayerSelection": {
                "toolLabel": "Map layers menu",
                "selectAsBaselayer": "Select as baselayer",
                "allowStyleChange": "Allow presentation style change",
                "showMetadata": "Show metadata links",
                "noMultipleStyles": "Only single presentation style available on the selected map layers.",
                "noMetadata": "No metadata links availabe on the selected map layers"
            },
            "SearchPlugin": {
                "toolLabel": "Place search"
            },
            "ControlsPlugin": {
                "toolLabel": "Pan by mouse"
            },
            "PublisherToolbarPlugin": {
                "toolLabel": "Map tools",
                "history": "Move to previous or next view",
                "measureline": "Measure distance",
                "measurearea": "Measure area"
            }
        }
    }
});