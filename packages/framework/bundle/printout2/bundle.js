/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapping.printout.bundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapping.printout.instance");

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
            "src": "../../../../bundles/framework/printout2/view/print.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/preview.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/printout2/components/thematicmap.js"
        }],
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "printout",
            "Bundle-Name": "printout",
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

Oskari.bundle_manager.installBundleClass("printout", "Oskari.mapping.printout.bundle");
