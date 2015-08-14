
/**
 * @class Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance
 * Bundle definition for Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.usagetracker.UsageTrackerBundle", function() {

}, {
    "create" : function() {

        return Oskari.clazz.create("Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance");
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {

        "scripts" : [
		{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/usagetracker/instance.js"
        }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "usagetracker",
            "Bundle-Name" : "usagetracker",
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
                    "Name" : "usagetracker",
                    "Title" : "usagetracker"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    }
});
Oskari.bundle_manager.installBundleClass("usagetracker", "Oskari.mapframework.bundle.usagetracker.UsageTrackerBundle");
