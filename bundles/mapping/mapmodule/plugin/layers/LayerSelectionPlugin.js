import React from 'react';
import { showLayerSelectionPopup } from './LayerSelectionPopup';
import { MapModuleButton } from '../../MapModuleButton';
import { LayersIcon } from 'oskari-ui/components/icons';
import { createRoot } from 'react-dom/client';

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
        me._styleSelectable = !!this.getConfig().isStyleSelectable;
        me._showMetadata = !!this.getConfig().showMetadata;
        me._layers = [];
        me._baseLayers = [];
        me._reactRoot = null;
    }, {
        _toggleToolState: function () {
            if (this.popupControls) {
                this.popupCleanup();
            } else {
                this.showPopup();
            }
        },
        showPopup: function () {
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
                this.getLocation()
            );
            this.refresh();
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
            const div = this.getElement();
            if (!div) return;
            this.refresh();
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
                '<div class="mapplugin layerselection"></div>');
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
        resetUI: function () {
            this.popupCleanup();
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
            this._updateLayerSelectionPopup();
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
            this._updateLayerSelectionPopup();
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
            // bottom layer is first in list. Reverse lists to render in correct order.
            this._layers = this.getSandbox().findAllSelectedMapLayers().filter(l => !isBaseLayer(l)).reverse();
            this._baseLayers = this.getSandbox().findAllSelectedMapLayers().filter(isBaseLayer).reverse();
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
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.isVisible() || !this.isEnabled()) {
                // no point in drawing the ui if we are not visible
                return;
            }

            this.teardownUI();
            this._element = this._createControlElement();
            this.refresh();
            this.addToPluginContainer(this._element);
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        refresh: function () {
            let el = this.getElement();
            if (!el) {
                return;
            }

            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_layerselect'
                    icon={<LayersIcon />}
                    title={this._loc.title}
                    onClick={(e) => this._togglePopup()}
                    iconActive={this.popupControls ? true : false}
                    position={this.getLocation()}
                />
            );
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
