/**
 * @class Oskari.mapframework.bundle.personaldata.PersonalDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.bundle.MyDataBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance");
        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "./instance.js"
        }, {
            "type": "text/javascript",
            "src": "./Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "./Tile.js"
        }, {
            "type": "text/javascript",
            "src": "./events/PersonaldataLoadedEvent.js"
        },{
            "type": "text/javascript",
            "src": "./view/MyViews/MyViewsTab.jsx"
        }, {
            "type": "text/javascript",
            "src": "./service/ViewService.js"
        }, {
            "type": "text/javascript",
            "src": "./PublishedMapsTab.js"
        }, {
            "type": "text/javascript",
            "src": "./view/Account/AccountTab.jsx"
        }, {
            "type": "text/javascript",
            "src": "./request/AddTabRequest.js"
        }, {
            "type": "text/javascript",
            "src": "./request/AddTabRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "./resources/scss/personaldata.scss"
        }],

        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "./resources/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "./resources/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "./resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "./resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "./resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "./resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "./resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "./resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "./resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "./resources/locale/fr.js"
        }, {
            "lang": "ka",
            "type": "text/javascript",
            "src": "./resources/locale/ka.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "./resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "./resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "./resources/locale/hu.js"
        },{
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "./resources/locale/is.js"
        },{
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "./resources/locale/it.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "./resources/locale/lv.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "./resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "./resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "./resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "./resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "./resources/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "./resources/locale/ro.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "./resources/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "./resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "./resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "./resources/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "./resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "./resources/locale/uk.js"
        }, {
            "lang": "ru",
            "type": "text/javascript",
            "src": "./resources/locale/ru.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "personaldata",
            "Bundle-Name": "personaldata",
            "Bundle-Author": [{
                "Name": "ejv",
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
     * @property {String[]} dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("personaldata", "Oskari.bundle.MyDataBundle");
