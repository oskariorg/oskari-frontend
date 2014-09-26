/**
 * @class Oskari.mapframework.bundle.myplacesimport.UserLayersTab
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.UserLayersTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance} instance
     *      reference to the myplacesimport instance
     * @param {Object} localization
     *      instance's localization
     */

    function (instance, localization) {
        var me = this,
            p;
        me.instance = instance;
        me.loc = localization;
        me.layerMetaType = 'USERLAYER';
        me.visibleFields = [
            'name', 'description', 'source', 'remove'
        ];
        me.grid = undefined;
        me.container = undefined;

        // templates
        me.template = {};
        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }
    }, {
        __templates: {
            "main": '<div class="oskari-user-layers-tab"></div>',
            "link": '<a href="JavaScript:void(0);"></a>'
        },
        /**
         * Returns reference to a container that should be shown in personal data
         *
         * @method getContent
         * @return {jQuery} container reference
         */
        getContent: function () {
            var me = this,
                sandbox = me.instance.getSandbox(),
                grid = Oskari.clazz.create('Oskari.userinterface.component.Grid'),
                addMLrequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');

            grid.setVisibleFields(this.visibleFields);
            // set up the link from name field
            grid.setColumnValueRenderer('name', function (name, data) {
                var link = me.template.link.clone();

                link.append(name).bind('click', function () {
                    // add myplacesimport layer to map on name click
                    var request = addMLrequestBuilder(data.id, false, data.isBase);
                    sandbox.request(me.instance, request);
                    return false;
                });
                return link;
            });
            grid.setColumnValueRenderer('remove', function (name, data) {
                var link = me.template.link.clone();

                link.append(me.loc.buttons['delete']).bind('click', function () {
                    me._confirmDeleteUserLayer(data);
                    return false;
                });
                return link;
            });
            // setup localization
            _.each(this.visibleFields, function (field) {
                grid.setColumnUIName(field, me.loc.grid[field]);
            });

            me.container = me.template.main.clone();
            me.grid = grid;
            // populate initial grid content
            me.refresh();
            return me.container;
        },
        refresh: function () {
            this.container.empty();
            this.grid.setDataModel(this._getGridModel());
            this.grid.renderTo(this.container);
        },
        /**
         * Confirms delete for given layer and deletes it if confirmed. Also shows
         * notification about cancel, deleted or error on delete.
         * @method _confirmDeleteLayer
         * @param {Object} data grid data object for place
         * @private
         */
        _confirmDeleteUserLayer: function (data) {
            var me = this;
            //var loc = this.loc.notification['delete'];
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            okBtn.setTitle(me.loc.buttons['delete']);
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                me._deleteUserLayer(data.id);
                dialog.close();
            });
            var cancelBtn = dialog.createCloseButton(me.loc.buttons.cancel),
                confirmMsg = me.loc.confirmDeleteMsg + ' "' + data.name + '"?';
            dialog.show(me.loc.title, confirmMsg, [cancelBtn, okBtn]);
            dialog.makeModal();
        },
        /**
         * @method _deleteUserLayer
         * Request backend to delete user layer. On success removes the layer
         * from map and layerservice. On failure displays a notification.
         * @param layer layer analysis data to be destroyed
         * @private
         */
        _deleteUserLayer: function (layerId) {
            var me = this,
                sandbox = me.instance.sandbox;

            // parse actual id from layer id
            var tokenIndex = layerId.lastIndexOf("_") + 1,
                idParam = layerId.substring(tokenIndex);

            jQuery.ajax({
                url: sandbox.getAjaxUrl(),
                data: {
                    action_route: 'DeleteUserLayer',
                    id: idParam
                },
                type: 'POST',
                success: function (response) {
                    if (response && response.result === 'success') {
                        me._deleteSuccess(layerId);
                    } else {
                        me._deleteFailure();
                    }
                },
                error: function () {
                    me._deleteFailure();
                }
            });
        },
        /**
         * Success callback for backend operation.
         * @method _deleteSuccess
         * @param layerId Id of the layer that was removed
         * @private
         */
        _deleteSuccess: function (layerId) {
            var me = this,
                sandbox = me.instance.sandbox,
                service = sandbox.getService('Oskari.mapframework.service.MapLayerService');

            // Remove layer from grid... this is really ugly, but so is jumping
            // through hoops to masquerade as a module
            var model = me.grid.getDataModel().data,
                i,
                gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            for (i = 0; i < model.length; i++) {
                if (model[i].id !== layerId) {
                    gridModel.addData(model[i]);
                }
            }
            me.grid.setDataModel(gridModel);
            me.grid.renderTo(me.container);

            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // also we need to do it before service.remove() to avoid problems on other components
            var removeMLrequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                request = removeMLrequestBuilder(layerId);
            sandbox.request(me.instance, request);
            service.removeLayer(layerId);

            // show msg to user about successful removal
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(me.loc.notification.deletedTitle, me.loc.notification.deletedMsg);
            dialog.fadeout(3000);
        },
        /**
         * Failure callback for backend operation.
         * @method _deleteFailure
         * @private
         */
        _deleteFailure: function () {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = dialog.createCloseButton(this.loc.buttons.ok);
            dialog.show(this.loc.error.title, this.loc.error.generic, [okBtn]);
        },
        /**
         * Renders current user layers to a grid model and returns it.
         *
         * @method _getGridModel
         * @private
         * @param {jQuery} container
         */
        _getGridModel: function (container) {
            var service = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                layers = service.getAllLayersByMetaType(this.layerMetaType),
                gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');

            gridModel.setIdField('id');

            _.each(layers, function (layer) {
                if (gridModel.data.length === 0) {
                    gridModel.addData({
                        'id': layer.getId(),
                        'name': layer.getName(),
                        'description': layer.getDescription(),
                        'source': layer.getSource(),
                        'isBase': layer.isBaseLayer()
                    });
                }
                var idDouble = false;
                for (i=0; i < gridModel.data.length; i++) {
                    if (layer.getId() === gridModel.data[i].id) {
                        idDouble = true;
                        break;
                    }
                }
                if (!idDouble) {
                    gridModel.addData({
                        'id': layer.getId(),
                        'name': layer.getName(),
                        'description': layer.getDescription(),
                        'source': layer.getSource(),
                        'isBase': layer.isBaseLayer()
                    });
                }
            });
            return gridModel;
        }
    });
