/**
 * @class Oskari.mapping.cameracontrols3d.CameraControls3dBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapping.cameracontrols3d.CameraControls3dBundle", function() {

}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.mapping.cameracontrols3d.instance");
	}
}, {

	"protocol" : ["Oskari.bundle.Bundle"],
	"source" : {
		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/camera-controls-3d/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/camera-controls-3d/plugin/CameraControls3dPlugin.js"
		}],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/camera-controls-3d/resources/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/camera-controls-3d/resources/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../bundles/mapping/camera-controls-3d/resources/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "camera-controls-3d",
			"Bundle-Name" : "camera-controls-3d",
			"Bundle-Author" : [{
				"Name" : "mmldev",
				"Organisation" : "nls.fi",
				"Temporal" : {
					"Start" : "2019"
				},
				"Copyleft": {
					"License": {
						"License-Name": "EUPL"
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

Oskari.bundle_manager.installBundleClass("camera-controls-3d", "Oskari.mapping.cameracontrols3d.CameraControls3dBundle");
