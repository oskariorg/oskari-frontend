/**
 * @class Oskari.mapframework.bundle.register.RegisterBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.register.RegisterBundle",
    function () {}, {
        "create": function () {
            return Oskari.clazz.create("Oskari.mapframework.bundle.register.RegisterBundleInstance");
        },
        "update": function (manager, bundle, bi, info) {}
    }, {
        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/register/instance.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/paikkatietoikkuna/register/resources/scss/register.scss"
            }],

            "locales": [{
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/register/resources/locale/en.js"
            }, {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/register/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/paikkatietoikkuna/register/resources/locale/sv.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "register",
                "Bundle-Name": "register",
                "Bundle-Author": [{
                    "Name": "tm",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2014",
                        "End": "2020"
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

                /**
                 *
                 */

            }
        },

        /**
         * @static
         * @property dependencies
         */
        "dependencies": ["jquery"]

    });

Oskari.bundle_manager.installBundleClass("register", "Oskari.mapframework.bundle.register.RegisterBundle");
