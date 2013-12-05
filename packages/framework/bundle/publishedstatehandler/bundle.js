
/**
 * @class Oskari.mapframework.bundle.statehandler.StateHandlerBundle
 * Bundle definition for Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publishedstatehandler.PublishedStateHandlerBundle", function() {

}, {
    "create" : function() {

        return Oskari.clazz.create("Oskari.mapframework.bundle.publishedstatehandler.PublishedStateHandlerBundleInstance");
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {

        "scripts" : [
		{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publishedstatehandler/instance.js"
        }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "publishedstatehandler",
            "Bundle-Name" : "publishedstatehandler",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2009",
                    "End" : "2011"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : "publishedstatehandler",
                    "Title" : "publishedstatehandler"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    }
});
Oskari.bundle_manager.installBundleClass("publishedstatehandler", "Oskari.mapframework.bundle.publishedstatehandler.PublishedStateHandlerBundle");
/*
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publishedstatehandler/state-methods.js"
*/