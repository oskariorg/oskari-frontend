/**
 * @class Oskari.mapframework.bundle.mapuserlayers.MapUserLayersBundle
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.mapuserlayers.MapUserLayersBundle",
    function () {}, {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return null;
        },
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    }, {
        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapuserlayers/domain/UserLayer.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapuserlayers/domain/UserLayerModelBuilder.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapuserlayers/plugin/UserLayersLayerPlugin.ol2.js"
            }],

            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplacesimport/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplacesimport/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/myplacesimport/resources/locale/en.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapuserlayers",
                "Bundle-Name": "mapuserlayers",
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
                        "Name": "Userlayers",
                        "Title": "UserLayers"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    }
);

Oskari.bundle_manager.installBundleClass("mapuserlayers", "Oskari.mapframework.bundle.mapuserlayers.MapUserLayersBundle");