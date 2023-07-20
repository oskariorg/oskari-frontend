/**
 * @class Oskari.mapframework.bundle.featuredata.request.ShowFeatureDataRequestHandler
 * Handles Oskari.mapframework.bundle.featuredata.request.ShowFeatureDataRequest to show WFS feature data.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.request.ShowFeatureDataRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata.plugin.mapmodule.OpenlayersPopupPlugin} featureData
     *          reference to featureData
     */
    function (featureData) {
        this.featureData = featureData;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.featuredata.request.ShowFeatureDataRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const controller = this.featureData?.plugin?.handler?.getController() || null;
            if (!controller) {
                Oskari.log('FeatureData').warn('No plugin controller found. Cannot handle ShowFeatureData - request.');
            }
            const id = request.getId();
            controller.setActiveTab(id);
            if (!controller.isFlyoutOpen()) {
                controller.openFlyout();
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
