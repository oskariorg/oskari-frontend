import { LayerEditorFlyout } from './view/Flyout';
import { ShowLayerEditorRequest } from './request/ShowLayerEditorRequest';
import { ShowLayerEditorRequestHandler } from './request/ShowLayerEditorRequestHandler';
import { LocalizingFlyout } from './view/LocalizingFlyout';

const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

const FLYOUT = {
    EDITOR: 'editor',
    THEME: 'theme',
    SUBTHEME: 'subtheme',
    DATA_PROVIDER: 'dataProvider'
};

Oskari.clazz.defineES('Oskari.admin.admin-layereditor.instance',
    class AdminLayerEditor extends BasicBundle {
        constructor() {
            super();
            this.__name = 'admin-layereditor';
            this.loc = Oskari.getMsg.bind(null, this.__name);
            this.eventHandlers = {
                'MapLayerEvent': (event) => {
                    if (event.getOperation() !== 'add') {
                        // only handle add layer
                        return;
                    }
                    if (event.getLayerId()) {
                        this._addTool(event.getLayerId());
                    } else { // initial layer load
                        this._setupLayerTools();
                    }
                }
            };
        }
        _startImpl() {
            this._setupLayerTools();
            this._setupAdminTooling();
            this._loadDataProviders();
            this.sandbox.requestHandler(ShowLayerEditorRequest.NAME, new ShowLayerEditorRequestHandler(this));
            const layerService = this._getLayerService();
            layerService.on('availableLayerTypesUpdated', () => this._setupLayerTools());
            // listen to changes so admin form is updated with new/updated/removed grouping options
            layerService.on('theme.update', () => this._getFlyout().setMapLayerGroups(this.getGroups()));
            layerService.on('dataProvider.update', () => this._getFlyout().setDataProviders(this.getDataProviders()));
        }
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        _getLayerService() {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        }

        /**
         * Adds tools for all layers
         */
        _setupLayerTools() {
            // add tools for feature data layers
            const layers = this._getLayerService().getAllLayers();
            layers.forEach(layer => {
                this._addTool(layer, true);
            });
            // update all layers at once since we suppressed individual events
            const event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.sandbox.notifyAll(event);
        }

        /**
         * Adds admin tools to layer list
         */
        _setupAdminTooling() {
            // add layerlist tool for adding new layers
            const toolingService = this.sandbox.getService('Oskari.mapframework.service.LayerListToolingService');
            if (!toolingService) {
                return;
            }
            const addLayerTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addLayerTool.setName('layer-editor-add-layer');
            addLayerTool.setTitle(this.loc('addLayer'));
            addLayerTool.setCallback(() => Oskari.getSandbox().postRequestByName('ShowLayerEditorRequest', []));
            addLayerTool.setTypes([toolingService.TYPE_CREATE]);
            toolingService.addTool(addLayerTool);

            const offset = {
                x: -100,
                y: -200
            };

            const createPopupCallback = (flyoutKey, position, id) => {
                return evt => {
                    const position = {
                        left: evt.pageX + offset.x,
                        top: evt.pageY + offset.y
                    };
                    this.showFormPopup(flyoutKey, position);
                };
            };

            const subthemeCallback = (evt, id, groupMethod, layerCountInGroup) => {
                let flyoutKey = FLYOUT.SUBTHEME;

                const position = {
                    left: evt.pageX + offset.x,
                    top: evt.pageY + offset.y
                };
                this.showFormPopup(flyoutKey, position, id, layerCountInGroup);

            };

            const addDataProviderTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addDataProviderTool.setName('layer-editor-add-data-provider');
            addDataProviderTool.setTitle(this.loc('addDataProvider'));
            addDataProviderTool.setCallback(createPopupCallback(FLYOUT.DATA_PROVIDER));
            addDataProviderTool.setTypes([toolingService.TYPE_CREATE]);
            toolingService.addTool(addDataProviderTool);

            const editGroupCallBack = (evt, id, groupMethod, layerCountInGroup, parentId) => {
                const position = {
                    left: evt.pageX + offset.x,
                    top: evt.pageY + offset.y
                };

                let flyoutKey;

                switch (groupMethod) {
                    case 'getOrganizationName':
                        flyoutKey = FLYOUT.DATA_PROVIDER;
                        break;
                    case 'getInspireName':
                        flyoutKey = FLYOUT.THEME;
                        break;
                    default:
                        Oskari.log('admin-layereditor').error('Not supported groupMethod ' + groupMethod);
                        return;
                }
                this.showFormPopup(flyoutKey, position, id, layerCountInGroup, parentId);
            };

            const addSubthemeTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addSubthemeTool.setName('addSubtheme');
            addSubthemeTool.setTooltip(this.loc('addSubtheme'));
            addSubthemeTool.setIconCls('add-sub-theme');
            addSubthemeTool.setTypes(['layergroup', 'getInspireName']);
            //addSubthemeTool.setCallback(editGroupCallBack);
            addSubthemeTool.setCallback(subthemeCallback);
            toolingService.addTool(addSubthemeTool);

            const editThemeTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            editThemeTool.setName('editTheme');
            editThemeTool.setTooltip(this.loc('editTheme'));
            editThemeTool.setIconCls('edit-layer');
            editThemeTool.setTypes(['layergroup', 'getInspireName']);
            editThemeTool.setCallback(editGroupCallBack);
            toolingService.addTool(editThemeTool);

            const editDataProviderTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            editDataProviderTool.setName('editDataProvider');
            editDataProviderTool.setTooltip(this.loc('editDataProvider'));
            editDataProviderTool.setIconCls('edit-layer');
            editDataProviderTool.setTypes(['layergroup', 'getOrganizationName']);
            editDataProviderTool.setCallback(editGroupCallBack);
            toolingService.addTool(editDataProviderTool);

            const addThemeTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addThemeTool.setName('layer-editor-add-theme');
            addThemeTool.setTitle(this.loc('addTheme'));
            addThemeTool.setCallback(createPopupCallback(FLYOUT.THEME));
            addThemeTool.setTypes([toolingService.TYPE_CREATE]);
            toolingService.addTool(addThemeTool);
        }

        /**
         * Adds the layer edit tool for layer
         * @method  @private _addTool
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        _addTool(layer, suppressEvent) {
            const service = this._getLayerService();
            if (typeof layer !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layer = service.findMapLayer(layer);
            }
            if (!layer || !this._hasComposingModel(layer)) {
                return;
            }
            // add feature data tool for layer
            const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('layer-editor');
            tool.setIconCls('edit-layer');
            tool.setTooltip(this.loc('editor-tool'));
            tool.setTypes(['layerList']);

            tool.setCallback(() => {
                this.showEditor(layer.getId());
            });

            service.addToolForLayer(layer, tool, suppressEvent);
        }

        /**
         * Checks if layer composing is supported for the layer.
         * @param {Object} layer
         * @return {boolean} true, if composing is supported.
         */
        _hasComposingModel(layer) {
            const service = this._getLayerService();
            let composingModel = service.getComposingModelForType(layer.getLayerType());
            if (!composingModel) {
                composingModel = service.getComposingModelForType(layer.getLayerType() + 'layer');
                if (!composingModel) {
                    return false;
                }
            }
            return true;
        }

        /**
         * @method showFormPopup To show a simple data input form.
         * @param {string} flyoutKey FLYOUT.THEME or FLYOUT.DATA_PROVIDER
         * @param {object} position where to place the popup
         */
        showFormPopup(flyoutKey, position, id, layerCountInGroup, parentId) {
            let flyout = null;
            switch (flyoutKey) {
                case FLYOUT.THEME:
                    flyout = this._getThemeFlyout(id, layerCountInGroup, parentId);
                    break;
                case FLYOUT.SUBTHEME:
                    flyout = this._getSubthemeFlyout(id, layerCountInGroup);
                    break;
                case FLYOUT.DATA_PROVIDER:
                    flyout = this._getDataProviderFlyout(id, layerCountInGroup);
                    break;
                default:
                    return;
            }
            const { left, top } = position;
            const flyoutWidth = 330;
            flyout.setSize(flyoutWidth);
            flyout.move(left, top, true);
            if (flyout.isVisible()) {
                flyout.bringToTop();
            } else {
                flyout.show();
            }
        }

        /**
         * @method _showEditor
         * Opens flyout with layer editor for given layerId
         * @param {Number} layerId
         */
        showEditor(layerId) {
            const flyout = this._getFlyout();
            const layerService = this._getLayerService();
            flyout.setLocale(this.loc);
            flyout.setDataProviders(this.getDataProviders());
            flyout.setMapLayerGroups(this.getGroups());
            flyout.setLayer(layerService.findMapLayer(layerId));
            if (flyout.isVisible()) {
                flyout.bringToTop();
            } else {
                flyout.show();
            }
        }
        getDataProviders() {
            const dataProviders = this._getLayerService().getDataProviders();
            dataProviders.sort(function (a, b) {
                return Oskari.util.naturalSort(a.name, b.name);
            });
            return dataProviders;
        }

        getGroups() {
            const groups = this._getLayerService().getAllLayerGroups();
            return groups;
        }

        /**
         * @private @method _loadDataProviders
         * Loads data provider list
         */
        _loadDataProviders() {
            const me = this;
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                url: Oskari.urls.getRoute('GetMapLayerGroups'),
                error: function () {
                    var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    errorDialog.show(me.locale('errors.dataProvider.title'), me.locale('errors.dataProvider.message'));
                    errorDialog.fadeout();
                },
                success: function (response) {
                    const dataProviders = [];
                    response.organization.forEach(function (org) {
                        dataProviders.push({
                            id: org.id,
                            name: Oskari.getLocalized(org.name)
                        });
                    });
                    me._getLayerService().setDataProviders(dataProviders);
                }
            });
        }
        /**
         * @private @method _getFlyout
         * Ensure flyout exists and return it
         * @return {LayerEditorFlyout}
         */
        _getFlyout() {
            if (!this.flyout) {
                const xPosition = jQuery('#mapdiv').position().left;
                const offset = 150;

                this.flyout = new LayerEditorFlyout(this.loc('flyout-title'));
                this.flyout.move(xPosition + offset, 15, true);
                this.flyout.makeDraggable({
                    handle: '.oskari-flyouttoolbar',
                    scroll: false
                });
            }
            return this.flyout;
        }

        /**
         * @method _getThemeFlyout
         * Ensures theme flyout exists and returns it.
         * @return {LocalizingFlyout}
         */
        _getThemeFlyout(id, layerCountInGroup, parentId) {
            const me = this;
            const fetchTheme = (id, setLoading, setValue) => {
                setLoading(true);
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    url: Oskari.urls.getRoute('MapLayerGroups', { id }),
                    error: function (jqXHR, textStatus, errorThrown) {
                        setLoading(false);
                        // TODO: error handling
                    },
                    success: function (response) {
                        setLoading(false);
                        setValue(response.name);
                    }
                });
            };

            const loc = id ? this.loc('editTheme') : this.loc('addTheme');

            this.themeFlyout = new LocalizingFlyout(this, loc, {
                headerMessageKey: 'themeName',
                id: id,
                fetch: fetchTheme,
                layerCountInGroup: layerCountInGroup
            }, this.loc('deleteGroupLayers'));
            this.themeFlyout.makeDraggable({
                handle: '.oskari-flyouttoolbar',
                scroll: false
            });
            this.themeFlyout.setSaveAction((value, id) => {
                const layerService = this._getLayerService();
                const httpMethod = id ? 'POST' : 'PUT';
                const getpayload = () => {
                    if (id) {
                        return parentId ? { locales: value, id: id, parentId: parentId } : { locales: value, id: id }
                    } else {
                        return { locales: value }
                    }
                }

                //const payload = id ? { locales: value, id: id, parentId: parentId } : { locales: value };
                jQuery.ajax({
                    type: httpMethod,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('MapLayerGroups'),
                    data: JSON.stringify(getpayload()),
                    success: response => {
                        this.themeFlyout.hide();
                        //const group = Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', response.id);
                        //const group = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService').getAllLayerGroups(response.id);
                        const group = layerService.getAllLayerGroups(response.id);
                        //console.log(group);
                        group.setName(response.name);

                        httpMethod === 'POST'
                            ? this._getLayerService().updateLayerGroup(group)
                            : this._getLayerService().addLayerGroup(group);
                        // Inform user with popup
                        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(' ', me.loc('messages.saveSuccess'));
                        dialog.fadeout();
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        this.themeFlyout.setLoading(false);
                        // Inform user with popup
                        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(' ', me.loc('messages.saveFailed'));
                        dialog.fadeout();
                        // Log error
                        const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                        Oskari.log('admin-layereditor').error(errorText);
                    }
                });
            });
            if (id) {
                // only add a delete action if we have something to delete
                this.themeFlyout.setDeleteAction((id, deleteLayers) => {
                    const me = this;
                    this.themeFlyout.setLoading(true);
                    jQuery.ajax({
                        type: 'DELETE',
                        url: Oskari.urls.getRoute('MapLayerGroups', { id: id, deleteLayers: deleteLayers }),
                        success: response => {
                            this.themeFlyout.setLoading(false);
                            this.themeFlyout.hide();
                            this._getLayerService().deleteLayerGroup(response.id, response.parentId, deleteLayers);
                            // Inform user with popup
                            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            dialog.show(' ', me.loc('messages.deleteSuccess'));
                            dialog.fadeout();
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            this.themeFlyout.setLoading(false);
                            // Inform user with popup
                            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            dialog.show(' ', me.loc('messages.deleteFailed'));
                            dialog.fadeout();
                            // Log error
                            const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                            Oskari.log('admin-layereditor').error(errorText);
                        }
                    });
                });
            }
            return this.themeFlyout;
        }

        /**
         * @method _getSubthemeFlyout
         * Ensures theme flyout exists and returns it.
         * @return {LocalizingFlyout}
         */
        _getSubthemeFlyout(parentId, layerCountInGroup) {
            //const parentId = id;
            const me = this;
            const fetchTheme = (parentId, setLoading, setValue) => {
                setLoading(true);
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    url: Oskari.urls.getRoute('MapLayerGroups', { parentId }),
                    error: function (jqXHR, textStatus, errorThrown) {
                        setLoading(false);
                        // TODO: error handling
                    },
                    success: function (response) {
                        setLoading(false);
                        setValue(response.name);
                    }
                });
            };

            //const loc = parentId ? this.loc('editSubtheme') : this.loc('addSubtheme');
            const loc = this.loc('addSubtheme');
            this.themeFlyout = new LocalizingFlyout(this, loc, {
                headerMessageKey: 'themeName',
                id: null,
                fetch: fetchTheme,
                layerCountInGroup: layerCountInGroup
            }, this.loc('deleteGroupLayers'));
            this.themeFlyout.makeDraggable({
                handle: '.oskari-flyouttoolbar',
                scroll: false
            });
            this.themeFlyout.setSaveAction((value) => {
                //const httpMethod = id ? 'POST' : 'PUT';
                const httpMethod = 'PUT';
                // const payload = id ? { locales: value, id: id } : { locales: value };
                const payload = { locales: value, parentId: parentId };
                jQuery.ajax({
                    type: httpMethod,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('MapLayerGroups'),
                    data: JSON.stringify(payload),
                    success: response => {
                        this.themeFlyout.hide();
                        const group = Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', response);
                        httpMethod === 'POST'
                            ? this._getLayerService().updateLayerGroup(parentId, group)
                            : this._getLayerService().addSublayerGroup(parentId, group);
                        // Inform user with popup
                        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(' ', me.loc('messages.saveSuccess'));
                        dialog.fadeout();
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        this.themeFlyout.setLoading(false);
                        // Inform user with popup
                        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(' ', me.loc('messages.saveFailed'));
                        dialog.fadeout();
                        // Log error
                        const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                        Oskari.log('admin-layereditor').error(errorText);
                    }
                });
            });
            return this.themeFlyout;
        }


        /**
         * @method _getDataProviderFlyout
         * Ensures theme flyout exists and returns it.
         * @return {LocalizingFlyout}
         */
        _getDataProviderFlyout(id, layerCountInGroup) {
            const fetchDataProvider = (id, setLoading, setValue) => {
                setLoading(true);
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    url: Oskari.urls.getRoute('DataProvider', { id }),
                    error: function (jqXHR, textStatus, errorThrown) {
                        setLoading(false);
                        // TODO: error handling
                    },
                    success: function (response) {
                        setLoading(false);
                        setValue(response.name);
                    }
                });
            };

            const loc = id ? this.loc('editDataProvider') : this.loc('addDataProvider');
            this.dataProviderFlyout = new LocalizingFlyout(this, loc, {
                headerMessageKey: 'dataProviderName',
                id: id,
                fetch: fetchDataProvider,
                layerCountInGroup: layerCountInGroup
            }, this.loc('deleteGroupLayers'));
            this.dataProviderFlyout.makeDraggable({
                handle: '.oskari-flyouttoolbar',
                scroll: false
            });
            this.dataProviderFlyout.setSaveAction(value => {
                const me = this;
                const httpMethod = id ? 'POST' : 'PUT';
                const payload = id ? { locales: value, id: id } : { locales: value };
                jQuery.ajax({
                    type: httpMethod,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('SaveOrganization'),
                    data: JSON.stringify(payload),
                    success: response => {
                        this.dataProviderFlyout.hide();
                        const dataProvider = {
                            id: response.id,
                            name: Oskari.getLocalized(response.name)
                        };

                        httpMethod === 'POST'
                            ? this._getLayerService().updateDataProvider(dataProvider)
                            : this._getLayerService().addDataProvider(dataProvider);

                        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(' ', me.loc('messages.saveSuccess'));
                        dialog.fadeout();
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        this.dataProviderFlyout.setLoading(false);
                        // Inform user with popup
                        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(' ', me.loc('messages.saveFailed'));
                        dialog.fadeout();
                        // Log error
                        const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                        Oskari.log('admin-layereditor').error(errorText);
                    }
                });
            });
            if (id) {
                // only add a delete action if we have something to delete
                this.dataProviderFlyout.setDeleteAction((id, deleteLayers) => {
                    const me = this;
                    this.dataProviderFlyout.setLoading(true);
                    jQuery.ajax({
                        type: 'DELETE',
                        url: Oskari.urls.getRoute('DataProvider', { id: id, deleteLayers: deleteLayers }),
                        success: response => {
                            this.dataProviderFlyout.setLoading(false);
                            this.dataProviderFlyout.hide();
                            this._getLayerService().deleteDataProvider(response, deleteLayers);
                            // Inform user with popup
                            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            dialog.show(' ', me.loc('messages.deleteSuccess'));
                            dialog.fadeout();
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            this.dataProviderFlyout.setLoading(false);
                            // Inform user with popup
                            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            dialog.show(' ', me.loc('messages.deleteFailed'));
                            dialog.fadeout();
                            // Log error
                            const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                            Oskari.log('admin-layereditor').error(errorText);
                        }
                    });
                });
            }
            return this.dataProviderFlyout;
        }
    }
);
