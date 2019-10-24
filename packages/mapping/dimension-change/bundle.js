/**
 * @class Oskari.mapframework.bundle.dimension-change.DimensionChangeBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.dimension-change.DimensionChangeBundle",
    function () {}, {
        "create": function () {
            return Oskari.clazz.create("Oskari.mapframework.bundle.dimension-change.DimensionChangeBundleInstance");
        },
        "update": function (manager, bundle, bi, info) {}
    }, {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/dimension-change/instance.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/mapping/dimension-change/resources/css/dimension-change.css"
            }],
            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/dimension-change/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/dimension-change/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/dimension-change/resources/locale/sv.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "dimension-change",
                "Bundle-Name": "dimension-change",
                "Bundle-Author": [{
                    "Name": "Joonas Heijari",
                    "Organisation": "Meco Oy",
                    "Temporal": {
                        "Start": "2019",
                        "End": "2025"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        }
    });

Oskari.bundle_manager.installBundleClass("dimension-change", "Oskari.mapframework.bundle.dimension-change.DimensionChangeBundle");
