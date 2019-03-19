/**
 * @class Oskari.bundle.language-selector.bundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.bundle.language-selector.bundle", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create("Oskari.bundle.language-selector.instance");
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/instance.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/language-selector/resources/scss/style.scss"
        }],
        "locales" : [{
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/en.js"
        }, {
            "lang" : "et",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/et.js"
        }, {
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/fi.js"
        }, {
            "lang" : "fr",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/fr.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/it.js"
        }, {
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/is.js"
        }, {
            "lang" : "nb",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/nb.js"
        }, {
            "lang" : "nl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/nl.js"
        }, {
            "lang" : "nn",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/nn.js"
        }, {
            "lang" : "sk",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/sk.js"
        }, {
            "lang" : "sl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/sl.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/sv.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/language-selector/resources/locale/es.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "language-selector",
            "Bundle-Name" : "language-selector",
            "Bundle-Author" : [{
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2019"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }]
        }
    }
});

Oskari.bundle_manager.installBundleClass("language-selector", 
    "Oskari.bundle.language-selector.bundle");
