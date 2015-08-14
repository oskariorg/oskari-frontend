/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundle",
    function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance");
    },
    "update": function (manager, bundle, bi, info) {}
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/service/MyPlacesImportService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/UserLayersTab.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/myplacesimport/css/style.css"
        }],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplacesimport/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "myplacesimport",
            "Bundle-Name": "myplacesimport",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2014"
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

Oskari.bundle_manager.installBundleClass("myplacesimport", "Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundle");
