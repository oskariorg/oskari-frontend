const TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
Oskari.clazz.define('Oskari.mapframework.publisher.tool.LayerSelectionTool', function () {
}, {
    index: 1,
    allowedLocations: ['top left', 'top center', 'top right'],
    lefthanded: 'top right',
    righthanded: 'top left',
    allowedSiblings: [
        'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
    ],
    groupedSiblings: false,
    _templates: {
        extraOptions: jQuery(`
            <div class="publisher2 background-layer-selector tool-options">
                <div class="metadata-selection">
                    <label><input type="checkbox"/><span></span></label>
                </div>
                <div class="style-selection">
                    <label><input type="checkbox"/><span></span></label>
                </div>
                <div class="info"></div>
                <div class="layers"></div>
            </div>
            `),
        backgroundCheckbox: jQuery('<div class="background-layers"><label>' +
            '    <input class="baselayer" type="checkbox"/>' +
            '  </label><div>')
    },
    _extraOptions: null,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function () {
        const plug = this._getToolPluginMapfullConf() || {};
        return {
            id: TOOL_ID,
            title: 'LayerSelectionPlugin',
            config: plug.config || {}
        };
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        if (!this.state.enabled) {
            return null;
        }
        const plugin = this.getPlugin();
        const conf = {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{
                            id: TOOL_ID,
                            config: plugin.getConfig()
                        }]
                    }
                }
            }
        };
        if (plugin.getShowMetadata()) {
            // published map needs to also include 'metadataflyout' bundle if we want to show metadata
            conf.configuration.metadataflyout = {};
        }
        return conf;
    },
    /**
     * Check layer selections
     * @method  @private _checkLayerSelections
     */
    _checkLayerSelections: function () {
        if (!this._extraOptions) {
            return;
        }
        const plugin = this.getPlugin();
        this._getLayersList().forEach(layer => {
            var selected = this._extraOptions.find('.background-layers[data-id=' + layer.getId() + '] input:checked');
            if (selected.length > 0) {
                plugin.addBaseLayer(layer);
            }
        });
        // this._extraOptions.find('.background-layers[data-id=' + layer.getId() + '] input:checked').trigger('change');
    },
    _getLayerSelection: function () {
        const pluginValues = this.getPlugin().getBaseLayers();
        if (!pluginValues.defaultBaseLayer) {
            return null;
        }
        return {
            baseLayers: pluginValues.baseLayers,
            defaultBaseLayer: pluginValues.defaultBaseLayer
        };
    },
    /**
     * Get extra options.
     * @method getExtraOptions
     * @public
     *
     * @returns {Object} jQuery element
     */
    getExtraOptions: function () {
        var me = this;
        if (!me._extraOptions) {
            const initialConf = me._getToolPluginMapfullConf();
            const isAllowStyleChange = initialConf && initialConf.config && initialConf.config.isStyleSelectable;
            const showMetadata = initialConf && initialConf.config && initialConf.config.showMetadata;
            const extraOptions = me._templates.extraOptions.clone();
            extraOptions.find('.style-selection label span').append(me.__loc.layerselection.allowStyleChange);
            extraOptions.find('.metadata-selection label span').append(me.__loc.layerselection.showMetadata);
            const allowCheckbox = extraOptions.find('.style-selection label input')
                .on('change', function () {
                    const isChecked = jQuery(this).is(':checked');
                    me.__plugin.setStyleSelectable(isChecked);
                });
            const metadataCheckBox = extraOptions.find('.metadata-selection label input')
                .on('change', function () {
                    const isChecked = jQuery(this).is(':checked');
                    me.__plugin.setShowMetadata(isChecked);
                });
            if (isAllowStyleChange) {
                allowCheckbox.prop('checked', true).change();
            }
            if (showMetadata) {
                metadataCheckBox.prop('checked', true).change();
                me.__plugin.setShowMetadata(true);
            }
            extraOptions.find('.info').html(me.__loc.layerselection.info);
            me._extraOptions = extraOptions;
            var layers = me._getLayersList();
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                me._addLayer(layer);
            }
            me._metadataAvailable(layers);
            me._checkCanChangeStyle(layers);
        }
        return me._extraOptions;
    },
    _metadataAvailable: function (layers = this._getLayersList()) {
        if (!this._extraOptions) {
            return;
        }
        let noMetadata = true;
        for (const layer of layers) {
            if (layer.getMetadataIdentifier()) noMetadata = false;
        }
        const input = this._extraOptions.find('.metadata-selection label input');
        input.prop('disabled', noMetadata);
    },
    /**
     * @method hasPublishRight
     * Checks if the layer can be published.
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to check
     * @return {Boolean} true if the layer can be published
     */
    hasPublishRight: function (layer) {
        return layer.hasPermission('publish');
    },
    /**
     * Returns the published map layer selection
     *
     * @method _getLayersList
     * @private
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    _getLayersList: function () {
        var me = this;
        return me.getSandbox().findAllSelectedMapLayers();
    },
    eventHandlers: {
        /**
         * @method AfterMapLayerAddEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
         *
         * Updates the layerlist
         */
        AfterMapLayerAddEvent: function (event) {
            this._handleMapLayerAdd(event._mapLayer);
        },

        /**
         * @method AfterMapLayerRemoveEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
         *
         * Updates the layerlist
         */
        AfterMapLayerRemoveEvent: function (event) {
            if (!this.hasPublishRight(event._mapLayer)) {
                return;
            }
            this._handleMapLayerRemove(event._mapLayer);
        }

    },
    /**
     * @method  @private _addLayer Add layer to UI
     * @param {Object} layer added layer
     */
    _addLayer: function (layer) {
        var me = this;
        if (!this.hasPublishRight(layer)) {
            return;
        }

        const existingLayerDiv = this._extraOptions.find('.layers').find('[data-id=' + layer.getId() + ']');
        if (existingLayerDiv.length > 0) {
            // layer already added
            return;
        }
        const layerDiv = this._templates.backgroundCheckbox.clone();
        layerDiv.find('label').append(Oskari.util.sanitize(layer.getName()));
        layerDiv.attr('data-id', layer.getId());
        const input = layerDiv.find('input');

        if (me.shouldPreselectLayer(layer.getId())) {
            input.prop('checked', true);
            layer.selected = true;
        }
        input.on('change', function () {
            const checkbox = jQuery(this);
            const isChecked = checkbox.is(':checked');
            layer.selected = isChecked;
            if (isChecked) {
                me.__plugin.addBaseLayer(layer);
            } else {
                me.__plugin.removeBaseLayer(layer);
            }
        });
        me._extraOptions.find('.layers').append(layerDiv);
    },
    /**
     * Should preselect layer.
     * @method @private shouldPreselectLayer
     * @param  {Integer} id layer id
     * @return {Boolean} true if layer must be preselect, other false
     */
    shouldPreselectLayer: function (id) {
        const toolPluginMapfullConf = this._getToolPluginMapfullConf();
        if (!toolPluginMapfullConf) {
            return false;
        }
        const { baseLayers = [] } = toolPluginMapfullConf.config;
        return baseLayers.some(layerId => '' + layerId === '' + id);
    },
    /**
     * @private @method _getToolPluginMapfullConf
     * Get map view cofiguration (from mapfull) for this tool
     * @return {Object / null} config or null if not found
     */
    _getToolPluginMapfullConf: function () {
        const { configuration } = this.data || {};
        if (!configuration) {
            return null;
        }
        const { mapfull = {} } = configuration;
        const { conf = {} } = mapfull;
        const { plugins = [] } = conf;
        // data.configuration.mapfull.conf.plugins
        return plugins.find(plug => plug.id === TOOL_ID);
    },
    /**
     * Handle add map layer event
     * @method  @private handleMapLayerAdd
     * @param  {Object} layer added layer
     */
    _handleMapLayerAdd: function (layer) {
        this._addLayer(layer);
        this._checkCanChangeStyle();
        this._metadataAvailable();
    },
    /**
     * Handle remove map layer event
     * @method  @private handleMapLayerRemove
     * @param  {Object} layer removed layer
     */
    _handleMapLayerRemove: function (layer) {
        const layerDiv = this._extraOptions.find('.layers').find('[data-id=' + layer.getId() + ']');
        layerDiv.remove();
        this._checkCanChangeStyle();
        this._metadataAvailable();
    },
    /**
     * @private @method _checkCanChangeStyle
     * Enable / disable checkbox for layer style change
     * @param {AbstractLayer[]} layers that should be checked
     */
    _checkCanChangeStyle: function (layers = this._getLayersList()) {
        if (!this._extraOptions) {
            return;
        }
        const isStyleChangePossible = layers.some((layer) => {
            return typeof layer.getStyles === 'function' && layer.getStyles().length > 1;
        });

        const input = this._extraOptions.find('.style-selection label input');
        input.prop('disabled', !isStyleChangePossible);
    },
    /**
     * @method init
     * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
     */
    init: function (data) {
        var me = this;
        me.data = data;

        if (data.configuration && data.configuration.mapfull && data.configuration.mapfull.conf && data.configuration.mapfull.conf.plugins) {
            const plugins = data.configuration.mapfull.conf.plugins;
            plugins.forEach(function (plugin) {
                if (me.getTool().id !== plugin.id) {
                    return;
                }
                me.setEnabled(true);
                if (me.__started) {
                    setTimeout(function () {
                        me._checkLayerSelections();
                    }, 300);
                }
            });
        }

        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.getSandbox().registerForEventByName(me, p);
            }
        }
    },
    getName: function () {
        return 'Oskari.mapframework.publisher.tool.LayerSelectionTool';
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
    /**
     * Stop panel.
     * @method stop
     * @public
     **/
    stop: function () {
        if (this._extraOptions) {
            this._extraOptions.find('.background-layers input:checked').prop('checked', false);
        }
        const sandbox = this.getSandbox();
        const plugin = this.getPlugin();

        for (var p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(this, p);
            }
        }
        if (plugin) {
            if (sandbox) {
                plugin.stopPlugin(sandbox);
            }
            this.__mapmodule.unregisterPlugin(plugin);
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
