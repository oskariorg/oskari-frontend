/**
 * @class Oskari.mapframework.bundle.featuredata.FeatureDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata.FeatureDataBundle", function() {

}, {
    "create": function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance");

        return inst;

    },
    "update": function(manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/PopupHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/plugin/MapSelectionPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/plugin/FeaturedataPlugin.js"

        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/service/GridJsonService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/service/GridModelManager.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/domain/WfsGridUpdateParams.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/request/ShowFeatureDataRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/request/ShowFeatureDataRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/featuredata/css/style.css"
        }],

        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "featuredata",
            "Bundle-Name": "featuredata",
            "Bundle-Author": [{
                "Name": "jjk",
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

Oskari.bundle_manager.installBundleClass("featuredata", "Oskari.mapframework.bundle.featuredata.FeatureDataBundle");