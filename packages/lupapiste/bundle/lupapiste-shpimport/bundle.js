/**
 * @class Oskari.lupapiste.bundle.myplacesimport.MyPlacesImportBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.lupapiste.bundle.shpimport.ShpImportBundle",
    function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.lupapiste.bundle.shpimport.ShpImportBundleInstance");
    },
    "update": function (manager, bundle, bi, info) {}
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/service/MyPlacesImportService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/UserLayersTab.js"
        }, {
          "type" : "text/css",
          "src" : "../../../../resources/lupapiste/bundle/lupapiste-shpimport/css/shpimport.css"      
        }],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/lupapiste/bundle/lupapiste-shpimport/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "lupapiste-shpimport",
            "Bundle-Name": "lupapiste-shpimport",
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

Oskari.bundle_manager.installBundleClass("lupapiste-shpimport", "Oskari.lupapiste.bundle.shpimport.ShpImportBundle");
