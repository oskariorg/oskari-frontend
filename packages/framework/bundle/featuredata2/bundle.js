/**
 * @class Oskari.mapframework.bundle.featuredata2.FeatureDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.FeatureDataBundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance");

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
         * featuredata2
         */
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/PopupHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/plugin/MapSelectionPlugin.ol2.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/event/FinishedDrawingEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/event/WFSSetFilter.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/event/WFSSetPropertyFilter.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/event/AddedFeatureEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/plugin/FeaturedataPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/request/ShowFeatureDataRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/request/ShowFeatureDataRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/featuredata2/resources/css/style.css"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../libraries/jsts/javascript.util.min.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../libraries/jsts/jsts-0.16.0.min.js"
        }],
        "locales": [{
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/cs.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/fr.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/hr.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/it.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/nb.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/nn.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/pt.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/sk.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/sl.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/featuredata2/resources/locale/sv.js"
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
