/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundle
 */
Oskari.clazz.define("Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundle",

    /**
     * Called automatically on construction. At this stage bundle sources have been
     * loaded, if bundle is loaded dynamically.
     *
     * @contructor
     * @static
     */
    function() {

    }, {
        /*
         * called when a bundle instance will be created
         *
         * @method create
         */
        "create": function() {
            return Oskari.clazz.create("Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundleInstance");
        },
        /**
         * Called by Bundle Manager to provide state information to
         *
         * @method update
         * bundle
         */
        "update": function(manager, bundle, bi, info) {}
    },

    /**
     * metadata
     */
    {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [
            {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/layerselector2/service/layerlist.js"
            },{
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/Flyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/Tile.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/model/LayerGroup.js"
            }, {
                "type": "text/javascript",
            "src": "../../../../bundles/framework/hierarchical-layerlist/view/LayerGroupTab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/view/SelectedLayersTab.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/service/LayerlistExtenderService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/service/OskariEventNotifierService.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/components/SelectedLayer.js"
            },  {
                "type": "text/javascript",
                "src": "../../../../libraries/jstree/jstree.js"
            }, {
                "type": "text/css",
                "src": "../../../../libraries/jstree/themes/default/style.css"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/layerselector2/request/ShowFilteredLayerListRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/layerselector2/request/ShowFilteredLayerListRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/layerselector2/request/AddLayerListFilterRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/layerselector2/request/AddLayerListFilterRequestHandler.js"
            },{
                "type": "text/css",
                "src": "../../../../bundles/framework/hierarchical-layerlist/resources/css/style.css"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/hierarchical-layerlist/resources/locale/en.js"
            }]
        }
    });

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("hierarchical-layerlist", "Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundle");