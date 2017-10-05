
Oskari.clazz.define("Oskari.coordinateconversion.bundle", function () {

},{
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.coordinateconversion.instance");
        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
},{

    "protocol": ["Oskari.bundle.Bundle"],
    "source": {

        "scripts": [
        {
            "type": "text/json",
            "src": "../../../../bundles/framework/coordinateconversion/resources/values.json"
        },
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
            "src": "../../../../bundles/framework/coordinateconversion/components/table.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/util/helper.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/view/conversion.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/view/mapselect.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/view/filesettings.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinateconversion/service/ConversionService.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/coordinateconversion/resources/css/filesettings.css"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/coordinateconversion/resources/css/coordinateconversion.css"
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
Oskari.bundle_manager.installBundleClass("coordinateconversion", "Oskari.coordinateconversion.bundle");
