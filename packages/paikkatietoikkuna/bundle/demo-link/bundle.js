/**
 * @class Oskari.mapframework.bundle.demo-link.DemoLinkBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.demo-link.DemoLinkBundle",
    function () {}, {
        "create": function () {
            return Oskari.clazz.create("Oskari.mapframework.bundle.demo-link.DemoLinkBundleInstance");
        },
        "update": function (manager, bundle, bi, info) {}
    }, {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/demo-link/instance.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/paikkatietoikkuna/demo-link/resources/css/demolink.css"
            }],
            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/demo-link/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/demo-link/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/demo-link/resources/locale/sv.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "demo-link",
                "Bundle-Name": "demo-link",
                "Bundle-Author": [{
                    "Name": "Joonas Heijari",
                    "Organisation": "PHZ FullStack Oy",
                    "Temporal": {
                        "Start": "2018",
                        "End": "2018"
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
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        }
    });

Oskari.bundle_manager.installBundleClass("demo-link", "Oskari.mapframework.bundle.demo-link.DemoLinkBundle");
