
Oskari.clazz.define("Oskari.mapframework.bundle.coordinateconversion.CoordinateConversionBundle", function () {

},{
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.coordinateconversion.CoordinateConversionBundleInstance");
        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
},{

    "protocol": ["Oskari.bundle.Bundle"],
    "source": {

        "scripts": [
        /*
         * Abstract base
         */

        {
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/mapmodule/plugin/AbstractMapModulePlugin.js"
        },
        {
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/mapmodule/plugin/BasicMapModulePlugin.js"
        },

        /*
         * coordinateconversion
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/plugin/ConversionPlugin.js"
        }
        ],
        "locales": [ {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/resources/locale/fi.js"
        },{
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/resources/locale/sv.js"
        } ]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "coordinateconversion",
            "Bundle-Name": "coordinateconversion",
            "Bundle-Author": [{
                "Name": "mmldev",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2017",
                    "End": "?"
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
Oskari.bundle_manager.installBundleClass("coordinateconversion", "Oskari.mapframework.bundle.coordinateconversion.CoordinateConversionBundle");
