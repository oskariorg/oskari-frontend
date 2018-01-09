/**
 * @class Oskari.mapframework.bundle.guidedtour.GuidedTourBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.framework.bundle.guidedtour.GuidedTourBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {}, {
        "create": function () {
            var me = this;
            var inst = Oskari.clazz.create(
                "Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance"
            );
            return inst;
        },
        "update": function (manager, bundle, bi, info) {}
    }, {

        "protocol": [
            "Oskari.bundle.Bundle",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
        ],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/request/AddToGuidedTourRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/request/AddToGuidedTourRequestHandler.js"
            },{
                "type": "text/javascript",
                "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/framework/guidedtour/resources/css/style.css"
            }],
            "locales": [{
                "lang": "bg",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/bg.js"
            }, {
                "lang": "cs",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/cs.js"
            }, {
                "lang": "da",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/da.js"
            }, {
                "lang": "de",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/de.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/es.js"
            }, {
                "lang": "et",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/et.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/fi.js"
            }, {
                "lang": "ka",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/ka.js"
            }, {
                "lang": "el",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/el.js"
            }, {
                "lang": "hr",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/hr.js"
            }, {
                "lang": "hu",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/hu.js"
            }, {
                "lang": "lv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/lv.js"
            }, {
                "lang": "nl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/nl.js"
            }, {
                "lang": "pl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/pl.js"
            }, {
                "lang": "pt",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/pt.js"
            }, {
                "lang": "ro",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/ro.js"
            }, {
                "lang": "sr",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/sr.js"
            }, {
                "lang": "sl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/sl.js"
            }, {
                "lang": "sk",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/sk.js"
            }, {
                "lang": "sq",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/sq.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/sv.js"
            }, {
                "lang": "uk",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/guidedtour/resources/locale/uk.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "guidedtour",
                "Bundle-Name": "guidedtour",
                "Bundle-Author": [{
                    "Name": "ev",
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

Oskari.bundle_manager.installBundleClass(
    "guidedtour",
    "Oskari.framework.bundle.guidedtour.GuidedTourBundle"
);
