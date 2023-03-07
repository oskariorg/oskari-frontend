import React from 'react';
import ReactDOM from 'react-dom';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';
import olInteractionDragRotate from 'ol/interaction/DragRotate';
import styled from 'styled-components';
import { NorthIcon } from 'oskari-ui/components/icons';

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
        me.inMobileMode = false;
        this._eventsHandled = false;
    }, {
        handleEvents: function () {
            if (this._eventsHandled) {
                // only add interaction/event handling once and not on every redrawUI()
                return;
            }
            this._eventsHandled = true;
            var me = this;
            var DragRotate = new olInteractionDragRotate();
            this.getMap().addInteraction(DragRotate);
            var eventBuilder = Oskari.eventBuilder('map.rotated');

            this._map.on('pointerdrag', function (e) {
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
        /**
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            this._locale = Oskari.getLocalization('maprotator', Oskari.getLang() || Oskari.getDefaultLanguage()).display;
            if (!this.hasUi()) {
                return null;
            }
            return this._templates.maprotatortool.clone();
        },
        rotateIcon: function (degrees) {
            this._renderButton(degrees);
        },
        _renderButton: function (degrees = this.getDegrees()) {
            let el = this.getElement();
            if (!el) return;

            ReactDOM.render(
                <MapModuleButton
                    className='t_maprotator'
                    title={this._locale.tooltip.tool}
                    icon={<StyledIcon degrees={degrees || 0}><NorthIcon /></StyledIcon>}
                    onClick={() => {
                        if (!this.inLayerToolsEditMode()) {
                            this.setRotation(0);
                        }
                    }}
                    iconActive={degrees !== 0}
                    position={this.getLocation()}
                />,
                el[0]
            );
        },
        _createUI: function () {
            this._element = this._createControlElement();
            this.renderButton();
            this.handleEvents();
            this.addToPluginContainer(this._element);
        },
        setRotation: function (deg) {
            // if deg is number then transform degrees to radians otherwise use 0
            var rot = (typeof deg === 'number') ? deg / 57.3 : 0;
            // if deg is number use it for degrees otherwise use 0
            var degrees = (typeof deg === 'number') ? deg : 0;
            this.rotateIcon(degrees);
            this._map.getView().setRotation(rot);
            this.setDegrees(degrees);
        },
        getRotation: function () {
            var rot = this._map.getView().getRotation();
            // radians to degrees with one decimal
            var deg = Math.round(rot * 573) / 10;
            return deg;
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         */
        changeToolStyle: function () {
            this._renderButton();
        },
        /**
         * Create event handlers.
         * @method @private _createEventHandlers
         */
        _createEventHandlers: function () {
            return {
                MapSizeChangedEvent: function () {
                    this.setRotation(this.getDegrees());
                },
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
            var isMobile = mapInMobileMode || Oskari.util.isMobile();
            if (this.getElement()) {
                this.teardownUI(true);
            }

            this.inMobileMode = isMobile;
            this._createUI();
        },
        teardownUI: function () {
            // detach old element from screen
            if (!this.getElement()) {
                return;
            }
            this.getElement().detach();
            this.removeFromPluginContainer(this.getElement());
        },
        hasUi: function () {
            return !this._config.noUI;
        },
        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function () {
            return this._element;
        },
        stopPlugin: function () {
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
