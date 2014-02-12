/**
 * @class Oskari.mapframework.bundle.mapmyplaces.MapMyPlacesBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapmyplaces.MapMyPlacesBundle", function () {}, {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {

            return null;
        },
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    },

    /**
     * metadata
     */
    {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmyplaces/plugin/MyPlacesLayerPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmyplaces/domain/MyPlacesLayer.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmyplaces/domain/MyPlacesLayerModelBuilder.js"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmyplaces/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmyplaces/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/mapmyplaces/locale/en.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapmyplaces",
                "Bundle-Name": "mapmyplaces",
                "Bundle-Tag": {
                    "mapframework": true
                },
                "Bundle-Icon": {
                    "href": "icon.png"
                },
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
                        "Name": "Analysis",
                        "Title": "Analysis"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    });

Oskari.bundle_manager.installBundleClass("mapmyplaces", "Oskari.mapframework.bundle.mapmyplaces.MapMyPlacesBundle");
