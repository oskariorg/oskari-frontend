/**
 * @class Oskari.mapframework.domain.Bundle
 *
 */
Oskari.clazz.define("Oskari.mapframework.domain.Bundle",
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
			"src" : "../../../../sources/framework/domain/wmslayer.js"
/*		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/wfslayer.js" */
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/vectorlayer.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/map.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/style.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/polygon.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/tooltip.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/wizard-options.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/wizard-step.js"
/*		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/wfs-tile-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/wfs-grid-scheduled-request.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/QueuedTile.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/TileQueue.js" */
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/domain/user.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "domain",
			"Bundle-Name" : "mapframework.domain.Bundle",
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
					"Name" : " mapframework.domain.Bundle",
					"Title" : " mapframework.domain.Bundle"
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
Oskari.bundle_manager.installBundleClass("domain", "Oskari.mapframework.domain.Bundle");
