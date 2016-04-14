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

		"scripts" : [
		{
			"type" : "text/javascript",
			"src" : "../../../../libraries/jquery/jquery-ui-1.9.2.custom.min.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../libraries/jquery/plugins/jquery.base64.min.js"
		},{
			"type" : "text/css",
			"src" : "../../../../bundles/framework/oskariui/resources/css/jquery-ui-1.9.2.custom.css"
		},{
			"type" : "text/css",
			"src" : "../../../../bundles/framework/oskariui/resources/bootstrap-grid.css"
        },{
            "type" : "text/javascript",
            "expose" : "_",
            "src" : "../../../../libraries/lodash/2.3.0/lodash.js"
        },{
            "type" : "text/css",
            "src" : "../../../../libraries/Clusterize.js-0.12.0/clusterize.css"
        },{
            "type" : "text/javascript",
            "expose" : "clusterize",
            "src" : "../../../../libraries/Clusterize.js-0.12.0/clusterize.js"
		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/oskariui/DomManager.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/oskariui/Layout.js"
		}],
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
	"dependencies" : ["jquery", "bb", "backbone"]

});

Oskari.bundle_manager.installBundleClass("oskariui", "Oskari.mapframework.bundle.oskariui.OskariUIBundle");
