/**
 * @class Oskari.framework.bundle.admin-permissions.AdminLayerRightsBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin-permissions.AdminPermissionsBundle",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        var me = this;
        
        /* this would be enough when only flyout will be implemented */
        /*
        var inst = Oskari.clazz.create("Oskari.userinterface.extension.DefaultExtension",
            'helloworld',
            "Oskari.sample.bundle.helloworld.HelloWorldFlyout"
            );
        */

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.admin.bundle.admin-permissions.AdminPermissionsBundleInstance",
            'admin-permissions',
            "Oskari.admin.bundle.admin-permissions.AdminPermissionsFlyout"
            );

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/instance.js"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/en.js"
        }, {
            "lang" : "et",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/et.js"
        }, {
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/is.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/it.js"
        }, {
            "lang" : "nl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/nl.js"
        }, {
            "lang" : "sk",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/sk.js"
        }, {
            "lang" : "sl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/sl.js"
        }, {
            "lang" : "nb",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/nb.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/es.js"
        }, {
            "lang" : "fr",
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/admin-permissions/resources/locale/fr.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "admin-permissions",
            "Bundle-Name" : "admin-permissions",
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

Oskari.bundle_manager.installBundleClass("admin-permissions", "Oskari.admin.bundle.admin-permissions.AdminPermissionsBundle");
