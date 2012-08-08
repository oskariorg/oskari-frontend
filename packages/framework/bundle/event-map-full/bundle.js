/**
 * @class Oskari.mapframework.event.map.full.Bundle
 */

Oskari.clazz.define("Oskari.mapframework.event.map.full.Bundle",
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
		 * full
		 */
		{
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-generate-html-link-to-map-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-generate-html-print-to-map-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-start-map-publisher-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-draw-polygon-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-draw-selected-polygon-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-select-polygon-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-remove-polygon-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-erase-polygon-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-append-feature-info-event.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../sources/framework/event/common/after-update-hidden-value-event.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "event-map-full",
			"Bundle-Name" : "mapframework.event.map.full.Bundle",
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
					"Name" : " mapframework.event.Bundle",
					"Title" : " mapframework.event.Bundle"
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
Oskari.bundle_manager.installBundleClass("event-map-full", "Oskari.mapframework.event.map.full.Bundle");
