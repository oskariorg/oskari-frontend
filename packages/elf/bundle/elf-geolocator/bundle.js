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
            "src" : "../../../../bundles/elf/bundle/elf-geolocator/instance.js"
        }],
        "locales" : [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/bundle/elf-geolocator/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/bundle/elf-geolocator/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/elf/bundle/elf-geolocator/locale/en.js"
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
