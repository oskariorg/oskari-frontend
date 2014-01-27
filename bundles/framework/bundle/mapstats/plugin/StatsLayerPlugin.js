/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
        this._statsDrawLayer = null;
        this._highlightCtrl = null;
        this._navCtrl = null;
        this._getFeatureControlHover = null;
        this._getFeatureControlSelect = null;
        this._modeVisible = false;
        this.config = config;
        this.ajaxUrl = null;
        this.featureAttribute = 'kuntakoodi';
        if (config && config.ajaxUrl) {
            me.ajaxUrl = config.ajaxUrl;
        }
        if (config && config.published) {
            // A sort of a hack to enable the controls in a published map.
            // At the moment there's no such option in the conf, but there might be.
            me._modeVisible = config.published;
        }
    }, {
        /** @static @property __name plugin name */
        __name: 'StatsLayerPlugin',

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'STATS',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },
        /**
         * @method hasUI
         * This plugin doesn't have an UI that we would want to ever hide so always returns false
         * @return {Boolean}
         */
        hasUI: function () {
            return false;
        },
        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('statslayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('statslayer', null);
        },
        /**
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {

            var sandboxName = (this.config ? this.config.sandbox : null) || 'sandbox',
                sbx = Oskari.getSandbox(sandboxName),
                mapLayerService = sbx.getService('Oskari.mapframework.service.MapLayerService'); // register domain builder
            if (mapLayerService) {
                mapLayerService.registerLayerModel('statslayer', 'Oskari.mapframework.bundle.mapstats.domain.StatsLayer');

                var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', sbx);
                mapLayerService.registerLayerModelBuilder('statslayer', layerModelBuilder);
            }
        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();

            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
            if (!this.ajaxUrl) {
                this.ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetStatsTile';
            }
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapLayerRemoveEvent': function (event) {
                this._afterMapLayerRemoveEvent(event);
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                this._mapLayerVisibilityChangedEvent(event);
            },
            'AfterChangeMapLayerOpacityEvent': function (event) {
                this._afterChangeMapLayerOpacityEvent(event);
            },
            'AfterChangeMapLayerStyleEvent': function (event) {
            },
            'MapStats.StatsVisualizationChangeEvent': function (event) {
                this._afterStatsVisualizationChangeEvent(event);
            },
            'StatsGrid.ModeChangedEvent': function (event) {
                this._afterModeChangedEvent(event);
            },
            'StatsGrid.SelectHilightsModeEvent': function (event) {
                this._hilightFeatures(event);
            },
            'StatsGrid.ClearHilightsEvent': function (event) {
                this._clearHilights(event);
            },
            //_clearHilights
            'MapStats.HoverTooltipContentEvent': function (event) {
                this._afterHoverTooltipContentEvent(event);
            }
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.WmsLayer[]} layers
         */
        preselectLayers: function (layers) {

            var sandbox = this._sandbox,
                i,
                layer,
                layerId;
            for (i = 0; i < layers.length; i++) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType(this._layerType)) {
                    sandbox.printDebug("preselecting " + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

        },

        /**
         * Activates the hover and select controls.
         *
         * @method activateControls
         */
        activateControls: function () {
            this._getFeatureControlHover.activate();
            this._getFeatureControlSelect.activate();
        },

        /**
         * Deactivates the hover and select controls.
         *
         * @method deactivateControls
         */
        deactivateControls: function () {
            this._getFeatureControlHover.deactivate();
            this._getFeatureControlSelect.deactivate();
        },
        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var me = this,
                eventBuilder = me._sandbox.getEventBuilder('MapStats.FeatureHighlightedEvent'),
                highlightEvent;

            var layerScales = me.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale()),
                openLayer = new OpenLayers.Layer.WMS('layer_' + layer.getId(), me.ajaxUrl + "&LAYERID=" + layer.getId(), {
                    layers: layer.getWmsName(),
                    transparent: true,
                    format: "image/png"
                }, {
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visibility: true,
                    singleTile: true,
                    buffer: 0
                });

            // Select control
            me._statsDrawLayer = new OpenLayers.Layer.Vector("Stats Draw Layer", {
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        fillOpacity: 0.0,
                        strokeOpacity: 0.0
                    }),
                    "temporary": new OpenLayers.Style({
                        strokeColor: "#ff6666",
                        strokeOpacity: 1.0,
                        strokeWidth: 3,
                        fillColor: "#ff0000",
                        fillOpacity: 0.0,
                        graphicZIndex: 2,
                        cursor: "pointer"
                    }),
                    "select": new OpenLayers.Style({})
                })
            });
            me._map.addLayers([me._statsDrawLayer]);

            // Hover control
            me._highlightCtrl = new OpenLayers.Control.SelectFeature(me._statsDrawLayer, {
                hover: true,
                highlightOnly: true,
                outFeature: function (feature) {
                    me._highlightCtrl.unhighlight(feature);
                    me._removePopup();
                },
                renderIntent: "temporary"
            });
            // Make sure selected feature doesn't swallow events so we can drag above it
            // http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues
            if (me._highlightCtrl.handlers !== undefined) { // OL 2.7
                me._highlightCtrl.handlers.feature.stopDown = false;
            } else if (me._highlightCtrl.handler !== undefined) { // OL < 2.7
                me._highlightCtrl.handler.stopDown = false;
                me._highlightCtrl.handler.stopUp = false;
            }
            me._map.addControl(this._highlightCtrl);
            me._highlightCtrl.activate();

            var queryableMapLayers = [openLayer];

            me._getFeatureControlHover = new OpenLayers.Control.WMSGetFeatureInfo({
                drillDown: false,
                hover: true,
                handlerOptions: {
                    "hover": {
                        delay: 0
                    },
                    "stopSingle": false
                },
                infoFormat: "application/vnd.ogc.gml",
                layers: queryableMapLayers,
                eventListeners: {
                    getfeatureinfo: function (event) {
                        var drawLayer = me._map.getLayersByName("Stats Draw Layer")[0],
                            i;
                        if (typeof drawLayer === "undefined") {
                            return;
                        }
                        if (event.features.length === 0) {
                            for (i = 0; i < drawLayer.features.length; i++) {
                                if (!drawLayer.features[i].selected) {
                                    drawLayer.removeFeatures([drawLayer.features[i]]);
                                }
                            }
                            me._removePopup();
                            return;
                        }
                        var found = false,
                            attrText = me.featureAttribute;

                        for (i = 0; i < drawLayer.features.length; i++) {
                            if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                                found = true;
                            } else if (!drawLayer.features[i].selected) {
                                drawLayer.removeFeatures([drawLayer.features[i]]);
                            }
                        }

                        if (!found) {
                            drawLayer.addFeatures([event.features[0]]);
                            me._highlightCtrl.highlight(event.features[0]);

                            me._removePopup();
                            me._addPopup(event);
                        }
                        drawLayer.redraw();
                    },
                    beforegetfeatureinfo: function (event) {},
                    nogetfeatureinfo: function (event) {}
                }
            });
            // Add the control to the map
            me._map.addControl(me._getFeatureControlHover);
            // Activate only is mode is on.
            if (me._modeVisible) {
                me._getFeatureControlHover.activate();
            }

            // Select control
            me._getFeatureControlSelect = new OpenLayers.Control.WMSGetFeatureInfo({
                drillDown: true,
                hover: false,
                handlerOptions: {
                    "click": {
                        delay: 0
                    },
                    "pixelTolerance": 5
                },
                infoFormat: "application/vnd.ogc.gml",
                layers: queryableMapLayers,
                eventListeners: {
                    getfeatureinfo: function (event) {
                        if (event.features.length === 0) {
                            return;
                        }
                        var newFeature = event.features[0],
                            drawLayer = me._map.getLayersByName("Stats Draw Layer")[0];
                        if (typeof drawLayer === "undefined") {
                            return;
                        }
                        var foundInd = -1;
                        var attrText = me.featureAttribute,
                            i,
                            featureStyle;

                        for (i = 0; i < drawLayer.features.length; i++) {
                            if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                                foundInd = i;
                                break;
                            }
                        }
                        featureStyle = OpenLayers.Util.applyDefaults(featureStyle, OpenLayers.Feature.Vector.style['default']);
                        featureStyle.fillColor = "#ff0000";
                        featureStyle.strokeColor = "#ff3333";
                        featureStyle.strokeWidth = 3;
                        featureStyle.fillOpacity = 0.2;

                        if (foundInd >= 0) {
                            drawLayer.features[i].selected = !drawLayer.features[i].selected;
                            if (drawLayer.features[i].selected) {
                                drawLayer.features[i].style = featureStyle;
                            } else {
                                drawLayer.features[i].style = null;
                                me._highlightCtrl.highlight(drawLayer.features[i]);
                            }
                            if (eventBuilder) {
                                highlightEvent = eventBuilder(drawLayer.features[i], drawLayer.features[i].selected, 'click');
                            }
                        } else {
                            drawLayer.addFeatures([newFeature]);
                            newFeature.selected = true;
                            newFeature.style = featureStyle;
                            if (eventBuilder) {
                                highlightEvent = eventBuilder(newFeature, newFeature.selected, 'click');
                            }
                        }
                        drawLayer.redraw();

                        if (highlightEvent) {
                            me._sandbox.notifyAll(highlightEvent);
                        }
                    },
                    beforegetfeatureinfo: function (event) {},
                    nogetfeatureinfo: function (event) {}
                }
            });
            // Add the control to the map
            me._map.addControl(me._getFeatureControlSelect);
            // Activate only is mode is on.
            if (me._modeVisible) {
                me._getFeatureControlSelect.activate();
            }

            openLayer.opacity = layer.getOpacity() / 100;

            me._map.addLayer(openLayer);

            me._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer " + layer.getId());

            if (keepLayerOnTop) {
                me._map.setLayerIndex(openLayer, me._map.layers.length);
            } else {
                me._map.setLayerIndex(openLayer, 0);
            }
        },

        /**
         * Activates/deactivates the controls after the mode has changed.
         *
         * @method _afterModeChangedEvent
         * @private
         * @param {Oskari.statistics.bundle.statsgrid.event.ModeChangedEvent} event
         */
        _afterModeChangedEvent: function (event) {
            this._modeVisible = event.isModeVisible();
            var drawLayer = this._map.getLayersByName("Stats Draw Layer")[0];

            if (this._modeVisible) {
                this.activateControls();
            } else {
                this.deactivateControls();
                if (drawLayer) {
                    drawLayer.removeAllFeatures();
                }
                this._removePopup();
            }
        },
        /**
         * Clear hilighted features
         *
         * @method _clearHilights
         * @private
         * @param {Oskari.statistics.bundle.statsgrid.event.ClearHilightsEvent} event
         */
        _clearHilights: function (event) {
            var drawLayer = this._map.getLayersByName("Stats Draw Layer")[0],
                i;
            if (drawLayer) {
                for (i = 0; i < drawLayer.features.length; i++) {
                    //clear style
                    drawLayer.features[i].style = null;
                    // notify highlight control
                    this._highlightCtrl.highlight(drawLayer.features[i]);
                }
            }
            drawLayer.redraw();
            //remove popup also
            this._removePopup();
        },

        /**
         * Hilight features
         *
         * @method _hilightFeatures
         * @private
         * @param {Oskari.statistics.bundle.statsgrid.event.SelectHilightsModeEvent} event
         */
        _hilightFeatures: function (event) {
            // which municipalities should be hilighted
            var codes = event.getCodes(),
                drawLayer = this._map.getLayersByName("Stats Draw Layer")[0];

            // drawLayer can not be undefined
            if (typeof drawLayer === "undefined") {
                return;
            }

            var attrText = this.featureAttribute,
                featureStyle;


            // add hilight feature style
            featureStyle = OpenLayers.Util.applyDefaults(featureStyle, OpenLayers.Feature.Vector.style['default']);
            featureStyle.fillColor = "#ff0000";
            featureStyle.strokeColor = "#ff3333";
            featureStyle.strokeWidth = 3;
            featureStyle.fillOpacity = 0.2;

            // loop through codes and features to find out if feature should be hilighted
            var key,
                i;
            for (key in codes) {
                if (codes.hasOwnProperty(key)) {
                    for (i = 0; i < drawLayer.features.length; i++) {
                        if (drawLayer.features[i].attributes[attrText] === key && codes[key]) {
                            drawLayer.features[i].style = featureStyle;
                            this._highlightCtrl.highlight(drawLayer.features[i]);
                            break;
                        }
                    }
                }
            }
            drawLayer.redraw();
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var me = this,
                layer = event.getMapLayer();
            if (!layer.isLayerOfType(me._layerType)) {
                return;
            }
            me._removeMapLayerFromMap(layer);
            me._highlightCtrl.deactivate();
            me._getFeatureControlHover.deactivate();
            me._getFeatureControlSelect.deactivate();
            me._map.removeControl(me._highlightCtrl);
//            me._map.removeControl(me._navCtrl);
            me._map.removeControl(me._getFeatureControlHover);
            me._map.removeControl(me._getFeatureControlSelect);
            me._map.removeLayer(me._statsDrawLayer);
        },

        /**
         * @method _mapLayerVisibilityChangedEvent
         * Handle MapLayerVisibilityChangedEvent
         * @private
         * @param {Oskari.mapframework.event.common.MapLayerVisibilityChangedEvent}
         */
        _mapLayerVisibilityChangedEvent: function (event) {
            var mapLayer = event.getMapLayer();
            if (mapLayer._layerType !== "STATS") {
                return;
            }
            this._statsDrawLayer.setVisibility(mapLayer.isVisible());

            // Do nothing if not in statistics mode.
            if (this._modeVisible) {
                if (mapLayer.isVisible()) {
                    this._getFeatureControlHover.activate();
                    this._getFeatureControlSelect.activate();
                } else {
                    this._getFeatureControlHover.deactivate();
                    this._getFeatureControlSelect.deactivate();
                }
            }
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var mapLayer = this.getOLMapLayers(layer);
            /* This should free all memory */
            mapLayer[0].destroy();
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {

            if (!layer.isLayerOfType(this._layerType)) {
                return null;
            }

            return this._map.getLayersByName('layer_' + layer.getId());
        },

        /**
         * Removes popup from the map.
         *
         * @method _removePopup
         * @private
         * @param {OpenLayers.Popup} popup Optional, uses this._popup if not provided
         */
        _removePopup: function (popup) {
            popup = popup || this._popup;
            if (popup) {
                this._map.removePopup(popup);
            }
        },

        /**
         * Adds a popup to the map and sends a request to get content for it
         * from the statsgrid bundle.
         *
         * @method _addPopup
         * @private
         * @param {OpenLayers.Event} event event with xy and feature information
         */
        _addPopup: function (event) {
            var content = event.features[0].attributes.kuntanimi;
            this._popup = new OpenLayers.Popup('mapstatsHover',
                this._map.getLonLatFromPixel(new OpenLayers.Pixel(event.xy.x + 5, event.xy.y + 5)),
                new OpenLayers.Size(100, 100),
                content
                );
            this._popup.autoSize = true;
            this._popup.opacity = 0.8;
            this._map.addPopup(this._popup);

            var reqBuilder = this._sandbox.getRequestBuilder('StatsGrid.TooltipContentRequest');
            if (reqBuilder) {
                var request = reqBuilder(event.features[0]);
                this._sandbox.request(this, request);
            }
        },

        /**
         * Sets content for this._popup, if found.
         *
         * @method _afterHoverTooltipContentEvent
         * @private
         * @param {Oskari.mapframework.bundle.mapstats.event.HoverTooltipContentEvent} event
         */
        _afterHoverTooltipContentEvent: function (event) {
            var content = event.getContent();
            if (this._popup) {
                this._popup.setContentHTML(content);
            }
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this.getOLMapLayers(layer);
            if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },

        _afterStatsVisualizationChangeEvent: function (event) {
            var layer = event.getLayer(),
                params = event.getParams(),
                mapLayer = this.getOLMapLayers(layer);

            this.featureAttribute = params.VIS_ATTR;

            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer[0].mergeNewParams({
                    VIS_ID: params.VIS_ID,
                    VIS_NAME: params.VIS_NAME,
                    VIS_ATTR: params.VIS_ATTR,
                    VIS_CLASSES: params.VIS_CLASSES,
                    VIS_COLORS: params.VIS_COLORS,
                    LAYERS: params.VIS_NAME
                });
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });