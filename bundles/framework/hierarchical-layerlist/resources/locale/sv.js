Oskari.registerLocalization({
    "lang": "sv",
    "key": "hierarchical-layerlist",
    "value": {
        "title": "Kartlager",
        "desc": "",
        "errors": {
            "generic": "Systemfel. Försök på nytt senare.",
            "loadFailed": "Fel i laddningen av kartlager. Ladda ned sidan på nytt i din läsare och välj kartlagren igen.",
            "noResults": "Inga resultat hittades.",
            "noResultsForKeyword": "Inga kartlager hittades av detta sökord."
        },
        "loading": "Söker...",

        "filter": {
            "text": "Sök kartlager",
            "shortDescription": "Sök kartlager med namnet på kartlagret, namnet på dataproducenten eller nyckelordet som beskriver kartlagret.",
            "description": "Skriv en del av namnet på kartlagret, namnet på dataproducenten eller nyckelordet som beskriver kartlagret. Nyckelordssökningen startar när minst fyra tecken har skrivits. Tillåtna tecken är bokstäverna a-z samt å, ä och ö, siffror, backsteg och bindestreck.",
            "allLayers": "Alla kartlager",
            "didYouMean": "Menade du:"
        },
        "tooltip": {
            "type-base": "Bakgrundskarta",
            "type-wms": "Kartlager (WMS, WMTS)",
            "type-wfs": "Dataprodukt (WFS)",
            "type-wfs-manual": "Data product (WFS) - Layer is drawn on a map via Feature Data or via Refresh button action"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "Kartlagret är tillgängligt just nu.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "Kartlagret är inte tillgängligt just nu.",
                "iconClass": "backendstatus-down"
            },
            "ERROR": {
                "tooltip": "Kartlagret är inte tillgängligt just nu.",
                "iconClass": "backendstatus-error"
            },
            "MAINTENANCE": {
                "tooltip": "Avbrott i kartlagrets tillgänglighet är att vänta inom de närmaste dagarna.",
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
        "types": {
            "syn": "Synonym",
            "lk": "Relaterat begrepp",
            "vk": "Koordinatbegrepp",
            "ak": "Underordnat begrepp",
            "yk": "Överordnat begrepp"
        },
        "layerFilter": {
            "buttons": {
                "newest": "Nyaste",
                "featuredata": "Vektorlager"
            },
            "tooltips": {
                "newest": "Visa de ## nyaste kartlager",
                "featuredata": "Visa endast vektorlager",
                "remove": "Ta bort filter"
            }
        },
        "guidedTour": {
            "title": "Kartlager",
            "message": "Från Kartlager-menyn du kan välja kartlagret för att visas på kartan. Du kan också söka kartlager med kartlagernamn, en dataleverantörs namn eller ett sökord. De valda kartlagren kan kontrolleras i valda lagren-tab.",
            "openLink": "Visa kartlagren",
            "closeLink": "Göm kartlagren",
            "tileText": "Kartlagren"
        },
        "SelectedLayersTab": {
            "title": "Valda kartlager",
            "style": "Stil",
            "show": "Visa",
            "hide": "Göm",
            "rights": {
                "can_be_published_map_user": "Får publiceras"
            },
            "tooltips": {
                "removeLayer": "Ta bort kartlager",
                "openLayerTools": "Oöppnä kartlagerfunktionerna",
                "closeLayerTools": "Stäng kartlagerfunktionerna",
                "zoomToLayerExtent": "Matcha kartlager till kartvisningen",
                "can_be_published_map_user": "Kartlagret får publiceras i ett inbäddat kartfönster. Antalet användare per vecka kan vara begränsat."
            }
        },
        "manyLayersWarning": {
            "title": "Attention!",
            "text": "Du lägger till 10 eller flera lager på kartan. Om du fortsätter kommer det att orsaka prestandaproblem när du ökar kartlagren!"
        },
        "manyLayersWarningAlready": {
            "text": "Kartan har för närvarande 10 eller flera kartlager. Om du fortsätter kommer det att orsaka prestandaproblem när du ökar kartlagren!"
        }
    }
});