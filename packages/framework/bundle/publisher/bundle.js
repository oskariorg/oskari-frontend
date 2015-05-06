/**
 * @class Oskari.mapframework.bundle.publisher.PublisherBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publisher.PublisherBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.publisher.PublisherBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/event/MapPublishedEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/event/ToolStyleChangedEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/event/ColourSchemeChangedEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/event/FontChangedEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/event/LayerToolsEditModeEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/NotLoggedIn.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/StartView.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/BasicPublisher.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/PublisherLocationForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/PublisherToolsForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/PublisherLayerForm.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/view/PublisherLayoutForm.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/publisher/resources/css/style.css"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/request/PublishMapEditorRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/request/PublishMapEditorRequestHandler.js"
        }],

        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/fr.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/hu.js"
        },{
            "lang" : "it",
            "type" : "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/it.js"
        },{
            "lang" : "is",
            "type" : "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/is.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/lv.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/pt.js"
        }, {
            "lang": "ro",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/ro.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/publisher/resources/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "publisher",
            "Bundle-Name": "publisher",
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

Oskari.bundle_manager.installBundleClass("publisher", "Oskari.mapframework.bundle.publisher.PublisherBundle");
