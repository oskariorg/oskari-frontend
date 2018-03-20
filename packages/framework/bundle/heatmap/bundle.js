/**
 * @class Oskari.mapframework.bundle.heatmap.HeatmapBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.heatmap.HeatmapBundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.heatmap.HeatmapBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/HeatmapDialog.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/plugin/AbstractHeatmapPlugin.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/plugin/HeatmapLayerPlugin.ol2.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/domain/HeatmapLayer.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/mapping/heatmap/resources/css/style.css"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/mapping/heatmap/resources/locale/sv.js"
        }]
    }
});

Oskari.bundle_manager.installBundleClass("heatmap", "Oskari.mapframework.bundle.heatmap.HeatmapBundle");
