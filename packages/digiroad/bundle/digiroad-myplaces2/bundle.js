/**
 * @class Oskari.digiroad.bundle.myplaces2.MyPlacesBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.digiroad.bundle.myplaces2.MyPlacesBundle", function() {
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.digiroad.bundle.myplaces2.MyPlacesBundleInstance");
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
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/FinishedDrawingEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/MyPlaceHoverEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/MyPlacesChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/MyPlaceSelectedEvent.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/EditedFeaturesLoadedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/FeedbackLoadedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/event/NewRestrictionsLoadedEvent.js"
        },
		/* model */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/model/MyPlace.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/model/MyPlacesCategory.js"
		},
		/* plugin */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/plugin/DrawPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/plugin/HoverPlugin.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/plugin/TurningRestrictionsPlugin.js"
        },
		/* request */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/StopDrawingRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/StartDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/GetGeometryRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/GetGeometryRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/StartDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/StopDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/EditPlaceRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/EditCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/DeleteCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/PublishCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/EditRequestHandler.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/FinishRestrictionRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/FinishRestrictionRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/StartRestrictionRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/request/StartRestrictionRequestHandler.js"
        },
		/* service */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/service/MyPlacesService.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/service/MyPlacesWFSTStore.js"
		},
		/* ui */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/view/MainView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/view/PlaceForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/view/CategoryForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/view/FeedbackForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/ButtonHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/CategoryHandler.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/instance.js"
        }, {
           // NOTE! EXTERNAL LIBRARY!
            "type" : "text/javascript",
            "src" : "../../../../libraries/jscolor/jscolor.js"
		},
		// css
		{
            "type" : "text/css",
            "src" : "../../../../resources/digiroad/bundle/digiroad-myplaces2/css/myplaces.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-myplaces2/locale/en.js"
        }
       ]
	},
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "digiroad-myplaces2",
            "Bundle-Name" : "digiroad-myplaces2",
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
Oskari.bundle_manager.installBundleClass("digiroad-myplaces2", "Oskari.digiroad.bundle.myplaces2.MyPlacesBundle");
