/**
 * @class Oskari.framework.bundle.system.message.request.ShowMessageRequestHandler
 */
Oskari.clazz.define('Oskari.framework.bundle.maprotator.request.SetRotationRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
     *          reference to system-message instance
     */
    function (instance) {
        this.instance = instance;
    }, {
      handleRequest: function (core, request) {
        this.instance.setRotation(request.getDegrees());
      }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
