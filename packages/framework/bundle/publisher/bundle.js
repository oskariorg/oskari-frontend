/**
 * @class Oskari.mapframework.bundle.publisher.PublisherBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publisher.PublisherBundle", function() {

}, {
	"create" : function() {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.publisher.PublisherBundleInstance");

		return inst;

	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
		{
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/Flyout.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/Tile.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/event/MapPublishedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/event/ToolStyleChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/event/ColourSchemeChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/event/FontChangedEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/event/LayerToolsEditModeEvent.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/view/NotLoggedIn.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/view/StartView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/view/BasicPublisher.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/view/PublisherLocationForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/view/PublisherToolsForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/view/PublisherLayerForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/view/PublisherLayoutForm.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../resources/framework/bundle/publisher/css/style.css"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/request/PublishMapEditorRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/publisher/request/PublishMapEditorRequestHandler.js"
        }],

		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/locale/en.js"
		}, {
			"lang" : "cs",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/locale/cs.js"
		}, {
			"lang" : "de",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/locale/de.js"
		}, {
			"lang" : "es",
			"type" : "text/javascript",
			"src" : "../../../../bundles/framework/bundle/publisher/locale/es.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "publisher",
			"Bundle-Name" : "publisher",
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

Oskari.bundle_manager.installBundleClass("publisher", "Oskari.mapframework.bundle.publisher.PublisherBundle");
