import React from 'react';
import { SwipeIcon } from '../resources/icons/Swipe';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
 *
 * Provides mapmodule button for the swipe tool
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginLayerSelectionPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._clazz =
            'Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin';
        this._defaultLocation = 'top left';
        this._index = 70;
        this._name = 'LayerSwipePlugin';
        this.handler = null;
        this.template = jQuery('<div class="mapplugin layerswipe"></div>');
        this._reactRoot = null;
    }, {
        _startPluginImpl: function () {
            this.addToPluginContainer(this._createControlElement());
            this.refresh();
            return true;
        },
        _stopPluginImpl: function () {
            // to sync toolbar button state on publisher close
            this.getSandbox().findRegisteredModuleInstance('LayerSwipe')?.setToolActive(false);
            this.teardownUI();
        },
        setHandler: function (handler) {
            if (this.handler || !handler) {
                // already set or no handler
                return;
            }
            handler.addStateListener(() => this.refresh());
            this.handler = handler;
        },
        getHandler: function () {
            if (!this.handler) {
                const handler = this.getSandbox().findRegisteredModuleInstance('LayerSwipe')?.getHandler();
                this.setHandler(handler);
            }
            return this.handler;
        },
        /**
         * @private @method  _createControlElement
         * Creates the whole ui from scratch and writes the plugin in to the UI.
         * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
         * If it exists, checks if there are other bundles and writes itself as the first one.
         * If the placeholder doesn't exist the plugin is written to the mapmodules div element.
         */
        _createControlElement: function () {
            return this.template.clone();
        },

        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        refresh: function () {
            const el = this.getElement();
            const handler = this.getHandler();
            if (!el || !handler) {
                return;
            }
            const { active, noUI } = handler.getState();
            const controller = handler.getController();
            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_layerswipe'
                    highlight='stroke'
                    icon={<SwipeIcon />}
                    visible={!noUI}
                    title={Oskari.getMsg('LayerSwipe', 'toolLayerSwipe')}
                    onClick={() => controller.toggleTool()}
                    iconActive={active}
                    position={this.getLocation()}
                    iconSize='20px'
                />
            );
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
