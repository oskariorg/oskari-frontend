/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapping.printout2.bundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapping.printout2.instance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/jquery.imagesLoaded.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/event/PrintableContentEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/view/print.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/preview.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/settings.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/sidepanel.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/sizepanel.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/toolhandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/printarea.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/tools/AbstractTool.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/tools/thematicmap.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/tools/testtool.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/printout2/resources/css/style.css"
        } ],
        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/fi.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/hu.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/lv.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/nl.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/ro.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/uk.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/it.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/nb.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/resources/locale/fr.js"
          }, {
              "lang": "nn",
              "type": "text/javascript",
              "src": "../../../../bundles/framework/printout2/resources/locale/nn.js"
          }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "printout2",
            "Bundle-Name": "printout2",
            "Bundle-Author": [{
                "Name": "Oskari.org",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2017",
                    "End": "2018"
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

Oskari.bundle_manager.installBundleClass("printout2", "Oskari.mapping.printout2.bundle");
