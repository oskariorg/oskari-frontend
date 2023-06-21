/**
 * @class Oskari.catalogue.bundle.metadatasearch.MetadataSearchBundle
 *
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadatasearch.MetadataSearchBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.catalogue.bundle.metadatasearch.MetadataSearchBundleInstance");

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

		"scripts" : [
			/* service */
			{
	            "type": "text/javascript",
	            "src": "../../../bundles/catalogue/metadatasearch/service/MetadataOptionService.js"
	        }, {
	            "type": "text/javascript",
	            "src": "../../../bundles/catalogue/metadatasearch/service/MetadataSearchService.js"
	        },
	        /* instance */
	        {
				"type" : "text/javascript",
				"src" : "../../../bundles/catalogue/metadatasearch/instance.js"
			},
		],
		"locales" : [
		{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../bundles/catalogue/metadatasearch/resources/locale/fi.js"
		},{
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../bundles/catalogue/metadatasearch/resources/locale/en.js"
		},{
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../bundles/catalogue/metadatasearch/resources/locale/sv.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "metadatasearch",
			"Bundle-Name" : "catalogue.bundle.metadatasearch",
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

Oskari.bundle_manager.installBundleClass("metadatasearch", "Oskari.catalogue.bundle.metadatasearch.MetadataSearchBundle");
