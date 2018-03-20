/**
 * @class Oskari.mapframework.bundle.mapmyplaces.MapMyPlacesBundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapmyplaces.MapMyPlacesBundle", function () {}, {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {

            return null;
        },
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    },

    /**
     * metadata
     */
    {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/plugin/MyPlacesLayerPlugin.ol3.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/domain/MyPlacesLayer.js"
            }, {
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapmyplaces/event/MyPlacesVisualizationChangeEvent.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/domain/MyPlacesLayerModelBuilder.js"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/fi.js"
            }, {
                "lang": "fr",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/fr.js"
            }, {
                "lang": "is",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/is.js"
            }, {
                "lang": "it",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/it.js"
            }, {
                "lang": "nb",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/nb.js"
            }, {
                "lang": "nl",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/nl.js"
            }, {
                "lang": "nn",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/nn.js"
            }, {
                "lang": "sl",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/sl.js"
            }, {
                "lang": "sk",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/sk.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/en.js"
            }, {
                "lang": "es",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/es.js"
            }, {
                "lang": "et",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmyplaces/resources/locale/et.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapmyplaces",
                "Bundle-Name": "mapmyplaces",
                "Bundle-Tag": {
                    "mapframework": true
                },
                "Bundle-Icon": {
                    "href": "icon.png"
                },
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
                        "Name": "MapMyPlaces",
                        "Title": "MapMyPlaces"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    }
    );

Oskari.bundle_manager.installBundleClass("mapmyplaces", "Oskari.mapframework.bundle.mapmyplaces.MapMyPlacesBundle");
