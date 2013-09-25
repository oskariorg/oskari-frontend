/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundle
 *
 */
Oskari.clazz.define("Oskari.ol3.bundle.mapfull.MapFullBundle",
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
        return Oskari.clazz.create("Oskari.ol3.bundle.mapfull.MapFullBundleInstance");
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
            "src" : "../../../../bundles/ol3/bundle/mapfull/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/enhancement/start-map-with-link-enhancement.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/request/MapResizeEnabledRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/request/MapResizeEnabledRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/request/MapWindowFullScreenRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapfull/request/MapWindowFullScreenRequestHandler.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/mapfull/css/style.css"
        }],
        "resources" : []
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "mapfull",
            "Bundle-Name" : "ol3.mapfull.Bundle",
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
            }]
        }
    }
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("mapfull", "Oskari.ol3.bundle.mapfull.MapFullBundle");
