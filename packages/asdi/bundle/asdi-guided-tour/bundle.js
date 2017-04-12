/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.elf.geolocator.Bundle
 */
Oskari.clazz.define("Oskari.asdiguidedtour.Bundle", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.framework.bundle.asdiguidedtour.BundleInstance",
            "asdi-guidedtour");
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
            "src" : "../../../../bundles/asdi/asdi-guided-tour/instance.js"
        }],
        "locales" : [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/asdi/asdi-guided-tour/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "asdi-guidedtour",
            "Bundle-Name" : "asdi-guidedtour",
            "Bundle-Author" : [{
                "Name" : "inyholm",
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

Oskari.bundle_manager.installBundleClass("asdi-guided-tour",
    "Oskari.asdiguidedtour.Bundle");
