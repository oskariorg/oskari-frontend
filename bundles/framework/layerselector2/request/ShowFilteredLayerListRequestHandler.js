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
    function(sandbox, instance) {
        this.sandbox = sandbox;
        this.instance = instance;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            var layerSelectorFlyout = this.instance.plugins['Oskari.userinterface.Flyout'];

            this.instance.filteredLayerListOpenedByRequest = true;

            if(request.getSelectedFilter()){
                layerSelectorFlyout.activateFilter(request.getSelectedFilter());
            }

            if(request.getOpenLayerList() && request.getOpenLayerList() === true){
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'attach']);
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
