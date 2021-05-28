/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.framework.admin-layeranalytics.AdminLayerAnalyticsBundle
 */
Oskari.clazz.define("Oskari.framework.admin-layeranalytics.AdminLayerAnalyticsBundle",

/**
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 *
 * @contructor
 * @static
 */
function() {

}, {
    /*
    * called when a bundle instance will be created
    *
    * @method create
    */
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance"
        );
    },
    /**
     * Called by Bundle Manager to provide state information to
     *
     * @method update
     * bundle
     */
    "update" : function(manager, bundle, bi, info) {
    }
},

/**
 * metadata
 */
{
    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
                "type" : "text/javascript",
                "src" : "../../../../bundles/framework/admin-layeranalytics/instance.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/framework/admin-layeranalytics/Tile.js"
            }
        ],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/admin-layeranalytics/resources/locale/fi.js"
        }]
    }
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("admin-layeranalytics", "Oskari.framework.admin-layeranalytics.AdminLayerAnalyticsBundle");
