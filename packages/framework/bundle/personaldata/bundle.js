/**
 * @class Oskari.mapframework.bundle.personaldata.PersonalDataBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.personaldata.PersonalDataBundle", function () {

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
            "src": "../../../../bundles/framework/bundle/personaldata/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/MyViewsTab.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/service/ViewService.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/PublishedMapsTab.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/AccountTab.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/request/AddTabRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/request/AddTabRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "../../../../resources/framework/bundle/personaldata/css/personaldata.css"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/myplaces2/MyPlacesTab.js"
        }],

        "locales": [{
            "lang": "am",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/am.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/fi.js"
        }, {
            "lang": "ge",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/ge.js"
        }, {
            "lang": "gr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/gr.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/hu.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/lv.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/nl.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/ro.js"
        }, {
            "lang": "rs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/rs.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/bundle/personaldata/locale/uk.js"
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

Oskari.bundle_manager.installBundleClass("personaldata", "Oskari.mapframework.bundle.personaldata.PersonalDataBundle");
