/**
 * @class Oskari.parcel.bundle.parceltour.ParcelTourBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.parcel.bundle.parceltour.ParcelTourBundle",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {}, {
        "create": function () {
            var me = this;
            var inst = Oskari.clazz.create(
                "Oskari.parcel.bundle.parceltour.ParcelTourBundleInstance"
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
                "src": "../../../../bundles/parcel/bundle/parceltour/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../libraries/jquery/plugins/jquery.cookie.js"
            }, {
                "type": "text/css",
                "src": "../../../../resources/parcel/bundle/parceltour/css/style.css"
            }],
            "locales": [{
                "lang": "bg",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/bg.js"
            }, {
                "lang": "cs",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/cs.js"
            }, {
                "lang": "da",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/da.js"
            }, {
                "lang": "de",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/de.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/es.js"
            }, {
                "lang": "et",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/et.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/fi.js"
            }, {
                "lang": "ge",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/ge.js"
            }, {
                "lang": "gr",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/gr.js"
            }, {
                "lang": "hr",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/hr.js"
            }, {
                "lang": "hu",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/hu.js"
            }, {
                "lang": "lv",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/lv.js"
            }, {
                "lang": "nl",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/nl.js"
            }, {
                "lang": "pl",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/pl.js"
            }, {
                "lang": "pt",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/pt.js"
            }, {
                "lang": "ro",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/ro.js"
            }, {
                "lang": "rs",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/rs.js"
            }, {
                "lang": "sl",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/sl.js"
            }, {
                "lang": "sk",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/sk.js"
            }, {
                "lang": "sq",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/sq.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/sv.js"
            }, {
                "lang": "uk",
                "type": "text/javascript",
                "src": "../../../../bundles/parcel/bundle/parceltour/locale/uk.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "parceltour",
                "Bundle-Name": "parceltour",
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
    "parceltour",
    "Oskari.parcel.bundle.parceltour.ParcelTourBundle"
);
