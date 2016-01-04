/**
* @class Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundle
* 
*/
Oskari.clazz.define("Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundle", function() {
	
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundleInstance");
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
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/framework/selected-featuredata/instance.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/framework/selected-featuredata/Flyout.js"
			},
			{
				"type" : "text/css",
				"src" : "../../../../bundles/framework/selected-featuredata/resources/css/style.css"
			}],

        	"locales": [{
				"lang" : "fi",
				"type" : "text/javascript",
				"src" : "../../../../bundles/framework/selected-featuredata/resources/locale/fi.js"
			},{
				"lang" : "en",
				"type" : "text/javascript",
				"src" : "../../../../bundles/framework/selected-featuredata/resources/locale/en.js"
			},{
				"lang" : "sv",
				"type" : "text/javascript",
				"src" : "../../../../bundles/framework/selected-featuredata/resources/locale/sv.js"
			}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "selected-featuredata",
			"Bundle-Name" : "selected-featuredata",
			"Bundle-Author" : [{
				"Name" : "Dimenteq Oy",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2015",
					"End" : "2015"
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

Oskari.bundle_manager.installBundleClass("selected-featuredata", "Oskari.mapframework.bundle.selected-featuredata.SelectedFeatureDataBundle");