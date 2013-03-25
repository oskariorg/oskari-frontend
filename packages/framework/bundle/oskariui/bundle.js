/**
 * @class Oskari.mapframework.bundle.oskariui.OskariUIBundle
 *
 * Applies required jquery-ui-components to app
 * Adds Dom Manager for managing external DOM references.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.oskariui.OskariUIBundle", function() {
	this.conf = {};
}, {
	"create" : function() {


		return this;

	},
	"update" : function(manager, bundle, bi, info) {

	},
	"start" : function() {
		/* We'll add our own Dom Manager */
		var partsMap = this.conf.partsMap || {};
		var domMgr = Oskari.clazz.create('Oskari.framework.bundle.oskariui.DomManager', jQuery, partsMap);
		Oskari.setDomManager(domMgr);

	},
	"stop" : function() {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/oskariui/jquery-ui-1.9.1.custom.min.js"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/oskariui/css/jquery-ui-1.9.1.custom.css"
		}, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/oskariui/bootstrap-grid.css"
		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/oskariui/DomManager.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/oskariui/Layout.js"
		}/*, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/oskariui/css/layout-grid.css"
		}*/],

		"locales" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "oskariui",
			"Bundle-Name" : "oskariui",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2012"
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

Oskari.bundle_manager.installBundleClass("oskariui", "Oskari.mapframework.bundle.oskariui.OskariUIBundle");
