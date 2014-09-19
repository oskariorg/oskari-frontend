/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance");
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
            "src": "../../../../src/mapping/mapmodule/plugin/AbstractMapModulePlugin.js"
        },
        {
            "type": "text/javascript",
            "src": "../../../../src/mapping/mapmodule/plugin/BasicMapModulePlugin.js"
        },

        /*
         * coordinatedisplay
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/plugin/CoordinatesPlugin.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/coordinatedisplay/css/coordinatedisplay.css"
        }],
        "locales": [{
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/fi.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/hr.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/lv.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/nl.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/ro.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/sl.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/coordinatedisplay/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "coordinatedisplay",
            "Bundle-Name": "coordinatedisplay",
            "Bundle-Author": [{
                "Name": "ah",
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

Oskari.bundle_manager.installBundleClass("coordinatedisplay",
    "Oskari.mapframework.bundle" +
    ".coordinatedisplay" +
    ".CoordinateDisplayBundle");
