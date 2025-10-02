import React from 'react';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import { CoordinatePluginHandler } from './CoordinatePluginHandler';
import { TextIcon } from 'oskari-ui/components/icons';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin
 * Provides a coordinate display for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (config) {
        var me = this;
        me._locale = Oskari.getMsg.bind(null, 'coordinatetool');
        me._config = config || {};
        me._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        me._defaultLocation = 'top right';
        me._index = 60;
        me._name = 'CoordinateToolPlugin';
        me._templates = {
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"></div>')
        };
        me._reactRoot = null;
    }, {
        resetUI: function () {
            if (this.handler && this.popupOpen) {
                this.handler.getController().popupCleanup();
            }
        },
        _createControlElement: function () {
            return this._templates.coordinatetool.clone();
        },
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this.refresh();
        },
        teardownUI: function (preserveElement) {
            // remove old element
            this.removeFromPluginContainer(this.getElement(), preserveElement);
            if (this.handler) {
                this.handler.getController().popupCleanup();
            }
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            this.addToPluginContainer(this.getElement());
            this.refresh();
        },
        setNoUI: function (value) {
            this._config.noUI = value;
        },
        hasUI: function () {
            return !this._config.noUI;
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @method @public refresh
         */
        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            if (!this.handler) {
                // init handler here so we can be sure we have a sandbox for this instance
                this.handler = new CoordinatePluginHandler(this, this.getMapModule(), this.getConfig());
                this.popupOpen = false;
                this.handler.addPopupListener((isOpen) => {
                    this.popupOpen = isOpen;
                    this.refresh();
                });
            }

            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_coordinatetool'
                    visible={this.hasUI()}
                    title={this._locale('display.tooltip.tool')}
                    icon={<TextIcon text='XY' />}
                    onClick={() => this.handler.getController().showPopup()}
                    iconActive={!!this.popupOpen}
                    position={this.getLocation()}
                />);
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function () {
            return this._element;// jQuery('.mapplugin.coordinatetool');
        },
        /**
         * Create event handlers.
         * @method @private _createEventHandlers
         */
        _createEventHandlers: function () {
            return {
                /**
                 * @method RPCUIEvent
                 * will open/close coordinatetool's popup
                 */
                RPCUIEvent: function (event) {
                    var me = this;
                    if (me.handler && event.getBundleId() === 'coordinatetool') {
                        me.handler.getController().showPopup();
                    }
                }
            };
        },

        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
            // TODO: tear down handler?
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
