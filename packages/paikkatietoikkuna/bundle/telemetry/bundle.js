/**
 * @class Oskari.mapframework.bundle.telemetry.TelemetryBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.telemetry.TelemetryBundle",
    function () {}, {
        "create": function () {
            return Oskari.clazz.create("Oskari.mapframework.bundle.telemetry.TelemetryBundleInstance");
        },
        "update": function (manager, bundle, bi, info) {}
    }, {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/telemetry/instance.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "telemetry",
                "Bundle-Name": "telemetry",
                "Bundle-Author": [{
                    "Name": "Jan Wolski",
                    "Organisation": "CGI",
                    "Temporal": {
                        "Start": "2018",
                        "End": "2018"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Name-Locale": {
                    "fi": {
                        "Name": " style-1",
                        "Title": " style-1"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari", "jquery"],
                "Import-Bundle": {}

                /**
                 *
                 */

            }
        },

        /**
         * @static
         * @property dependencies
         */
        "dependencies": ["jquery"]

    });

Oskari.bundle_manager.installBundleClass("telemetry", "Oskari.mapframework.bundle.telemetry.TelemetryBundle");
