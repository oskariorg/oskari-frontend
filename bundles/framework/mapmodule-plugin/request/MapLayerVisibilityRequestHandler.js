/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler
 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin} layersPlugin
     *          reference to layersplugin
     */

    function (sandbox, layersPlugin) {
        this.sandbox = sandbox;
        this.layersPlugin = layersPlugin;
        //in case of wmts layer timing issues the request is tried a couple of times. Use the counter to prevent trying again til the end of time.
        this.wmtsRetryCounter = {

        };
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
            //should check that the visibility actually has changed.
            if (!layer) {
                return;
            }
            layer.setVisible(request.getVisible());
            var map = this.layersPlugin.getMap();
            var module = this.layersPlugin.getMapModule();
            // get openlayers layer objects from map
            var layers = module.getOLMapLayers(layer.getId()),
                i;

            //No OLMapLayers found and a WMTS layer? There might be a WMTS timing issue. Run again after a while with a timer...
            if (!layers || layers.length === 0 && layer.isLayerOfType('WMTS')) {

                if (!me.wmtsRetryCounter[layer.getId()]) {
                    me.wmtsRetryCounter[layer.getId()] = 0;
                }

                if (me.wmtsRetryCounter[layer.getId()]++ < 10) {
                    window.setTimeout(function() {
                        me.handleRequest(core, request);
                    }, 500);
                }
            } else {
                me.wmtsRetryCounter[layer.getId()] = 0;
            }

            for (i = 0; i < layers.length; i++) {
                layers[i].setVisibility(layer.isVisible());
                layers[i].display(layer.isVisible());
            }

            // notify other components
            this.layersPlugin.notifyLayerVisibilityChanged(layer);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });