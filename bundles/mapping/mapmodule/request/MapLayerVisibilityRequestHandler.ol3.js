/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler
 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
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
         * Shows/hides the maplayer specified in the request in OpenLayers implementation.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var me = this;
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

            // get openlayers layer objects from map
            var module = this.layersPlugin.getMapModule();
            var layerList = module.getOLMapLayers(layer.getId());
            if(!layerList.length) {
                return;
            }
            layerList.forEach(function(ol) {
                me.setVisible(ol, layer.isVisible());
            });

            // notify other components
            this.layersPlugin.notifyLayerVisibilityChanged(layer);
        },
        tryVectorLayers : function(id, blnVisible) {
            var module = this.layersPlugin.getMapModule();
            var plugin = module.getLayerPlugins('vectorlayer');
            if(!plugin || typeof plugin.getLayerById !== 'function') {
                return;
            }
            var layer = plugin.getLayerById(id);
            if(!layer) {
                return;
            }
            this.setVisible(layer, blnVisible);
        },
        setVisible : function(layer, bln) {
            // ol3 specific
            layer.setVisible(bln);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });