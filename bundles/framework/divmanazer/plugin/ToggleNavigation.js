import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.userinterface.plugin.ToggleNavigationPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define('Oskari.userinterface.plugin.ToggleNavigationPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.userinterface.plugin.ToggleNavigationPlugin';
        me._defaultLocation = 'top left';
        me._index = 2;
        me._name = 'ToggleNavigationPlugin';
        me._element = null;
        const isMobile = Oskari.util.isMobile();
        me._sandbox = null;
        this._isVisible = isMobile;
        this._active = this._isVisible && Oskari.dom.isNavigationVisible();
        me._templates = {
            plugin: jQuery('<div class="mapplugin togglenavigation"></div>')
        };
        me._reactRoot = null;
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
            const nav = Oskari.dom.getNavigationEl();
            if (!el || !nav) {
                return;
            }
            const isToggled = !!Oskari.dom.isNavigationVisible();
            this._active = isToggled;

            // Fixes button staying active or hovered after click
            this.getReactRoot(el[0]).unmount();

            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_navigationtoggle'
                    visible={this.isVisible()}
                    icon={<MenuOutlined />}
                    iconActive={isToggled}
                    iconSize='20px'
                    onClick={(e) => {
                        Oskari.dom.showNavigation(!isToggled);
                        this.redrawUI();
                    }}
                    position={this.getLocation()}
                    isNav={true}
                />);
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
        isVisible: function () {
            return this._isVisible;
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
                    // Hide navigation when moving from desktop to mobile
                    if (Oskari.dom.isNavigationVisible() && !this._isVisible && Oskari.util.isMobile()) {
                        this._isVisible = true;
                        Oskari.dom.showNavigation(false);
                        this.refresh();
                    }
                    if (this._active !== Oskari.dom.isNavigationVisible()) {
                        this.refresh();
                    }
                }
            };
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
