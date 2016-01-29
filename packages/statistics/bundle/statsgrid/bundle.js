/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.bundle.statsgrid.StatsGridBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

    }, {
        "create": function () {
            return Oskari.clazz.create("Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance",
                'StatsGrid', 
                null, 
                "Oskari.statistics.bundle.statsgrid.Tile", 
                "Oskari.statistics.bundle.statsgrid.StatsView");
        },
        "update": function (manager, bundle, bi, info) {
        }
    }, {
        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [{
                "type" : "text/javascript",
                "src" : "../../../../libraries/webcomponentsjs/webcomponents-lite.min.js"
            }, {
                // MODIFIED IN STATSGRID!!!!!
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/view/MainPanel.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/service/CallbackQueue.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/service/StatisticsService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/service/UserSelectionsService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/IndicatorSelectedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/Tile.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/statistics/statsgrid/resources/css/indicatorselector.css"

                // /MODIFIED IN STATSGRID!!!!!
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/StatsView.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/StatsToolbar.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/plugin/ManageClassificationPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/StatsDataChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/ModeChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/ClearHilightsEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/SelectHilightsModeEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/IndicatorsEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/event/UserIndicatorEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/StatsGridRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/StatsGridRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/TooltipContentRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/TooltipContentRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/IndicatorsRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/IndicatorsRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/request/AddDataSourceRequest.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/statistics/statsgrid/resources/css/style.css"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/statistics/statsgrid/resources/css/classifyplugin.css"
            }, {
                "src": "../../../../libraries/jquery/jquery.event.drag-2.0.min.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/chosen/chosen.jquery.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/chosen/chosen.css",
                "type": "text/css"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/resources/locale/fi.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/statistics/statsgrid/resources/locale/en.js"
            }],
            "links": [{
                "rel": "import",
                "href": "/Oskari/bundles/statistics/statsgrid/oskari-statsview.html"
            }],
            "vulcanizedHtml": {
                // In the future when the whole application uses Polymer we can vulcanize the whole app
                // instead of using these dynamically coded partial imports.
                "rel": "import",
                "href": "/Oskari/bundles/statistics/statsgrid/vulcanized.html"
            }
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "statsgrid",
                "Bundle-Name": "statsgrid",
                "Bundle-Author": [{
                    "Name": "jjk",
                    "Organisatpation": "nls.fi",
                    "Temporal": {
                        "Start": "2013",
                        "End": "2013"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Verspation": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        },

        /**
         * @static
         * @property dependencies
         */
        "dependencies": ["jquery"]

    });

Oskari.bundle_manager.installBundleClass("statsgrid", "Oskari.statistics.bundle.statsgrid.StatsGridBundle");
