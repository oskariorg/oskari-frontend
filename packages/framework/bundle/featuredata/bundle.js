/**
 * @class Oskari.mapframework.bundle.featuredata2.FeatureDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata.FeatureDataBundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {
    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
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
         * featuredata
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/plugin/FeatureDataPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/request/ShowFeatureDataRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/request/ShowFeatureDataRequestHandler.js"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata/resources/locale/sv.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "featuredata",
            "Bundle-Name": "featuredata",
            "Bundle-Author": [{
                "Name": "pjh",
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
