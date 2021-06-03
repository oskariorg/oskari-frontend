/**
 * @class Oskari.mapframework.bundle.layerlist.LayerListBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerlist.LayerListBundle', function () {

}, {
    'create': function () {
        var me = this;
        var inst = Oskari.clazz.create('Oskari.mapframework.bundle.layerlist.LayerListBundleInstance');

        return inst;
    },
    'update': function (manager, bundle, bi, info) {

    }
}, {
    'protocol': ['Oskari.bundle.Bundle', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
    'source': {
        'scripts': [{
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/instance.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/service/layerlist.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/model/LayerGroup.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/request/ShowFilteredLayerListRequest.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/request/ShowFilteredLayerListRequestHandler.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/request/AddLayerListFilterRequest.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/request/AddLayerListFilterRequestHandler.js'
        },
        {
            'type': 'text/css',
            'src': '../../../bundles/framework/layerlist/resources/scss/style.scss'
        }],

        'locales': [{
            'lang': 'en',
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/resources/locale/en.js'
        }, {
            'lang': 'fi',
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/resources/locale/fi.js'
        }, {
            'lang': 'sv',
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/resources/locale/sv.js'
        }, {
            'lang': 'is',
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/resources/locale/is.js'
        }, {
            'lang': 'is',
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/resources/locale/fr.js'
        }, {
            'lang': 'is',
            'type': 'text/javascript',
            'src': '../../../bundles/framework/layerlist/resources/locale/ru.js'
        }]
    },
    'bundle': {
        'manifest': {
            'Bundle-Identifier': 'layerlist',
            'Bundle-Name': 'layerlist',
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
                    'Name': ' style-1',
                    'Title': ' style-1'
                },
                'en': {}
            },
            'Bundle-Version': '1.0.0',
            'Import-Namespace': ['Oskari', 'jquery'],
            'Import-Bundle': {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    'dependencies': ['jquery']

});

Oskari.bundle_manager.installBundleClass('layerlist', 'Oskari.mapframework.bundle.layerlist.LayerListBundle');
