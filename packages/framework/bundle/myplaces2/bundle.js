/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.MyPlacesBundle", function() {
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance");
	},
	"update" : function(manager, bundle, bi, info) {
		manager.alert("RECEIVED update notification " + info);
	}
},
{
	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {
		"scripts" : [
		/* event */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/event/FinishedDrawingEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/event/AddedFeatureEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/event/MyPlaceHoverEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/event/MyPlacesChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/event/MyPlaceSelectedEvent.js"
		},
		/* model */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/model/MyPlace.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/model/MyPlacesCategory.js"
		},
		/* plugin */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/plugin/DrawPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/plugin/HoverPlugin.js"
		},
		/* request */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/request/StopDrawingRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/request/StartDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/GetGeometryRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/GetGeometryRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/StartDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/StopDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/EditPlaceRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/EditCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/DeleteCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/PublishCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/request/EditRequestHandler.js"
		},
		/* service */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/service/MyPlacesService.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/service/MyPlacesWFSTStore.js"
		},
		/* ui */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/view/MainView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/view/PlaceForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/view/CategoryForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/ButtonHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/CategoryHandler.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/myplaces2/instance.js"
        }, {
           // NOTE! EXTERNAL LIBRARY!
            "type" : "text/javascript",
            "src" : "../../../../libraries/jscolor/jscolor.js"
		},
		// css
		{
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/myplaces2/css/myplaces.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/locale/en.js"
        }, {
            "lang" : "cs",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/locale/cs.js"
        }, {
            "lang" : "de",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/locale/de.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/myplaces2/locale/es.js"
        }
       ]
	},
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "myplaces2",
            "Bundle-Name" : "myplaces2",
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
                    "Name" : " style-1",
                    "Title" : " style-1"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("myplaces2", "Oskari.mapframework.bundle.myplaces2.MyPlacesBundle");
