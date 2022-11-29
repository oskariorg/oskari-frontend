import React from 'react';
import ReactDOM from 'react-dom';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';
import styled from 'styled-components';

import './request/ToggleFullScreenControlRequest';

// Icon is too small with defaults (18x18px)
const StyledButton = styled(MapModuleButton)`
> span {
    font-size: 22px;
    max-height: 22px;
    max-width: 22px;
    > svg {
        max-height: 22px;
        max-width: 22px;
    }
}
`;

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
        me._templates = {
            plugin: jQuery('<div class="mapplugin fullscreen"></div>')
        };
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
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _startPluginImpl: function (sandbox) {
            this.setEnabled(this._enabled);
            return this.setVisible(this._visible);
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         *
         */
         changeToolStyle: function (style, div) {
            const conf = this.getConfig();
            // Change the style if in the conf
            if (style) {
                conf.toolStyle = style;
            }
            this.refresh();
        },
        getStyleForRender: function() {
            const conf = this.getConfig();
            let toolStyle;
            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                toolStyle = conf.toolStyle;
            } else {
                toolStyle = this.getToolStyleFromMapModule();
            }
            return toolStyle || 'rounded-dark';
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.isVisible() || !this.isEnabled()) {
                // no point in drawing the ui if we are not visible or enabled
                return;
            }

            this.teardownUI();

            this.inMobileMode = mapInMobileMode;

            this._element = this._createControlElement();
            this.refresh();
            this.addToPluginContainer(this.getElement());
        },
        /**
         * @public @method refresh
         */
        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            const isFullscreen = !!this.state.fullscreen;
            ReactDOM.render(
                <StyledButton
                    className='t_fullscreen'
                    styleName={this.getStyleForRender()}
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    iconActive={isFullscreen}
                    onClick={() => {
                        if (!this.inLayerToolsEditMode()) {
                            this.setState({
                                fullscreen: !isFullscreen
                            });
                        }
                    }}
                    position={this.getLocation()}
                />
                ,
                el[0]
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
            this.setVisible(request.isVisible());
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
