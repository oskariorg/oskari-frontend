/**
 * @class Oskari.sample.bundle.tetris.Bundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.sample.bundle.tetris.Bundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.sample.bundle.tetris.BundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/sample/tetris/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/sample/tetris/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/sample/tetris/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/blockrain/blockrain.jquery.min.js"
        }, {
            "type": "text/css",
            "src": "../../../../libraries/blockrain/blockrain.css"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/sample/tetris/resources/css/style.css"
        }],

        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/sample/tetris/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/sample/tetris/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/sample/tetris/resources/locale/sv.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "tetris",
            "Bundle-Name": "tetris",
            "Bundle-Author": [{
                "Name": "Marko Kuosmanen",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2015",
                    "End": "2016"
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
                    "Name": "tetris",
                    "Title": "tetris"
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

Oskari.bundle_manager.installBundleClass("tetris", "Oskari.sample.bundle.tetris.Bundle");
