/**
 * @class Oskari.admin.bundle.metrics.MetricsAdminBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.admin.bundle.metrics.MetricsAdminBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
    "create" : function() {
        var me = this;

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.admin.bundle.metrics.MetricsAdminBundleInstance");

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/admin/metrics/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../libraries/jquery/plugins/jqtree/jqtree-1.2.1.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../libraries/jquery/plugins/jqtree/jqtree.css"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "metrics",
            "Bundle-Name" : "metrics",
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

Oskari.bundle_manager.installBundleClass("metrics", "Oskari.admin.bundle.metrics.MetricsAdminBundle");
