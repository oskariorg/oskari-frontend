/**
 * @class Oskari.mapframework.bundle.myviews.MyViewsBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myviews.MyViewsBundle', function() {

}, {
    create : function() {
        var me = this;
        var inst = Oskari.clazz.create('Oskari.mapframework.bundle.myviews.MyViewsBundleInstance');
        return inst;

    },
    update : function(manager, bundle, bi, info) {

    }
}, {

    protocol : [ 'Oskari.bundle.Bundle', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
    source : {

        scripts : [{
            type : 'text/javascript',
            src : '../../../../bundles/framework/bundle/myviews/instance.js'
        }, {
            type : 'text/javascript',
            src : '../../../../libraries/jquery/plugins/jquery.simplemodal.js'
        }, {
            type : 'text/css',
            src : '../../../../resources/framework/bundle/myviews/myviews.css'       
        }],
        
        locales : [
/*
        {
            lang : 'fi',
            type : 'text/javascript',
            src : '../../../../bundles/framework/bundle/myviews/locale/fi.js'
        }, {
            lang : 'sv',
            type : 'text/javascript',
            src : '../../../../bundles/framework/bundle/myviews/locale/sv.js'
        }, {
            lang : 'en',
            type : 'text/javascript',
            src : '../../../../bundles/framework/bundle/myviews/locale/en.js'
        }
*/        
        ]
    },
    bundle : {
        manifest : {
            'Bundle-Identifier' : 'myviews',
            'Bundle-Name' : 'myviews',
            'Bundle-Author' : [{
                'Name' : 'ah',
                'Organisation' : 'nls.fi',
                'Temporal' : {
                    'Start' : '2009',
                    'End' : '2011'
                },
                'Copyleft' : {
                    'License' : {
                        'License-Name' : 'EUPL',
                        'License-Online-Resource' : 'http://www.paikkatietoikkuna.fi/license'
                    }
                }
            }],
            'Bundle-Name-Locale' : {
                'fi' : {
                    'Name' : ' style-1',
                    'Title' : ' style-1'
                },
                'en' : {}
            },
            'Bundle-Version' : '1.0.0',
            'Import-Namespace' : [ 'Oskari' ],
            'Import-Bundle' : {}
        }
    },

    /**
     * @static
     * @property yuilibrary
     *
     * yuilibrary dependencies for this bundle (TBD)
     */
    dependencies : [ 'jquery' ]

});

Oskari.bundle_manager.installBundleClass('myviews', 
                                         'Oskari.mapframework.bundle.myviews.MyViewsBundle');
