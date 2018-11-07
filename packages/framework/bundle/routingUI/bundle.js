/**
 * @class Oskari.mapframework.bundle.routingUI.RoutingUIBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.routingUI.RoutingUIBundle",
    function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapframework.bundle.routingUI.RoutingUIBundleInstance");
    },
    "update": function (manager, bundle, bi, info) {}
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingUI/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingUI/popupRouting.js"
        }, {
            "type": "text/javascript",
            "expose": "moment",
            "src" : "../../../../libraries/moment/2.10.6/moment-with-locales.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/routingUI/resources/scss/style.scss"
        }],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingUI/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingUI/resources/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingUI/resources/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "routingUI",
            "Bundle-Name": "routingUI",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2014"
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

Oskari.bundle_manager.installBundleClass("routingUI", "Oskari.mapframework.bundle.routingUI.RoutingUIBundle");
