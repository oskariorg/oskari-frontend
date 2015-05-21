/**
 * @class Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequestHandler
 *
 */
Oskari.clazz.define(
    'Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequestHandler',
    function (sandbox, instance) {
        this.sandbox = sandbox;
        /** @property instance */
        this.instance = instance;
    }, {

        /** @method handleRequest dispatches processing to instance */
        handleRequest: function (core, request) {
            this.instance.plugins["Oskari.userinterface.Flyout"].updateFeedbackUI(request.getMetadata());
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'detach']);
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
