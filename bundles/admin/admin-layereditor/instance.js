import React from 'react';
import { LayerEditorFlyout } from './view/Flyout';
import { ShowLayerEditorRequest } from './request/ShowLayerEditorRequest';
import { ShowLayerEditorRequestHandler } from './request/ShowLayerEditorRequestHandler';
import { Messaging } from 'oskari-ui/util';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getNavigationDimensions } from 'oskari-ui/components/window';
import { LayerListFormHandler } from './view/LayerListForm/layerListFormHandler';

const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

const FLYOUT = {
    EDITOR: 'editor',
    THEME: 'theme',
    DATA_PROVIDER: 'dataProvider'
};

Oskari.clazz.defineES('Oskari.admin.admin-layereditor.instance',
    class AdminLayerEditor extends BasicBundle {
        constructor () {
            super();
            this.__name = 'admin-layereditor';
            this.loc = Oskari.getMsg.bind(null, this.__name);
            this.layerListFormHandler = new LayerListFormHandler();
            this.eventHandlers = {
                MapLayerEvent: (event) => {
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

        _startImpl () {
            this._setupLayerTools();
            this._setupAdminTooling();
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
        _getLayerService () {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        }

        /**
         * Adds tools for all layers
         */
        _setupLayerTools () {
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
        _setupAdminTooling () {
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

            const createPopupCallback = popupKey => {
                return evt => {
                    this.showFormPopup(popupKey);
                };
            };

            const addSubthemeCallback = (evt, parentId, groupMethod, layerCountInGroup) => {
                let flyoutKey = FLYOUT.THEME;
                this.showFormPopup(flyoutKey, undefined, layerCountInGroup, parentId);
            };

            const addDataProviderTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addDataProviderTool.setName('layer-editor-add-data-provider');
            addDataProviderTool.setTitle(this.loc('addDataProvider'));
            addDataProviderTool.setCallback(createPopupCallback(FLYOUT.DATA_PROVIDER));
            addDataProviderTool.setTypes([toolingService.TYPE_CREATE]);
            toolingService.addTool(addDataProviderTool);

            const editGroupCallBack = (evt, id, groupMethod, layerCountInGroup) => {
                let popupKey;

                switch (groupMethod) {
                case 'getOrganizationName':
                    popupKey = FLYOUT.DATA_PROVIDER;
                    break;
                case 'getGroups':
                    popupKey = FLYOUT.THEME;
                    break;
                default:
                    Oskari.log('admin-layereditor').error('Not supported groupMethod ' + groupMethod);
                    return;
                }
                this.showFormPopup(popupKey, id, layerCountInGroup);
            };

            const addSubthemeTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addSubthemeTool.setName('addSubtheme');
            addSubthemeTool.setIconComponent(<PlusCircleOutlined/>);
            addSubthemeTool.setTooltip(this.loc('addSubtheme'));
            addSubthemeTool.setIconCls('add-sub-theme');
            addSubthemeTool.setTypes(['layergroup', 'getGroups']);
            addSubthemeTool.setCallback(addSubthemeCallback);
            toolingService.addTool(addSubthemeTool);

            const editThemeTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            editThemeTool.setName('editTheme');
            editThemeTool.setIconComponent(<EditOutlined/>);
            editThemeTool.setTooltip(this.loc('editTheme'));
            editThemeTool.setIconCls('edit-layer');
            editThemeTool.setTypes(['layergroup', 'getGroups']);
            editThemeTool.setCallback(editGroupCallBack);
            toolingService.addTool(editThemeTool);

            const editDataProviderTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            editDataProviderTool.setName('editDataProvider');
            editDataProviderTool.setIconComponent(<EditOutlined/>);
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
        _addTool (layer, suppressEvent) {
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
            tool.setIconComponent(<EditOutlined/>);
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
        _hasComposingModel (layer) {
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
         */
        showFormPopup (flyoutKey, id, layerCountInGroup, parentId) {
            switch (flyoutKey) {
            case FLYOUT.THEME:
                this._showThemePopup(id, layerCountInGroup, parentId);
                break;
            case FLYOUT.DATA_PROVIDER:
                this._showDataProviderPopup(id, layerCountInGroup);
                break;
            default:
                break;
            }
        }

        /**
         * @method _showEditor
         * Opens flyout with layer editor for given layerId
         * @param {Number} layerId
         */
        showEditor (layerId) {
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

        getDataProviders () {
            const dataProviders = this._getLayerService().getDataProviders();
            dataProviders.sort(function (a, b) {
                return Oskari.util.naturalSort(a.name, b.name);
            });
            return dataProviders;
        }

        getGroups () {
            // filter runtime groups (negative ids)
            return this._getLayerService().getAllLayerGroups()
                .filter(group => group.id > 0)
                .toSorted((a, b) => Oskari.util.naturalSort(Oskari.getLocalized(a.name), Oskari.getLocalized(b.name)));
        }

        /**
         * @private @method _getFlyout
         * Ensure flyout exists and return it
         * @return {LayerEditorFlyout}
         */
        _getFlyout () {
            if (!this.flyout) {
                const dimensions = getNavigationDimensions();
                let xPosition = 0;
                if (dimensions) {
                    xPosition = dimensions.left + dimensions.width;
                }
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
         * @method _showThemePopup
         * Ensures theme flyout exists and returns it.
         */
        _showThemePopup (id, layerCountInGroup, parentId) {
            const controller = this.layerListFormHandler.getController();
            controller.setLoading(true);

            controller.setSaveAction((locales, id, parentId) => {
                const httpMethod = id ? 'PUT' : 'POST';

                const payload = {
                    parentId,
                    locales
                };
                if (id) {
                    payload.id = id;
                }

                const me = this;
                jQuery.ajax({
                    type: httpMethod,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('MapLayerGroups', { id }),
                    data: JSON.stringify(payload),
                    success: response => {
                        const group = Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', response);
                        const locale = Oskari.getLocalized(response.locale);
                        this.layerListFormHandler.getController().closePopup();
                        group.setName(locale.name);
                        group.setDescription(locale.desc);
                        if (id) {
                            this._getLayerService().updateLayerGroup(group);
                        } else {
                            this._getLayerService().addLayerGroup(group, parentId);
                        }
                        // Inform user with popup
                        Messaging.success(me.loc('messages.saveSuccess'));
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        this.layerListFormHandler.getController().setLoading(false);
                        // Inform user with popup
                        Messaging.error(me.loc('messages.saveFailed'));
                        // Log error
                        const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                        Oskari.log('admin-layereditor').error(errorText);
                    }
                });
            });
            if (id) {
                controller.setDeleteAction((id, deleteLayers) => {
                    // only add a delete action if we have something to delete
                    this.layerListFormHandler.getController().setLoading(true);
                    const me = this;
                    jQuery.ajax({
                        type: 'DELETE',
                        url: Oskari.urls.getRoute('MapLayerGroups', { id, deleteLayers }),
                        success: response => {
                            this.layerListFormHandler.getController().setLoading(false);
                            this.layerListFormHandler.getController().closePopup();
                            this._getLayerService().deleteLayerGroup(response.id, response.parentId, deleteLayers);
                            // Inform user with popup
                            Messaging.success(me.loc('messages.deleteSuccess'));
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            this.layerListFormHandler.getController().setLoading(false);
                            // Inform user with popup
                            Messaging.error(me.loc('messages.deleteFailed'));
                            // Log error
                            const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                            Oskari.log('admin-layereditor').error(errorText);
                        }
                    });
                });
            }

            const popupTitle = id ? Oskari.getMsg('admin-layereditor', 'editTheme') : Oskari.getMsg('admin-layereditor', 'addTheme');
            const hasSubgroups = id ? this._getLayerService().findLayerGroupById(id).hasSubgroups() : false;
            if (id) {
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    url: Oskari.urls.getRoute('MapLayerGroups', { id }),
                    error: function (jqXHR, textStatus, errorThrown) {
                        controller.setLoading(false);
                        // TODO: error handling
                    },
                    success: function (response) {
                        controller.setLoading(false);
                        controller.setValue(response.locale);

                        controller.showPopup(popupTitle, {
                            headerMessageKey: 'themeName',
                            id,
                            parentId,
                            hasSubgroups,
                            layerCountInGroup
                        }, Oskari.getMsg('admin-layereditor', 'deleteGroupLayers'));
                    }
                });
            } else {
                controller.setLoading(false);
                controller.setValue({});
                controller.showPopup(popupTitle, {
                    headerMessageKey: 'themeName',
                    id,
                    parentId,
                    hasSubgroups,
                    layerCountInGroup
                }, Oskari.getMsg('admin-layereditor', 'deleteGroupLayers'));
            }
        }

        /**
         * @method _showDataProviderPopup
         * Ensures theme flyout exists and returns it.
         */
        _showDataProviderPopup (id, layerCountInGroup) {
            const controller = this.layerListFormHandler.getController();
            controller.setLoading(true);

            controller.setSaveAction(value => {
                const me = this;
                const httpMethod = id ? 'PUT' : 'POST';
                const payload = { locales: value };
                if (id) {
                    payload.id = id;
                }
                jQuery.ajax({
                    type: httpMethod,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('DataProvider', { id }),
                    data: JSON.stringify(payload),
                    success: response => {
                        const locale = Oskari.getLocalized(response.locale);
                        const dataProvider = {
                            id: response.id,
                            name: locale.name,
                            desc: locale.desc
                        };

                        if (id) {
                            this._getLayerService().updateDataProvider(dataProvider);
                        } else {
                            this._getLayerService().addDataProvider(dataProvider);
                        }
                        this.layerListFormHandler.getController().closePopup();
                        Messaging.success(me.loc('messages.saveSuccess'));
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        this.layerListFormHandler.getController().setLoading(false);
                        // Inform user with popup
                        Messaging.error(me.loc('messages.saveFailed'));
                        // Log error
                        const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                        Oskari.log('admin-layereditor').error(errorText);
                    }
                });
            });
            if (id) {
                // only add a delete action if we have something to delete
                controller.setDeleteAction((id, deleteLayers) => {
                    const me = this;
                    this.layerListFormHandler.setLoading(true);
                    jQuery.ajax({
                        type: 'DELETE',
                        url: Oskari.urls.getRoute('DataProvider', { id, deleteLayers }),
                        success: response => {
                            this.layerListFormHandler.getController().setLoading(false);
                            this.layerListFormHandler.getController().closePopup();
                            this._getLayerService().deleteDataProvider(response, deleteLayers);
                            // Inform user with popup
                            Messaging.success(me.loc('messages.deleteSuccess'));
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            this.layerListFormHandler.getController().setLoading(false);
                            // Inform user with popup
                            Messaging.error(me.loc('messages.deleteFailed'));
                            // Log error
                            const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR, errorThrown);
                            Oskari.log('admin-layereditor').error(errorText);
                        }
                    });
                });
            }
            const loc = id ? this.loc('editDataProvider') : this.loc('addDataProvider');

            if (id) {
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    url: Oskari.urls.getRoute('DataProvider', { id }),
                    error: function (jqXHR, textStatus, errorThrown) {
                        controller.setLoading(false);
                        // TODO: error handling
                    },
                    success: function (response) {
                        controller.setLoading(false);
                        controller.setValue(response.locale);
                        controller.showPopup(loc, {
                            headerMessageKey: 'dataProviderName',
                            id: id,
                            layerCountInGroup: layerCountInGroup
                        }, Oskari.getMsg('admin-layereditor', 'deleteGroupLayers'));
                    }
                });
            } else {
                controller.setLoading(false);
                controller.setValue({});
                controller.showPopup(loc, {
                    headerMessageKey: 'dataProviderName',
                    id: id,
                    layerCountInGroup: layerCountInGroup
                }, Oskari.getMsg('admin-layereditor', 'deleteGroupLayers'));
            }
        }
    }
);
