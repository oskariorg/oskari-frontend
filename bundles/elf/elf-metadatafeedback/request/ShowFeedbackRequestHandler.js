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
            // Set the score based on the given value
            this.instance.plugins["Oskari.userinterface.Flyout"].getEl().find("div#raty-star").raty('score',request.getRating());

            //set metadata id
            this.instance.plugins["Oskari.userinterface.Flyout"].getEl().find("input#primaryTargetCode").val(request.getMetadataId());

            //set the reference to the metadataobject...
            this.instance.plugins["Oskari.userinterface.Flyout"].setMetadata(request.getMetadata());


            // Show the feedback flyout
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'detach']);
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
