/**
 * @class Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundle", function () {}, {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundleInstance');
        },
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    },

    /**
     * metadata
     */
    {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/EditState.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/GeometryProcessor.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/request/StartGeometryCuttingRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/request/StartGeometryCuttingRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/request/StopGeometryCuttingRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/request/StopGeometryCuttingRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometrycutter/event/GeometryCuttingEvent.js"
            }, {
                "type" : "text/javascript",
                "expose": "jsts",
    			"src" : "../../../../libraries/jsts/jsts-1.4.0.min.js"
    		}],
            "locales": []
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "geometrycutter",
                "Bundle-Name": "geometrycutter",
                "Bundle-Tag": {
                    "mapframework": true
                },
                "Bundle-Icon": {
                    "href": "icon.png"
                },
                "Bundle-Author": [{
                    "Name": "Jan Wolski",
                    "Organisation": "Karttakeskus",
                    "Temporal": {
                        "Start": "2017",
                        "End": "2017"
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
                        "Name": "geometrycutter",
                        "Title": "geometrycutter"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    });
Oskari.bundle_manager.installBundleClass("geometrycutter", "Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundle");
