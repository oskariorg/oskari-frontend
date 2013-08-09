Oskari.registerLocalization({
    "lang" : "en",
    "key" : "LayerSelector",
    "value" : {
        "title" : "Map layers",
        "desc" : "",
        "errors" : {
            "title": "Error!",
            "generic": "System error. Please try again later.",
            "loadFailed" : "Error loading map layers. Reload the page in your browser and select map layers.",
            "noResults": "The search returned no results.",
            "minChars" : "Minimum length is 4 characters."
        },
        "loading" : "Loading...",
        "filter" : {
            "text" : "Search map layers",
            "shortDescription" : "Search layers using title, organization, or keywords.",
            "description" : "You can search map layers by typing part of the name of that layer. Furthermore, you can search usig synonyms and other keywords. Keyword search opens when there is at least 4 letters in the search field and enter key has been pressed.",
            "inspire" : "By theme",
            "organization" : "By data providers",
            "published" : "Users"
        },
        "published" : {
            "organization" : "Published map layer",
            "inspire" : "Published map layer"
        },
        "tooltip" : {
            "type-base" : "Background map",
            "type-wms" : "Map layer",
            "type-wfs" : "Data product"
        },
        "backendStatus" : {
            "OK" : {
                "tooltip" : "The map layer is currently available.",
                "iconClass" : "backendstatus-ok"
            },
            "DOWN" : {
                "tooltip" : "The map layer is currently unavailable.",
                "iconClass" : "backendstatus-down"
            },
            "MAINTENANCE" : {
                "tooltip" : "The map layer may be periodically unavailable during the next few days.",
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
            "lk"    : "related term",
            "vk"    : "meronym",
            "ak"    : "hyponym",
            "yk"    : "hypernym"
        }
    }
});
