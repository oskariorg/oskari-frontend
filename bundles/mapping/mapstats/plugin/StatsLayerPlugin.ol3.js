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
        me.featureLayer = null;
        me.highlightStyle = null;
        me.invisibleStyle = null;
        me._layers = {};
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
                );

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
         * Deactivates the hover and select controls.
         *
         * @method deactivateControls
         */
        deactivateControls: function () {
            var me = this;
            if ( me._handleSingleClick) {
                me.getMap().un('singleclick', me._handleSingleClick, me);
            }

        },

        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
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


                wms = {
                    'URL': me.ajaxUrl + '&LAYERID=' + layer.getId(),
                    'LAYERS': layer.getLayerName(),
                    'FORMAT': 'image/png'
                },

                openlayer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: wms.URL,
                        //crossOrigin : 'anonymous',
                        params: {
                            'LAYERS': wms.LAYERS,
                            'FORMAT': wms.FORMAT
                        }
                    }),
                    id: layer.getId(),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(me.getSandbox().getMap().getScale()) && layer.isVisible(),
                    singleTile: true,
                    buffer: 0
                });


            //Select control styles

            var map = me.getMap();
            this.highlightStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(219, 112, 147, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ff6666',
                    width: 2
                })
            });
            this.invisibleStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(219, 112, 147, 0.0)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(219, 112, 147, 0.0)',
                    width: 2
                })
            });

            this._statsDrawLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({}
                    ),
                    title: 'Stats Draw Layer',
                    style: this.highlightStyle
                }
            );



            openlayer.opacity = layer.getOpacity() / 100;

            me.getMap().addLayer(openlayer);
            me._layers[openlayer.get('id')] = openlayer;

            //Select control
            map.on('singleclick', me._handleSingleClick, this);

            //TODO: Hover with timer
            //  map.on('pointermove',  me._handleHover, this);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                me.getMapModule().setLayerIndex(openlayer, me.getMap().getLayers().getArray().length);
            } else {
                me.getMapModule().setLayerIndex(openlayer, 0);
            }
            // Add stats draw layer on top
            me.getMap().addLayer(this._statsDrawLayer);
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
         * @method _drawGetFeatureInfo
         * Draws getfeatureinfo geometry and label data
         * @private
         * @param {geojson featurecollection}
         * @param {boolean}  if true, remove old features
         *            event
         */
        _drawGetFeatureInfo: function (response, clear) {
            var parser = new ol.format.GeoJSON(),
                feature = parser.readFeatures(response),
                eventBuilder = this.getSandbox().getEventBuilder(
                    'MapStats.FeatureHighlightedEvent'
                ),
                highlightEvent,
                source = this._statsDrawLayer.getSource();

            if(!feature  || feature.length < 1 ) {
                return;
            }
            if(clear){
                this._statsDrawLayer.getSource().clear();
            }
            var isNew = true,
                attrText = this.featureAttribute;
            if(source.getFeatures().length > 0 ) {
                for (var i = 0; i < source.getFeatures().length; i += 1) {
                    if (source.getFeatures()[i].getProperties()[attrText] === feature[0].getProperties()[attrText]) {
                        isNew = false;
                        // remove feature
                        source.removeFeature(source.getFeatures()[i]);
                    }
                }
            }
            if(isNew){
                source.addFeatures(feature);
            }

            if (eventBuilder) {
                highlightEvent = eventBuilder(
                    feature[0].getProperties(),
                    isNew,
                    'click'
                );
                if (highlightEvent) {
                    this.getSandbox().notifyAll(highlightEvent);
                }
            }



        },
        /**
         * OL3 single click listener
         * - get featureinfo of WMS layer feature
         * - draw feature to this._statsDrawLayer layer
         * @param evt
         * @private
         */
        _handleSingleClick: function (evt) {
            var me = this,
                map = evt.map,
                view = map.getView(),
                reso = view.getResolution(),
                proj = view.getProjection(),
                olLayer = null;

            for (var lay in me._layers) {
                olLayer = me._layers[lay];
            }

            if (olLayer) {
                if(olLayer.getVisible()) {
                    var url = olLayer.getSource().getGetFeatureInfoUrl(evt.coordinate, reso, proj, {'INFO_FORMAT': 'application/json'});
                    jQuery.ajax(url).then(function (response) {
                        //Response is geojson
                        // Render geometry and label
                        me._drawGetFeatureInfo(response, false);
                    });
                }
            }
        },
        /**
         * Manage feature visibility, if all layer feature data is changed
         * @param params params.VIS_NAME= new region data name , params.VIS_ATTR= key attribute
         * @private
         */
        _manageFeatureVisibility: function (params) {
            var highlightEvent,
                layerName = params.VIS_NAME,
                attrText =  params.VIS_ATTR,
                source = this._statsDrawLayer.getSource();

            if (layerName && this.featureLayer !== layerName) {
                this.featureLayer = layerName;

                if (source.getFeatures().length > 0) {
                    for (var i = 0; i < source.getFeatures().length; i += 1) {
                        // Set selected features invisible, which are not in current feature data
                        if (source.getFeatures()[i].getProperties()[this.featureAttribute]) {
                            // Set invisible style
                            source.getFeatures()[i].setStyle(this.invisibleStyle);
                        }
                        if (source.getFeatures()[i].getProperties()[attrText]) {
                            // Set highlight style
                            source.getFeatures()[i].setStyle(this.highlightStyle);
                        }
                    }
                }
            }
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
            this._statsDrawLayer.setVisible(mapLayer.isVisible());
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

            var maplayer = this._layers[layer.getId()];
            /* This should free all memory */
            if (maplayer !== null && maplayer !== undefined) {
                this.getMapModule().removeLayer(maplayer, layer);
                delete this._layers[layer.getId()];
            }
        },

        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType((this._layerType))) {
                return null;
            }
            if(!this._layers[layer.getId()]) {
                return null;
            }
            // only single layer/id, wrap it in an array
            return [this._layers[layer.getId()]];
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
            var mapLayer = this._layers[layer.getId()];
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.setOpacity(layer.getOpacity() / 100);
            }
        },

        _afterStatsVisualizationChangeEvent: function (event) {
            var layer = event.getLayer(),
                params = event.getParams(),
                mapLayer = this._layers[layer.getId()];

            this._manageFeatureVisibility(params);

            this.featureAttribute = params.VIS_ATTR;

            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.getSource().updateParams({
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