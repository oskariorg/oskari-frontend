/**
 * @class Oskari.mapframework.bundle.parcel.DrawingTool
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.DrawingTool",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
	/*
	 * @method create
	 * called when a bundle instance will be created
	 */
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.DrawingToolInstance");
		return inst;

	},
	/**
	 * @method update
	 * Called by Bundle Manager to provide state information to
	 * bundle
	 */
	"update" : function(manager, bundle, bi, info) {
        manager.alert("RECEIVED update notification " + info);
	}
},

/**
 * metadata
 */
{
    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {
        "scripts" : [
        /* event */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/event/FinishedDrawingEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/event/ParcelChangedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/event/ParcelSelectedEvent.js"
        },
        /* plugin */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/plugin/DrawPlugin.js"
        },
        /* request */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/request/SaveDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/request/StopDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/request/StartDrawingRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/request/SaveDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/request/StopDrawingRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/request/StartDrawingRequestHandler.js"
        },
        /* service */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/service/ParcelService.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/service/ParcelWfst.js"
        },
        /* ui */
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/view/MainView.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/view/PlaceForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/handler/ButtonHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/handler/ParcelSelectorHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/instance.js"
        }, {
           // NOTE! EXTERNAL LIBRARY!
            "type" : "text/javascript",
            "src" : "../../../../libraries/jscolor/jscolor.js"
        },
        // css
        {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/parcel/css/style.css"
        },         {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/parcel/css/icons.css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/parcel/locale/fi.js"
        }
       ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "parcel",
            "Bundle-Name" : "parcel",
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
                }
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

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("parcel", "Oskari.mapframework.bundle.parcel.DrawingTool");
