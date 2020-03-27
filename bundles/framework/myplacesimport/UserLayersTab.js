/**
 * @class Oskari.mapframework.bundle.myplacesimport.UserLayersTab
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.UserLayersTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance} instance
     *      reference to the myplacesimport instance
     */

    function (instance) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, 'MyPlacesImport');
        this.layerMetaType = 'USERLAYER';
        this.visibleFields = [
            'name', 'description', 'source', 'edit', 'remove'
        ];
        this.grid = undefined;
        this.container = undefined;

        // templates
        this.template = {};
        Object.keys(this.__templates).forEach(templateName => {
            this.template[templateName] = jQuery(this.__templates[templateName]);
        });
    }, {
        __templates: {
            'main': '<div class="oskari-user-layers-tab"></div>',
            'link': '<a href="JavaScript:void(0);"></a>'
        },
        /**
         * Returns reference to a container that should be shown in personal data
         *
         * @method getContent
         * @return {jQuery} container reference
         */
        getContent: function () {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
            var addMLrequestBuilder = Oskari.requestBuilder('AddMapLayerRequest');
            var mapMoveByContentReqBuilder = Oskari.requestBuilder('MapModulePlugin.MapMoveByLayerContentRequest');

            grid.setVisibleFields(this.visibleFields);
            // set up the link from name field
            grid.setColumnValueRenderer('name', function (name, data) {
                var link = me.template.link.clone();

                link.append(name).on('click', function () {
                    // add myplacesimport layer to map on name click
                    var request = addMLrequestBuilder(data.id);
                    sandbox.request(me.instance, request);
                    request = mapMoveByContentReqBuilder(data.id, true);
                    sandbox.request(me.instance, request);
                    return false;
                });
                return link;
            });
            grid.setColumnValueRenderer('edit', function (name, data) {
                var link = me.template.link.clone();

                link.append(me.loc('tab.grid.editButton')).on('click', function () {
                    me._editUserLayer(data);
                    return false;
                });
                return link;
            });
            grid.setColumnValueRenderer('remove', function (name, data) {
                var link = me.template.link.clone();

                link.append(me.loc('tab.grid.removeButton')).on('click', function () {
                    me._confirmDeleteUserLayer(data);
                    return false;
                });
                return link;
            });
            // setup localization
            this.visibleFields.forEach((field) => {
                grid.setColumnUIName(field, me.loc('tab.grid.' + field));
            });

            me.container = me.template.main.clone();
            me.grid = grid;
            // populate initial grid content
            me.refresh();
            return me.container;
        },
        refresh: function () {
            if (!this.container) {
                return;
            }
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
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            okBtn.setTitle(this.loc('tab.buttons.delete'));
            okBtn.addClass('primary');

            okBtn.setHandler(() => {
                this._deleteUserLayer(data.id);
                dialog.close();
            });
            var cancelBtn = dialog.createCloseButton(this.loc('tab.buttons.cancel'));
            var confirmMsg = this.loc('tab.confirmDeleteMsg', { name: data.name });
            dialog.show(this.loc('tab.deleteLayer'), confirmMsg, [cancelBtn, okBtn]);
            dialog.makeModal();
        },
        /**
         * @method _deleteUserLayer
         * Request backend to delete user layer. On success removes the layer
         * from map and layerservice. On failure displays a notification.
         * @param layer layer userlayer data to be destroyed
         * @private
         */
        _deleteUserLayer: function (layerId) {
            var me = this;

            // parse actual id from layer id
            var tokenIndex = layerId.lastIndexOf('_') + 1;
            var idParam = layerId.substring(tokenIndex);

            jQuery.ajax({
                url: Oskari.urls.getRoute('DeleteUserLayer'),
                data: {
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
            var me = this;
            const sandbox = me.instance.sandbox;
            const service = sandbox.getService('Oskari.mapframework.service.MapLayerService');

            // Remove layer from grid... this is really ugly, but so is jumping
            // through hoops to masquerade as a module
            const model = me.grid.getDataModel().data;
            const gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            model.forEach(row => {
                if (row.id !== layerId) {
                    gridModel.addData(row);
                }
            });
            me.grid.setDataModel(gridModel);
            me.grid.renderTo(me.container);

            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // also we need to do it before service.remove() to avoid problems on other components
            const request = Oskari.requestBuilder('RemoveMapLayerRequest')(layerId);
            sandbox.request(me.instance, request);
            service.removeLayer(layerId);

            // show msg to user about successful removal
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(me.loc('tab.notification.deletedTitle'), me.loc('tab.notification.deletedMsg'));
            dialog.fadeout(3000);
        },
        /**
         * Failure callback for backend operation.
         * @method _deleteFailure
         * @private
         */
        _deleteFailure: function () {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okBtn = dialog.createCloseButton(this.loc('tab.buttons.ok'));
            dialog.show(this.loc('tab.error.title'), this.loc('tab.error.deleteMsg'), [okBtn]);
        },
        /**
         * Renders current user layers to a grid model and returns it.
         *
         * @method _getGridModel
         * @private
         */
        _getGridModel: function () {
            const service = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            const layers = service.getAllLayersByMetaType(this.layerMetaType);
            const gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');

            gridModel.setIdField('id');

            layers.forEach(function (layer) {
                if (gridModel.data.length === 0) {
                    gridModel.addData({
                        'id': layer.getId(),
                        'name': layer.getName(),
                        'description': layer.getDescription(),
                        'source': layer.getSource(),
                        'isBase': layer.isBaseLayer()
                    });
                    return;
                }
                var idDouble = false;
                for (var i = 0; i < gridModel.data.length; i++) {
                    if (layer.getId() === gridModel.data[i].id) {
                        idDouble = true;
                        break;
                    }
                }
                if (!idDouble && layer.isInternalDownloadSource()) {
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
        },
        /**
         * Request backend to update userlayer name, source, description and style.
         * On success updates the layer on the map and layerservice.
         * On failure displays a notification.
         *
         * @method _editUserLayer
         * @private
         * @param {Object} data
         */
        _editUserLayer: function (data) {
            var me = this;
            var styleForm;
            var form;
            var dialog;
            var buttons = [];
            var saveBtn;
            var cancelBtn;
            var action = this.instance.getService().getEditLayerUrl();
            var tokenIndex = data.id.lastIndexOf('_') + 1;
            var idParam = data.id.substring(tokenIndex);
            me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            styleForm = Oskari.clazz.create('Oskari.mapframework.bundle.myplacesimport.StyleForm', me.instance);

            me._setStyleValuesToStyleForm(idParam, styleForm);

            form = styleForm.getForm();
            form.find('input[data-name=userlayername]').val(data.name);
            form.find('input[data-name=userlayerdesc]').val(data.description);
            form.find('input[data-name=userlayersource]').val(data.source);

            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc('tab.buttons.save'));
            saveBtn.addClass('primary');
            saveBtn.setHandler(function () {
                var values = styleForm.getValues();
                var msg;
                var title;
                var fadeout;
                values.id = idParam;

                if (!values.name) {
                    me._showMessage(me.loc('tab.error.title'), me.loc('tab.error.styleName'), false);
                    return;
                }

                jQuery.ajax({
                    url: action,
                    data: values,
                    type: 'POST',
                    success: function (response) {
                        if (typeof response === 'object') {
                            msg = me.loc('tab.notification.editedMsg');
                            title = me.loc('tab.title');
                            me.instance.getService().updateLayer(data.id, response);
                            me.refresh();
                            fadeout = true;
                        } else {
                            msg = me.loc('tab.error.editMsg');
                            title = me.loc('tab.error.title');
                            fadeout = false;
                        }
                        me._showMessage(title, msg, fadeout);
                    },
                    error: function (jqXHR, textStatus) {
                        msg = me.loc('tab.error.editMsg');
                        title = me.loc('tab.error.title');
                        fadeout = false;
                        me._showMessage(title, msg, fadeout);
                    }
                });

                dialog.close();
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            cancelBtn = dialog.createCloseButton(me.loc('tab.buttons.cancel'));
            cancelBtn.setHandler(function () {
                dialog.close();
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            buttons.push(cancelBtn);
            buttons.push(saveBtn);
            dialog.show(me.loc('tab.editLayer'), form, buttons);
        },
        /**
         * Retrieves the userlayer style from the backend and sets it to the style form
         *
         * @method _setStyleValuesToStyleForm
         * @private
         * @param {String} id
         * @param {Object} form
         */
        _setStyleValuesToStyleForm: function (id, form) {
            var me = this;
            var action = this.instance.getService().getGetUserLayerStyleUrl();
            action += '&id=' + id;
            jQuery.ajax({
                url: action,
                type: 'GET',
                success: function (response) {
                    if (typeof response === 'object') {
                        form.setStyleValues(response);
                    } else {
                        me._showMessage(me.loc('tab.error.title'), me.loc('tab.error.getStyle'), false);
                    }
                },
                error: function (jqXHR, textStatus) {
                    me._showMessage(me.loc('tab.error.title'), me.loc('tab.error.getStyle'), false);
                }
            });
        },
        /**
         * Displays a message on the screen
         *
         * @method _showMessage
         * @private
         * @param  {String} title
         * @param  {String} message
         * @param  {Boolean} fadeout optional default true
         */
        _showMessage: function (title, message, fadeout) {
            fadeout = fadeout !== false;
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var btn = dialog.createCloseButton(me.loc('tab.buttons.close'));

            dialog.makeModal();
            dialog.show(title, message, [btn]);
            if (fadeout) {
                dialog.fadeout(5000);
            }
        }
    });
