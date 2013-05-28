/**
 * @class Oskari.mapframework.bundle.featuredata2.FeatureDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.FeatureDataBundle", function() {

}, {
    "create": function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance");

        return inst;

    },
    "update": function(manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/PopupHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/plugin/MapSelectionPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/event/FinishedDrawingEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/event/WFSSetFilter.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/event/AddedFeatureEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/plugin/FeaturedataPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/request/ShowFeatureDataRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/request/ShowFeatureDataRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/featuredata2/css/style.css"
        }],

        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/featuredata2/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "featuredata2",
            "Bundle-Name": "featuredata2",
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

Oskari.bundle_manager.installBundleClass("featuredata2", "Oskari.mapframework.bundle.featuredata2.FeatureDataBundle");
