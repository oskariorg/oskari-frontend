import olView from 'ol/View';
import olControlOverviewMap from 'ol/control/OverviewMap';
import olLayerTile from 'ol/layer/Tile';
import olLayerImage from 'ol/layer/Image';
import olLayerVector from 'ol/layer/Vector';
import olLayerVectorTile from 'ol/layer/VectorTile';
import React from 'react';
import ReactDOM from 'react-dom';
import { MapModuleButton } from '../../MapModuleButton';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin
 *
 * Provides indexmap functionality for map. Uses image from plugin resources as the index map.
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     *
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin';
        me._defaultLocation = 'bottom right';
        me._index = 5;
        me._name = 'IndexMapPlugin';
        me._indexMap = null;
        me._baseLayerId = null;
        me._indElement = null;
    },
    {
        _stopPluginImpl: function () {
            this._removeIndexMap();
            this.teardownUI();
        },
        /**
         * @private @method _createControlElement
         * Constructs/initializes the indexmap  control for the map.
         *
         *
         * @return {jQuery} element
         */
        _createControlElement: function () {
            /* overview map */
            var me = this,
                conf = me.getConfig(),
                el;

            if (conf.containerId) {
                el = jQuery('#' + conf.containerId);
            } else {
                el = jQuery('<div class="mapplugin indexmap"></div>');
            }
            // Ol indexmap target
            me._indElement = jQuery('<div class="mapplugin ol_indexmap"></div>');
            el.append(me._indElement);

            var toggleButton = jQuery('<div class="indexmapToggle"></div>');
            // button has to be added separately so the element order is correct...
            el.append(toggleButton);
            var toolStyle = this.getToolStyleFromMapModule();
            this.changeToolStyle(toolStyle, el);

            // add toggle functionality to button
            this._createIndexMap();
            return el;
        },
        /**
         * @method _getOverviewLayers
         * Creates copy of base layer with same source.
         *
         * @return {Array<ol/layer/Layer>} returns empty array if no layers available
         */
        _getOverviewLayers: function () {
            const result = [];
            const mapmodule = this.getMapModule();
            const layer = mapmodule.getBaseLayer();
            if (!layer) return result;
            const layerId = layer.getId();
            const olLayer = mapmodule.getOLMapLayers(layerId);
            if (!Array.isArray(olLayer)) return result;
            olLayer.forEach(l => {
                const source = l.getSource();
                if (l instanceof olLayerTile) {
                    result.push(new olLayerTile({ source }));
                } else if (l instanceof olLayerImage) {
                    result.push(new olLayerImage({ source }));
                } else if (l instanceof olLayerVector) {
                    result.push(new olLayerVector({
                        source,
                        style: l.getStyle()
                    }));
                } else if (l instanceof olLayerVectorTile) {
                    result.push(new olLayerVectorTile({
                        source,
                        style: l.getStyle()
                    }));
                }
            });
            this._baseLayerId = layerId;
            return result;
        },
        _createIndexMap: function (collapsed = true) {
            if (this._indexMap) return;
            const olMap = this.getMap();
            const projection = olMap.getView().getProjection();
            this._indexMap = new olControlOverviewMap({
                target: this._indElement[0],
                layers: this._getOverviewLayers(),
                collapsed,
                view: new olView({ projection })
            });
            olMap.addControl(this._indexMap);
        },
        _removeIndexMap: function () {
            if (!this._indexMap) return;
            this.getMap().removeControl(this._indexMap);
            this._baseLayerId = null;
            this._indexMap = null;
        },
        _handleClick: function () {
            if (!this._indexMap) {
                this._createIndexMap(false);
                return;
            }
            if (this._indexMap.getCollapsed()) {
                const baseLayer = this.getMapModule().getBaseLayer();
                if (!baseLayer || this._baseLayerId === baseLayer.getId()) {
                    this._indexMap.setCollapsed(false);
                    return;
                }
                // base layer changed, create new index map
                this._removeIndexMap();
                this._createIndexMap(false);
            } else {
                this._indexMap.setCollapsed(true);
            }
        },
        changeToolStyle: function (style, element) {
            this.renderButton(style, element);
        },
        renderButton: function (style, element) {
            let el = element;
            if (!element) {
                el = this.getElement();
            }
            if (!el) return;
            el = el.find('.indexmapToggle');

            let styleName = style;
            if (!style) {
                styleName = this.getToolStyleFromMapModule();
            }
            if (!styleName) {
                styleName = 'rounded-dark';
            }

            ReactDOM.render(
                <div className={`indexmapToggle ${styleName}`}>
                    <MapModuleButton
                        className='t_indexmap'
                        onClick={() => {
                            if (!this.inLayerToolsEditMode()) {
                                this._handleClick();
                            }
                        }}
                        size='48px'
                        styleName={styleName}
                        icon={<div className='icon' />}
                    />
                </div>,
                el[0]
            );
        },
        _setLayerToolsEditModeImpl: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            if (this.inLayerToolsEditMode()) {
                // close map
                if (this._indexMap) {
                    this._indexMap.setCollapsed(true);
                }
            }
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
