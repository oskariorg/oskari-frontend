/**
 * @class Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataPopupRequestHandler
 * Handles Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataPopupRequest to show WFS feature data in popup.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataPopupRequestHandler',
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
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest} request
         *      request to handle
         */
        handleRequest : function(core, request) {
            var mapLayer = request.getLayer(),
                flyout = this.featureData.plugins["Oskari.userinterface.Flyout"];

            flyout.showFeatureDataInPopup(mapLayer);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
