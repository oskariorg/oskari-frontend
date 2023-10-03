/**
 * @class Oskari.statistics.statsgrid.StatsGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.statsgrid.StatsGridBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

    }, {
        "create": function () {
            return Oskari.clazz.create("Oskari.statistics.statsgrid.StatsGridBundleInstance",
                'statsgrid');
        }
    }, {
        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/FlyoutManager.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/Tile.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/MyIndicatorsTab.jsx"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/PersonalDataIndicatorsTab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/SeriesService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/StatisticsService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/ClassificationService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/ColorService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/StateService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/ErrorService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/Cache.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/service/CacheHelper.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/RegionsetSelector.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/SelectedIndicatorsMenu.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/IndicatorForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/IndicatorParametersList.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/IndicatorDataForm.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/Diagram.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/SpanSelect.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/view/TableFlyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/view/DiagramFlyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/view/Filter.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/view/IndicatorFormFlyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/Datatable.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/plugin/TogglePlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/SeriesControl.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/SeriesToggleTool.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/components/RegionsetViewer.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/IndicatorEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/DatasourceEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/FilterEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/RegionsetChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/ActiveIndicatorChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/RegionSelectedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/ClassificationChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/ParameterChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/event/StateChangedEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/AbstractStatsPluginTool.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/StatsTableTool.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/ClassificationTool.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/ClassificationToggleTool.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/OpacityTool.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/plugin/ClassificationPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/plugin/SeriesControlPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/publisher/DiagramTool.js"
            }, {
                "type": "text/css",
                "src": "../../../bundles/statistics/statsgrid/resources/scss/style.scss"
            }, {
                "type": "text/css",
                "src": "../../../bundles/statistics/statsgrid/resources/css/seriesplayback.css"
            }, {
                "src": "../../../libraries/chosen/1.5.1/chosen.jquery.js",
                "type": "text/javascript"
            }, {
                "src": "../../../libraries/chosen/1.5.1/chosen.css",
                "type": "text/css"
            }],
            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/resources/locale/fi.js"
            }, {
                "lang": "fr",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/resources/locale/fr.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/resources/locale/sv.js"
            }, {
                "lang": "ru",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/resources/locale/ru.js"
            }, {
                "lang": "is",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgrid/resources/locale/is.js"
            }]
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

Oskari.bundle_manager.installBundleClass("statsgrid", "Oskari.statistics.statsgrid.StatsGridBundle");
