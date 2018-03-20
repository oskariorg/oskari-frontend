
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
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
    }, {
        /**
         * @method handleRequest
         * Adds layerlist filter button
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            this.layerlistService.registerLayerlistFilterButton(request.getToolText(), request.getTooltip(), {
                    active: request.getIconClassActive(),
                    deactive: request.getIconClassDeactive()
                }, request.getFilterName());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
