Oskari.registerLocalization(
    {
        'lang': 'en',
        'key': 'LayerList',
        'value': {
            'title': 'Map Layers',
            'desc': '',
            'errors': {
                'loadFailed': 'The map layers could not be loaded. Reload the webpage in your browser and select map layers again.',
                'noResults': 'No search results could be found. Please check the search term.'
            },
            'tabs': {
                'layerList': 'Search map layers',
                'selectedLayers': 'Selected layers'
            },
            'filter': {
                'title': 'Show',
                'placeholder': 'All layers',
                'search': {
                    'placeholder': 'Search map layers by name, data producer or keyword',
                    'tooltip': 'Search map layers by name, data producer or keyword. You can type a whole term or a part of it.'
                },
                'newest': {
                    'title': 'Newest',
                    'tooltip': 'Show ## newest map layers'
                }
            },
            'grouping': {
                'title': 'Grouping',
                'inspire': 'By Theme',
                'organization': 'By Data Provider'
            },
            'tooltip': {
                'type-base': 'Background map',
                'type-wms': 'Map layer (WMS, WMTS)',
                'type-wfs': 'Data product (WFS)',
                'type-timeseries': 'Time series layer',
                'addLayer': 'Add map layer'
            },
            'backendStatus': {
                'OK': {
                    'tooltip': 'The map layer is currently available.',
                    'iconClass': 'backendstatus-ok'
                },
                'DOWN': {
                    'tooltip': 'The map layer is not currently available.',
                    'iconClass': 'backendstatus-down'
                },
                'ERROR': {
                    'tooltip': 'The map layer is not currently available.',
                    'iconClass': 'backendstatus-error'
                },
                'MAINTENANCE': {
                    'tooltip': 'The map layer may be periodically not available during the next few days.',
                    'iconClass': 'backendstatus-maintenance'
                },
                'UNKNOWN': {
                    'tooltip': '',
                    'iconClass': 'backendstatus-unknown'
                },
                'UNSTABLE': {
                    'tooltip': '',
                    'iconClass': 'backendstatus-unstable'
                }
            },
            'guidedTour': {
                'title': 'Map layers',
                'message': 'In the Map Layers menu you can find all the map layers in the map service. <br/><br/> Sort map layers by theme or data provider. <br/><br/> Search map layers by a map layer name, a data provider name or a keyword. Newest map layers, vector layers and publishable layers you can find in pre-defined lists.<br/><br/> Open map layers you can check in the Selected Layers menu.',
                'openLink': 'Show Map Layers',
                'closeLink': 'Hide Map Layers',
                'tileText': 'Map layers'
            }
        }
    });
