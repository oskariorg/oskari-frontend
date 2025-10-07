import React from 'react';
import { BackgroundLayerSelection } from './BackgroundLayerSelection';
import { ThemeProvider } from 'oskari-ui/util';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides a background maplayer selection "dropdown" on top of the map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginBackgroundLayerSelectionPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin';
        this._defaultLocation = 'bottom center';
        this._index = 0;
        this._name = 'BackgroundLayerSelectionPlugin';
        // make sure baseLayers aren't numbers.
        this._baseLayerIds = this._config?.baseLayers?.map(id => typeof id === 'number' ? id.toString() : id);
        this._baseLayerOptions = [];
        this._template = jQuery('<div class="backgroundLayerSelectionPlugin oskariui mapplugin"/>');
        this._reactRoot = null;
    }, {
        /** @static @property __name module name */
        __name: 'BackgroundLayerSelectionPlugin',
        _initImpl: function () {
            if (!this._getBaseLayerIds().length) {
                Oskari.log(this.getName()).error('No baseLayers defined in configuration');
            }
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
                /**
                 * @method AfterRearrangeSelectedMapLayerEvent
                 * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
                 *
                 * Rearranges layers
                 */
                AfterRearrangeSelectedMapLayerEvent: function () {
                    // Update selection, bottom baselayer might've changed
                    this.refresh();
                },

                /**
                 * @method AfterMapLayerRemoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
                 *
                 * Removes the layer from selection
                 */
                AfterMapLayerRemoveEvent: function () {
                    // Update selection, bottom baselayer might've changed
                    this.refresh();
                },

                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Adds the layer to selection
                 */
                AfterMapLayerAddEvent: function () {
                    // Update selection, bottom baselayer might've changed
                    this.refresh();
                },

                /**
                 * @method AfterMapMoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
                 *
                 * Adds the layer to selection
                 */
                MapLayerEvent: function (event) {
                    const layerId = event.getLayerId()?.toString();
                    if (layerId && !this._getBaseLayerIds().includes(layerId)) {
                        // handle mass events and base layers only
                        return;
                    }
                    if (event.getOperation() === 'update') {
                        // clear to get updated options on refresh
                        this._baseLayerOptions = [];
                    }
                    this.refresh();
                },
                MapSizeChangedEvent: function () {
                    this.refresh();
                }
            };
        },

        /**
         * @private @method _getBottomLayer
         * Returns the bottom-most selected layer if any
         *
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        _getBottomLayerId: function () {
            return this.getSandbox().findAllSelectedMapLayers()[0]?.getId().toString();
        },
        _getSelectedId: function () {
            const ids = this._getBaseLayerIds();
            // base layer is handled as base layer only when it's bottom layer
            const bottomId = this._getBottomLayerId();
            return ids.includes(bottomId) ? bottomId : undefined;
        },
        _getBaseLayerIds: function () {
            return this._baseLayerIds || [];
        },
        _getBaseLayerOptions: function () {
            if (this._baseLayerOptions.length) {
                return this._baseLayerOptions;
            }
            const ids = this._getBaseLayerIds();
            const sb = this.getSandbox();
            const options = ids.map(id => ({
                id,
                title: sb.findMapLayerFromAllAvailable(id)?.getName(),
                action: () => this._onSelect(id)
            })).filter(opt => opt.title);
            if (ids.length === options.length) {
                // store if we have full set
                this._baseLayerOptions = options;
            }
            return options;
        },
        /**
         * Does the actual layer selection update
         * @param  {String} newId Id of the new base layer
         * @private
         */
        _onSelect: function (newId) {
            const selectedId = this._getSelectedId();
            if (newId === selectedId) {
                // user clicked already selected option, do nothing
                return;
            }
            const sb = this.getSandbox();
            // switch bg layer (no need to call update on ui, we should catch the event)
            // - check if current bottom layer exists & is in our list (if so, remove)
            if (selectedId) {
                sb.postRequestByName('RemoveMapLayerRequest', [selectedId]);
            }
            // - check if new selection is already selected, remove if so as rearrange doesn't seem to work
            if (sb.isLayerAlreadySelected(newId)) {
                sb.postRequestByName('RemoveMapLayerRequest', [newId]);
            }
            // - add to bottom
            sb.postRequestByName('AddMapLayerRequest', [newId, { toPosition: 0 }]);
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        /**
         * @private @method  _createLayerSelectionElements
         * Creates LI elements for the bg layers.
         * These are used in both dropdown and list mode.
         *
         */
        _createLayerSelectionElements: function () {
            const element = this.getElement();
            if (!element) {
                return;
            }
            this.getReactRoot(element[0]).render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <BackgroundLayerSelection
                        isMobile={Oskari.util.isMobile()}
                        baseLayers={this._getBaseLayerOptions()}
                        selectedId={this._getSelectedId()}
                        mapWidth={this.getSandbox().getMap().getWidth()}
                    />
                </ThemeProvider>
            );
        },

        _createControlElement: function () {
            return this._template.clone();
        },

        refresh: function () {
            this._createLayerSelectionElements();
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
    }
);
