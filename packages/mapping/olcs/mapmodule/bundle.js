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
                },
                /**
                 * mapmodule implementation related plugins
                 */
                 {
                    'type': 'text/javascript',
                    'src': '../../../../bundles/mapping/mapmodule/plugin/layers/LayersPlugin.olcs.js'
                },
                /**
                 * Styles
                 */
                {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/getinfo.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/logoplugin.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/datasource.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/indexmap.ol.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/scalebar.ol.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/fullscreen.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/layersselection.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/backgroundlayerselection.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/vectorlayer.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/publishertoolbar.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/mylocation.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/search.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/mapmodule.ol.scss'
                },
                // Attribution
                {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/attribution.ol.scss'
                }, {
                    'type': 'text/css',
                    'src': '../../../../bundles/mapping/mapmodule/resources/scss/attribution.cs.scss'
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
