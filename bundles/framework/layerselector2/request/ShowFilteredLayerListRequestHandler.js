/**
 * @class Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequestHandler
 * Handles Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequest to filter layerlist by some condition.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.plugin.mapmodule.OpenlayersPopupPlugin} featureData
     *          reference to featureData
     */
    function(sandbox) {
        this.sandbox = sandbox;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            var layerSelector = this.sandbox.findRegisteredModuleInstance('LayerSelector'),
                layerSelectorFlyout = layerSelector.plugins['Oskari.userinterface.Flyout'];

            layerSelectorFlyout.setLayerListFilteringFunction(request.getFilterFunction());
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [layerSelector, 'attach']);
            layerSelectorFlyout.populateLayers();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
