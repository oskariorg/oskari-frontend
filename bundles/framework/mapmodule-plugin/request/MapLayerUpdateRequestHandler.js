/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler
 * Handles MapModulePlugin.MapLayerUpdateRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     *            mapModule reference to mapmodule
     */

    function (sandbox, mapModule) {

        this.sandbox = sandbox;
        this.mapModule = mapModule;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var layerId = request.getLayerId();
            var forced = request.isForced();
            var params = request.getParameters();

            var sandbox = this.sandbox;
            var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId),
                i;
            var olLayerList,
                wfsLayerPlugin,
                count;
            if (!layer) {
                return;
            }

            if (params && layer.isLayerOfType("WMS")) {
                olLayerList = this.mapModule.getOLMapLayers(layerId);
                count = 0;
                if (olLayerList) {
                    count = olLayerList.length;
                    for (i = 0; i < olLayerList.length; ++i) {
                        olLayerList[i].mergeNewParams(params);
                    }
                }
                this.sandbox.printDebug("[MapLayerUpdateRequestHandler] WMS layer / merge new params: " + layerId + ", found " + count);

            } else {
                if (layer.isLayerOfType("WFS")) {
                    // request current tiles from transport, clean wfs/wms buffer and redraw
                    wfsLayerPlugin = this.mapModule.getPluginInstances('WfsLayerPlugin');
                    wfsLayerPlugin.refreshLayer(layerId);
                }

                olLayerList = this.mapModule.getOLMapLayers(layerId);
                count = 0;
                if (olLayerList) {
                    count = olLayerList.length;
                    for (i = 0; i < olLayerList.length; ++i) {
                        olLayerList[i].redraw(forced);
                    }
                }
                this.sandbox.printDebug("[MapLayerUpdateRequestHandler] Layer / update layer " + layerId + ", found " + count);
            }

        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });