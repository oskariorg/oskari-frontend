/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundle
 *
 */
Oskari.clazz.define("Oskari.ol3.bundle.ol3.Ol3Bundle",
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
        return this;
    },

    /**
     * @method update
     *
     * Called by Bundle Manager to provide state information to
     * bundle
     *
     */
    "update" : function(manager, bundle, bi, info) {

    },
     "start" : function() {
    },
    "stop" : function() {
      // delete OpenLayers...just joking
    }
},

/**
 * metadata
 */
{

    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {

        "scripts" : [ {
            "type" : "text/javascript",
            "src" : "../../../../libraries/ol3/base.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../libraries/ol3/ol-20130912.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../libraries/ol3/ol3-ol2-compatibility.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../libraries/proj4js-1.0.1/proj4js-compressed.js"
        }, /* {
            "type" : "text/javascript",
            "src" : "../../../../libraries/ol3/ol-deps.js"
        }, */ {
            "type" : "text/css",
            "src" : "../../../../resources/ol3/bundle/ol3-default/css/ol.css"
        }],
        "resources" : []
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "ol3",
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
Oskari.bundle_manager.installBundleClass("ol3", "Oskari.ol3.bundle.ol3.Ol3Bundle");
