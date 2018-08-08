/**
 * @class Oskari.map3dtiles.bundle.tiles3d.Map3DTilesBundle
 */
Oskari.clazz.define('Oskari.map3dtiles.bundle.tiles3d.Map3DTilesBundle', function () {
}, {
    /*
    * implementation for protocol 'Oskari.bundle.Bundle'
    */
    'create': function () {
        return null;
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
        'scripts': [{
            'type': 'text/javascript',
            'src': '../../../../bundles/paikkatietoikkuna/tiles3d/domain/Tiles3DLayer.js'
        }, {
            'type': 'text/javascript',
            'src': '../../../../bundles/paikkatietoikkuna/tiles3d/plugin/Tiles3DLayerPlugin.js'
        }]
    },
    'bundle': {
        'manifest': {
            'Bundle-Identifier': 'map3dtiles',
            'Bundle-Name': 'map3dtiles',
            'Bundle-Tag': {
                'mapframework': true
            },
            'Bundle-Icon': {
                'href': 'icon.png'
            },
            'Bundle-Author': [{
                'Name': 'hjh',
                'Organisation': 'nls.fi',
                'Temporal': {
                    'Start': '2018',
                    'End': '2020'
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
                    'Name': '3DTiles',
                    'Title': '3DTiles'
                },
                'en': {}
            },
            'Bundle-Version': '1.0.0',
            'Import-Namespace': ['Oskari']
        }
    }
});

Oskari.bundle_manager.installBundleClass('map3dtiles', 'Oskari.map3dtiles.bundle.tiles3d.Map3DTilesBundle');
