import React from 'react';
import ReactDOM from 'react-dom';
import { BackgroundLayerSelection } from './BackgroundLayerSelection';
import { ThemeProvider } from 'oskari-ui/util';

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
    function (config) {
        var i;
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin';
        this._defaultLocation = 'bottom center';
        this._index = 0;
        this._name = 'BackgroundLayerSelectionPlugin';
        this.error = !(this._config && this._config.baseLayers && this._config.baseLayers.length);
        // Hackhack, make sure baseLayers aren't numbers.
        if (!this.error) {
            for (i = 0; i < this._config.baseLayers.length; i += 1) {
                if (typeof this._config.baseLayers[i] === 'number') {
                    this._config.baseLayers[i] =
                        this._config.baseLayers[i].toString();
                }
            }
        }
    }, {
        /** @static @property __name module name */
        __name: 'BackgroundLayerSelectionPlugin',

        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         *
         */
        _initImpl: function () {
            // selected layer's li is marked by selected-class
            // if dropdown is open, li with selected-class will be hidden
            // currentSelection stores the current selection so we don't have to reorder the list elements
            this.template = jQuery(
                '<div class="backgroundLayerSelectionPlugin oskariui mapplugin">' +
                '<div class="content">' +
                '</div></div>'
            );
            // used in case the module config is faulty
            this.errorTemplate = jQuery(
                '<div class="backgroundLayerSelectionPlugin oskariui mapplugin">' +
                '  <div class="bg"></div>' +
                '  <div class="error">No baseLayers defined in configuration</div>' +
                '</div>'
            );
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
                AfterRearrangeSelectedMapLayerEvent: function (event) {
                    // Update selection, bottom baselayer might've changed
                    // this._updateUISelection();
                    this.refresh();
                },

                /**
                 * @method AfterMapLayerRemoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
                 *
                 * Removes the layer from selection
                 */
                AfterMapLayerRemoveEvent: function (event) {
                    // Redo ui, one of our layers might've been deleted
                    // TODO Check if event.getMapLayer() id is in our layers first...
                    // if not, still do this._updateUISelection() as the selected
                    // layer might still have changed
                    // this._createLayerSelectionElements();
                    this.refresh();
                },

                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Adds the layer to selection
                 */
                AfterMapLayerAddEvent: function (event) {
                    // Redo ui, we might've gotten a previously missing layer
                    // TODO Check if event.getMapLayer() id is in our layers first...
                    // if not, still do this._updateUISelection() as the selected
                    // layer might still have changed
                    // this._createLayerSelectionElements();
                    this.refresh();
                },

                /**
                 * @method AfterMapMoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
                 *
                 * Adds the layer to selection
                 */
                MapLayerEvent: function (event) {
                    // TODO add check for event.getMapLayer().getId() here?
                    // this._createLayerSelectionElements();
                    this.refresh();
                },
                MapSizeChangedEvent: function (evt) {
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
        _getBottomLayer: function () {
            return this.getSandbox().findAllSelectedMapLayers()[0];
        },

        /**
         * Does the actual layer selection update
         * @param  {String} newId Id of the new base layer
         * @private
         */
        _updateSelection: function (newId) {
            if (this.error) {
                return;
            }
            const currentBottomId = this._getBottomLayer()?.getId();
            if (newId === currentBottomId) {
                // user clicked already selected option, do nothing
                return;
            }
            const sb = this.getSandbox();
            const { baseLayers = [] } = this.getConfig();

            // switch bg layer (no need to call update on ui, we should catch the event)
            // - check if current bottom layer exists & is in our list (if so, remove)
            if (currentBottomId && baseLayers.includes(currentBottomId.toString())) {
                sb.postRequestByName('RemoveMapLayerRequest', [currentBottomId]);
            }
            // - check if new selection is already selected, remove if so as rearrange doesn't seem to work
            if (sb.isLayerAlreadySelected(newId)) {
                sb.postRequestByName('RemoveMapLayerRequest', [newId]);
            }
            // - add to bottom
            sb.postRequestByName('AddMapLayerRequest', [newId, { toPosition: 0 }]);
        },

        /**
         * @private @method  _createLayerSelectionElements
         * Creates LI elements for the bg layers.
         * These are used in both dropdown and list mode.
         *
         */
        _createLayerSelectionElements: function () {
            if (this.error) {
                return;
            }
            var me = this,
                element = me.getElement();
            if (!element) {
                return;
            }
            var layer,
                layerIds = me.getConfig().baseLayers,
                i;
            // remove children, this function is called on update
            let layers = [];
            for (i = 0; i < layerIds.length; i += 1) {
                layer = me.getSandbox().findMapLayerFromAllAvailable(
                    layerIds[i]
                );
                if (layer) {
                    layers.push({
                        id: layerIds[i],
                        title: layer.getName(),
                        onClick: (id) => this._updateSelection(id)
                    });
                }
            }

            const mapWidth = this.getSandbox().getMap().getWidth();

            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <BackgroundLayerSelection
                        isMobile={Oskari.util.isMobile()}
                        layers={layers}
                        current={this._getBottomLayer()}
                        mapWidth={mapWidth}
                    />
                </ThemeProvider>,
                element[0]
            );
        },

        _createControlElement: function () {
            var me = this,
                el;

            if (me.error) {
                // No baseLayers in config, show error.
                el = me.errorTemplate.clone();
            } else {
                el = me.template.clone();
            }

            return el;
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
