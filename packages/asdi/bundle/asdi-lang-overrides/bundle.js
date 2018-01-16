/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.elf.lang.overrides.Bundle
 */
Oskari.clazz.define("Oskari.asdi.lang.overrides.Bundle", function() {

}, {
    "create" : function() {
        return this;
    },
    "update" : function(manager, bundle, bi, info) {
    },
    "start": function() {},
    "stop": function() {}
}, {
    "protocol" : [
        "Oskari.bundle.Bundle",
        "Oskari.mapframework.bundle.extension.ExtensionBundle"
    ],
    "source" : {
        "scripts" : [
        ],
        "locales" : [
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-lang-overrides/resources/locale/en.js"
            }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "asdi-lang-overrides",
            "Bundle-Name" : "asdi-lang-overrides",
            "Bundle-Author" : [{
                "Name" : "mmldev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2018"
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
                    "Name" : "lang-overrides",
                    "Title" : "lang-overrides"
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

Oskari.bundle_manager.installBundleClass("asdi-lang-overrides",
    "Oskari.asdi.lang.overrides.Bundle");
