/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin';
        me._name = 'StatsLayerPlugin';

        me._supportedFormats = {};
        me._statsDrawLayer = null;
        me._highlightCtrl = null;
        me._navCtrl = null;
        me._getFeatureControlHover = null;
        me._getFeatureControlSelect = null;
        me._modeVisible = false;
        me.ajaxUrl = null;
        me.featureAttribute = 'kuntakoodi';
        if (me._config) {
            if (me._config.ajaxUrl) {
                me.ajaxUrl = me._config.ajaxUrl;
            }
            if (me._config.published) {
                // A sort of a hack to enable the controls in a published map.
                // At the moment there's no such option in the conf, but there
                // might be.
                me._modeVisible = me._config.published;
            }
        }
    }, {

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'STATS',

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
         * @private @method _initImpl
         * Interface method for the module protocol.
         *
         *
         */
        _initImpl: function () {
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                ); // register domain builder

            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'statslayer',
                    'Oskari.mapframework.bundle.mapstats.domain.StatsLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder',
                    this.getSandbox()
                );
                mapLayerService.registerLayerModelBuilder(
                    'statslayer',
                    layerModelBuilder
                );
            }
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         *
         *
         */
        _startPluginImpl: function () {
            if (!this.ajaxUrl) {
                this.ajaxUrl =
                    this.getSandbox().getAjaxUrl() +
                    'action_route=GetStatsTile';
            }
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me._afterMapLayerRemoveEvent(event);
                },

                MapLayerVisibilityChangedEvent: function (event) {
                    me._mapLayerVisibilityChangedEvent(event);
                },

                AfterChangeMapLayerOpacityEvent: function (event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                },

                AfterChangeMapLayerStyleEvent: function (event) {
                },

                'MapStats.StatsVisualizationChangeEvent': function (event) {
                    me._afterStatsVisualizationChangeEvent(event);
                },

                'StatsGrid.ModeChangedEvent': function (event) {
                    me._afterModeChangedEvent(event);
                },

                'StatsGrid.SelectHilightsModeEvent': function (event) {
                    me._hilightFeatures(event);
                },

                'StatsGrid.ClearHilightsEvent': function (event) {
                    me._clearHilights(event);
                },

                //_clearHilights
                'MapStats.HoverTooltipContentEvent': function (event) {
                    me._afterHoverTooltipContentEvent(event);
                }
            };
        },

        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.WmsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType(this._layerType)) {
                    sandbox.printDebug('preselecting ' + layerId);
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
            var me = this;
            if (me._getFeatureControlHover) {
                me._getFeatureControlHover.activate();
            }
            if (me._getFeatureControlSelect) {
                me._getFeatureControlSelect.activate();
            }
        },

        /**
         * Deactivates the hover and select controls.
         *
         * @method deactivateControls
         */
        deactivateControls: function () {
            var me = this;
            if (me._getFeatureControlHover) {
                me._getFeatureControlHover.deactivate();
            }
            if (me._getFeatureControlSelect) {
                me._getFeatureControlSelect.deactivate();
            }
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
                eventBuilder = me.getSandbox().getEventBuilder(
                    'MapStats.FeatureHighlightedEvent'
                ),
                highlightEvent,
                layerScales = me.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),
                openLayer = new OpenLayers.Layer.WMS(
                    'layer_' + layer.getId(),
                    me.ajaxUrl + '&LAYERID=' + layer.getId(),
                    {
                        layers: layer.getWmsName(),
                        transparent: true,
                        format: 'image/png'
                    },
                    {
                        scales: layerScales,
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        singleTile: true,
                        buffer: 0
                    }
                );

            // Select control
            me._statsDrawLayer = new OpenLayers.Layer.Vector(
                'Stats Draw Layer',
                {
                    styleMap: new OpenLayers.StyleMap({
                        'default': new OpenLayers.Style({
                            fillOpacity: 0.0,
                            strokeOpacity: 0.0
                        }),
                        'temporary': new OpenLayers.Style({
                            strokeColor: '#ff6666',
                            strokeOpacity: 1.0,
                            strokeWidth: 3,
                            fillColor: '#ff0000',
                            fillOpacity: 0.0,
                            graphicZIndex: 2,
                            cursor: 'pointer'
                        }),
                        'select': new OpenLayers.Style({})
                    })
                }
            );
            me.getMap().addLayers([me._statsDrawLayer]);

            // Hover control
            me._highlightCtrl = new OpenLayers.Control.SelectFeature(
                me._statsDrawLayer,
                {
                    hover: true,
                    highlightOnly: true,
                    outFeature: function (feature) {
                        me._highlightCtrl.unhighlight(feature);
                        me._removePopup();
                    },
                    renderIntent: 'temporary'
                }
            );
            // Make sure selected feature doesn't swallow events so we can drag above it
            // http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues
            if (me._highlightCtrl.handlers !== undefined) { // OL 2.7
                me._highlightCtrl.handlers.feature.stopDown = false;
            } else if (me._highlightCtrl.handler !== undefined) { // OL < 2.7
                me._highlightCtrl.handler.stopDown = false;
                me._highlightCtrl.handler.stopUp = false;
            }
            me.getMap().addControl(this._highlightCtrl);
            me._highlightCtrl.activate();

            var queryableMapLayers = [openLayer];

            me._getFeatureControlHover = new OpenLayers.Control.WMSGetFeatureInfo({
                drillDown: false,
                hover: true,
                handlerOptions: {
                    'hover': {
                        delay: 0
                    },
                    'stopSingle': false
                },
                infoFormat: 'application/vnd.ogc.gml',
                layers: queryableMapLayers,
                eventListeners: {
                    getfeatureinfo: function (event) {
                        var drawLayer = me.getDrawLayer(),
                            i;
                        if (typeof drawLayer === 'undefined') {
                            return;
                        }
                        if (event.features.length === 0) {
                            for (i = 0; i < drawLayer.features.length; i += 1) {
                                if (!drawLayer.features[i].selected) {
                                    drawLayer.removeFeatures(
                                        [drawLayer.features[i]]
                                    );
                                }
                            }
                            me._removePopup();
                            return;
                        }
                        var found = false,
                            attrText = me.featureAttribute;

                        for (i = 0; i < drawLayer.features.length; i += 1) {
                            if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                                found = true;
                            } else if (!drawLayer.features[i].selected) {
                                drawLayer.removeFeatures(
                                    [drawLayer.features[i]]
                                );
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
            me.getMap().addControl(me._getFeatureControlHover);
            // Activate only is mode is on.
            if (me._modeVisible) {
                me._getFeatureControlHover.activate();
            }

            // Select control
            me._getFeatureControlSelect = new OpenLayers.Control.WMSGetFeatureInfo({
                drillDown: true,
                hover: false,
                handlerOptions: {
                    'click': {
                        delay: 0
                    },
                    'pixelTolerance': 5
                },
                infoFormat: 'application/vnd.ogc.gml',
                layers: queryableMapLayers,
                eventListeners: {
                    getfeatureinfo: function (event) {
                        if (event.features.length === 0) {
                            return;
                        }
                        var newFeature = event.features[0],
                            drawLayer = me.getDrawLayer();

                        if (typeof drawLayer === 'undefined') {
                            return;
                        }
                        var foundInd = -1,
                            attrText = me.featureAttribute,
                            i,
                            featureStyle;

                        for (i = 0; i < drawLayer.features.length; i += 1) {
                            if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                                foundInd = i;
                                break;
                            }
                        }
                        featureStyle = OpenLayers.Util.applyDefaults(
                            featureStyle,
                            OpenLayers.Feature.Vector.style['default']
                        );
                        featureStyle.fillColor = '#ff0000';
                        featureStyle.strokeColor = '#ff3333';
                        featureStyle.strokeWidth = 3;
                        featureStyle.fillOpacity = 0.2;

                        if (foundInd >= 0) {
                            drawLayer.features[i].selected =
                                !drawLayer.features[i].selected;
                            if (drawLayer.features[i].selected) {
                                drawLayer.features[i].style = featureStyle;
                            } else {
                                drawLayer.features[i].style = null;
                                me._highlightCtrl.highlight(drawLayer.features[i]);
                            }
                            if (eventBuilder) {
                                highlightEvent = eventBuilder(
                                    drawLayer.features[i],
                                    drawLayer.features[i].selected,
                                    'click'
                                );
                            }
                        } else {
                            drawLayer.addFeatures([newFeature]);
                            newFeature.selected = true;
                            newFeature.style = featureStyle;
                            if (eventBuilder) {
                                highlightEvent = eventBuilder(
                                    newFeature,
                                    newFeature.selected,
                                    'click'
                                );
                            }
                        }
                        drawLayer.redraw();

                        if (highlightEvent) {
                            me.getSandbox().notifyAll(highlightEvent);
                        }
                    },
                    beforegetfeatureinfo: function (event) {},
                    nogetfeatureinfo: function (event) {}
                }
            });
            // Add the control to the map
            me.getMap().addControl(me._getFeatureControlSelect);
            // Activate only is mode is on.
            if (me._modeVisible) {
                me._getFeatureControlSelect.activate();
            }

            openLayer.opacity = layer.getOpacity() / 100;

            me.getMap().addLayer(openLayer);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                me.getMap().setLayerIndex(openLayer, me.getMap().layers.length);
            } else {
                me.getMap().setLayerIndex(openLayer, 0);
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
            var drawLayer = this.getDrawLayer();

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
            var drawLayer = this.getDrawLayer(),
                i;

            if (drawLayer) {
                for (i = 0; i < drawLayer.features.length; i += 1) {
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
                drawLayer = this.getDrawLayer();

            // drawLayer can not be undefined
            if (typeof drawLayer === 'undefined') {
                return;
            }

            var attrText = this.featureAttribute,
                featureStyle;


            // add hilight feature style
            featureStyle = OpenLayers.Util.applyDefaults(
                featureStyle,
                OpenLayers.Feature.Vector.style['default']
            );
            featureStyle.fillColor = '#ff0000';
            featureStyle.strokeColor = '#ff3333';
            featureStyle.strokeWidth = 3;
            featureStyle.fillOpacity = 0.2;

            // loop through codes and features to find out if feature should be hilighted
            var key,
                i;
            for (key in codes) {
                if (codes.hasOwnProperty(key)) {
                    for (i = 0; i < drawLayer.features.length; i += 1) {
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
            me.getMap().removeControl(me._highlightCtrl);
//            me.getMap().removeControl(me._navCtrl);
            me.getMap().removeControl(me._getFeatureControlHover);
            me.getMap().removeControl(me._getFeatureControlSelect);
            me.getMap().removeLayer(me._statsDrawLayer);
        },

        /**
         * @method _mapLayerVisibilityChangedEvent
         * Handle MapLayerVisibilityChangedEvent
         * @private
         * @param {Oskari.mapframework.event.common.MapLayerVisibilityChangedEvent}
         */
        _mapLayerVisibilityChangedEvent: function (event) {
            var mapLayer = event.getMapLayer();
            if (mapLayer._layerType !== 'STATS') {
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

            var mapLayer = this.getFirstOLMapLayer(layer);
            /* This should free all memory */
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.destroy();
            }
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

            return this.getMap().getLayersByName('layer_' + layer.getId());
        },

        getFirstOLMapLayer: function (layer) {
            var ls = this.getOLMapLayers(layer),
                ret = null;

            if (ls && ls.length > 0 && ls[0] !== null && ls[0] !== undefined) {
                ret = ls[0];
            }
            return ret;
        },

        getDrawLayer: function () {
            var ret = null,
                layers = this.getMap().getLayersByName('Stats Draw Layer');

            if (layers && layers.length) {
                ret = layers[0];
            }
            return ret;
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
                this.getMap().removePopup(popup);
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
                this.getMap().getLonLatFromPixel(new OpenLayers.Pixel(event.xy.x + 5, event.xy.y + 5)),
                new OpenLayers.Size(100, 100),
                content
                );
            this._popup.autoSize = true;
            this._popup.opacity = 0.8;
            this.getMap().addPopup(this._popup);

            var reqBuilder = this.getSandbox().getRequestBuilder('StatsGrid.TooltipContentRequest');
            if (reqBuilder) {
                var request = reqBuilder(event.features[0]);
                this.getSandbox().request(this, request);
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

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            var mapLayer = this.getFirstOLMapLayer(layer);
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.setOpacity(layer.getOpacity() / 100);
            }
        },

        _afterStatsVisualizationChangeEvent: function (event) {
            var layer = event.getLayer(),
                params = event.getParams(),
                mapLayer = this.getFirstOLMapLayer(layer);

            this.featureAttribute = params.VIS_ATTR;

            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.mergeNewParams({
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
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });