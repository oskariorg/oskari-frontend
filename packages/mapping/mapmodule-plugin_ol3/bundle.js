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
                 * Openlayers 3
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../libraries/ol3/ol-v3.7.0.js"
                },
                /*
                 * Proj4js
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../libraries/Proj4js/proj4js-2.2.1/proj4-src.js"
                },
                /*
                 * Abstract base
                 */


                {
                    "type": "text/javascript",
                    "src": "../../../src/mapping/mapmodule/AbstractMapModule.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../src/mapping/mapmodule/plugin/AbstractMapModulePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../src/mapping/mapmodule/plugin/BasicMapModulePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../src/mapping/mapmodule/AbstractMapLayerPlugin.js"
                },
                /*
                 * map-module
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/ui/module/map-module.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/Plugin.js"
                },
                /**
                 * interactions plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/interactions/InteractionsPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/DisableMapKeyboardMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/DisableMapMouseMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/EnableMapKeyboardMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/EnableMapMouseMovementRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapMovementInteractionsRequestHandler.js"
                }, 
                /*{
                    "type": "text/javascript",
                    "src": "../../../sources/framework/request/common/show-map-measurement-request.js"
                },
                */
                /**
                 * GFI
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/getinfo/GetFeatureInfoHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/GetFeatureInfoRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/GetFeatureInfoActivationRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/getinfo/GetInfoPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/getinfo/GetFeatureInfoFormatter.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/getinfo.css"
                },

                /**
                 * Search plugin
                 */
                 
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/search/SearchPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/framework/search/service/searchservice.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/search.css"
                },
                /**
                 * Logo plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/logo/LogoPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/logoplugin.css"
                },
                /**
                 * Data Source plugin
                 */

                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/datasource/DataSourcePlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/datasource.css"
                },
                // IndexMap
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/indexmap/IndexMapPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/indexmap.css"
                },
                // ScaleBar
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/scalebar/ScaleBarPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/scalebar.css"
                },
                // Markers plugin
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/markers/MarkersPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/AddMarkerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/AddMarkerRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/RemoveMarkersRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/RemoveMarkersRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/AfterAddMarkerEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/AfterRemoveMarkersEvent.js"
                },
                /*
                // FullScreen
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/fullscreen/FullScreen.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/fullscreen.css"
                },

                /**
                 * MapLayer selection plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/layers/LayerSelectionPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/layersselection.css"
                },

                /**
                 * Background MapLayer selection plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/layers/BackgroundLayerSelectionPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/backgroundlayerselection.css"
                },
                /**
                 * Layers plugin
                 */
                
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/layers/LayersPlugin.js"
                }, 

                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapLayerVisibilityRequest.js"
                }, 
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapLayerVisibilityRequestHandler.js"
                }, 

                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapMoveByLayerContentRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapMoveByLayerContentRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/MapLayerVisibilityChangedEvent.js"
                },
                /** Layers backport */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/wmslayer/WmsLayerPlugin.js"
                },
                /**
                 * Vector Layer plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/vectorlayer/VectorLayerPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/vectorlayer/request/AddFeaturesToMapRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/vectorlayer/request/AddFeaturesToMapRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/vectorlayer/request/RemoveFeaturesFromMapRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/vectorlayer/request/RemoveFeaturesFromMapRequestHandler.js"
                },
                /**
                 * GeoLocation plugin
                 */
                 /*
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/location/GeoLocationPlugin.js"
                },
                /**
                 * Draw plugin
                 */
                /*
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/DrawPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/event/AddedFeatureEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/event/FinishedDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/event/SelectedDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/event/ActiveDrawingEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/request/GetGeometryRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/request/GetGeometryRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/request/StartDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/request/StartDrawingRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/request/StopDrawingRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/drawplugin/request/StopDrawingRequestHandler.js"
                },
                /**
                 * Publishertoolbar plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/publishertoolbar/PublisherToolbarPlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/publishertoolbar/request/ToolContainerRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/publishertoolbar/request/ToolContainerRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/publishertoolbar/request/ToolSelectionHandler.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/publishertoolbar.css"
                },
                /**
                 * Realtime plugin
                 */
                /*
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/realtime/RealtimePlugin.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/realtime/event/RefreshLayerEvent.js"
                },
                /**
                 * My Location plugin
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/mylocation/MyLocationPlugin.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/mylocation.css"
                },

                /**
                 * Requests & handlers
                 */
                {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/ToolSelectionRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapLayerUpdateRequest.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapLayerUpdateRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/request/MapMoveRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/MapClickedEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/EscPressedEvent.js"
                }, 
                /*{
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/GetInfoResultEvent.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/event/MapSizeChangedEvent.js"
                }, 
                */{
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/zoombar/Portti2Zoombar.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/porttizoombar.css"
                }, {
                    "type": "text/javascript",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/plugin/panbuttons/PanButtons.js"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/panbuttons.css"
                }, {
                    "type": "text/css",
                    "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/css/mapmodule.css"
                }
                
            ],
            "locales": [{
                // when lang is undefined, loader loads each language file, publisher needs localization for each
                //"lang" : "hy",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/hy.js"
            }, {
                //"lang" : "bg",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/bg.js"
            }, {
                //"lang" : "cs",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/cs.js"
            }, {
                //"lang" : "da",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/da.js"
            }, {
                //"lang" : "de",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/de.js"
            }, {
                //"lang" : "en",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/en.js"
            }, {
                //"lang" : "es",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/es.js"
            }, {
                //"lang" : "et",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/et.js"
            }, {
                //"lang" : "fi",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/fi.js"
            }, {
                //"lang" : "ka",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/ka.js"
            }, {
                //"lang" : "el",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/el.js"
            }, {
                //"lang" : "hr",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/hr.js"
            }, {
                //"lang" : "hu",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/hu.js"
            }, {
                //"lang" : "lv",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/lv.js"
            }, {
                //"lang" : "nl",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/nl.js"
            }, {
                //"lang" : "pl",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/pl.js"
            }, {
                //"lang" : "pt",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/pt.js"
            }, {
                //"lang" : "ro",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/ro.js"
            }, {
                //"lang" : "sr",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/sr.js"
            }, {
                //"lang" : "sl",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/sl.js"
            }, {
                //"lang" : "sk",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/sk.js"
            }, {
                //"lang" : "sq",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/sq.js"
            }, {
                //"lang" : "sv",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/sv.js"
            }, {
                //"lang" : "uk",
                "type": "text/javascript",
                "src": "../../../bundles/mapping/mapmodule-plugin_ol3/resources/locale/uk.js"
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
Oskari.bundle_manager.installBundleClass("mapmodule-plugin_ol3", "Oskari.mapframework.bundle.PluginMapModuleBundle");
