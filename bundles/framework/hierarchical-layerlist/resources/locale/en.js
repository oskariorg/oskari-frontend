Oskari.registerLocalization({
    "lang": "en",
    "key": "hierarchical-layerlist",
    "value": {
        "title": "Map Layers",
        "desc": "",
        "errors": {
            "generic": "The system error occurred.",
            "loadFailed": "The map layers could not be loaded. Reload the webpage in your browser and select map layers again.",
            "noResults": "No search results could be found. Please check the search term.",
            "noResultsForKeyword": "No map layers could be found. Please check the search term."
        },
        "loading": "Searching...",

        "filter": {
            "text": "Search map layers.",
            "shortDescription": "Search map layers by map layer name, data producer name or keyword.",
            "description": "Search map layers by map layer name, data producer name or keyword. You can type a whole term or a part of it. The search term must be at least four characters long.",
            "allLayers": "All layers",
            "didYouMean": "Did you mean:"
        },
        "tooltip": {
            "type-base": "Background map",
            "type-wms": "Map layer (WMS, WMTS)",
            "type-wfs": "Data product (WFS)",
            "type-wfs-manual": "Refresh feature data by clicking 'Feature Data' or 'Refresh' button in the map window."
        },
        "backendStatus": {
            "OK": {
                "tooltip": "The map layer is currently available.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "The map layer is not currently available.",
                "iconClass": "backendstatus-down"
            },
            "ERROR": {
                "tooltip": "The map layer is not currently available.",
                "iconClass": "backendstatus-error"
            },
            "MAINTENANCE": {
                "tooltip": "The map layer may be periodically not available during the next few days.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-unknown"
            },
            "UNSTABLE": {
                "tooltip": "",
                "iconClass": "backendstatus-unstable"
            }
        },
        "buttons": {
            "ok": "OK"
        },
        "layerFilter": {
            "buttons": {
                "newest": "Newest",
                "featuredata": "Vector layers"
            },
            "tooltips": {
                "newest": "Show ## newest map layers",
                "featuredata": "Show only vector layers",
                "remove": "Remove filter"
            }
        },
        "guidedTour": {
            "title": "Map layers",
            "message": "In the Map Layers menu you can find all the map layers in the map service. <br/><br/> Search map layers by a map layer name, a data provider name or a keyword. Newest map layers, vector layers and publishable layers you can find in pre-defined lists.<br/><br/> Open map layers you can check in the Selected Layers tab.",
            "openLink": "Show Map Layers",
            "closeLink": "Hide Map Layers",
            "tileText": "Map layers"
        },
        "SelectedLayersTab": {
            "title": "Selected layers",
            "style": "Style",
            "show": "Show",
            "hide": "Hide",
            "rights": {
                "can_be_published_map_user": "Publication permitted"
            },
            "tooltips": {
                "removeLayer": "Remove layer for selected",
                "openLayerTools": "Open layer tools",
                "closeLayerTools": "Close layer tools",
                "zoomToLayerExtent": "Zoom to layer extent",
                "can_be_published_map_user": "The map layer is publishable in embedded maps. The weekly usage limit may be limited."
            }
        },
        "manyLayersWarning": {
            "title": "Attention!",
            "text": "You are adding 10 or more layers to the map. If you continue, increasing the map layers will cause performance problems!"
        },
        "manyLayersWarningAlready": {
            "text": "The map currently has 10 or more map layers. If you continue, increasing the map layers will cause performance problems!"
        }
    }
});