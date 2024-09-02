/**
 * @class Oskari.statistics.statsgrid.StatsGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.StatsGridBundle',
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

    }, {
        'create': function () {
            return Oskari.clazz.create('Oskari.statistics.statsgrid.StatsGridBundleInstance',
                'statsgrid');
        }
    }, {
        'protocol': ['Oskari.bundle.Bundle', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
        'source': {
            'scripts': [{
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/instance.js'
            }],
            'locales': [{
                'lang': 'en',
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/resources/locale/en.js'
            }, {
                'lang': 'fi',
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/resources/locale/fi.js'
            }, {
                'lang': 'fr',
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/resources/locale/fr.js'
            }, {
                'lang': 'sv',
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/resources/locale/sv.js'
            }, {
                'lang': 'ru',
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/resources/locale/ru.js'
            }, {
                'lang': 'is',
                'type': 'text/javascript',
                'src': '../../../bundles/statistics/statsgrid/resources/locale/is.js'
            }]
        },
        'bundle': {
            'manifest': {
                'Bundle-Identifier': 'statsgrid',
                'Bundle-Name': 'statsgrid',
                'Bundle-Author': [{
                    'Name': 'jjk',
                    'Organisatpation': 'nls.fi',
                    'Temporal': {
                        'Start': '2013',
                        'End': '2013'
                    },
                    'Copyleft': {
                        'License': {
                            'License-Name': 'EUPL',
                            'License-Online-Resource': 'http://www.paikkatietoikkuna.fi/license'
                        }
                    }
                }],
                'Bundle-Verspation': '1.0.0',
                'Import-Namespace': ['Oskari'],
                'Import-Bundle': {}
            }
        },

        /**
         * @static
         * @property dependencies
         */
        'dependencies': ['jquery']

    });

Oskari.bundle_manager.installBundleClass('statsgrid', 'Oskari.statistics.statsgrid.StatsGridBundle');
