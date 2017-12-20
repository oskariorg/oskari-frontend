/**
 * @class Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundle',
    function () {}, {
        create: function () {
            return Oskari.clazz.create('Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundleInstance');
        },
        update: function (manager, bundle, bi, info) {}
    }, {
        'protocol': ['Oskari.bundle.Bundle'],
        'source': {
            'scripts': [{
                "type": "text/javascript",
                "expose": "d3",
                "src": "../../../../libraries/d3/d3.min.js"
            }, {
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/view/TerrainFlyout.js'
            }, {
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/view/TerrainPopup.js'
            }, {
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/BundleModule.js'
            }, {
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/instance.js'
            }, {
                "type": "text/css",
                "src": "../../../../bundles/paikkatietoikkuna/terrain-profile/resources/css/terrainprofile.css"
            }],
            'locales': [{
                'lang': 'en',
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/resources/locale/en.js'
            }, {
                'lang': 'fi',
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/resources/locale/fi.js'
            }, {
                'lang': 'sv',
                'type': 'text/javascript',
                'src': '../../../../bundles/paikkatietoikkuna/terrain-profile/resources/locale/sv.js'
            }]
        },
        'bundle': {
            'manifest': {
                'Bundle-Identifier': 'terrain-profile',
                'Bundle-Name': 'terrain-profile',
                'Bundle-Author': [{
                    'Name': 'Jan Wolski',
                    'Organisation': 'Karttakeskus',
                    'Temporal': {
                        'Start': '2017',
                        'End': '2017'
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

                /**
                 *
                 */

            }
        },

        /**
         * @static
         * @property dependencies
         */
        'dependencies': ['jquery']

    });

Oskari.bundle_manager.installBundleClass('terrain-profile', 'Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundle');
