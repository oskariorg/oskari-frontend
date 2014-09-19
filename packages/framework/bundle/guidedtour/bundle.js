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
                "src": "../../../../bundles/framework/bundle/guidedtour/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
            }, {
                "type": "text/css",
                "src": "../../../../resources/framework/bundle/guidedtour/css/style.css"
            }],
            "locales": [{
                "lang": "bg",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/bg.js"
            }, {
                "lang": "cs",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/cs.js"
            }, {
                "lang": "da",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/da.js"
            }, {
                "lang": "de",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/de.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/es.js"
            }, {
                "lang": "et",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/et.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/fi.js"
            }, {
                "lang": "ka",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/ka.js"
            }, {
                "lang": "el",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/el.js"
            }, {
                "lang": "hr",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/hr.js"
            }, {
                "lang": "hu",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/hu.js"
            }, {
                "lang": "lv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/lv.js"
            }, {
                "lang": "nl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/nl.js"
            }, {
                "lang": "pl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/pl.js"
            }, {
                "lang": "pt",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/pt.js"
            }, {
                "lang": "ro",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/ro.js"
            }, {
                "lang": "sr",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/sr.js"
            }, {
                "lang": "sl",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/sl.js"
            }, {
                "lang": "sk",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/sk.js"
            }, {
                "lang": "sq",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/sq.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/sv.js"
            }, {
                "lang": "uk",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/guidedtour/locale/uk.js"
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
