/**
 * @class Oskari.mapframework.bundle.geometryeditor.GeometryEditorBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.geometryeditor.GeometryEditorBundle", function () {}, {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return null;
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
                "src": "../../../../bundles/framework/geometryeditor/plugin/DrawFilterPlugin.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/request/StartDrawFilteringRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/request/StartDrawFilteringRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/request/StopDrawFilteringRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/request/StopDrawFilteringRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/event/FinishedDrawFilteringEvent.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../libraries/clipper/clipper.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../libraries/jsts/jsts.js"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/geometryeditor/resources/locale/en.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "geometryeditor",
                "Bundle-Name": "geometryeditor",
                "Bundle-Tag": {
                    "mapframework": true
                },
                "Bundle-Icon": {
                    "href": "icon.png"
                },
                "Bundle-Author": [{
                    "Name": "jjk",
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
                        "Name": "GeometryEditor",
                        "Title": "GeometryEditor"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    });
Oskari.bundle_manager.installBundleClass("geometryeditor", "Oskari.mapframework.bundle.geometryeditor.GeometryEditorBundle");
