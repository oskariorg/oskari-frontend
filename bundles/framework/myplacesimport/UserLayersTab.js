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
                dialog.close();
                this.instance.getService().deleteUserLayer(data.id);
            });
            var cancelBtn = dialog.createCloseButton(this.loc('tab.buttons.cancel'));
            var confirmMsg = this.loc('tab.confirmDeleteMsg', { name: data.name });
            dialog.show(this.loc('tab.deleteLayer'), confirmMsg, [cancelBtn, okBtn]);
            dialog.makeModal();
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
            const layers = this.instance.getMapLayerService().getAllLayersByMetaType(this.layerMetaType);
            const gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');

            gridModel.setIdField('id');
            const layersAdded = [];
            layers.forEach(function (layer) {
                if (!layer.isInternalDownloadSource()) {
                    // someone elses shared layer from URL-param etc
                    return;
                }
                if (layersAdded.includes(layer.getId())) {
                    // about to add a duplicate layer.
                    // Don't know why but this was handled before so just in case
                    return;
                }
                gridModel.addData({
                    'id': layer.getId(),
                    'name': Oskari.util.sanitize(layer.getName()),
                    'description': Oskari.util.sanitize(layer.getDescription()),
                    'source': Oskari.util.sanitize(layer.getSource()),
                    'isBase': layer.isBaseLayer()
                });
                layersAdded.push(layer.getId());
            });
            return gridModel;
        },
        _editUserLayer: function (data) {
            const { id } = data;
            const layer = this.instance.getMapLayerService().findMapLayer(id);
            const values = {
                locale: layer.getLocale(),
                style: layer.getCurrentStyle().getFeatureStyle(),
                id
            };
            this.instance.openLayerDialog(values);
        }
    });
