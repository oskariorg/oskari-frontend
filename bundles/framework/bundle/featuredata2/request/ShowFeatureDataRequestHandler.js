/**
 * @class Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler
 * Handles Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest to show WFS feature data.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.plugin.mapmodule.OpenlayersPopupPlugin} featureData
     *          reference to featureData
     */
        function(featureData) {
        this.featureData = featureData;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         * 		reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest} request
         * 		request to handle
         */
        handleRequest : function(core, request) {
            var id = request.getId();
            var flyout = this.featureData.plugins["Oskari.userinterface.Flyout"];
            var panels = flyout.tabsContainer.panels;
            for (var i=0; i<panels.length; i++) {
                if (panels[i].layer.getId() === id) {
                    flyout.tabsContainer.select(panels[i]);
                    break;
                }
            }
            this.featureData.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.featureData, 'detach']);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
