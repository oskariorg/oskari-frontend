Oskari.clazz.define('Oskari.mapframework.publisher.tool.LayerSelectionTool',
function() {
}, {
    index : 1,
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
        backgroundLayerSelector: jQuery('<div class="publisher2 background-layer-selector tool-options"><div class="header"></div><div class="layers"></div></div>'),
        backgroundCheckbox: jQuery('<div class="background-layers"><label>' +
                '    <input class="baselayer" type="checkbox"/>' +
                '  </label><div>')
    },
    _backgroundLayerSelector: null,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
            title: 'LayerSelectionPlugin',
            config: {}
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
        var me = this;

        if(me.state.enabled) {
            var pluginConfig = { id: this.getTool().id, config: this.getPlugin().getConfig()};
            var layerSelection = me._getLayerSelection();
            if (layerSelection && !jQuery.isEmptyObject(layerSelection)) {
                pluginConfig.layerSelection = layerSelection;
            }
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [pluginConfig]
                        }
                    }
                }
            };
        } else {
            return null;
        }
    },
    _getLayerSelection: function () {
        var me = this,
            layerSelection = {};
        var pluginValues = me.getPlugin().getBaseLayers();
        if (pluginValues.defaultBaseLayer) {
            layerSelection.baseLayers =
                pluginValues.baseLayers;
            layerSelection.defaultBaseLayer =
                pluginValues.defaultBaseLayer;
        }
        return layerSelection;
    },
    /**
     * Get extra options.
     * @method getExtraOptions
     * @public
     *
     * @returns {Object} jQuery element
     */
    getExtraOptions: function (toolContainer) {
        var me = this;
            backgroundLayerSelector = me._templates.backgroundLayerSelector;
        if(!me._backgroundLayerSelector) {
            backgroundLayerSelector.find('.header').html(me.__loc.layerselection.info);
            me._backgroundLayerSelector = backgroundLayerSelector;
            var layers = me._getLayersList();
            for(var i=0;i<layers.length;i++){
                var layer = layers[i];
                me._addLayer(layer);
            }
        }
        return backgroundLayerSelector;
    },
    /**
     * @method hasPublishRight
     * Checks if the layer can be published.
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to check
     * @return {Boolean} true if the layer can be published
     */
    hasPublishRight: function (layer) {
        // permission might be "no_publication_permission"
        // or nothing at all
        return (layer.getPermission('publish') === 'publication_permission_ok');
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
        return me.__sandbox.findAllSelectedMapLayers();
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
    _addLayer: function(layer) {
        if (!this.hasPublishRight(layer)) {
            return;
        }

        var me = this,
            layerDiv = me._templates.backgroundCheckbox.clone(),
            foundedLayerDiv = me._backgroundLayerSelector.find('.layers').find('[data-id=' + layer.getId() + ']');

        if(foundedLayerDiv.length>0) {
            return;
        }

        layerDiv.find('label').append(layer.getName());
        layerDiv.attr('data-id', layer.getId());
        // TODO checked handling
        me._backgroundLayerSelector.find('.layers').append(layerDiv);
    },
    /**
     * Handle add map layer event
     * @method  @private handleMapLayerAdd
     * @param  {Object} layer added layer
     */
    _handleMapLayerAdd: function(layer){
        var me = this;
        me._addLayer(layer);
    },
    /**
     * Handle remove map layer event
     * @method  @private handleMapLayerRemove
     * @param  {Object} layer removed layer
     */
    _handleMapLayerRemove: function(layer){
        var me = this,
            layerDiv = me._backgroundLayerSelector.find('.layers').find('[data-id=' + layer.getId() + ']');
        // TODO checked handling
        layerDiv.remove();
    },
    /**
     * @method init
     * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
     */
    init: function () {
        var me = this;
        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.__sandbox.registerForEventByName(me, p);
            }
        }

        var layers = me._getLayersList();

    },
    getName: function() {
        return "Oskari.mapframework.publisher.tool.LayerSelectionTool";
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
    stop: function(){
        var me = this;

        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.__sandbox.unregisterFromEventByName(me, p);
            }
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});