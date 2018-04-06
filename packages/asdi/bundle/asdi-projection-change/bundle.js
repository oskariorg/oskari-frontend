/**
 * Definition for bundle. See source for details.
 * @class Oskari.projection.change.Bundle
 */
Oskari.clazz.define("Oskari.projection.change", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.projection.change.instance",
            "projection-change"
        );    
    }
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "scripts" : [
            {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/instance.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/Flyout.js"  
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/view/ProjectionChange.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/view/ErrorListing.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/view/ProjectionInformation.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/plugin/ProjectionChangerPlugin.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/request/ShowProjectionChangerRequest.js"
            }, {
                "type": "text/javascript",
                "src" : "../../../../bundles/asdi/asdi-projection-change/component/card.js"
            }, {
                "type": "text/css",
                "src" : "../../../../bundles/asdi/asdi-projection-change/resources/css/style.css"
            }
        ],
        "locales" : [
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-projection-change/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-projection-change/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/asdi-projection-change/resources/locale/sv.js"
            }
        ]
    },
    "bundle": {
    "manifest": {
        "Bundle-Identifier": "projection-change",
        "Bundle-Name": "projection-change",
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

Oskari.bundle_manager.installBundleClass("asdi-projection-change", "Oskari.projection.change");