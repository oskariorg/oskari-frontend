
/**
 * @class Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequestHandler
 * Handles Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest to show filter.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.plugin.mapmodule.OpenlayersPopupPlugin} featureData
     *          reference to featureData
     */
    function(sandbox, instance) {
        this.sandbox = sandbox;
        this.instance = instance;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            var layerSelectorFlyout = this.instance.plugins['Oskari.userinterface.Flyout'];
            layerSelectorFlyout.addFilterTool(request.getToolText(), request.getTooltip(), request.getIconClassActive(), request.getIconClassDeactive(), request.getFilterName());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
