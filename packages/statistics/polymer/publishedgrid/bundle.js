/**
 * @class Oskari.statistics.bundle.publishedgrid.PublishedGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.bundle.publishedgrid.PublishedGridBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
    "create" : function() {
        return Oskari.clazz.create("Oskari.statistics.bundle.publishedgrid.PublishedGridBundleInstance");
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../libraries/webcomponentsjs/webcomponents-lite.min.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/publishedgrid.polymer/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/statistics/statsgrid.polymer/view/MainPanel.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/plugin/ManageClassificationPlugin.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/event/StatsDataChangedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/event/IndicatorsEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/statistics/statsgrid.polymer/service/CallbackQueue.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/service/StatisticsService.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/request/TooltipContentRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/request/TooltipContentRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/request/IndicatorsRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/request/IndicatorsRequestHandler.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/divmanazer/component/buttons/CloseButton.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/resources/css/style.css"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/resources/css/classifyplugin.css"
        }, {
            "src" : "../../../../bundles/statistics/publishedgrid.polymer/resources/css/publishedgrid.css",
            "type" : "text/css"
        }, {
            "src" : "../../../../libraries/jquery/jquery.event.drag-2.0.min.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/1.5.1/chosen.css",
            "type" : "text/css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/statsgrid.polymer/resources/locale/en.js"
        }],
        "links": [{
            "rel": "import",
            "href": "/Oskari/bundles/statistics/statsgrid.polymer/oskari-statsview.html"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "publishedgrid",
            "Bundle-Name" : "publishedgrid",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisatpation" : "nls.fi",
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
            "Bundle-Verspation" : "1.0.0",
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

Oskari.bundle_manager.installBundleClass("publishedgrid", "Oskari.statistics.bundle.publishedgrid.PublishedGridBundle");
