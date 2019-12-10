import { LayerEditorFlyout } from './view/Flyout';
import { ShowLayerEditorRequest } from './request/ShowLayerEditorRequest';
import { ShowLayerEditorRequestHandler } from './request/ShowLayerEditorRequestHandler';
import { LocalizingFlyout } from './view/LocalizingFlyout';

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
            this.dataProviders = [];
        }
        _startImpl () {
            this._setupLayerTools();
            this._setupAdminTooling();
            this._loadDataProviders();
            this.sandbox.requestHandler(ShowLayerEditorRequest.NAME, new ShowLayerEditorRequestHandler(this));
        }

        _setDataProviders (dataProviders) {
            this.dataProviders = dataProviders;
        }
        _getDataProviders () {
            return this.dataProviders;
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
            if (toolingService) {
                const addLayerTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
                addLayerTool.setName('layer-editor-add-layer');
                addLayerTool.setTitle(this.loc('addLayer'));
                addLayerTool.setCallback(() => Oskari.getSandbox().postRequestByName('ShowLayerEditorRequest', []));

                const offset = {
                    x: -100,
                    y: -200
                };
                const createPopupCallback = flyoutKey => {
                    return evt => {
                        const position = {
                            left: evt.pageX + offset.x,
                            top: evt.pageY + offset.y
                        };
                        this.showFormPopup(flyoutKey, position);
                    };
                };
                const addDataProviderTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
                addDataProviderTool.setName('layer-editor-add-data-provider');
                addDataProviderTool.setTitle(this.loc('addDataProvider'));
                addDataProviderTool.setCallback(createPopupCallback(FLYOUT.DATA_PROVIDER));

                const addThemeTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
                addThemeTool.setName('layer-editor-add-theme');
                addThemeTool.setTitle(this.loc('addTheme'));
                addThemeTool.setCallback(createPopupCallback(FLYOUT.THEME));

                addLayerTool.setTypes([toolingService.TYPE_CREATE]);
                addThemeTool.setTypes([toolingService.TYPE_CREATE]);
                addDataProviderTool.setTypes([toolingService.TYPE_CREATE]);
                toolingService.addTool(addLayerTool);
                toolingService.addTool(addDataProviderTool);
                toolingService.addTool(addThemeTool);
            }
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
            if (!layer || layer.getLayerType() !== 'wfs' || layer.getVersion() !== '1.1.0') {
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
         * @method showFormPopup To show a simple data input form.
         * @param {string} flyoutKey FLYOUT.THEME or FLYOUT.DATA_PROVIDER
         * @param {object} position where to place the popup
         */
        showFormPopup (flyoutKey, position) {
            let flyout = null;
            switch (flyoutKey) {
            case FLYOUT.THEME:
                flyout = this._getAddThemeFlyout();
                break;
            case FLYOUT.DATA_PROVIDER:
                flyout = this._getAddDataProviderFlyout();
                break;
            default:
                return;
            }
            const { left, top } = position;
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
        showEditor (layerId) {
            const flyout = this._getFlyout();
            const layerService = this._getLayerService();
            flyout.setLocale(this.loc);
            flyout.setDataProviders(this._getDataProviders());
            flyout.setMapLayerGroups(layerService.getAllLayerGroups());
            flyout.setLayer(layerService.findMapLayer(layerId));
            if (flyout.isVisible()) {
                flyout.bringToTop();
            } else {
                flyout.show();
            }
        }

        /**
         * @private @method _loadDataProviders
         * Loads data provider list
         */
        _loadDataProviders () {
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

                    dataProviders.sort(function (a, b) {
                        return Oskari.util.naturalSort(a.name, b.name);
                    });
                    me._setDataProviders(dataProviders);
                }
            });
        }
        /**
         * @private @method _getFlyout
         * Ensure flyout exists and return it
         * @return {LayerEditorFlyout}
         */
        _getFlyout () {
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
         * @method _getAddThemeFlyout
         * Ensures theme flyout exists and returns it.
         * @return {LocalizingFlyout}
         */
        _getAddThemeFlyout () {
            if (this.themeFlyout) {
                return this.themeFlyout;
            }
            this.themeFlyout = new LocalizingFlyout(this, this.loc('addTheme'), {
                showHeading: false,
                headerMessageKey: 'themeName'
            });
            this.themeFlyout.makeDraggable({
                handle: '.oskari-flyouttoolbar',
                scroll: false
            });
            this.themeFlyout.setAction(value => {
                // TODO add discreet notifications
                jQuery.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('MapLayerGroups'),
                    data: JSON.stringify({ locales: value }),
                    success: response => {
                        this.themeFlyout.hide();
                        const group = Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', response);
                        this._getLayerService().addLayerGroup(group);
                    },
                    error: () => {
                        this.themeFlyout.setLoading(false);
                    }
                });
            });
            return this.themeFlyout;
        }

        /**
         * @method _getAddDataProviderFlyout
         * Ensures theme flyout exists and returns it.
         * @return {LocalizingFlyout}
         */
        _getAddDataProviderFlyout () {
            if (this.dataProviderFlyout) {
                return this.dataProviderFlyout;
            }
            this.dataProviderFlyout = new LocalizingFlyout(this, this.loc('addDataProvider'), {
                showHeading: false,
                headerMessageKey: 'dataProviderName'
            });
            this.dataProviderFlyout.makeDraggable({
                handle: '.oskari-flyouttoolbar',
                scroll: false
            });
            this.dataProviderFlyout.setAction(value => {
                // TODO add discreet notifications
                jQuery.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Oskari.urls.getRoute('SaveOrganization'),
                    data: JSON.stringify({ locales: value }),
                    success: response => {
                        this.dataProviderFlyout.hide();
                        const dataProvider = {
                            id: response.id,
                            name: Oskari.getLocalized(response.name)
                        };
                        const dataProviders = [...this.dataProviders, dataProvider];
                        dataProviders.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
                        this._setDataProviders(dataProviders);
                    },
                    error: () => {
                        this.dataProviderFlyout.setLoading(false);
                    }
                });
            });
            return this.dataProviderFlyout;
        }
    }
);
