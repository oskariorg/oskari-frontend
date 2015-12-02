/**
 * @class Oskari.mapframework.bundle.publisher2.request.PublishMapEditorRequestHandler
 * Requesthandler for editing a map view in publish mode
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
     *          reference to publisher instance
     */
    function (instance) {
        this.instance = instance;
    }, {

        __defaultToolsConfig: {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [
                            {id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'},
                            {id: 'Oskari.mapframework.mapmodule.ControlsPlugin'}
                        ]
                    }
                }
            }
        },
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
            var me = this,
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl();

            if (request._viewData) {
                //get the uuid from the request
                var uuid = request._viewData.uuid && request._viewData.uuid ? request._viewData.uuid : null;
                // make the ajax call
                jQuery.ajax({
                    url: url + '&action_route=AppSetup&uuid='+uuid,
                    type: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        data.uuid = uuid;
                        me.instance.setPublishMode(true, me.instance.getLayersWithoutPublishRights(), data);
                        me._showEditNotification();
                    },
                    error: function(response) {
                    }
                });
            } else {
                var defaultToolsConfig = me.__defaultToolsConfig;
                me.instance.setPublishMode(true, me.instance.getLayersWithoutPublishRights(), defaultToolsConfig);
            }
            
        },
        /**
         * @method _showEditNotification
         * Shows notification that the user starts editing an existing published map
         * @private
         */
        _showEditNotification: function () {
            var loc = this.instance.getLocalization('edit'),
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(loc.popup.title, loc.popup.msg);
            dialog.fadeout();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });