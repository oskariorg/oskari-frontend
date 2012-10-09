/**
 * @class Oskari.sample.bundle.guidedtour.GuidedTourBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.sample.bundle.guidedtour.GuidedTourBundle",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.sample.bundle.guidedtour.GuidedTourBundleInstance");
        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/guidedtour/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../resources/sample/bundle/guidedtour/js/jquery.cookie.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../resources/sample/bundle/guidedtour/css/style.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/guidedtour/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/guidedtour/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/guidedtour/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "guidedtour",
            "Bundle-Name" : "guidedtour",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2009",
                    "End" : "2011"
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
                    "Name" : " style-1",
                    "Title" : " style-1"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}

        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("guidedtour", "Oskari.sample.bundle.guidedtour.GuidedTourBundle");
