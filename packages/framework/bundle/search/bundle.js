/**
 * @class Oskari.mapframework.bundle.search.SearchBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.search.SearchBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.search.SearchBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/view/DefaultSearchView.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/event/TabChangedEvent.js"
        },  {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/request/AddTabRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/request/AddTabRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/request/AddSearchResultActionRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/request/RemoveSearchResultActionRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/request/SearchResultActionRequestHandler.js"
        },  {
            "type": "text/javascript",
            "src": "../../../../bundles/service/search/searchservice.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/service/search/event/SearchResultEvent.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/service/search/request/SearchRequest.js"
        },{
            "type": "text/css",
            "src": "../../../../bundles/framework/search/resources/css/style.css"
        }],

        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/fr.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/hu.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/it.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/lv.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/ro.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/search/resources/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "search",
            "Bundle-Name": "search",
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

Oskari.bundle_manager.installBundleClass("search", "Oskari.mapframework.bundle.search.SearchBundle");
