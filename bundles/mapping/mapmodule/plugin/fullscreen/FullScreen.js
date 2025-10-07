import React from 'react';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';

import './request/ToggleFullScreenControlRequest';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin';
        me._defaultLocation = 'top left';
        me._index = 1;
        me._name = 'FullScreenPlugin';
        me._element = null;
        me.state = {};
        me._sandbox = null;
        this._isVisible = true;
        me._templates = {
            plugin: jQuery('<div class="mapplugin fullscreen"></div>')
        };
        this._reactRoot = null;
    },
    {
        /**
         * @method _createControlElement
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            return this._templates.plugin.clone();
        },
        /**
         * @method _startPluginImpl
         */
        _startPluginImpl: function () {
            if (!Oskari.util.isMobile()) {
                this.setElement(this._createControlElement());
                this.addToPluginContainer(this.getElement());
                this.refresh();
            }
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            this.refresh();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @public @method refresh
         */
        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            if (Oskari.util.isMobile()) {
                this.teardownUI();
                return;
            }

            const isFullscreen = !!this.state.fullscreen;
            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_fullscreen'
                    visible={this.isVisible()}
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    iconActive={isFullscreen}
                    iconSize='22px'
                    onClick={() => {
                        this.setState({
                            fullscreen: !isFullscreen
                        });
                    }}
                    position={this.getLocation()}
                />
            );
        },
        teardownUI: function () {
            this.removeFromPluginContainer(this.getElement());
        },
        /**
         * @method _stopPluginImpl
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
        },

        /**
         * @private @method  createRequestHandlers
         *
         * @return {Object} Request handler map
         */
        createRequestHandlers: function () {
            return {
                'MapModulePlugin.ToggleFullScreenControlRequest': this
            };
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
                MapSizeChangedEvent: function (evt) {
                    this.refresh();
                }
            };
        },
        /**
         * Handler for MapModulePlugin.ToggleFullScreenControlRequest
         *
         * Oskari.getSandbox().postRequestByName('MapModulePlugin.ToggleFullScreenControlRequest', [true/false]);
         *
         * @param {Oskari.mapframework.core.Core} core
         *      Reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.ToggleFullScreenControlRequest} request
         *      Request to handle
         */
        handleRequest: function (core, request) {
            this._isVisible = request.isVisible();
            this.refresh();
        },
        isVisible: function () {
            return this._isVisible;
        },
        setState: function (state) {
            this.state = state || {};
            if (this.state.fullscreen) {
                this._hideNavigation();
            } else {
                this._showNavigation();
            }
            this.refresh();
        },
        getState: function () {
            return this.state;
        },
        _showNavigation: function () {
            Oskari.dom.getMapContainerEl().classList.remove('oskari-map-window-fullscreen');
        },
        _hideNavigation: function () {
            Oskari.dom.getMapContainerEl().classList.add('oskari-map-window-fullscreen');
        }
    },
    {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
