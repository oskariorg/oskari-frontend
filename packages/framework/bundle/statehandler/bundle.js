
/**
 * @class Oskari.mapframework.bundle.statehandler.StateHandlerBundle
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
            "src" : "../../../../bundles/framework/statehandler/instance.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../libraries/jquery/plugins/jquery.cookie.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/state-methods.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/session-methods.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/plugin/Plugin.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/plugin/SaveViewPlugin.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/request/SetStateRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/request/SetStateRequestHandler.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/event/StateSavedEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/request/SaveStateRequest.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/statehandler/request/SaveStateRequestHandler.js"
        }
        ],

        "locales" : [
        {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/fr.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/it.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/is.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/nn.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/sl.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/sv.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/statehandler/resources/locale/sk.js"
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
