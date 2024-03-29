/**
 * @class Oskari.mapframework.bundle.infobox.InfoBoxBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapping.drawtools.DrawToolsBundle",

    function () {

    }, {
        "create": function () {
            var me = this;
            var inst =
                Oskari.clazz.create("Oskari.mapping.drawtools.DrawToolsBundleInstance");
            return inst;

        },
        "update": function (manager, bundle, bi, info) {

        }
    }, {

        "protocol": ["Oskari.bundle.Bundle",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
            ],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/drawtools/instance.js"
            },
    		/*CSS*/
    		{
                "type": "text/css",
                "src": "../../../../bundles/mapping/drawtools/resources/scss/drawtools.scss"
            }],
            "locales": [{
              "lang": "fi",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/fi.js"
            }, {
              "lang": "sv",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/sv.js"
            }, {
              "lang": "en",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/en.js"
            }, {
              "lang": "et",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/et.js"
            }, {
              "lang": "fr",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/fr.js"
            }, {
              "lang": "is",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/is.js"
            }, {
              "lang": "nb",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/nb.js"
            }, {
              "lang": "nn",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/nn.js"
            }, {
              "lang": "sk",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/sk.js"
            }, {
              "lang": "ru",
              "type": "text/javascript",
              "src": "../../../../bundles/mapping/drawtools/resources/locale/ru.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "drawtools",
                "Bundle-Name": "drawtools",
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

Oskari.bundle_manager.installBundleClass("drawtools",
    "Oskari.mapping.drawtools.DrawToolsBundle");
