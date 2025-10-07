import olView from 'ol/View';
import olControlOverviewMap from 'ol/control/OverviewMap';
import olLayerTile from 'ol/layer/Tile';
import olLayerImage from 'ol/layer/Image';
import olLayerVector from 'ol/layer/Vector';
import olLayerVectorTile from 'ol/layer/VectorTile';
import React from 'react';
import { MapModuleButton } from '../../MapModuleButton';
import { getNavigationTheme } from 'oskari-ui/theme';
import { createRoot } from 'react-dom/client';

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
        me._reactRoot = null;
    },
    {
        _startPluginImpl: function () {
            this._element = this._createControlElement();
            this.refresh();
            this.addToPluginContainer(this._element);
        },
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
            const conf = this.getConfig() || {};
            let el;

            if (conf.containerId) {
                el = jQuery('#' + conf.containerId);
            } else {
                el = jQuery('<div class="mapplugin indexmap"></div>');
            }

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
        _createIndexMap: function (collapsed = false) {
            if (this._indexMap) return;
            const el = this.getElement();
            if (!el) return;
            const indElement = jQuery('<div class="mapplugin ol_indexmap"></div>');
            const location = this.getLocation();
            if (location.includes('top')) {
                el.append(indElement);
            } else {
                el.prepend(indElement);
            }
            const olMap = this.getMap();
            const projection = olMap.getView().getProjection();
            this._indexMap = new olControlOverviewMap({
                target: indElement[0],
                layers: this._getOverviewLayers(),
                collapsed,
                view: new olView({ projection })
            });
            olMap.addControl(this._indexMap);
        },
        _removeIndexMap: function () {
            if (!this._indexMap) return;
            this.getMap().removeControl(this._indexMap);
            const el = this.getElement();
            el.find('.ol_indexmap').remove();
            this._baseLayerId = null;
            this._indexMap = null;
        },
        _handleClick: function () {
            if (!this._indexMap) {
                this._createIndexMap(false);
            } else {
                this._removeIndexMap();
            }
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        refresh: function () {
            let el = this.getElement();
            if (!el) {
                return;
            }
            const theme = this.getMapModule().getMapTheme();
            const helper = getNavigationTheme(theme);
            const isDark = Oskari.util.isDarkColor(helper.getPrimary());
            // the icon is switched based on styleName -> passed to classes -> see scss
            let styleName = 'bg-dark';
            if (!isDark) {
                styleName = 'bg-light';
            }

            this.getReactRoot(el[0]).render(
                <div className={`indexmapToggle ${styleName}`}>
                    <MapModuleButton
                        className='t_indexmap'
                        onClick={() => this._handleClick()}
                        size='48px'
                        icon={<div className='icon' />}
                    />
                </div>
            );
        },
        resetUI: function () {
            if (this._indexMap) {
                this._removeIndexMap();
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
