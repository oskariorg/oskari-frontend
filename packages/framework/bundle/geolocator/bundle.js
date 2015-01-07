/**
 * @class Oskari.mapframework.bundle.geolocator.GeoLocatorBundleInstance
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.geolocator.GeoLocatorBundleInstance", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.geolocator.GeoLocatorBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/geolocator/service/geolocatorsearchservice.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/geolocator/instance.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/geolocator/css/style.css"
        }],

        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/geolocator/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/geolocator/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/geolocator/locale/sv.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "geolocator",
            "Bundle-Name": "geolocator",
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

Oskari.bundle_manager.installBundleClass("geolocator", "Oskari.mapframework.bundle.geolocator.GeoLocatorBundleInstance");
