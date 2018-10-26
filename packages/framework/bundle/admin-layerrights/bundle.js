/**
 * @class Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle",
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
        var inst = Oskari.clazz.create("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance",
            'admin-layerrights',
            "Oskari.framework.bundle.admin-layerrights.AdminLayerRightsFlyout"
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
            "src" : "../../../../bundles/framework/admin-layerrights/instance.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/Flyout.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/Tile.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/scss/style.scss"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.css",
            "type" : "text/css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/en.js"
        }, {
            "lang" : "et",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/et.js"
        }, {
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/is.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/it.js"
        }, {
            "lang" : "nl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/nl.js"
        }, {
            "lang" : "sk",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/sk.js"
        }, {
            "lang" : "sl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/sl.js"
        }, {
            "lang" : "nb",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/nb.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/es.js"
        }, {
            "lang" : "fr",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-layerrights/resources/locale/fr.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "admin-layerrights",
            "Bundle-Name" : "admin-layerrights",
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

Oskari.bundle_manager.installBundleClass("admin-layerrights", "Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle");
