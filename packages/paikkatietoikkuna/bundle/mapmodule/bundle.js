/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundle
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.PluginMapModuleBundle",
    function () {},
    {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return this;
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

            "scripts": [
                /*
                 * Proj4js
                 */
                {
                    "type": "text/javascript",
                    "expose" : "proj4",
                    "src": "../../../../libraries/Proj4js/proj4js-2.2.1/proj4-src.js"
                },
                /*
                 * Abstract base
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/AbstractMapModule.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/AbstractMapModulePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/BasicMapModulePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/AbstractMapLayerPlugin.js"
                },
                /*
                 * map-module
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/paikkatietoikkuna/mapmodule/mapmodule.ol.cesium.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/Plugin.js"
                },
                /*
                 * domain
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/domain/AbstractLayer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/domain/style.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/domain/tool.js"
                },{
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/domain/MaplayerGroup.js"
                },
                /**
                 * controls plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule_ol3/plugin/controls/ControlsPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/DisableMapKeyboardMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/DisableMapMouseMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/EnableMapKeyboardMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/EnableMapMouseMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule_ol3/request/MapMovementControlsRequestHandler.js"
                },{
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/ShowMapMeasurementRequest.js"
                },
                /**
                 * GFI
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/getinfo/GetFeatureInfoHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/GetFeatureInfoRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/GetFeatureInfoActivationRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/getinfo/GetInfoPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/getinfo/GetFeatureInfoFormatter.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/getinfo/request/ResultHandlerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/getinfo/request/ResultHandlerRequestHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/getinfo.css"
                },

                /**
                 * Search plugin
                 */

                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/search/SearchPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/service/search/searchservice.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/service/search/event/SearchResultEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/service/search/request/SearchRequest.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/search.css"
                },
                /**
                 * Logo plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/logo/LogoPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/logo/DataProviderInfoService.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/logo/logo.service.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/logoplugin.css"
                },
                /**
                 * Data Source plugin
                 */

                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/datasource/DataSourcePlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/datasource.css"
                },
                // IndexMap
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/indexmap/IndexMapPlugin.ol3.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/indexmap_ol3.css"
                },
                // ScaleBar
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/scalebar/ScaleBarPlugin.ol3.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/scalebar_ol3.css"
                },
                // Markers plugin
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/markers/MarkersPlugin.ol3.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/AddMarkerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/AddMarkerRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/RemoveMarkersRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/RemoveMarkersRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/AfterAddMarkerEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/MarkerClickEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/AfterRemoveMarkersEvent.js"
                },{
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MarkerVisibilityRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MarkerVisibilityRequestHandler.js"
                },
                // FullScreen
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/fullscreen/FullScreen.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/ToggleFullScreenControlRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/ToggleFullScreenControlRequestHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/fullscreen.css"
                },

                /**
                 * MapLayer selection plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/layers/LayerSelectionPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/layersselection.css"
                },

                /**
                 * Background MapLayer selection plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/layers/BackgroundLayerSelectionPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/backgroundlayerselection.css"
                },
                /**
                 * Layers plugin
                 */

                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/layers/LayersPlugin.ol3.js"
                },

                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapLayerVisibilityRequest.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapLayerVisibilityRequestHandler.ol3.js"
                },

                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapMoveByLayerContentRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapMoveByLayerContentRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/MapLayerVisibilityChangedEvent.js"
                },
                /** Layers backport */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/wmslayer/WmsLayerPlugin.ol3.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/wmslayer/wmslayer.js"
                },
                /**
                 * Vector Layer plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/VectorLayerPlugin.ol3.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/vectorlayer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/FeatureEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/request/AddFeaturesToMapRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/request/AddFeaturesToMapRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/request/RemoveFeaturesFromMapRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/request/RemoveFeaturesFromMapRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/request/ZoomToFeaturesRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectorlayer/request/ZoomToFeaturesRequestHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/vectorlayer.css"
                },
                /**
                 * Vector tiles
                 */ 
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/vectortilelayer/VectorTileLayerPlugin.js"
                },
                /**
                 * GeoLocation plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/location/GeoLocationPlugin.js"
                },
                /**
                 * Publishertoolbar plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/publishertoolbar/PublisherToolbarPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/publishertoolbar/request/ToolContainerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/publishertoolbar/request/ToolContainerRequestHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/publishertoolbar.css"
                },
                /**
                 * Realtime plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/realtime/RealtimePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/realtime/event/RefreshLayerEvent.js"
                },
                /**
                 * My Location plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/mylocation/MyLocationPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/mylocation.css"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/GetUserLocationRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/GetUserLocationRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/UserLocationEvent.js"
                },

                /**
                 * Services
                 */
                {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapmodule/service/map.layer.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapmodule/service/map.state.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapmodule/service/VectorFeatureService.ol.js"
                },

                /**
                 * Requests & handlers
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/ToolSelectionRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/activate.map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/add.map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/remove.map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/set.opacity.map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/set.style.map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/set.order.map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/map.layer.handler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapMoveRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/paikkatietoikkuna/mapmodule/plugin/controls/ToolSelectionHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapLayerUpdateRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapLayerUpdateRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/MapMoveRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/ShowProgressSpinnerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/ShowProgressSpinnerRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/RegisterStyleRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/RegisterStyleRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/VectorLayerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/request/VectorLayerRequestHandler.js"
                },

                /**
                 * Events
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/MapClickedEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapmodule/event/MapMoveStartEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.activation.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.add.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.remove.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.order.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.opacity.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/map.layer.style.js"
                }, {
                   "type": "text/javascript",
                   "src": "../../../../bundles/mapping/mapmodule/event/ProgressEvent.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/mapmodule/event/MouseHoverEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/EscPressedEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/AfterMapMoveEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/GetInfoResultEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/event/MapSizeChangedEvent.js"
                },
                {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/zoombar/Portti2Zoombar.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/porttizoombar.css"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/mapmodule/plugin/panbuttons/PanButtons.js"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/panbuttons.css"
                }, {
                    "type": "text/css",
                    "src": "../../../../bundles/mapping/mapmodule/resources/css/mapmodule_ol3.css"
                }

            ],
            "locales": [{
                "lang" : "hy",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/hy.js"
            }, {
                "lang" : "bg",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/bg.js"
            }, {
                "lang" : "cs",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/cs.js"
            }, {
                "lang" : "da",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/da.js"
            }, {
                "lang" : "de",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/de.js"
            }, {
                "lang" : "en",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/en.js"
            }, {
                "lang" : "es",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/es.js"
            }, {
                "lang" : "et",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/et.js"
            }, {
                "lang" : "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/fi.js"
            }, {
                "lang" : "fr",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/fr.js"
            }, {
                "lang" : "ka",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/ka.js"
            }, {
                "lang" : "el",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/el.js"
            }, {
                "lang" : "hr",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/hr.js"
            }, {
                "lang" : "hu",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/hu.js"
            }, {
                "lang" : "is",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/is.js"
            }, {
                "lang" : "it",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/it.js"
            }, {
                "lang" : "lv",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/lv.js"
            }, {
                "lang" : "nl",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/nl.js"
            }, {
                "lang" : "nb",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/nb.js"
            }, {
                "lang" : "nn",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/nn.js"
            }, {
                "lang" : "pl",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/pl.js"
            }, {
                "lang" : "pt",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/pt.js"
            }, {
                "lang" : "ro",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/ro.js"
            }, {
                "lang" : "sr",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/sr.js"
            }, {
                "lang" : "sl",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/sl.js"
            }, {
                "lang" : "sk",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/sk.js"
            }, {
                "lang" : "sq",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/sq.js"
            }, {
                "lang" : "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/sv.js"
            }, {
                "lang" : "uk",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapmodule/resources/locale/uk.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapmodule-plugin",
                "Bundle-Name": "mapmodule",
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
                        "Name": "Kartta",
                        "Title": "Kartta"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari", "Ext", "OpenLayers"]
            }
        }
    }
);

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapmodule", "Oskari.mapframework.bundle.PluginMapModuleBundle");
