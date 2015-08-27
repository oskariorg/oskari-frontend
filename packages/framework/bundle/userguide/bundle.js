/**
 * @class Oskari.userinterface.bundle.ui.UserInterfaceBundle
 *
 *
 */

Oskari.clazz.define("Oskari.mapframework.bundle.userguide.UserGuideBundle", function () {

}, {
    /**
     * @method create creates an Oskari DIV Manager instance
     * @return {Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance}
     */
    "create": function () {

        return Oskari.clazz.create("Oskari.mapframework.bundle.userguide.UserGuideBundleInstance");
    },
    /**
     * @method update called by the bundle manager to inform on changes in bundlage
     */
    "update": function (manager, bundle, bi, info) {

    }
}, {
    /**
     * @static
     * @property protocol protocols implemented by this bundle
     */
    "protocol": ["Oskari.bundle.Bundle"],
    "source": {
        /**
         * @static
         * @property source.scripts
         *
         */
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/request/ShowUserGuideRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/request/ShowUserGuideRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/SimpleFlyout.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/userguide/resources/css/style.css"
        }],
        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/hy.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/fr.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/hu.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/it.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/lv.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/ro.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/sq.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/sr.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/userguide/resources/locale/uk.js"
        }]
    },
    "bundle": {
        /**
         * @static
         * @property bundle.manifest
         */
        "manifest": {
            "Bundle-Identifier": "userguide",
            "Bundle-Name": "userguide",
            "Bundle-Tag": {
                "mapframework": true
            },

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
                    "Name": "userguide",
                    "Title": "userguide"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari"],
            "Import-Bundle": {}
        }
    }
});

Oskari.bundle_manager.installBundleClass("userguide", "Oskari.mapframework.bundle.userguide.UserGuideBundle");
