/**
 * @class Oskari.mapframework.request.map.full.Bundle
 */

Oskari.clazz.define("Oskari.mapframework.request.map.full.Bundle",
/**
 * @constructor
 *
 * Bundle's constructor is called when bundle is created. At
 * this stage bundle sources have been loaded, if bundle is
 * loaded dynamically.
 *
 */
function() {

	/*
	 * Any bundle specific classes may be declared within
	 * constructor to enable stealth mode
	 *
	 * When running within map application framework - Bundle
	 * may refer classes declared with Oskari.clazz.define() -
	 * Bundle may refer classes declared with Ext.define -
	 * Bundle may refer classes declared within OpenLayers
	 * libary
	 *
	 *
	 */
}, {
	/*
	 * @method create
	 *
	 * called when a bundle instance will be created
	 *
	 */
	"create" : function() {

		return null;
	},
	/**
	 * @method update
	 *
	 * Called by Bundle Manager to provide state information to
	 * bundle
	 *
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

		"scripts" : [

		/** map full * */
		{
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/update-hidden-value-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/search-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/generate-html-link-to-map-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/generate-html-print-to-map-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/show-map-measurement-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/draw-polygon-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/draw-selected-polygon-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/select-polygon-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/remove-polygon-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/erase-polygon-request.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "request-map-full",
			"Bundle-Name" : "mapframework.request.map.full.Bundle",
			"Bundle-Tag" : {
				"mapframework" : true
			},

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
					"Name" : " mapframework.request.Bundle",
					"Title" : " mapframework.request.Bundle"
				},
				"en" : {}
			},
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

/**
 * Install this bundle by instantating the Bundle Class
 *
 */
Oskari.bundle_manager.installBundleClass("request-map-full", "Oskari.mapframework.request.map.full.Bundle");
