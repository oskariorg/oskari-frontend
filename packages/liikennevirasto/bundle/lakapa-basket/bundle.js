/**
 * @class Oskari.liikennevirasto.bundle.lakapa.BasketBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.BasketBundle",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.BasketBundleInstance");
        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/Tile.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/liikennevirasto/bundle/lakapa-basket/resources/css/style.css"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/request/AddToBasketRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/request/AddToBasketRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/request/ClearBasketRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/request/ClearBasketRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/request/RefreshBasketRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/request/RefreshBasketRequestHandler.js"
        }
        ],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/liikennevirasto/lakapa-basket/resources/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "lakapa-basket",
            "Bundle-Name" : "lakapa-basket",
            "Bundle-Author" : [{
                "Name" : "Marko Kuosmanen",
                "Organisation" : "Dimenteq Oy",
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
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("lakapa-basket", "Oskari.liikennevirasto.bundle.lakapa.BasketBundle");
