import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { MapLayers } from './MapLayers/MapLayers';
import ReactDOM from 'react-dom';
import { MapLayersHandler } from '../handler/MapLayersHandler';

/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelMapLayers
 *
 * Represents a layer listing view for the publisher as an Oskari.userinterface.component.AccordionPanel
 * and control for the published map layer selection plugin. Has functionality to promote layers
 * to users and let the user select base layers for the published map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelMapLayers',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.insatnce} instance the instance
     */
    function (sandbox, mapmodule, localization, instance) {
        var me = this;
        me.loc = localization;
        me.instance = instance;
        me.sandbox = sandbox;
        me.mapModule = mapmodule;
        me.isDataVisible = false;

        me.config = {
            layers: {
                promote: [{
                    text: me.loc.layerselection.promote,
                    id: [24] // , 203
                }],
                preselect: ['base_35']
            }
        };

        me.showLayerSelection = false;
        this.panel = null;
        this.handler = null;
    }, {
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Updates the layerlist
             */
            AfterMapLayerAddEvent: function (event) {
                this.handlePanelUpdate();
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Updates the layerlist
             */
            AfterMapLayerRemoveEvent: function (event) {
                this.handlePanelUpdate();
            },
            /**
             * @method AfterRearrangeSelectedMapLayerEvent
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Updates the layerlist
             */
            AfterRearrangeSelectedMapLayerEvent: function (event) {
                if (event._creator !== this.getName() && event._fromPosition !== event._toPosition) {
                    this.handlePanelUpdate();
                }
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             * Calls flyouts handlePanelUpdate() and handleDrawLayerSelectionChanged() functions
             */
            'MapLayerEvent': function (event) {
                if (event.getOperation() === 'update') {
                    this.handlePanelUpdate();
                }
            },

            /**
             * @method MapLayerVisibilityChangedEvent
             */
            MapLayerVisibilityChangedEvent: function (event) {
                this.handlePanelUpdate();
            }
        },
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
         */
        init: function (data) {
            for (const p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.registerForEventByName(this, p);
                }
            }

            this.handler = new MapLayersHandler(this.instance.getSandbox(), this.mapModule, data, () => this.handlePanelUpdate());

            if (!this.panel) {
                this.panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );
                this.panel.setTitle(this.loc.layerselection.label);
                this._populateMapLayerPanel();
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelMapLayers';
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            return this.panel;
        },
        /**
         * Returns the state of the plugin.
         *
         * @method isEnabled
         * @return {Boolean} true if the plugin is visible on screen.
         */
        isEnabled: function () {
            return this.handler.getState().showLayerSelection;
        },

        /**
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            const state = this.handler.getState();
            let conf = {};
            if (state.showLayerSelection) {
                conf = {
                    configuration: {
                        mapfull: {
                            conf: {
                                plugins: [{
                                    id: 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
                                    config: {
                                        defaultBaseLayer: state.defaultBaseLayer,
                                        baseLayers: state.baseLayers.map(l => l.getId()),
                                        showMetadata: state.showMetadata
                                    }
                                }]
                            }
                        }
                    }
                };
            }
            if (state.showMetadata) {
                // published map needs to also include 'metadataflyout' bundle if we want to show metadata
                conf.configuration.metadataflyout = {};
            }

            state.externalOptions.forEach(opt => {
                conf.configuration = {
                    ...conf.configuration,
                    ...opt.tool.getValues()
                };
            });
            return conf;
        },
        /**
         * Returns any errors found in validation (currently doesn't check anything) or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function () {
            var errors = [];
            return errors;
        },

        /**
         * Returns the published map layer selection
         *
         * @method _getLayersList
         * @private
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        _getLayersList: function () {
            return this.instance.sandbox.findAllSelectedMapLayers();
        },

        /**
         * Populates the map layers panel in publisher
         *
         * @method _populateMapLayerPanel
         * @private
         */
        _populateMapLayerPanel: function () {
            const contentPanel = this.panel.getContainer();
            contentPanel.empty();

            const content = jQuery('<div />');
            contentPanel.append(content);

            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
                    <MapLayers
                        state={this.handler.getState()}
                        controller={this.handler.getController()}
                    />
                </LocaleProvider>,
                content[0]
            );
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function () {
            this.handler?.getState()?.externalOptions?.forEach(t => {
                t.tool.setEnabled(false);
            });
        },
        /**
         * Clears previous layer listing and renders a new one to the view.
         *
         * @method handlePanelUpdate
         */
        handlePanelUpdate: function () {
            if (this.panel) {
                this._populateMapLayerPanel();
            }
        }
    }
);
