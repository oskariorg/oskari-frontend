import './ShowUserLayerDialogRequest';
/**
 * @class Oskari.mapframework.bundle.myplacesimport.request.ShowUserLayerDialogRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.request.ShowUserLayerDialogRequestHandler',
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
     * @param {Oskari.mapframework.bundle.myplacesimport.request.ShowUserLayerDialogRequestHandler} request
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
