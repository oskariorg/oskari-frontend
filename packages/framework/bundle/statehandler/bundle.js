
/**
 * @class Oskari.framework.bundle.statehandler.StateHandlerBundle
 * Bundle definition for Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.StateHandlerBundle", function() {

}, {
    "create" : function() {

        return Oskari.clazz.create("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance");
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {

        "scripts" : [
		{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/instance.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/state-methods.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/plugin/Plugin.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/plugin/SaveViewPlugin.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/request/SetStateRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/request/SetStateRequestHandler.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/event/StateSavedEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/request/SaveStateRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/statehandler/request/SaveStateRequestHandler.js"
        }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "statehandler",
            "Bundle-Name" : "statehandler",
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
                    "Name" : "statehandler",
                    "Title" : "statehandler"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    }
});
Oskari.bundle_manager.installBundleClass("statehandler", "Oskari.mapframework.bundle.statehandler.StateHandlerBundle");
