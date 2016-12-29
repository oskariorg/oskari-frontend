/**
 * @class Oskari.framework.bundle.system.message.request.ShowMessageRequestHandler
 */
Oskari.clazz.define('Oskari.framework.bundle.system.message.request.ShowMessageRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
     *          reference to system-message instance
     */
    function (instance) {
        this.instance = instance;
    }, {
      // var requestBuilder = sandbox.getRequestBuilder('SystemMessage.ShowMessageRequest');
      // var request = requestBuilder('testing', 'info');
      // sandbox.request('system-message', request);
      handleRequest: function (core, request) {
        this.instance.messages.push(request.getMessage().fontcolor(request.getUrgencyLevel()));
        this.instance.showStatusMessage(request.getMessage());
      }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
