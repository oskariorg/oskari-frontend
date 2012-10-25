/**
 * @class Oskari.framework.bundle.parcel.DrawingTool
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.framework.bundle.parcel.DrawingTool",

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
		var inst = Oskari.clazz.create("Oskari.framework.bundle.parcel.DrawingToolInstance");
		return inst;

	},
	/**
	 * @method update
	 * Called by Bundle Manager to provide state information to
	 * bundle
	 */
	"update" : function(manager, bundle, bi, info) {

	}
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {
		"scripts" : [{
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/parcel/css/style.css"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel/instance.js"
		}],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/parcel/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "parcel",
			"Bundle-Name" : "parcel",
			"Bundle-Author" : [{
				"Name" : "ev",
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
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}

		}
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : []

});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("parcel", "Oskari.framework.bundle.parcel.DrawingTool");
