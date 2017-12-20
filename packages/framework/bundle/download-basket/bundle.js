/**
 * @class Oskari.mapframework.bundle.downloadBasket.Bundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.downloadBasket.Bundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.downloadBasket.BundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/Cropping.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/Basket.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/Tile.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/download-basket/resources/css/style.css"
        }],

        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/download-basket/resources/locale/sv.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "download-basket",
            "Bundle-Name": "download-basket",
            "Bundle-Author": [{
                "Name": "Tuomas Ruohonen",
                "Organisation": "Dimenteq Oy",
                "Temporal": {
                    "Start": "2015",
                    "End": "2016"
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
                    "Name": "download-basket",
                    "Title": "download-basket"
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

Oskari.bundle_manager.installBundleClass("download-basket", "Oskari.mapframework.bundle.downloadBasket.Bundle");
