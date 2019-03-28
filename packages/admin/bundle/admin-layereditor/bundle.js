
Oskari.clazz.define("Oskari.admin.admin-layereditor.bundle", function () {

}, {
        "create": function () {
            return Oskari.clazz.create("Oskari.admin.admin-layereditor.instance");
        },
        "update": function (manager, bundle, bi, info) {

        }
    }, {

        "protocol": ["Oskari.bundle.Bundle"],
        "source": {

            "scripts": [{
                "src": "../../../../bundles/admin/admin-layereditor/instance.js"
            },
			{
                "type": "text/css",
                "src": "../../../../bundles/admin/admin-layereditor/resources/scss/style.scss"
            }],
            "locales": [{
                "lang": "en",
                "src": "../../../../bundles/admin/admin-layereditor/resources/locale/en.js"
            },
			{
                "lang": "fi",
                "src": "../../../../bundles/admin/admin-layereditor/resources/locale/fi.js"
            },
			{
                "lang": "sv",
                "src": "../../../../bundles/admin/admin-layereditor/resources/locale/sv.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "admin-layereditor",
                "Bundle-Name": "admin-layereditor",
                "Bundle-Author": [{
                    "Name": "mmldev",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2019",
                        "End": "?"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL"
                        }
                    }
                }]
            }
        }
    });
Oskari.bundle_manager.installBundleClass("admin-layereditor", "Oskari.admin.admin-layereditor.bundle");