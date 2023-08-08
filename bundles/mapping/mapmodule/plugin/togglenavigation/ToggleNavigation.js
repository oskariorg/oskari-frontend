import React from 'react';
import ReactDOM from 'react-dom';
import { MenuOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';
import styled from 'styled-components';

import './request/ToggleNavigationRequest';

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
 * @class Oskari.mapframework.bundle.mapmodule.plugin.ToggleNavigationPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.ToggleNavigationPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.ToggleNavigationPlugin';
        me._defaultLocation = 'top left';
        me._index = 2;
        me._name = 'ToggleNavigationPlugin';
        me._element = null;
        const isMobile = Oskari.util.isMobile();
        me.state = {
            navigationVisible: !isMobile
        };
        me._sandbox = null;
        this._isVisible = isMobile;
        me._templates = {
            plugin: jQuery('<div class="mapplugin togglenavigation"></div>')
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
         */
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this.refresh();
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
        /**
         * @public @method refresh
         */
        refresh: function () {
            const el = this.getElement();
            const nav = [...Oskari.dom.getRootEl().children].find(c => c.localName === 'nav');
            if (!el || !nav) {
                return;
            }
            const isToggled = !!this.state.navigationVisible;
            ReactDOM.render(
                <StyledButton
                    className='t_navigationtoggle'
                    visible={this.isVisible()}
                    icon={<MenuOutlined />}
                    iconActive={isToggled}
                    onClick={() => {
                        this.setState({
                            navigationVisible: !isToggled
                        });
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
                'MapModulePlugin.ToggleNavigationRequest': this
            };
        },
        /**
         * Handler for MapModulePlugin.ToggleNavigationRequest
         *
         * Oskari.getSandbox().postRequestByName('MapModulePlugin.ToggleNavigationRequest', [true/false]);
         *
         * @param {Oskari.mapframework.core.Core} core
         *      Reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.ToggleNavigationRequest} request
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
            if (state.navigationVisible) {
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
            const nav = [...Oskari.dom.getRootEl().children].find(c => c.localName === 'nav');
            nav.style.display = 'block';
        },
        _hideNavigation: function () {
            const nav = [...Oskari.dom.getRootEl().children].find(c => c.localName === 'nav');
            nav.style.display = 'none';
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
