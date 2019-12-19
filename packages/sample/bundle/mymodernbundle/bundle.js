/**
 * Example on How to create your own bundle.
 *
 * @module SimpleBundle
 * @see SimpleBundleInstance
 * @example <caption>Try it out with your application!</caption>
 * // Import the bundle in your application's main.js.
 * import 'oskari-loader!oskari-frontend/packages/sample/bundle/mymodernbundle/bundle.js';
 * 
 * // Tweak the appSetup in your application's index.js / entry point.
 * // Add mymodernbundle to startupSequence.
 * jQuery(document).ready(function() {
 *     function errorCb() { }
 *     function successCb() { }
 *     function modifyCb(appSetup) {
 *         appSetup.startupSequence.push({ bundlename : 'mymodernbundle' });
 *     }
 *     Oskari.app.loadAppSetup(ajaxUrl + 'action_route=GetAppSetup', window.controlParams, errorCb, successCb, modifyCb);
 * });
 */

/**
 * @class SimpleBundle
 * @global
 * @hideconstructor
 * @classdesc
 * To be imported in application main.js.
 * Definition for the bundle. See source for details.
 * 
 * @see SimpleBundleInstance
 */
Oskari.clazz.define('Oskari.sample.bundle.mymodernbundle.SimpleBundle',
    function() {

    },
    {
        /**
         * Called automatically on construction.
         * @memberof SimpleBundle
         * @returns {SimpleBundleInstance} Bundle instance
         */
        create : function() {
            return Oskari.clazz.create('Oskari.sample.bundle.mymodernbundle.SimpleBundleInstance');
        },
        /**
         * @memberof SimpleBundle
         */
        update : function(manager, bundle, bi, info) {

        }
    },
    {
        protocol : [ 'Oskari.bundle.Bundle' ],
        source : {
            scripts : [{
                type : 'text/javascript',
                src : '../../../../bundles/sample/mymodernbundle/instance.js'
            }]
        },
        bundle : {
            manifest : {
                'Bundle-Identifier' : 'mymodernbundle',
                'Bundle-Name' : 'mymodernbundle',
                'Bundle-Author' : [{
                    'Name' : 'jh',
                    'Organisation' : 'nls.fi',
                    'Temporal' : {
                        'Start' : '2019',
                        'End' : '2019'
                    },
                    'Copyleft' : {
                        'License' : {
                            'License-Name' : 'EUPL',
                            'License-Online-Resource': 'http://www.paikkatietoikkuna.fi/license'
                        }
                    }
                }],
                'Bundle-Version' : '1.0.0',
                'Import-Namespace' : ['Oskari'],
                'Import-Bundle' : {}
            }
        },
        dependencies : []
    }
);

Oskari.bundle_manager.installBundleClass('mymodernbundle', 'Oskari.sample.bundle.mymodernbundle.SimpleBundle');