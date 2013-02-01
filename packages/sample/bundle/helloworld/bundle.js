/**
 * @class Oskari.sample.bundle.helloworld.FlyoutHelloWorldBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.sample.bundle.helloworld.HelloWorldBundle",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        var me = this;
        
        /* this would be enough when only flyout will be implemented */
        /*
        var inst = Oskari.clazz.create("Oskari.userinterface.extension.DefaultExtension",
            'helloworld',
            "Oskari.sample.bundle.helloworld.HelloWorldFlyout"
            );
        */

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.sample.bundle.helloworld.HelloWorldBundleInstance",
            'helloworld',
            "Oskari.sample.bundle.helloworld.HelloWorldFlyout"
            );

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/helloworld/instance.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/helloworld/Flyout.js"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/helloworld/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/helloworld/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/sample/bundle/helloworld/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "helloworld",
            "Bundle-Name" : "helloworld",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2013",
                    "End" : "2013"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],        
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}

        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("helloworld", "Oskari.sample.bundle.helloworld.HelloWorldBundle");
