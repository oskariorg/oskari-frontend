/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.elf.license.Bundle
 */
Oskari.clazz.define("Oskari.elf.license.Bundle", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.elf.license.BundleInstance",
            "elf-license");
    },
    "update" : function(manager, bundle, bi, info) {
    }
}, {
    "protocol" : [
        "Oskari.bundle.Bundle",
        "Oskari.mapframework.bundle.extension.ExtensionBundle"
    ],
    "source" : {

        "scripts" : [
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/instance.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/elements/ParamEnumElement.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/elements/ParamDisplayElement.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/elements/ParamIntElement.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/elements/ParamBlnElement.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/elements/ParamTextElement.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/service/LicenseService.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/validator/NumberValidator.js"
            },
            {
                "type" : "text/css",
                "src" : "../../../../bundles/elf/elf-license/resources/css/style.css"
            }
        ],
        "locales" : [
            {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-license/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-license/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-license/resources/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/elf/elf-license/resources/locale/es.js"
            }, {
                "lang" : "et",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/et.js"
            }, {
                "lang" : "is",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/is.js"
            }, {
                "lang" : "it",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/it.js"
            }, {
                "lang" : "nl",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/nl.js"
            }, {
                "lang" : "sk",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/sk.js"
            }, {
                "lang" : "sl",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/sl.js"
            }, {
                "lang" : "nb",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/nb.js"
            }, {
                "lang" : "fr",
                "type" : "text/javascript",
                "src" : "../../../../bundles/elf/elf-license/resources/locale/fr.js"
              }, {
                  "lang" : "nn",
                  "type" : "text/javascript",
                  "src" : "../../../../bundles/elf/elf-license/resources/locale/nn.js"
              }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "elf-license",
            "Bundle-Name" : "elf-license",
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
                    "Name" : "license",
                    "Title" : "license"
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

Oskari.bundle_manager.installBundleClass("elf-license",
    "Oskari.elf.license.Bundle");
