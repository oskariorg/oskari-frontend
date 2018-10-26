/**
 * Definition for bundle. See source for details.
 * 
 * @class Oskari.elf.geolocator.Bundle
 */
Oskari.clazz.define("Oskari.elf.geolocator.Bundle", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.elf.geolocator.BundleInstance",
            "elf-geolocator");
    },
    "update" : function(manager, bundle, bi, info) {
    }
}, {
    "protocol" : [
        "Oskari.bundle.Bundle",
        "Oskari.mapframework.bundle.extension.ExtensionBundle"
    ],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-geolocator/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-geolocator/GeoLocatorSearchTab.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-geolocator/service/GeoLocatorSearchService.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/elf/elf-geolocator/resources/scss/style.scss"
        }],
        "locales" : [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/fr.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/it.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/nn.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/sk.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/sl.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/elf-geolocator/resources/locale/sv.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "elf-geolocator",
            "Bundle-Name" : "elf-geolocator",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2012"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.oskari.org/documentation/development/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : "geolocator",
                    "Title" : "geolocator"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },
    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("elf-geolocator", 
    "Oskari.elf.geolocator.Bundle");
