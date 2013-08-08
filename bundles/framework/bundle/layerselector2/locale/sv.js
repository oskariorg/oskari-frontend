Oskari.registerLocalization({
    "lang" : "sv",
    "key" : "LayerSelector",
    "value" : {
        "title" : "Kartlager",
        "desc" : "",
        "errors" : {
            "title": "Fel!",
            "generic": "Systemfel. Försök på nytt senare.",
            "loadFailed" : "Fel i laddningen av kartlager. Ladda ned sidan på nytt i din läsare och välj kartlagren.",
            "noResults": "ökningen gav inga resultat.",
            "minChars" : "Minsta längd är 4 bokstäver."
        },
        "loading" : "Laddar...",
        "filter" : {
            "text" : "Sök kartlager",
            "inspire" : "Enligt tema",
            "organization" : "Enligt dataproducent",
            "published" : "Användare"
        },
        "published" : {
            "organization" : "Publicerad kartlager",
            "inspire" : "Publicerad kartlager"
        },
        "tooltip" : {
            "type-base" : "Bakgrundskarta",
            "type-wms" : "kartlager",
            "type-wfs" : "Dataprodukt"
        },
        "backendStatus" : {
            "OK" : {
                "tooltip" : "Kartlagret är tillgängligt just nu.",
                "iconClass" : "backendstatus-ok"
            },
            "DOWN" : {
                "tooltip" : "Kartlagret är inte tillgängligt just nu.",
                "iconClass" : "backendstatus-down"
            },
            "MAINTENANCE" : {
                "tooltip" : "Avbrott i kartlagrets tillgänglighet är att vänta inom de närmaste dagarna.",
                "iconClass" : "backendstatus-maintenance"
            },
            "UNKNOWN" : {
                "tooltip" : "",
                "iconClass" : "backendstatus-ok"
            }
        },
        "buttons" : {
            "ok"    : "OK"
        },
        "types" : {
            "syn"   : "Synonym",
            "lk"    : "relaterad term",
            "vk"    : "meronym",
            "ak"    : "hyponym",
            "yk"    : "hypernym"
        }
    }
});
