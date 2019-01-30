/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin} layersPlugin
     *          reference to layersplugin
     */

    function (sandbox, layersPlugin) {
        this.sandbox = sandbox;
        this.layersPlugin = layersPlugin;
    }, {
        /**
         * @method handleRequest
         * Changes internal layer's visibility
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var layerId = request.getMapLayerId();
            var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                this.tryVectorLayers(layerId, request.getVisible());
                // no need to notify other components if it was a vector layer
                return;
            }
            if (layer.isVisible() === request.getVisible()) {
                // already in correct mode, no-op
                return;
            }
            layer.setVisible(request.getVisible());

            // layersplugin handles ol maplayers' visibility changes
            // and notifies other components
            this.layersPlugin.handleMapLayerVisibility(layer, true);
        },
        tryVectorLayers: function (id, blnVisible) {
            var module = this.layersPlugin.getMapModule();
            var plugin = module.getLayerPlugins('vectorlayer');
            if (!plugin || typeof plugin.setVisibleByLayerId !== 'function') {
                return;
            }
            plugin.setVisibleByLayerId(id, blnVisible);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
