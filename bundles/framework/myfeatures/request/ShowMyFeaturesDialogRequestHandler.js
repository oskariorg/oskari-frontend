import './ShowMyFeaturesDialogRequest';
/**
 * @class Oskari.mapframework.bundle.myfeatures.request.ShowMyFeaturesDialogRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myfeatures.request.ShowMyFeaturesDialogRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} instance
 *
 */
    function (instance) {
        this.instance = instance;
    }, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.myfeatures.request.ShowMyFeaturesDialogRequestHandler} request
     *      request to handle
     */
        handleRequest: function (core, request) {
            this.instance.showLayerDialog(request.getId());
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
