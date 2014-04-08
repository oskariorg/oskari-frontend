/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.MyPlacesBundle", function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance");
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
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/FinishedDrawingEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/AddedFeatureEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/event/MyPlaceHoverEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/event/MyPlacesChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/event/SelectedDrawingEvent.js"
            },
            /* model */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/model/MyPlace.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/model/MyPlacesCategory.js"
            },
            /* plugin */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/DrawPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/plugin/HoverPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/MyPlacesTab.js"
            },
            /* request */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StopDrawingRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StartDrawingRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/GetGeometryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/GetGeometryRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StartDrawingRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmodule-plugin/plugin/drawplugin/request/StopDrawingRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/EditPlaceRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/DeletePlaceRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/EditCategoryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/DeleteCategoryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/PublishCategoryRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/EditRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/OpenAddLayerDialogRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/request/OpenAddLayerDialogHandler.js"
            },
            /* service */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/service/MyPlacesService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/service/MyPlacesWFSTStore.js"
            },
            /* ui */
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/view/MainView.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/view/PlaceForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/view/CategoryForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/ButtonHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/CategoryHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/myplaces2/instance.js"
            }, {
                // NOTE! EXTERNAL LIBRARY!
                "type": "text/javascript",
                "src": "../../../../libraries/jscolor/jscolor.js"
            },
            // css
            {
                "type": "text/css",
                "src": "../../../../resources/framework/bundle/myplaces2/css/myplaces.css"
            }
        ],

        "locales": [{
            "lang": "am",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/am.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/fi.js"
        }, {
            "lang": "ge",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/ge.js"
        },{
            "lang": "gr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/gr.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/hu.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/lv.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/nl.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/ro.js"
        }, {
            "lang": "rs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/rs.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "myplaces2",
            "Bundle-Name": "myplaces2",
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
Oskari.bundle_manager.installBundleClass("myplaces2", "Oskari.mapframework.bundle.myplaces2.MyPlacesBundle");
