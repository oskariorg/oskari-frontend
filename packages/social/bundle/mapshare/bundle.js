
/**
 * @class Oskari.social.bundle.mapshare.MapShareBundle
 * 
 */
Oskari.clazz.define("Oskari.social.bundle.mapshare.MapShareBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.social.bundle.mapshare.MapShareBundleInstance");

	},
	"start" : function() {
	},
	"stop" : function() {
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/social/bundle/mapshare/instance.js"

		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/social/bundle/mapshare/Flyout.js"

		},{
			"type" : "text/javascript",
			"src" : "../../../../bundles/social/bundle/mapshare/Tile.js"

		}, {
			"type" : "text/css",
			"src" : "../../../../resources/social/bundle/mapshare/css/style.css"
		}], 
		"locales" : [  
		{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/social/bundle/mapshare/locale/fi.js"
		},{
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/social/bundle/mapshare/locale/en.js"
		},{
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/social/bundle/mapshare/locale/sv.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "mapshare",
			"Bundle-Name" : "social.bundle.mapshare",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2012",
					"End" : "2012"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],			
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("mapshare", "Oskari.social.bundle.mapshare.MapShareBundle");
