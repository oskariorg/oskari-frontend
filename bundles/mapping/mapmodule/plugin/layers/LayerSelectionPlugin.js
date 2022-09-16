import React from 'react';
import { showLayerSelectionPopup } from './LayerSelectionPopup';
import { MapModuleButton } from '../../MapModuleButton';
import ReactDOM from 'react-dom';
/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides a maplayer selection "dropdown" on top of the map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginLayerSelectionPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
        me._defaultLocation = 'top left';
        me._index = 70;
        me._name = 'LayerSelectionPlugin';

        me.initialSetup = true;
        me.templates = {};
        me._mobileDefs = {
            buttons: {
                'mobile-layerselection': {
                    iconCls: 'mobile-layers',
                    tooltip: '',
                    sticky: true,
                    show: true,
                    callback: function () {
                        me._toggleToolState();
                    },
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me._styleSelectable = !!this.getConfig().isStyleSelectable;
        me._showMetadata = !!this.getConfig().showMetadata;
        me._layers = [];
        me._baseLayers = [];
    }, {
        _toggleToolState: function () {
            if (this.popupControls) {
                this.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', [null, 'mobileToolbar-mobile-toolbar']);
                this.popupCleanup();
            } else {
                this.showPopup();
            }
        },
        showPopup: function () {
            const mapModule = this.getMapModule();
            // TODO: set default baselayer!!
            this.popupControls = showLayerSelectionPopup(
                this._baseLayers,
                this._layers,
                () => this.popupCleanup(),
                this.getShowMetadata(),
                this.getStyleSelectable(),
                (layer, visible, isBaseLayer) => {
                    if (isBaseLayer) {
                        this.selectBaseLayer(layer.getId());
                    } else {
                        this._setLayerVisible(layer, visible);
                    }
                },
                (layerId, style) => this._selectStyle(layerId, style),
                {
                    theme: mapModule.getTheme(),
                    font: this.getToolFontFromMapModule()
                },
                this.getLocation()
            );
        },
        _updateLayerSelectionPopup: function () {
            if (!this.popupControls) {
                return;
            }
            this.popupControls.update(
                this._baseLayers,
                this._layers,
                this.getShowMetadata(),
                this.getStyleSelectable()
            );
        },
        popupCleanup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         */
        _initImpl: function () {
            var me = this;
            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage(), true).plugin.LayerSelectionPlugin;
            me.templates.main = jQuery(
                '<div class="mapplugin layerselection">' +
                '  <div class="header">' +
                '  </div>' +
                '</div>');
            this.updateLayers();
        },
        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            return {
                /**
                 * @method AfterMapLayerRemoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
                 *
                 * Removes the layer from selection
                 */
                AfterMapLayerRemoveEvent: function () {
                    this.updateLayers();
                },
                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Adds the layer to selection
                 */
                AfterMapLayerAddEvent: function (event) {
                    this.updateLayers();
                },

                /**
                 * @method MapModulePlugin_MapLayerVisibilityRequest
                 * refreshes checkbox state based on visibility
                 */
                MapLayerVisibilityChangedEvent: function () {
                    this.updateLayers();
                },
                AfterChangeMapLayerStyleEvent: function () {
                    this.updateLayers();
                },
                /**
                 * @method AfterRearrangeSelectedMapLayerEvent
                 * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
                 *
                 * Rearranges layers
                 */
                AfterRearrangeSelectedMapLayerEvent: function (event) {
                    // Layer order has been changed by someone, re-sort layers
                    if (event._creator !== this.getName()) {
                        this.updateLayers();
                    }
                },
                MapSizeChangedEvent: function (evt) {
                    this._handleMapSizeChanged({ width: evt.getWidth(), height: evt.getHeight() });
                }
            };
        },
        _handleMapSizeChanged: function (size, isMobile) {
            var me = this,
                mobile = isMobile || Oskari.util.isMobile();
            if (!mobile && me.layerContent) {
                me.layerContent.find('div.layers-content').css('max-height', (0.75 * size.height) + 'px');
            }
        },
        _setLayerToolsEditModeImpl: function () {
            if (!this.getElement()) {
                return;
            }
            if (this.inLayerToolsEditMode()) {
                this.popupCleanup();
            }
        },

        /**
         * @method preselectLayers
         * Does nothing, protocol method for mapmodule-plugin
         */
        preselectLayers: function () {},

        /**
         * @method setStyleSelectable
         * Set if layer styles should be selectable by user
         * @param {Boolean} isSelectable
         */
        setStyleSelectable: function (isSelectable) {
            this.setConfig({
                ...this.getConfig(),
                isStyleSelectable: !!isSelectable
            });
        },
        /**
         * @method setShowMetadata
         * @param {Boolean} showMetadata
         */
        setShowMetadata: function (showMetadata) {
            this.setConfig({
                ...this.getConfig(),
                showMetadata: !!showMetadata
            });
        },
        /**
         * @method getStyleSelectable
         * @return {Boolean} can layer styles be selectable by user
         */
        getStyleSelectable: function () {
            return !!this.getConfig().isStyleSelectable;
        },
        getShowMetadata: function () {
            return !!this.getConfig().showMetadata;
        },
        updateLayers: function () {
            const { baseLayers = [] } = this.getConfig() || {};
            const isBaseLayer = (layer) => baseLayers.some(id => '' + id === '' + layer.getId());

            this._layers = this.getSandbox().findAllSelectedMapLayers().filter(l => !isBaseLayer(l));
            this._baseLayers = this.getSandbox().findAllSelectedMapLayers().filter(isBaseLayer);
            this._updateLayerSelectionPopup();
        },
        _selectStyle: function (layerId, style) {
            this.getSandbox().postRequestByName('ChangeMapLayerStyleRequest', [layerId, style]);
        },

        /**
         * @method _setLayerVisible
         * Makes given layer visible or hides it
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to control
         * @param {Boolean} blnVisible true to show, false to hide
         * @private
         */
        _setLayerVisible: function (layer, blnVisible) {
            const layerId = layer.getId();
            this.getSandbox().postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layerId, blnVisible]);
        },
        /**
         * @method addBaseLayer
         * Assumes that the layer is already added as normal layer and moves it to being a base layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
         */
        addBaseLayer: function (layer) {
            if (!layer || !layer.getId) {
                return;
            }
            const alreadyAdded = this._baseLayers.some(l => '' + l.getId() === '' + layer.getId());
            if (alreadyAdded) {
                return;
            }
            this._baseLayers.push(layer);
            this.setConfig({
                ...this.getConfig(),
                baseLayers: this._baseLayers.map(l => l.getId())
            });
            this._changedBaseLayer();
            this.updateLayers();
        },
        /**
         * @method removeBaseLayer
         * Assumes that the layer is already added as base layer and moves it to being a normal layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
         */
        removeBaseLayer: function (layer) {
            const old = this.getConfig();
            const newConfig = {
                ...old,
                baseLayers: old.baseLayers.filter(id => '' + id !== '' + layer.getId())
            };
            if (layer.getId() + '' === old.defaultBaseLayer + '') {
                // removed the currently selected base layer
                newConfig.defaultBaseLayer = newConfig.baseLayers[0];
            }
            this.setConfig(newConfig);
            this._changedBaseLayer();
            this.updateLayers();
            // make layer visible by default when toggled out of base layers
            this._setLayerVisible(layer, true);
        },
        /**
         * @method selectBaseLayer
         * Tries to find given layer from baselayers and select it programmatically
         * @param {String} layerId id for layer to select
         */
        selectBaseLayer: function (layerId) {
            const old = this.getConfig();
            this.setConfig({
                ...old,
                defaultBaseLayer: layerId || old.baseLayers[0]
            });
            this._changedBaseLayer();
        },
        /**
         * @method getBaseLayers
         * Returns list of the current base layers and which one is selected
         * @return {Object} returning object has property baseLayers as a {String[]} list of base layer ids and
         * {String} defaultBase as the selected base layers id
         */
        getBaseLayers: function () {
            const config = this.getConfig();
            return {
                baseLayers: config.baseLayers,
                defaultBaseLayer: config.defaultBaseLayer || config.baseLayers[0]
            };
        },
        /**
         * @method _changedBaseLayer
         * Checks which layer is currently the selected base layer, shows it and hides the rest
         * @private
         */
        _changedBaseLayer: function () {
            const sandbox = this.getSandbox();
            const values = this.getBaseLayers();
            const selectedBaseLayerId = values.defaultBaseLayer;
            values.baseLayers.forEach(layerId => {
                const layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
                if (!layer) {
                    return;
                }
                const isSelectedBaseLayer = '' + selectedBaseLayerId === '' + layerId;
                this._setLayerVisible(layer, isSelectedBaseLayer);
            });
            // send Request to rearrange layers
            sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [selectedBaseLayerId, 0]);
        },

        _togglePopup: function () {
            if (this.popupControls) {
                this.popupCleanup();
            } else {
                this.showPopup();
            }
        },

        /**
         * @private @method  _createControlElement
         * Creates the whole ui from scratch and writes the plugin in to the UI.
         * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
         * If it exists, checks if there are other bundles and writes itself as the first one.
         * If the placeholder doesn't exist the plugin is written to the mapmodules div element.
         */
        _createControlElement: function () {
            const el = this.templates.main.clone();
            return el;
        },

        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
            this.popupCleanup();
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            var isMobile = mapInMobileMode || Oskari.util.isMobile();
            if (!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            var me = this;
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();
            if (!toolbarNotReady && isMobile) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                // TODO: redrawUI is basically refresh, move stuff here from refresh if needed
                me._element = me._createControlElement();
                me.changeToolStyle(null, me._element);
                me.refresh();
                this.addToPluginContainer(me._element);
            }
        },

        refresh: function () {
            var me = this,
                conf = me.getConfig(),
                element = me.getElement();
            this._updateLayerSelectionPopup();
            if (conf) {
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, element);
                } else {
                    // not found -> use the style config obtained from the mapmodule.
                    var toolStyle = me.getToolStyleFromMapModule();
                    if (toolStyle !== null && toolStyle !== undefined) {
                        me.changeToolStyle(toolStyle, me.getElement());
                    }
                }

                if (conf.font) {
                    me.changeFont(conf.font, element);
                } else {
                    var font = me.getToolFontFromMapModule();
                    if (font !== null && font !== undefined) {
                        me.changeFont(font, element);
                    }
                }
            }
        },

        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {String} styleName
         * @param {jQuery} div
         */
        changeToolStyle: function (styleName, div) {
            div = div || this.getElement();
            if (!div) {
                return;
            }

            var header = div.find('div.header');
            ReactDOM.unmountComponentAtNode(header[0]);
            header.empty();

            // TODO: setting color for svg icon doesn't work
            const ButtonIcon = () => (
                <svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(-10.000000, -10.000000)" fill='#3c3c3c'>
                            <path d="M26.822,20.6490471 L27.6897848,21.1075254 C27.9339631,21.2364889 28.0273631,21.5389801 27.8983996,21.7831583 C27.8514267,21.8720963 27.7787228,21.9448002 27.6897848,21.9917731 L20.4670182,25.8064996 C20.1747992,25.960836 19.8252008,25.960836 19.5329818,25.8064996 L12.3102152,21.9917731 C12.0660369,21.8628096 11.9726369,21.5603184 12.1016004,21.3161402 C12.1485733,21.2272022 12.2212772,21.1544983 12.3102152,21.1075254 L13.178,20.6490471 L20,24.2517537 L26.822,20.6490471 Z M20.4670182,14.1403437 L27.6897848,17.9550702 C27.9339631,18.0840337 28.0273631,18.3865249 27.8983996,18.6307031 C27.8514267,18.7196411 27.7787228,18.792345 27.6897848,18.8393179 L20.4670182,22.6540444 C20.1747992,22.8083808 19.8252008,22.8083808 19.5329818,22.6540444 L12.3102152,18.8393179 C12.0660369,18.7103544 11.9726369,18.4078632 12.1016004,18.163685 C12.1485733,18.074747 12.2212772,18.0020431 12.3102152,17.9550702 L19.5329818,14.1403437 C19.8252008,13.9860073 20.1747992,13.9860073 20.4670182,14.1403437 Z" id="Combined-Shape-Copy-2"></path>
                        </g>
                    </g>
                </svg>
            );

            ReactDOM.render(
                <MapModuleButton
                    className='t_layerselect'
                    styleName={styleName}
                    icon={<ButtonIcon />}
                    title={this._loc.title}
                    onClick={(e) => {
                        if (this.inLayerToolsEditMode()) {
                            e.stopPropagation();
                        } else {
                            this._togglePopup();
                        }
                    }}
                />,
                header[0]
            );

            this._setLayerToolsEditMode(
                this.getMapModule().isInLayerToolsEditMode()
            );
        },

        /**
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @method changeFont
         * @param {String} fontId
         * @param {jQuery} div
         */
        changeFont: function (fontId, div) {
            div = div || this.getElement();

            if (!div || !fontId) {
                return;
            }

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;

            this.changeCssClasses(classToAdd, testRegex, [div]);
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
            this._layers = [];
            this._baseLayers = [];
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
