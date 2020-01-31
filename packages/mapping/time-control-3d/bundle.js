/**
 * @class Oskari.mapping.time-control-3d.bundle
 *
 * Definition for bundle. See source for details.
 */

Oskari.clazz.define("Oskari.mapping.time-control-3d.bundle", function () {
}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapping.time-control-3d.instance");
    }
}, {

    "protocol": ["Oskari.bundle.Bundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../bundles/mapping/time-control-3d/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../bundles/mapping/time-control-3d/plugin/TimeControl3dPlugin.js"
        }, {
            "type": "text/javascript",
            "src": "../../../bundles/mapping/time-control-3d/tool/TimeControl3dTool.js"
        }, {
            "type": "text/css",
            "src": "../../../bundles/mapping/time-control-3d/resources/scss/style.scss"
        }],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../bundles/mapping/time-control-3d/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../bundles/mapping/time-control-3d/resources/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../bundles/mapping/time-control-3d/resources/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "time-control-3d",
            "Bundle-Name": "time-control-3d",
            "Bundle-Author": [{
                "Name": "",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2019"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery", "react"],
            "Import-Bundle": {}
        }
    },
	/**
	 * @static
	 * @property dependencies
	 */
    "dependencies": ["jquery"]
});

Oskari.bundle_manager.installBundleClass("time-control-3d", "Oskari.mapping.time-control-3d.bundle");
