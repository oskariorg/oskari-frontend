/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.hsy.bundle.linkPanel.Bundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.hsy.bundle.linkPanel.BundleInstance");
        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle"],
    "source": {

        "scripts": [

        /*
         * linkpanel
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/hsy/link-panel/instance.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/hsy/link-panel/resources/css/style.css"
        }],

        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/hsy/link-panel/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/hsy/link-panel/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/hsy/link-panel/resources/locale/sv.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "link-panel",
            "Bundle-Name": "link-panel",
            "Bundle-Author": [{
                "Name": "TR",
                "Organisation": "Dimenteq Oy",
                "Temporal": {
                    "Start": "2015",
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
                    "Name": "link-panel",
                    "Title": "link-panel"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("link-panel", "Oskari.hsy.bundle.linkPanel.Bundle");
