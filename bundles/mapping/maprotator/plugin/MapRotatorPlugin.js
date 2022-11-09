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
    }, {
        handleEvents: function () {
            var me = this;
            var DragRotate = new olInteractionDragRotate();
            this._map.addInteraction(DragRotate);
            var degrees;
            var eventBuilder = Oskari.eventBuilder('map.rotated');

            this._map.on('pointerdrag', function (e) {
                degrees = me.getRotation();
                if (degrees !== me.getDegrees()) {
                    me.rotateIcon(degrees);
                    me.setDegrees(degrees);
                    var event = eventBuilder(degrees);
                    me._sandbox.notifyAll(event);
                }
            });
        },
        setDegrees: function (degree) {
            this.previousDegrees = degree;
        },
        getDegrees: function () {
            return this.previousDegrees;
        },
        /**
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var compass = this._templates.maprotatortool.clone();

            this._locale = Oskari.getLocalization('maprotator', Oskari.getLang() || Oskari.getDefaultLanguage()).display;

            if (!this.hasUi()) {
                return null;
            }
            return compass;
        },
        rotateIcon: function (degrees) {
            const el = this.getElement();
            if (el) {
                this._renderButton(degrees, null, el);
            }
        },
        _renderButton: function (degrees, style, element) {
            let el = element;
            if (!element) {
                el = this.getElement();
            }
            if (!el) return;

            let styleName = style;
            if (!style) {
                styleName = this.getToolStyleFromMapModule();
            }

            ReactDOM.render(
                <MapModuleButton
                    className='t_maprotator'
                    title={this._locale.tooltip.tool}
                    icon={<StyledIcon degrees={degrees || 0}><NorthIcon /></StyledIcon>}
                    styleName={styleName || 'rounded-dark'}
                    onClick={() => {
                        if (!this.inLayerToolsEditMode()) {
                            this.setRotation(0);
                        }
                    }}
                    iconActive={degrees !== 0}
                    position={this.getLocation()}
                />,
                element[0]
            );
        },
        _createUI: function () {
            this._element = this._createControlElement();
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
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this;
            var el = div || me.getElement();

            if (!el) {
                return;
            }

            const styleClass = style || 'rounded-dark';

            this._renderButton(this.getDegrees() || 0, styleClass, el);
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
                    var me = this;
                    if (event.getBundleId() === 'maprotator') {
                        me._toggleToolState();
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
            var conf = this._config;
            var isMobile = mapInMobileMode || Oskari.util.isMobile();
            if (this.getElement()) {
                this.teardownUI(true);
            }

            this.inMobileMode = isMobile;
            this._createUI();

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                this.changeToolStyle(conf.toolStyle, this.getElement());
            } else {
                var toolStyle = this.getToolStyleFromMapModule();
                this.changeToolStyle(toolStyle, this.getElement());
            }
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
