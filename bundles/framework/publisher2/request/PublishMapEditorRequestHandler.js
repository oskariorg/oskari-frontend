/**
 * @class Oskari.mapframework.bundle.publisher2.request.PublishMapEditorRequestHandler
 * Requesthandler for editing a map view in publish mode
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Function} openEditor
     *          function to call to open the publish editor. Optional initial data can be passed as parameter.
     */
    function (openEditor) {
        this.openEditor = openEditor;
    }, {
        /**
         * @method handleRequest
         * Shows/hides the maplayer specified in the request in OpenLayers implementation.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         *      request to handle
         * @param {Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var me = this;

            if (!request.getEditMap()) {
                me.openEditor();
                return;
            }
            //get the uuid from the request
            var uuid = request.getEditMap().uuid || null;
            // make the ajax call
            jQuery.ajax({
                url: Oskari.urls.getRoute('AppSetup'),
                data: {
                    uuid : uuid
                },
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    data.uuid = uuid;
                    me.openEditor(data);
                }
            });
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });