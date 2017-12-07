
Oskari.clazz.define("Oskari.coordinatetransformation.bundle", function () {

},{
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.coordinatetransformation.instance");
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
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/resources/values.json"
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
         * coordinatetransformation
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/components/table.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/components/select.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/util/helper.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/view/conversion.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/view/mapselect.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/view/mapmarkers.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/view/filesettings.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/service/TransformationService.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/resources/css/filesettings.css"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/resources/css/coordinatetransformation.css"
        }
        ],
        "locales": [ {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/resources/locale/fi.js"
        },{
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/paikkatietoikkuna/coordinatetransformation/resources/locale/sv.js"
        } ]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "coordinatetransformation",
            "Bundle-Name": "coordinatetransformation",
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
Oskari.bundle_manager.installBundleClass("coordinatetransformation", "Oskari.coordinatetransformation.bundle");
