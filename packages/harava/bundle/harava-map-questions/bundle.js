/**
 * @class Oskari.harava.bundle.haravaMapQuestions.MapQuestionsBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.harava.bundle.haravaMapQuestions.MapQuestionsBundle", 

function() {

}, {
	"create" : function() {
		var me = this;
		var inst = 
		  Oskari.clazz.create("Oskari.harava.bundle.MapQuestionsBundleInstance");
		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : [ "Oskari.bundle.Bundle",
	               "Oskari.mapframework.bundle.extension.ExtensionBundle" ],
	"source" : {

		"scripts" : [{
				"type" : "text/javascript",
				"src" : "../../../../bundles/harava/bundle/harava-map-questions/instance.js"
			},
			{
	            "type" : "text/javascript",
	            "src" : "../../../../bundles/harava/bundle/harava-map-questions/request/ShowQuestionStepRequest.js"
	        },
	        {
	            "type" : "text/javascript",
	            "src" : "../../../../bundles/harava/bundle/harava-map-questions/request/ShowQuestionStepRequestHandler.js"
	        },
			/* Resources */
			{
				"type" : "text/css",
				"src" : "../../../../resources/harava/bundle/harava-map-questions/css/mapquestions.css"	  
			}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "harava-map-questions",
			"Bundle-Name" : "harava-map-questions",
			"Bundle-Author" : [{
				"Name" : "MK",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2012",
					"End" : "2013"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : 
						  "http://www.paikkatietoikkuna.fi/license"
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
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}

		}
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : [ "jquery" ]

});

Oskari.bundle_manager.installBundleClass("harava-map-questions", 
         "Oskari.harava.bundle.haravaMapQuestions.MapQuestionsBundle");
