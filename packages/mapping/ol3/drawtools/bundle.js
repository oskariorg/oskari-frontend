/**
 * @class Oskari.mapframework.bundle.infobox.InfoBoxBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapping.drawtools.DrawToolsBundle",

    function () {

    }, {
        "create": function () {
            var me = this;
            var inst =
                Oskari.clazz.create("Oskari.mapping.drawtools.DrawToolsBundleInstance");
            return inst;

        },
        "update": function (manager, bundle, bi, info) {

        }
    }, {

        "protocol": ["Oskari.bundle.Bundle",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
            ],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/drawtools/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/drawtools/plugin/DrawPlugin.ol3.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/drawtools/request/StartDrawingRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/drawtools/request/StopDrawingRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/drawtools/event/DrawingEvent.js"
            },
            /*JAVASCRIPT.UTIL*/
            {
                "type" : "text/javascript",
                "src" : "../../../../libraries/jsts/javascript.util.min.js"
            },
            /*JSTS*/
            {
    			"type" : "text/javascript",
    			"src" : "../../../../libraries/jsts/jsts-0.16.0.min.js"
    		}]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "drawtools",
                "Bundle-Name": "drawtools",
                "Bundle-Author": [{
                    "Name": "ev",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2009",
                        "End": "2011"
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

Oskari.bundle_manager.installBundleClass("drawtools",
    "Oskari.mapping.drawtools.DrawToolsBundle");