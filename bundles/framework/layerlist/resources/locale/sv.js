Oskari.registerLocalization(
    {
        'lang': 'sv',
        'key': 'LayerList',
        'value': {
            'title': 'Kartlager',
            'desc': '',
            'errors': {
                'loadFailed': 'Fel i laddningen av kartlager. Ladda ned sidan på nytt i din läsare och välj kartlagren igen.',
                'noResults': 'Inga resultat hittades.'
            },
            'tabs': {
                'layerList': 'Sök kartlager',
                'selectedLayers': 'Valda kartlager'
            },
            'filter': {
                'title': 'Visa',
                'placeholder': 'Alla kartlager',
                'search': {
                    'placeholder': 'Sök kartlager med namnet, dataproducenten eller nyckelordet',
                    'tooltip': 'Sök kartlager med namnet, dataproducenten eller nyckelordet som beskriver kartlagret. Skriv en del av namnet på kartlagret, dataproducenten eller nyckelordet som beskriver kartlagret.'
                },
                'newest': {
                    'title': 'Nyaste',
                    'tooltip': 'Visa de ## nyaste kartlager'
                }
            },
            'grouping': {
                'title': 'Gruppering',
                'inspire': 'Enligt tema',
                'organization': 'Enligt dataproducent'
            },
            'tooltip': {
                'type-base': 'Bakgrundskarta',
                'type-wms': 'Kartlager (WMS, WMTS)',
                'type-wfs': 'Dataprodukt (WFS)',
                'type-timeseries': 'Kartlager med tidsserie',
                'addLayer': 'Tillägg lager'
            },
            'backendStatus': {
                'OK': {
                    'tooltip': 'Kartlagret är tillgängligt just nu.',
                    'iconClass': 'backendstatus-ok'
                },
                'DOWN': {
                    'tooltip': 'Kartlagret är inte tillgängligt just nu.',
                    'iconClass': 'backendstatus-down'
                },
                'ERROR': {
                    'tooltip': 'Kartlagret är inte tillgängligt just nu.',
                    'iconClass': 'backendstatus-error'
                },
                'MAINTENANCE': {
                    'tooltip': 'Avbrott i kartlagrets tillgänglighet är att vänta inom de närmaste dagarna.',
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
                'title': 'Kartlager',
                'message': 'Från Kartlager-menyn du kan välja kartlagret för att visas på kartan. Du kan lista kartlager med tema eller dataleverantör. Du kan också söka kartlager med kartlagernamn, en dataleverantörs namn eller ett sökord. De valda kartlagren kan kontrolleras i valda lagren-menyn.',
                'openLink': 'Visa kartlagren',
                'closeLink': 'Göm kartlagren',
                'tileText': 'Kartlagren'
            }
        }
    });
