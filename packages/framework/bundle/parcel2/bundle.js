/**
 * @class Oskari.mapframework.bundle.parcel2.ParcelBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel2.ParcelBundle", function() {
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.mapframework.bundle.parcel2.ParcelBundleInstance");
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
			"src" : "../../../../bundles/framework/bundle/parcel2/event/FinishedDrawingEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/event/ParcelHoverEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/event/ParcelChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/event/ParcelSelectedEvent.js"
		},
		/* model */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/model/Parcel.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/model/ParcelCategory.js"
		},
		/* plugin */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/plugin/DrawPlugin.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/plugin/HoverPlugin.js"
		},
		/* request */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/request/StopDrawingRequest.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/request/StartDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/GetGeometryRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/GetGeometryRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/StartDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/StopDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/EditPlaceRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/EditCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/DeleteCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/PublishCategoryRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/request/EditRequestHandler.js"
		},
		/* service */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/service/ParcelService.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/service/ParcelWFSTStore.js"
		},
		/* ui */
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/view/MainView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/view/PlaceForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/view/CategoryForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/ButtonHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/CategoryHandler.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel2/instance.js"
        }, {
           // NOTE! EXTERNAL LIBRARY!
            "type" : "text/javascript",
            "src" : "../../../../libraries/jscolor/jscolor.js"
		},
		// css
		{
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/parcel2/css/parcel.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel2/locale/en.js"
        }
       ]
	},
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "parcel2",
            "Bundle-Name" : "parcel2",
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
Oskari.bundle_manager.installBundleClass("parcel2", "Oskari.mapframework.bundle.parcel2.ParcelBundle");
