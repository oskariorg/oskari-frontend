/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundleInstance");
        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

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
         * coordinatetool
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/instance.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/plugin/CoordinateToolPlugin.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/plugin/CoordinateTransformationExtension.js"
        },{
           "type": "text/javascript",
           "src": "../../../../bundles/framework/coordinatetool/plugin/ViewChangerExtension.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/service/CoordinateToolService.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/publisher/CoordinateTool.js"
        },{
            "type": "text/css",
            "src": "../../../../bundles/framework/coordinatetool/resources/css/coordinatetool.css"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/sv.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/et.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/is.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/nb.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/nn.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/coordinatetool/resources/locale/sk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "coordinatetool",
            "Bundle-Name": "coordinatetool",
            "Bundle-Author": [{
                "Name": "mk",
                "Organisation": "nls.fi",
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

Oskari.bundle_manager.installBundleClass("coordinatetool",
    "Oskari.mapframework.bundle" +
    ".coordinatetool" +
    ".CoordinateToolBundle");
