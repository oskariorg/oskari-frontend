/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.printout.PrintoutBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.printout.PrintoutBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/jquery.imagesLoaded.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/plugin/LegendPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/service/PrintService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/view/StartView.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/view/BasicPrintout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/request/PrintMapRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/request/PrintMapRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/event/PrintableContentEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/event/PrintWithoutUIEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/event/PrintWithParcelUIEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/event/PrintCanceledEvent.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/printout/css/style.css"
        }],

        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/fi.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/hu.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/lv.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/nl.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/ro.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/printout/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "printout",
            "Bundle-Name": "printout",
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

Oskari.bundle_manager.installBundleClass("printout", "Oskari.mapframework.bundle.printout.PrintoutBundle");
