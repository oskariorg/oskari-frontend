/**
 * @class Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/service/findbycoordinatesservice.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/instance.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/findbycoordinates/resources/css/style.css"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/fr.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/it.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/nn.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/sk.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/sv.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/findbycoordinates/resources/locale/sl.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "findbycoordinates",
            "Bundle-Name": "findbycoordinates",
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

Oskari.bundle_manager.installBundleClass("findbycoordinates", "Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance");
