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
            "src" : "../../../../bundles/framework/mapfull/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapfull/request/MapResizeEnabledRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapfull/request/MapResizeEnabledRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapfull/request/MapWindowFullScreenRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapfull/request/MapWindowFullScreenRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapfull/request/MapSizeUpdateRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/mapfull/request/MapSizeUpdateRequestHandler.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/mapfull/resources/css/style.css"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/fi.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/it.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/nn.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/sk.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/sv.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/mapfull/resources/locale/fr.js"
        }]
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
