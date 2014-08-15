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
            "src": "../../../../bundles/framework/bundle/userguide/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/request/ShowUserGuideRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/request/ShowUserGuideRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/Flyout.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/userguide/css/style.css"
        }],
        "locales": [{
            "lang": "am",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/am.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/fi.js"
        }, {
            "lang": "gr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/gr.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/hu.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/lv.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/nl.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/pt.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/userguide/locale/uk.js"
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
