/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.elf.lang.overrides.Bundle
 */
Oskari.clazz.define("Oskari.elf.lang.overrides.Bundle", function() {

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
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-lang-overrides/resources/locale/fi.js"
            },
            {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-lang-overrides/resources/locale/sv.js"
            },
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-lang-overrides/resources/locale/en.js"
            },
            {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-lang-overrides/resources/locale/es.js"
            }, {
                "lang" : "et",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/et.js"
            }, {
                "lang" : "is",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/is.js"
            }, {
                "lang" : "it",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/it.js"
            }, {
                "lang" : "nl",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/nl.js"
            }, {
                "lang" : "sk",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/sk.js"
            }, {
                "lang" : "sl",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/sl.js"
            }, {
                "lang" : "nb",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/nb.js"
            }, {
                "lang" : "fr",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/fr.js"
              }, {
                  "lang" : "nn",
                  "type" : "text/javascript",
                  "src" : "../../../../bundles/elf/elf-lang-overrides/resources/locale/nn.js"
              }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "elf-lang-overrides",
            "Bundle-Name" : "elf-lang-overrides",
            "Bundle-Author" : [{
                "Name" : "MK",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2015"
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

Oskari.bundle_manager.installBundleClass("elf-lang-overrides",
    "Oskari.elf.lang.overrides.Bundle");
