import React from 'react';
import ReactDOM from 'react-dom';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import { QuestionOutlined } from '@ant-design/icons';
import { showMapLegendPopup } from './MapLegendPopup';

Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
    function (config, plugins) {
        var me = this;
        me._config = config || {};
        me._plugins = plugins;
        me._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin';
        me._defaultLocation = 'top right';
        me._templates = {
            maplegend: jQuery('<div class="mapplugin maplegend"></div>'),
            legendContainer: jQuery('<div class="legendSelector"></div>'),
            legendInfo: jQuery('<div class="legendInfo"></div>'),
            legendDivider: jQuery('<div class="maplegend-divider"></div>')
        };
        me._index = 90;
        me._element = null;
        me._isVisible = false;
        me._loc = null;
        me._popup = null;
        me._popupControls = null;
    }, {
        _setLayerToolsEditModeImpl: function () {
            if (this.inLayerToolsEditMode() && this.isOpen()) {
                this._toggleToolState();
            }
        },
        clearPopup: function () {
            if (this._popupControls) {
                this._popupControls.close();
            }
            this._popupControls = null;
            this.renderButton(null, null);
        },
        _createControlElement: function () {
            var me = this,
                loc = Oskari.getLocalization('maplegend', Oskari.getLang());
            var isMobile = Oskari.util.isMobile();

            this.inMobileMode = isMobile;
            me._loc = loc;

            return this.createDesktopElement();
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            const styleClass = style || 'rounded-dark';

            me.renderButton(styleClass, el);
        },

        renderButton: function (style, element) {
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
                    className='t_maplegend'
                    title={this._loc.tooltip}
                    icon={<QuestionOutlined />}
                    styleName={styleName || 'rounded-dark'}
                    onClick={() => {
                        if (!this.inLayerToolsEditMode()) {
                            this.togglePopup();
                        }
                    }}
                    iconActive={this._popupControls && this._popupControls !== null}
                    position={this.getLocation()}
                />,
                el[0]
            );
        },
        getLegend: function (legendId) {
            const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(legendId);
            if (!layer) {
                return;
            }
            return layer.getLegendImage();
        },
        togglePopup: function () {
            if (this._popupControls) {
                this.clearPopup();
            } else {
                const legends = this.getLegends();
                this._popupControls = showMapLegendPopup(legends, (id) => this.getLegend(id), () => this.clearPopup());
            }
            this.renderButton(null, null);
        },
        createDesktopElement: function () {
            var me = this;
            var legend = me._templates.maplegend.clone();
            var popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');
            me._popup = popupService.createPopup();
            me._popup.addClass('maplegend__popup');
            popupService.closeAllPopups(true);

            return legend;
        },
        getPopupPosition: function () {
            var popupLocation;

            if (this._config.location && this._config.location.classes === 'top left') {
                popupLocation = 'right';
            } else {
                popupLocation = 'left';
            }
            return popupLocation;
        },
        getLegends: function () {
            var layers = this.getSandbox().findAllSelectedMapLayers().slice(0);
            var legendLayers = [];

            layers.forEach(function (layer) {
                if (!layer.getLegendImage()) {
                    return;
                }
                var layerObject = {
                    id: layer.getId(),
                    title: Oskari.util.sanitize(layer.getName())
                };
                legendLayers.push(layerObject);
            });
            return legendLayers;
        },
        _createUI: function () {
            var me = this,
                conf = me._config;
            this._element = this._createControlElement();
            if (this._element) {
                this.addToPluginContainer(this._element);
            }
            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }
        },
        isOpen: function () {
            return this._isVisible;
        },

        redrawUI: function (mapInMobileMode, forced) {
            if (this.getElement()) {
                this.teardownUI(true);
            }

            this._createUI();
        },
        teardownUI: function () {
            // detach old element from screen
            if (this.getElement() !== undefined) {
                this.getElement().detach();
                this.removeFromPluginContainer(this.getElement());
            }
        },
        /**
         * Toggle tool state.
         * @method @private _toggleToolState
         */
        _toggleToolState: function () {
            if (this.isOpen()) {
                this._isVisible = false;
                this._popup.close(true);
                return this.isOpen();
            } else {
                this._isVisible = true;
                this.createDesktopElement();
            }
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
