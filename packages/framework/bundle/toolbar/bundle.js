/**
 * @class Oskari.mapframework.bundle.toolbar.ToolbarBundle
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.toolbar.ToolbarBundle", function() {
}, {
	"create" : function() {
    var inst =  Oskari.clazz.create("Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance");
		return inst;
	},
	"update" : function(manager, bundle, bi, info) {
	}
},

/**
 * metadata
 */
{

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/instance.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/button-methods.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/default-buttons.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/request/AddToolButtonRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/request/RemoveToolButtonRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/request/ToolButtonStateRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/request/SelectToolButtonRequest.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/request/ToolButtonRequestHandler.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/request/ShowMapMeasurementRequestHandler.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/event/ToolSelectedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/request/ToolbarRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/toolbar/request/ToolbarRequestHandler.js"
        }, {
			"type" : "text/css",
			"src" : "../../../../resources/framework/bundle/toolbar/css/toolbar.css"
		}],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/locale/en.js"
		}, {
			"lang" : "cs",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/locale/cs.js"
		}, {
			"lang" : "de",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/locale/de.js"
		}, {
			"lang" : "es",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/toolbar/locale/es.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "toolbar",
			"Bundle-Name" : "toolbar",
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
					"Name" : "Toolbar",
					"Title" : "Toolbar"
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
	 * @property {String[]} dependencies
	 */
	"dependencies" : ["jquery"]
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("toolbar", "Oskari.mapframework.bundle.toolbar.ToolbarBundle");
