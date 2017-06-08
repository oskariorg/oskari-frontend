/**
 * @class Oskari.admin.bundle.admin.GenericAdminBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.GenericAdminBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
    "create" : function() {
        var me = this;

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.admin.bundle.admin.GenericAdminBundleInstance",
            'GenericAdmin',
            "Oskari.admin.bundle.admin.GenericAdminFlyout"
            );

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/instance.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/DefaultViews.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/request/AddTabRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/Flyout.js"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "admin",
            "Bundle-Name" : "admin",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2013",
                    "End" : "2013"
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

Oskari.bundle_manager.installBundleClass("admin", "Oskari.admin.bundle.admin.GenericAdminBundle");
