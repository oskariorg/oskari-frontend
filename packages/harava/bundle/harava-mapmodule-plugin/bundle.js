/**
 * @class Oskari.harava.bundle.MapModulePluginBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.harava.bundle.MapModulePluginBundle",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
    /*
     * @method create
     * called when a bundle instance will be created
     */
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.harava.bundle.MapModulePluginBundleInstance");
        return inst;

    },
    /**
     * @method update
     * Called by Bundle Manager to provide state information to
     * bundle
     */
    "update" : function(manager, bundle, bi, info) {

    }
},

/**
 * metadata
 */
{

    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-mapmodule-plugin/instance.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-mapmodule-plugin/plugin/getinfo/HaravaGetInfoPlugin.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-mapmodule-plugin/plugin/wmslayer/HaravaWMSLayerPlugin.js"
        },        
        /*
         * Requests and handlers
         **/
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-mapmodule-plugin/request/UpdateMapRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/harava/bundle/harava-mapmodule-plugin/request/UpdateMapRequestHandler.js"
        }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "harava-mapmodule-plugin",
            "Bundle-Name" : "harava-mapmodule-plugin",
            "Bundle-Author" : [{
                "Name" : "MK",
                "Organisation" : "Dimenteq Oy",
                "Temporal" : {
                    "Start" : "2012",
                    "End" : "2013"
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
    "dependencies" : []

});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("harava-mapmodule-plugin", "Oskari.harava.bundle.MapModulePluginBundle");