/**
 * Definition for bundle. See source for details.
 * @class Oskari.map.projection.Bundle
 */
Oskari.clazz.define("Oskari.map.projection", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.map.projection.instance",
            "map-projection"
        );    
    }
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "scripts" : [
            {
            "type" : "text/javascript",
            "src" : "../../../../bundles/asdi/asdi-map-projection/instance.js"
            }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/asdi/asdi-map-projection/Flyout.js"  
            }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/asdi/asdi-map-projection/view/ProjectionChange.js"
            }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/asdi/asdi-map-projection/plugin/ProjectionChangerPlugin.js"
            }, {
                "type": "text/css",
                "src" : "../../../../bundles/asdi/asdi-map-projection/resources/css/style.css"
            },
        ],
        "locales" : [
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-map-projection/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-map-projection/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-map-projection/resources/locale/sv.js"
            }
        ]
    },
    "bundle": {
    "manifest": {
        "Bundle-Identifier": "map-projection",
        "Bundle-Name": "map-projection",
        "Bundle-Author": [{
            "Name": "MMLDEV",
            "Organisatpation": "nls.fi",
            "Temporal": {
                "Start": "2018",
                "End": "2018"
            },
            "Copyleft": {
                "License": {
                    "License-Name": "EUPL",
                    "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                }
            }
        }],
        "Bundle-Verspation": "1.0.0",
        "Import-Namespace": ["Oskari"],
        "Import-Bundle": {}
    }
},
"dependencies": ["jquery"]
});

Oskari.bundle_manager.installBundleClass("asdi-map-projection", "Oskari.map.projection");