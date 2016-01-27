/**
 * Definition for bundle. See source for details.
 * 
 * @class Oskari.elf.geolocator.Bundle
 */
Oskari.clazz.define("Oskari.asdi.login.Bundle", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.asdi.login.BundleInstance",
            "asdi-login",
            "Oskari.asdi.login.Flyout");
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
            "src" : "../../../../bundles/asdi/asdi-login/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/asdi/asdi-login/Flyout.js"
        }],
        "locales" : [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/asdi/asdi-login/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/asdi/asdi-login/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/asdi/asdi-login/resources/locale/sv.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "asdi-login",
            "Bundle-Name" : "asdi-login",
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
                    "Name" : "login",
                    "Title" : "login"
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

Oskari.bundle_manager.installBundleClass("asdi-login", 
    "Oskari.asdi.login.Bundle");
