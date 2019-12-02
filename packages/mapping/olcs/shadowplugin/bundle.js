/**
 * @class Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundle
 *
 * Definition for bundle. See source for details.
 */

Oskari.clazz.define("Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundle", function () {
}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundleInstance");
    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../bundles/mapping/shadow-plugin-3d/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../bundles/mapping/shadow-plugin-3d/plugin/ShadowingPluginClass.js"
        }],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../bundles/mapping/shadow-plugin-3d/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../bundles/mapping/shadow-plugin-3d/resources/locale/sv.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../bundles/mapping/shadow-plugin-3d/resources/locale/en.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "shadow-plugin-3d",
            "Bundle-Name": "shadow-plugin-3d",
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

Oskari.bundle_manager.installBundleClass("shadow-plugin-3d", "Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundle");
