import React from 'react';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';
import olInteractionDragRotate from 'ol/interaction/DragRotate';
import { unByKey } from 'ol/Observable';
import styled from 'styled-components';
import { NorthIcon } from 'oskari-ui/components/icons';
import { createRoot } from 'react-dom/client';

const StyledIcon = styled.div.attrs(({ degrees }) => ({
    style: {
        transform: `rotate(${degrees}deg)`
    }
}))`
    width: 13px;
    height: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

Oskari.clazz.define('Oskari.mapping.maprotator.MapRotatorPlugin',
    function (config) {
        var me = this;
        me._config = config || {};
        me._clazz = 'Oskari.mapping.maprotator.MapRotatorPlugin';
        me._defaultLocation = 'top right';
        me._toolOpen = false;
        me._index = 80;
        me._currentRot = null;
        me.previousDegrees = null;
        me._templates = {
            maprotatortool: jQuery('<div class="mapplugin maprotator"></div>')
        };
        me._log = Oskari.log('Oskari.mapping.maprotator.MapRotatorPlugin');
        this._dragRotate = null;
        this._removeListenerKey = null;
        this._name = 'MapRotatorPlugin';
        this._reactRoot = null;
    }, {
        handleEvents: function () {
            if (this._dragRotate) {
                // only add interaction/event handling once and not on every redrawUI()
                return;
            }
            var me = this;
            this._dragRotate = new olInteractionDragRotate();
            this.getMap().addInteraction(this._dragRotate);
            var eventBuilder = Oskari.eventBuilder('map.rotated');
            this._removeListenerKey = this.getMap().on('pointerdrag', function (e) {
                const degrees = me.getRotation();
                if (degrees !== me.getDegrees()) {
                    me.rotateIcon(degrees);
                    me.setDegrees(degrees);
                    me._sandbox.notifyAll(eventBuilder(degrees));
                }
            });
        },
        setDegrees: function (degree) {
            this.previousDegrees = degree;
        },
        getDegrees: function () {
            return this.previousDegrees || 0;
        },
        rotateIcon: function (degrees) {
            this._renderButton(degrees);
        },
        setRotation: function (deg) {
            // if deg is number then transform degrees to radians otherwise use 0
            var rot = (typeof deg === 'number') ? deg / 57.3 : 0;
            // if deg is number use it for degrees otherwise use 0
            var degrees = (typeof deg === 'number') ? deg : 0;
            this.rotateIcon(degrees);
            this.getMap().getView().setRotation(rot);
            this.setDegrees(degrees);
        },
        getRotation: function () {
            var rot = this.getMap().getView().getRotation();
            // radians to degrees with one decimal
            var deg = Math.round(rot * 573) / 10;
            return deg;
        },
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.setDegrees(this.getRotation());
            this.refresh();
            this.handleEvents();
            this.addToPluginContainer(this._element);
        },
        _createControlElement: function () {
            this._locale = Oskari.getLocalization('maprotator', Oskari.getLang() || Oskari.getDefaultLanguage()).display;
            return this._templates.maprotatortool.clone();
        },
        refresh: function () {
            this._renderButton();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        _renderButton: function (degrees = this.getDegrees()) {
            let el = this.getElement();
            if (!el) {
                return;
            }

            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_maprotator'
                    visible={this.hasUI()}
                    title={this._locale.tooltip.tool}
                    icon={<StyledIcon degrees={degrees || 0}><NorthIcon /></StyledIcon>}
                    onClick={() => this.setRotation(0)}
                    iconActive={degrees !== 0}
                    position={this.getLocation()}
                />
            );
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
                    if (event.getBundleId() === 'maprotator') {
                        this._toggleToolState();
                    }
                }
            };
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode) {
            // we don't need to do anything here any more
        },
        teardownUI: function () {
            // detach old element from screen
            if (!this.getElement()) {
                return;
            }
            this.getElement().detach();
            this.removeFromPluginContainer(this.getElement());
        },
        hasUI: function () {
            return !this._config.noUI;
        },
        _stopPluginImpl: function () {
            this.setRotation(0);
            this.teardownUI();
            if (this._dragRotate) {
                this.getMap().removeInteraction(this._dragRotate);
            }
            if (this._removeListenerKey) {
                unByKey(this._removeListenerKey);
            }
            this._dragRotate = null;
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
