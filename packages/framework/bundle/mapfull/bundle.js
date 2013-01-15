/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundle
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapfull.MapFullBundle",
/**
 * @constructor
 *
 * Bundle's constructor is called when bundle is created. At
 * this stage bundle sources have been loaded, if bundle is
 * loaded dynamically.
 *
 */
function() {

    /*
     * Any bundle specific classes may be declared within
     * constructor to enable stealth mode
     *
     * When running within map application framework - Bundle
     * may refer classes declared with Oskari.clazz.define() -
     * Bundle may refer classes declared with Ext.define -
     * Bundle may refer classes declared within OpenLayers
     * libary
     *
     *
     */
}, {
    /*
     * @method create
     *
     * called when a bundle instance will be created
     *
     */
    "create" : function() {
        return Oskari.clazz.create("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance");
    },

    /**
     * @method update
     *
     * Called by Bundle Manager to provide state information to
     * bundle
     *
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
            "src" : "../../../../bundles/framework/bundle/mapfull/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/enhancement/start-map-with-link-enhancement.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/request/MapResizeEnabledRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/request/MapResizeEnabledRequestHandler.js"
        }],
        "resources" : []
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "mapfull",
            "Bundle-Name" : "mapframework.mapfull.Bundle",
            "Bundle-Tag" : {
                "mapframework" : true
            },
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
                    "Name" : "mapframework.mapfull.Bundle",
                    "Title" : "mapframework.mapfull.Bundle"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    }
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("mapfull", "Oskari.mapframework.bundle.mapfull.MapFullBundle");
