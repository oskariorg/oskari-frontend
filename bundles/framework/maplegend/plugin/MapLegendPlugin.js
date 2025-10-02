import React from 'react';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import { QuestionOutlined } from '@ant-design/icons';
import { showMapLegendPopup } from '../components/MapLegendPopup';
import { createRoot } from 'react-dom/client';

Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
    function (config) {
        this._config = config || {};
        this._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin';
        this._defaultLocation = 'top right';
        this._index = 90;
        this._popupControls = null;
        this._reactRoot = null;
    }, {
        resetUI: function () {
            if (this.isOpen()) {
                this.clearPopup();
            }
        },
        _startPluginImpl: function () {
            this.addToPluginContainer(this._createControlElement());
            this.refresh();
            return true;
        },
        _stopPluginImpl: function () {
            this.clearPopup();
            this.removeFromPluginContainer(this.getElement());
        },
        _createControlElement: function () {
            return jQuery('<div class="mapplugin maplegend"></div>').clone();
        },

        clearPopup: function () {
            if (this._popupControls) {
                this._popupControls.close();
            }
            this._popupControls = null;
            this.refresh();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            const title = Oskari.getMsg('maplegend', 'tooltip');
            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_maplegend'
                    title={title}
                    icon={<QuestionOutlined />}
                    onClick={() => this.togglePopup()}
                    iconActive={this.isOpen()}
                    position={this.getLocation()}
                />
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
            if (this.isOpen()) {
                this.clearPopup();
                return;
            }
            const legends = this.getLegends();
            this._popupControls = showMapLegendPopup(legends, (id) => this.getLegend(id), () => this.clearPopup());
            this.refresh();
        },
        getLegends: function () {
            return this.getSandbox().findAllSelectedMapLayers()
                .filter(layer => layer.getLegendImage())
                .map(layer => ({
                    id: layer.getId(),
                    title: Oskari.util.sanitize(layer.getName())
                }));
        },
        isOpen: function () {
            return !!this._popupControls;
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
