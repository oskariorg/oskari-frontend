/**
 * @class Oskari.framework.bundle.admin-publish-transfer.BundleClass
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.framework.bundle.admin-publish-transfer.BundleClass",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        return {start:function(){}, stop: function(){}}
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {
    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {
        "scripts" : [{
            "type" : "text/javascript",
            "expose": "jsondiffpatch",
            "src" : "../../../../libraries/jsondiffpatch/jsondiffpatch.js"
        }, {
            "type" : "text/javascript",
            "expose": "jsondiffpatchformatters",
            "src" : "../../../../libraries/jsondiffpatch/jsondiffpatch-formatters.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../libraries/jsondiffpatch/formatters-styles/html.css"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-publish-transfer/TransferTool.js"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-publish-transfer/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-publish-transfer/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/admin-publish-transfer/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "admin-publish-transfer",
            "Bundle-Name" : "admin-publish-transfer",
            "Bundle-Author" : [{
                "Name" : "Jan Wolski",
                "Organisation" : "Karttakeskus",
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

Oskari.bundle_manager.installBundleClass("admin-publish-transfer", "Oskari.framework.bundle.admin-publish-transfer.BundleClass");
