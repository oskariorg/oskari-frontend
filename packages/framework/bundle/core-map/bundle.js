/**
 * @class Oskari.mapframework.core.map.Bundle
 *
 */
Oskari.clazz.define("Oskari.mapframework.core.map.Bundle",
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

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/core/core-feature-info-methods.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/core/core-map-layer-methods.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/core/core-map-methods.js"
		}

		/*
		 * { "type" : "text/javascript", "src" :
		 * "../../../../sources/framework/core/core-search-methods.js" },
		 */
		/*
		 * { "type" : "text/javascript", "src" :
		 * "../../../../sources/framework/core/core-wizard-methods.js" },
		 */
		/*
		 * { "type" : "text/javascript", "src" :
		 * "../../../../sources/framework/core/core-mapasker-methods.js" },
		 */
		/*
		 * { "type" : "text/javascript", "src" :
		 * "../../../../sources/framework/core/core-net-service-center-methods.js" },
		 */
		/*
		 * { "type" : "text/javascript", "src" :
		 * "../../../../sources/framework/core/core-status-methods.js" },
		 */
		/*
		 * { "type" : "text/javascript", "src" :
		 * "../../../../sources/framework/core/wfs-request-tiler.js" },
		 */
		],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "core-map",
			"Bundle-Name" : "mapframework.core.map.Bundle",
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
					"Name" : " mapframework.core.Bundle",
					"Title" : " mapframework.core.Bundle"
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
Oskari.bundle_manager.installBundleClass("core-map", "Oskari.mapframework.core.map.Bundle");
