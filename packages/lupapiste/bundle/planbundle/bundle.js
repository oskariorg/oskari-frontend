/**
 * @class Oskari.lupapiste.bundle.planbundle.FlyoutHelloWorldBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.lupapiste.bundle.planbundle.PlanBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.lupapiste.bundle.planbundle.PlanBundleInstance");
        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/bundle/planbundle/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/bundle/planbundle/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/bundle/planbundle/Tile.js"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/bundle/planbundle/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/bundle/planbundle/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/lupapiste/bundle/planbundle/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "planbundle",
            "Bundle-Name" : "planbundle",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "",
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

Oskari.bundle_manager.installBundleClass("planbundle", "Oskari.lupapiste.bundle.planbundle.PlanBundleInstance");
