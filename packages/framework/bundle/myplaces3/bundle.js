/**
 * @class Oskari.mapframework.bundle.myplaces3.MyPlacesBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces3.MyPlacesBundle", function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance");
    },
    "update": function (manager, bundle, bi, info) {
        manager.alert("RECEIVED update notification " + info);
    }
}, {
    "protocol": ["Oskari.bundle.Bundle"],
    "source": {
        "scripts": [
            /* event */

            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/event/MyPlacesChangedEvent.js"
            }, 
            /* model */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/model/MyPlace.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/model/MyPlacesCategory.js"
            },
            /* plugin */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/MyPlacesTab.js"
            },
            /* request */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/EditPlaceRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/DeletePlaceRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/EditCategoryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/DeleteCategoryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/PublishCategoryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/EditRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/OpenAddLayerDialogRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/request/OpenAddLayerDialogHandler.js"
            },
            /* service */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/service/MyPlacesService.js"
            },
            /* ui */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/view/MainView.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/view/PlaceForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/view/CategoryForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/ButtonHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/CategoryHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplaces3/instance.js"
            }, {
                // NOTE! EXTERNAL LIBRARY!
                "type": "text/javascript",
                "src": "../../../../libraries/jscolor/jscolor.js"
            },
            // css
            {
                "type": "text/css",
                "src": "../../../../bundles/framework/myplaces3/resources/css/myplaces.css"
            }
        ],

        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/fr.js"
        }, {
            "lang": "ka",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/ka.js"
        },{
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/hu.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/it.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/lv.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/nn.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/ro.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/myplaces3/resources/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "myplaces3",
            "Bundle-Name": "myplaces3",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2011"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale": {
                "fi": {
                    "Name": " style-1",
                    "Title": " style-1"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("myplaces3", "Oskari.mapframework.bundle.myplaces3.MyPlacesBundle");
