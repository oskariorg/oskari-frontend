/**
 * @class Oskari.framework.bundle.postprocessor.PostProcessorBundle
 *
 * Used for highlighting wfs features on pageload etc. Calls other bundles to accomplish stuff 
 * after everything has been loaded and started.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.postprocessor.PostProcessorBundle", function() {

}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance");
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {
		"scripts" : [
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/postprocessor/instance.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "postprocessor",
			"Bundle-Name" : "postprocessor",
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

Oskari.bundle_manager.installBundleClass("postprocessor", "Oskari.mapframework.bundle.postprocessor.PostProcessorBundle");
