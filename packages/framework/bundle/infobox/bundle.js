/**
 * @class Oskari.mapframework.bundle.infobox.InfoBoxBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.infobox.InfoBoxBundle",

    function () {

    }, {
        "create": function () {
            var me = this;
            var inst =
                Oskari.clazz.create("Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance");
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
                "src": "../../../../bundles/mapping/infobox/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/plugin/openlayerspopup/OpenlayersPopupPlugin.ol2.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/request/ShowInfoBoxRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/request/ShowInfoBoxRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/request/HideInfoBoxRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/request/HideInfoBoxRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/request/RefreshInfoBoxRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/request/RefreshInfoBoxRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/event/InfoBoxEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/infobox/event/InfoboxActionEvent.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/mapping/infobox/resources/css/infobox_ol2.css"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "infobox",
                "Bundle-Name": "infobox",
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

Oskari.bundle_manager.installBundleClass("infobox",
    "Oskari.mapframework.bundle.infobox.InfoBoxBundle");