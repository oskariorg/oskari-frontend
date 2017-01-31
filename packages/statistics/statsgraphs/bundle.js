/**
 * @class Oskari.statistics.statsgraphs.StatsGraphsBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.statsgraphs.StatsGraphsBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

    }, {
        "create": function () {
            return Oskari.clazz.create("Oskari.statistics.statsgraphs.StatsGraphsBundleInstance",
                'statsgraphs');
        },
        "update": function (manager, bundle, bi, info) {
        }
    }, {
        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "expose" : "d3",
                "src": "../../../libraries/d3/d3_3.5.16.js"
            }, {
                "type": "text/javascript",
                "src": "../../../libraries/d3/libs/c3_0.4.10.js"
            }, {
                "type": "text/css",
                "src": "../../../libraries/d3/libs/c3_0.4.10.min.css"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/Flyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/Chart1Tab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/Chart2Tab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/Chart3Tab.js"
            },],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/resources/locale/fi.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../bundles/statistics/statsgraphs/resources/locale/en.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "statsgraphs",
                "Bundle-Name": "statsgraphs",
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

Oskari.bundle_manager.installBundleClass("statsgraphs", "Oskari.statistics.statsgraphs.StatsGraphsBundle");
