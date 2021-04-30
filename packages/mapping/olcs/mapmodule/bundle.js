/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundle
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.PluginMapModuleBundle',
    function () {},
    {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        'create': function () {
            return this;
        },
        'update': function (manager, bundle, bi, info) {
            manager.alert('RECEIVED update notification ' + info);
        }
    },

    /**
     * metadata
     */
    {

        'protocol': ['Oskari.bundle.Bundle', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
        'source': {

            'scripts': [
                /*
                 * map-module
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/mapmodule.olcs.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/Plugin.js'
                },
                /**
                 * controls plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/controls/ControlsPlugin.ol.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/DisableMapKeyboardMovementRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/DisableMapMouseMovementRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/EnableMapKeyboardMovementRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/EnableMapMouseMovementRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/MapMovementControlsRequestHandler.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/ShowMapMeasurementRequest.js'
                },
                /**
                 * GFI
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/getinfo/GetFeatureInfoHandler.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/GetFeatureInfoRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/GetFeatureInfoActivationRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/getinfo/GetInfoPlugin.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/getinfo/GetFeatureInfoFormatter.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/getinfo/request/ResultHandlerRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/getinfo/request/ResultHandlerRequestHandler.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/getinfo.scss'
                },
                // AnnouncementsPlugin
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/announcements/AnnouncementsPlugin.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/announcementsplugin.ol.scss'
                },

                /**
                 * Search plugin
                 */

                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/search/SearchPlugin.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/service/search/searchservice.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/service/search/event/SearchResultEvent.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/service/search/request/SearchRequest.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/search.scss'
                },
                /**
                 * Logo plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/logo/LogoPlugin.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/logo/DataProviderInfoService.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/logo/logo.service.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/logoplugin.scss'
                },
                /**
                 * Data Source plugin
                 */

                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/datasource/DataSourcePlugin.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/datasource.scss'
                },
                // IndexMap
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/indexmap/IndexMapPlugin.ol.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/indexmap.ol.scss'
                },
                // ScaleBar
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/scalebar/ScaleBarPlugin.ol.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/scalebar.ol.scss'
                },
                // Attribution
                {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/attribution.ol.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/attribution.cs.scss'
                },
                // Markers plugin
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/markers/MarkersPlugin.ol.js'
                },
                // FullScreen
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/fullscreen/FullScreen.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/ToggleFullScreenControlRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/ToggleFullScreenControlRequestHandler.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/fullscreen.scss'
                },

                /**
                 * MapLayer selection plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/layers/LayerSelectionPlugin.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/layersselection.scss'
                },

                /**
                 * Background MapLayer selection plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/layers/BackgroundLayerSelectionPlugin.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/backgroundlayerselection.scss'
                },
                /**
                 * Layers plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/layers/LayersPlugin.olcs.js'
                },

                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/MapLayerVisibilityRequest.js'
                },
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/MapLayerVisibilityRequestHandler.ol.js'
                },

                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/MapMoveByLayerContentRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/request/MapMoveByLayerContentRequestHandler.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/event/MapLayerVisibilityChangedEvent.js'
                },
                /** Layers backport */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/wmslayer/WmsLayerPlugin.ol.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/wmslayer/wmslayer.js'
                },
                /**
                 * Vector Layer plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/vectorlayer/VectorLayerPlugin.ol.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/vectorlayer.scss'
                },
                /**
                 * Vector tiles
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/vectortilelayer/VectorTileLayer.js'
                },
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/vectortilelayer/VectorTileLayerPlugin.js'
                },
                /**
                 * Bing maps
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/bingmapslayer/BingMapsLayer.js'
                },
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/bingmapslayer/BingMapsLayerPlugin.js'
                },
                /**
                 * GeoLocation plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/location/GeoLocationPlugin.js'
                },
                /**
                 * Publishertoolbar plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/publishertoolbar/PublisherToolbarPlugin.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/publishertoolbar/request/ToolContainerRequest.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/publishertoolbar/request/ToolContainerRequestHandler.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/publishertoolbar.scss'
                },
                /**
                 * Realtime plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/realtime/RealtimePlugin.js'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/realtime/event/RefreshLayerEvent.js'
                },
                /**
                 * My Location plugin
                 */
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/mylocation/MyLocationPlugin.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/mylocation.scss'
                },

                // Announcements plugin
                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/announcements/AnnouncementsPlugin.js'
                },

                {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/zoombar/Portti2Zoombar.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/porttizoombar.scss'
                }, {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/panbuttons/PanButtons.js'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/panbuttons.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/mapmodule.ol.scss'
                }

            ],
            'locales': [{
                'lang': 'hy',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/hy.js'
            }, {
                'lang': 'bg',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/bg.js'
            }, {
                'lang': 'cs',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/cs.js'
            }, {
                'lang': 'da',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/da.js'
            }, {
                'lang': 'de',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/de.js'
            }, {
                'lang': 'en',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/en.js'
            }, {
                'lang': 'es',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/es.js'
            }, {
                'lang': 'et',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/et.js'
            }, {
                'lang': 'fi',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/fi.js'
            }, {
                'lang': 'fr',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/fr.js'
            }, {
                'lang': 'ka',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/ka.js'
            }, {
                'lang': 'el',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/el.js'
            }, {
                'lang': 'hr',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/hr.js'
            }, {
                'lang': 'hu',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/hu.js'
            }, {
                'lang': 'is',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/is.js'
            }, {
                'lang': 'it',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/it.js'
            }, {
                'lang': 'lv',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/lv.js'
            }, {
                'lang': 'nl',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/nl.js'
            }, {
                'lang': 'nb',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/nb.js'
            }, {
                'lang': 'nn',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/nn.js'
            }, {
                'lang': 'pl',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/pl.js'
            }, {
                'lang': 'pt',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/pt.js'
            }, {
                'lang': 'ro',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/ro.js'
            }, {
                'lang': 'sr',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/sr.js'
            }, {
                'lang': 'sl',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/sl.js'
            }, {
                'lang': 'sk',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/sk.js'
            }, {
                'lang': 'sq',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/sq.js'
            }, {
                'lang': 'sv',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/sv.js'
            }, {
                'lang': 'uk',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/uk.js'
            }, {
                'lang': 'ru',
                'type': 'text/javascript',
                'src': '../../../../bundles/mapping/mapmodule/resources/locale/ru.js'
            }]
        },
        'bundle': {
            'manifest': {
                'Bundle-Identifier': 'mapmodule-plugin',
                'Bundle-Name': 'mapmodule',
                'Bundle-Tag': {
                    'mapframework': true
                },

                'Bundle-Icon': {
                    'href': 'icon.png'
                },
                'Bundle-Author': [{
                    'Name': 'jjk',
                    'Organisation': 'nls.fi',
                    'Temporal': {
                        'Start': '2009',
                        'End': '2011'
                    },
                    'Copyleft': {
                        'License': {
                            'License-Name': 'EUPL',
                            'License-Online-Resource': 'http://www.paikkatietoikkuna.fi/license'
                        }
                    }
                }],
                'Bundle-Name-Locale': {
                    'fi': {
                        'Name': 'Kartta',
                        'Title': 'Kartta'
                    },
                    'en': {}
                },
                'Bundle-Version': '1.0.0',
                'Import-Namespace': ['Oskari', 'Ext', 'OpenLayers']
            }
        }
    }
);

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass('mapmodule', 'Oskari.mapframework.bundle.PluginMapModuleBundle');
