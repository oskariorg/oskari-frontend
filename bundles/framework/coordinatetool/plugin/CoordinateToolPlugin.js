import React from 'react';
import ReactDOM from 'react-dom';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import { CoordinatePluginHandler } from './CoordinatePluginHandler';
import styled from 'styled-components';

const StyledDiv = styled('div')`
    font-weight: bold;
    font-family: Open Sans,Arial,sans-serif;
`;
const CoordinateIcon = () => (<StyledDiv>XY</StyledDiv>);
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
    function (instance, config, locale, mapmodule, sandbox) {
        var me = this;
        me._locale = locale || Oskari.getMsg.bind(null, 'coordinatetool');
        me._config = config || {};
        me._mapmodule = mapmodule || Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        me._defaultLocation = 'top right';
        me._index = 60;
        me._name = 'CoordinateToolPlugin';
        me._templates = {
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"></div>')
        };
        // me.lastLonLat = null;
        me.handler = new CoordinatePluginHandler(me, me._mapmodule, me._config, me._instance);
        me.popupOpen = false;
        me.handler.addPopupListener((isOpen) => {
            me.popupOpen = isOpen;
            me.renderButton();
        });
    }, {
        _setLayerToolsEditModeImpl: function () {
            if (this.inLayerToolsEditMode() && this.isOpen()) {
                this.handler.getController().showPopup();
            }
        },
        _createControlElement: function () {
            var me = this,
                el = me._templates.coordinatetool.clone();

            if (me._config.noUI) {
                return null;
            }

            return el;
        },
        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
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
            if (!this.hasUI()) {
                return;
            }

            this.inMobileMode = mapInMobileMode;

            this.teardownUI();
            if (!this._config.noUI) {
                this._element = this._createControlElement();
                this.refresh();
                this.addToPluginContainer(this._element);
            }
        },

        hasUI: function () {
            return !this._config.noUI;
        },
        /**
         * Updates the given coordinates to the UI
         * @method @public refresh
         *
         * @param {Object} data contains lat/lon information to show on UI
         */
        refresh: function (data) {
            this.renderButton();
            return data;
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
                    if (event.getBundleId() === 'coordinatetool') {
                        me.handler.getController().showPopup();
                    }
                }
            };
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         */
        changeToolStyle: function () {
            this.renderButton();
        },

        renderButton: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            ReactDOM.render(
                <MapModuleButton
                    className='t_coordinatetool'
                    title={this._locale('display.tooltip.tool')}
                    icon={<CoordinateIcon />}
                    onClick={() => {
                        if (!this.inLayerToolsEditMode()) {
                            this.handler.getController().showPopup();
                        }
                    }}
                    iconActive={!!this.popupOpen}
                    position={this.getLocation()}
                />,
                el[0]
            );
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
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
