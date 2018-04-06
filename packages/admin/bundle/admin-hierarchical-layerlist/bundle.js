/**
 * @class Oskari.admin.bundle.metrics.MetricsAdminBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.HierarchicalLayerListBundle",
    /**
     * @method create called automatically on construction
     * @static
     */
    function() {

    }, {
        "create": function() {
            var me = this;

            /* or this if you want to tailor instance also */
            var inst = Oskari.clazz.create("Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance");

            return inst;

        },
        "update": function(manager, bundle, bi, info) {

        }
    }, {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {
            "scripts": [
            {
                "type": "text/javascript",
                "src": "../../../../bundles/admin/admin-hierarchical-layerlist/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/admin/admin-hierarchical-layerlist/components/Group.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/admin/admin-hierarchical-layerlist/components/Layer.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/admin/admin-hierarchical-layerlist/resources/css/style.css"
            }],
            "locales": [
                {
                    "lang": "fi",
                    "type": "text/javascript",
                    "src": "../../../../bundles/integration/admin-layerselector/resources/locale/fi.js"
                }, {
                    "lang": "en",
                    "type": "text/javascript",
                    "src": "../../../../bundles/integration/admin-layerselector/resources/locale/en.js"
                }, {
                    "lang": "sv",
                    "type": "text/javascript",
                    "src": "../../../../bundles/integration/admin-layerselector/resources/locale/sv.js"
                },
                {
                    "lang": "fi",
                    "type": "text/javascript",
                    "src": "../../../../bundles/admin/admin-hierarchical-layerlist/resources/locale/fi.js"
                }, {
                    "lang": "sv",
                    "type": "text/javascript",
                    "src": "../../../../bundles/admin/admin-hierarchical-layerlist/resources/locale/sv.js"
                }, {
                    "lang": "en",
                    "type": "text/javascript",
                    "src": "../../../../bundles/admin/admin-hierarchical-layerlist/resources/locale/en.js"
                }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "admin-hierarchical-layerlist",
                "Bundle-Name": "admin-hierarchical-layerlist",
                "Bundle-Author": [{
                    "Name": "MK",
                    "Organisation": "Dimenteq Oy",
                    "Temporal": {
                        "Start": "2018",
                        "End": "20209"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}

            }
        },

        /**
         * @static
         * @property dependencies
         */
        "dependencies": ["jquery"]

    });

Oskari.bundle_manager.installBundleClass("admin-hierarchical-layerlist", "Oskari.admin.bundle.admin.HierarchicalLayerListBundle");