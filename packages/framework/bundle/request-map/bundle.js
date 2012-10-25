/**
 * @class Oskari.mapframework.request.map.Bundle
 *
 */
Oskari.clazz.define("Oskari.mapframework.request.map.Bundle",
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

		/**
		 * map
		 */
		/*{
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/disable-map-keyboard-movement-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/enable-map-keyboard-movement-request.js"
		}, */ 
		{
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/add-map-layer-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/remove-map-layer-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/map-move-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/show-map-layer-info-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/hide-map-marker-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/ctrl-key-down-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/request/common/ctrl-key-up-request.js"
		}
		],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "request-map",
			"Bundle-Name" : "mapframework.request.map.Bundle",
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
Oskari.bundle_manager.installBundleClass("request-map", "Oskari.mapframework.request.map.Bundle");
