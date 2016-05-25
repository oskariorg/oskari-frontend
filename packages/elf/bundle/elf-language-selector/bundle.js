/**
 * @class Oskari.mapframework.bundle.backendstatus.BackendStatusBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.elf.languageselector.Bundle", function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.elf.languageselector.BundleInstance","elf-language-selector");

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/elf-extension.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/instance.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/css/style.css"
        }],
        "locales" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/all.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/en.js"
        }, {
            "lang" : "et",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/et.js"
        }, {
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/fi.js"
        }, {
            "lang" : "fr",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/fr.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/it.js"
        }, {
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/is.js"
        }, {
            "lang" : "nb",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/nb.js"
        }, {
            "lang" : "nl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/nl.js"
        }, {
            "lang" : "nn",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/nn.js"
        }, {
            "lang" : "sk",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/sk.js"
        }, {
            "lang" : "sl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/sl.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/sv.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-language-selector/resources/locale/es.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "elf-language-selector",
            "Bundle-Name" : "elf-language-selector",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2012"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : "backendstatus",
                    "Title" : "backendstatus"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}

            /**
             *
             */

        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("elf-language-selector", 
    "Oskari.elf.languageselector.Bundle");
