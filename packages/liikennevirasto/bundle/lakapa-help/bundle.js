
/**
 * @class Oskari.liikennevirasto.bundle.lakapa.HelpBundle
 * 
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.HelpBundle", function() {

}, {
	"create" : function() {

		return Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.HelpFlyoutBundleInstance");

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
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/instance.js"

		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/Flyout.js"
		}, 
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/Tile.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/request/TransportChangedRequest.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/request/TransportChangedRequestHandler.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/request/ChangeLanguageRequest.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/request/ChangeLanguageRequestHandler.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/request/ShowHelpRequest.js"
		},
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/request/ShowHelpRequestHandler.js"
		},
		{
			"type" : "text/css",
			"src" : "../../../../bundles/liikennevirasto/bundle/lakapa-help/resources/css/style.css"
		}, 
		{
			"language" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/resources/locale/fi.js"
		},{
			"language" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/resources/locale/en.js"
		},{
			"language" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/liikennevirasto/lakapa-help/resources/locale/sv.js"
		}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "lakapa-help",
			"Bundle-Name" : "lakapa-help",
			"Bundle-Author" : [{
				"Name" : "Marko Kuosmanen",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2014",
					"End" : "2014"
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

Oskari.bundle_manager.installBundleClass("lakapa-help", "Oskari.liikennevirasto.bundle.lakapa.HelpBundle");
