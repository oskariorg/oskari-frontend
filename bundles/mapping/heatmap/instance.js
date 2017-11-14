/**
 * This bundle attaches heatmap tool for layers
 *
 * @class Oskari.mapframework.bundle.heatmap.HeatmapBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.heatmap.HeatmapBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     */
    function() {}, {
        __idCounter : 1,
        /**
         * @static
         * @property __name
         */
        __name: 'heatmap',
        /**
         * Module protocol method
         *
         * @method getName
         */
        getName: function() {
            return this.__name;
        },
        /**
         * Needed by sandbox.register()
         */
        init : function() {},
        /**
         * Bundle startup
         *
         * @method start
         */
        start: function() {

            var sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox = sandbox;

            sandbox.register(this);
            for (var p in this.eventHandlers) {
                sandbox.registerForEventByName(this, p);
            }
            this.__setupLayerTools();

            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var plugin = Oskari.clazz.create('Oskari.mapframework.heatmap.HeatmapLayerPlugin');
            mapModule.registerPlugin(plugin);
            mapModule.startPlugin(plugin);
            //this._plugin = plugin;
        },
        /**
         * @method update
         *
         * implements bundle instance update method
         */
        update: function() {},

        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function() {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        },
        /**
         * Adds the Feature data tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool: function(layerModel, suppressEvent) {
            var me = this;
            var service = this.getLayerService();
            if (typeof layerModel !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layerModel = service.findMapLayer(layerModel);
            }
            if (!layerModel || !layerModel.getAttributes().heatmap) {
                return;
            }
            var loc = Oskari.getLocalization(this.getName());

            // add heatmap tool for layer
            var label = loc.tool_label,
                tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            if(layerModel.isLayerOfType('HEATMAP')) {
                label = loc.tool_label_settings;
            }
            tool.setName("heatmap");
            tool.setTitle(label);
            tool.setTooltip(label);
            var dialog = Oskari.clazz.create('Oskari.mapframework.bundle.heatmap.HeatmapDialog', loc.dialog);
            tool.setCallback(function() {
                if(layerModel.isLayerOfType('HEATMAP')) {
                    dialog.showDialog(layerModel, function(values) {
                        me.__setupHeatmap(layerModel, values, false);
                    }, false);
                }
                else {
                    var layer = Oskari.clazz.create('Oskari.mapframework.bundle.heatmap.domain.HeatmapLayer');
                    layer.copyValues(layerModel, {
                        id : 'heatmap_' + (me.__idCounter++),
                        name : layerModel.getName() + ' - ' + label
                    });
                    layer.setTools([]);
                    me.__addTool(layer, true);
                    dialog.showDialog(layer, function(values) {
                        me.__setupHeatmap(layer, values, true);
                    }, true);
                }
            });

            service.addToolForLayer(layerModel, tool, suppressEvent);
        },
        __setupHeatmap : function(layer, values, isNew) {
            layer.setRadius(values.radius);
            layer.setWeightedHeatmapProperty(values.property);
            layer.setPixelsPerCell(values.pixelsPerCell);
            layer.setColorConfig(values.colorConfig);
            layer.setColorSetup(values.colorSetup);
            layer.setSelectedTheme(values.selectedTheme);
            if(isNew) {
                this.sandbox.printDebug('Register and setup heatmap with values', values, layer);
                var service = this.getLayerService();
                // adding layer to service so it can be referenced with id
                service.addLayer(layer);
                // add layer to map with request
                var rbAdd = this.sandbox.getRequestBuilder('AddMapLayerRequest');
                this.sandbox.request(this, rbAdd(layer.getId(), true));
            }
            else {
                this.sandbox.printDebug('Update heatmap with values', values, layer);
                // request update for the layer
                var rbUpdate = this.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest');
                this.sandbox.request(this, rbUpdate(layer.getId(), true));
            }
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools: function() {
            var me = this;
            // add tools for feature data layers
            var service = this.getLayerService();
            var layers = service.getAllLayers();
            _.each(layers, function(layer) {
                me.__addTool(layer, true);
            });
            // update all layers at once since we suppressed individual events
            var event = me.sandbox.getEventBuilder('MapLayerEvent')(null, 'tool');
            me.sandbox.notifyAll(event);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'MapLayerEvent': function(event) {
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }
                if (event.getLayerId()) {
                    this.__addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this.__setupLayerTools();
                }
            }
        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded if not.
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         *
         */
        onEvent: function(event) {
            var me = this,
                handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        }
    });