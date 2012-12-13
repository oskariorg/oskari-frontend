/**
 * @class Oskari.mapframework.bundle.parcelinfo.ParcelInfo
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelinfo.ParcelInfo",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelinfo.ParcelInfoInstance");
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
            "src" : "../../../../bundles/framework/bundle/parcelinfo/instance.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/parcelinfo/css/parcelinfo.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelinfo/locale/fi.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "parcelinfo",
            "Bundle-Name" : "parcelinfo",
            "Bundle-Author" : [{
                "Name" : "jjk",
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

Oskari.bundle_manager.installBundleClass("parcelinfo", "Oskari.mapframework.bundle.parcelinfo.ParcelInfo");
