/**
 * @class Oskari.mapframework.bundle.parcelselector.ParcelSelector
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelselector.ParcelSelector",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance");
        return inst;
    },
    "update" : function(manager, bundle, bi, info) {
    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelselector/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelselector/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelselector/Tile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelselector/model/LayerGroup.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelselector/view/ParcelsTab.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/parcelselector/css/parcelselector.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcelselector/locale/fi.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "parcelselector",
            "Bundle-Name" : "parcelselector",
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
                    "Name" : " style-1",
                    "Title" : " style-1"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("parcelselector", "Oskari.mapframework.bundle.parcelselector.ParcelSelector");
