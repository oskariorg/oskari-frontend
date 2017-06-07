/**
 * @class Oskari.admin.bundle.appsetup.AppSetupAdminBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.admin.bundle.appsetup.AppSetupAdminBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
    "create" : function() {
        var me = this;

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.admin.bundle.appsetup.AppSetupAdminBundleInstance");

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/appsetup/instance.js"
        },
        {
            "type" : "text/css",
            "src" : "../../../../bundles/admin/appsetup/resources/css/style.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/appsetup/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/appsetup/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/appsetup/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "appsetup",
            "Bundle-Name" : "appsetup",
            "Bundle-Author" : [{
                "Name" : "MK",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2017",
                    "End" : "2017"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
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

Oskari.bundle_manager.installBundleClass("appsetup", "Oskari.admin.bundle.appsetup.AppSetupAdminBundle");
