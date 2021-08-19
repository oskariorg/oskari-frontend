/**
 * @class Oskari.mapframework.bundle.system_message.SystemBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.wfsvector.WfsVectorBundle", function () {

}, {
        "create": function () {
            return this;
        },
        "update": function (manager, bundle, bi, info) {

        }
    },
    {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [
                {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/service/WFSLayerService.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSStatusChangedEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/request/ActivateHighlightRequest.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/request/ActivateHighlightRequestHandler.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSFeaturesSelectedEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSPropertiesEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSFeatureEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapwfs2/event/WFSFeatureGeometriesEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapwfs2/domain/WFSLayer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapwfs2/domain/WfsLayerModelBuilder.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapwfs2/resources/scss/style.scss"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapwfs2/plugin/WfsVectorLayerPlugin.ol.js"
                }
            ],
            "locales" : [{
                "lang" : "en",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/en.js"
            }, {
                "lang" : "es",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/es.js"
            }, {
                "lang" : "et",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/et.js"
            }, {
                "lang" : "fi",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/fi.js"
            }, {
                "lang" : "fr",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/fr.js"
            }, {
                "lang" : "is",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/is.js"
            }, {
                "lang" : "it",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/it.js"
            }, {
                "lang" : "sv",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/sv.js"
            }, {
                "lang" : "nb",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/nb.js"
            }, {
                "lang" : "nl",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/nl.js"
            }, {
                "lang" : "nn",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/nn.js"
            }, {
                "lang" : "sl",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/sl.js"
            }, {
                "lang" : "sk",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/sk.js"
            }, {
                "lang" : "de",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/de.js"
            }, {
                "lang" : "cs",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/cs.js"
            }, {
                "lang" : "ru",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/mapwfs2/resources/locale/ru.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "wfsvector",
                "Bundle-Name": "wfsvector",
                "Bundle-Author": [{
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2018",
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari", "jquery"],
                "Import-Bundle": {}
            }
        }
    });
Oskari.bundle_manager.installBundleClass("mapwfs2", "Oskari.wfsvector.WfsVectorBundle");
