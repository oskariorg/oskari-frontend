/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin', 

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
    this._statsDrawLayer = null;
    this._highlightCtrl = null;
    this._getFeatureControlHover = null;
    this._getFeatureControlSelect = null;
    this.config = config;
    this.ajaxUrl = null;
    if(config && config.ajaxUrl) {
        this.ajaxUrl = config.ajaxUrl;
    }
}, {
    /** @static @property __name plugin name */
    __name : 'StatsLayerPlugin',

    /** @static @property _layerType type of layers this plugin handles */
    _layerType : 'STATS',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method hasUI
     * This plugin doesn't have an UI that we would want to ever hide so always returns false
     * @return {Boolean} 
     */
    hasUI : function() {
        return false;
    },
    /**
     * @method register
     * Interface method for the plugin protocol.
     * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
     */
    register : function() {
        this.getMapModule().setLayerPlugin('statslayer', this);
    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     * Unregisters self from mapmodules layerPlugins
     */
    unregister : function() {
        this.getMapModule().setLayerPlugin('statslayer', null);
    },
    /**
     * @method init
     * Interface method for the module protocol.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {

        var sandboxName = ( this.config ? this.config.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);
        
        // register domain builder
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if(mapLayerService) {
            mapLayerService.registerLayerModel('statslayer', 'Oskari.mapframework.bundle.mapstats.domain.StatsLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', sandbox);
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
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
        if(!this.ajaxUrl) {
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
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
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
    start : function(sandbox) {
    },
    /**
     * @method stop
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this._afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this._afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this._afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            //this._afterChangeMapLayerStyleEvent(event);
        },
        'MapStats.StatsVisualizationChangeEvent': function(event) {
            this._afterStatsVisualizationChangeEvent(event);
        }
    },

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method preselectLayers
     * Adds given layers to map if of type WMS
     * @param {Oskari.mapframework.domain.WmsLayer[]} layers
     */
    preselectLayers : function(layers) {

        var sandbox = this._sandbox;
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(!layer.isLayerOfType(this._layerType)) {
                continue;
            }

            sandbox.printDebug("preselecting " + layerId);
            this._addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /**
     * Handle _afterMapLayerAddEvent
     * @private 
     * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
     *            event
     */
    _afterMapLayerAddEvent : function(event) {
        this._addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * @method _addMapLayerToMap
     * @private
     * Adds a single WMS layer to this map
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    _addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        var me = this;

        if(!layer.isLayerOfType(this._layerType)) {
            return;
        }

        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.removeLayer(markerLayer[mlIdx], false);
                }
            }
        }

        var layerScales = this.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());
        var openLayer = new OpenLayers.Layer.WMS('layer_' + layer.getId(), this.ajaxUrl+"&LAYERID="+layer.getId(), {
            layers : layer.getWmsName(),
            transparent : true,
            format : "image/png"
        }, {
            scales : layerScales,
            isBaseLayer : false,
            displayInLayerSwitcher : false,
            visibility : true,
            singleTile : true,
            buffer : 0
        });

        // Select control
        this._statsDrawLayer = new OpenLayers.Layer.Vector("Stats Draw Layer", {
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
                "select": new OpenLayers.Style({
                })
            })
        });
        this._map.addLayers([this._statsDrawLayer]);

        // Hover control
        this._highlightCtrl = new OpenLayers.Control.SelectFeature(this._statsDrawLayer, {
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary"
        });
        this._map.addControl(this._highlightCtrl);
        this._highlightCtrl.activate();

        var queryableMapLayers = [openLayer];
        this._getFeatureControlHover = new OpenLayers.Control.WMSGetFeatureInfo({
            drillDown: false,
            hover: true,
            handlerOptions: {
                "hover": {delay: 0},
                "stopSingle": false
            },
            infoFormat: "application/vnd.ogc.gml",
            layers: queryableMapLayers,
            eventListeners: {
                getfeatureinfo: function (event) {
                    var drawLayer = me._map.getLayersByName("Stats Draw Layer")[0];
                    if (typeof drawLayer === "undefined") return;
                    if (event.features.length === 0) {
                        for (var i = 0; i < drawLayer.features.length; i++) {
                            if (!drawLayer.features[i].selected) drawLayer.removeFeatures([drawLayer.features[i]]);
                        }
                        return;
                    }
                    var found = false;
                    var attrText = "kuntakoodi";
                    for (var i = 0; i < drawLayer.features.length; i++) {
                        if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                            found = true;
                        } else if (!drawLayer.features[i].selected){
                            drawLayer.removeFeatures([drawLayer.features[i]]);
                        }
                    }
                    if (!found) {
                        drawLayer.addFeatures([event.features[0]]);
                        me._highlightCtrl.highlight(event.features[0]);
                    }
                    drawLayer.redraw();
                },
                beforegetfeatureinfo: function(event) {
                },
                nogetfeatureinfo: function(event) {
                }
            }
        });
        // Add the control to the map
        this._map.addControl(this._getFeatureControlHover);
        this._getFeatureControlHover.activate();

        // Select control
        this._getFeatureControlSelect = new OpenLayers.Control.WMSGetFeatureInfo({
            drillDown: true,
            hover: false,
            handlerOptions: {
                "click": {delay: 0},
                "pixelTolerance": 5
            },
            infoFormat: "application/vnd.ogc.gml",
            layers: queryableMapLayers,
            eventListeners: {
                getfeatureinfo: function(event) {
                    if (event.features.length === 0) return;
                    var newFeature = event.features[0];
                    var drawLayer = me._map.getLayersByName("Stats Draw Layer")[0];
                    if (typeof drawLayer === "undefined") return;
                    var foundInd = -1;
                    var attrText = "kuntakoodi";
                    for (var i = 0; i < drawLayer.features.length; i++) {
                        if (drawLayer.features[i].attributes[attrText] === event.features[0].attributes[attrText]) {
                            foundInd = i;
                            break;
                        }
                    }
        		    var featureStyle = OpenLayers.Util.applyDefaults(featureStyle, OpenLayers.Feature.Vector.style['default']);
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
                    } else {
                        drawLayer.addFeatures([newFeature]);
                        newFeature.selected = true;
                        newFeature.style = featureStyle;
                    }
                    drawLayer.redraw();
                },
                beforegetfeatureinfo: function(event) {
                },
                nogetfeatureinfo: function(event) {
                }
            }
        });
        // Add the control to the map
        this._map.addControl(this._getFeatureControlSelect);
        this._getFeatureControlSelect.activate();

        openLayer.opacity = layer.getOpacity() / 100;

        this._map.addLayer(openLayer);

        this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer " + layer.getId());

        if(keepLayerOnTop) {
            this._map.setLayerIndex(openLayer, this._map.layers.length);
        } else {
            this._map.setLayerIndex(openLayer, 0);
        }
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.addLayer(markerLayer[mlIdx]);
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
    _afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();
        if(!layer.isLayerOfType(this._layerType)) {
            return;
        }
        this._removeMapLayerFromMap(layer);
        this._highlightCtrl.deactivate();
        this._getFeatureControlHover.deactivate();
        this._getFeatureControlSelect.deactivate();
        this._map.removeControl(this._highlightCtrl);
        this._map.removeControl(this._getFeatureControlHover);
        this._map.removeControl(this._getFeatureControlSelect);
        this._map.removeLayer(this._statsDrawLayer);
    },
    /**
     * @method _afterMapLayerRemoveEvent
     * Removes the layer from the map
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     */
    _removeMapLayerFromMap : function(layer) {

        if(!layer.isLayerOfType(this._layerType)) {
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
    getOLMapLayers : function(layer) {

        if(!layer.isLayerOfType(this._layerType)) {
            return null;
        }

        return this._map.getLayersByName('layer_' + layer.getId());
    },
    /**
     * @method _afterChangeMapLayerOpacityEvent
     * Handle AfterChangeMapLayerOpacityEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
     *            event
     */
    _afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType(this._layerType))
            return;

        this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
        var mapLayer = this.getOLMapLayers(layer);
        if(mapLayer[0] != null) {
            mapLayer[0].setOpacity(layer.getOpacity() / 100);
        }
    },
    /**
     * Handle AfterChangeMapLayerStyleEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
     *            event
     */
    _afterChangeMapLayerStyleEvent : function(event) {
        var layer = event.getMapLayer();

        /*
        TileHandler recognizes these parameters:
        // to get from DB
        VIS_ID="1" 
        // to construct from given data (no DB involved)
        VIS_NAME="ows:Kunnat2013"
        VIS_ATTR="Kuntakoodi"
        VIS_CLASSES="020,091|186,086,982|111,139,740"
        VIS_COLORS="vis=choro:ccffcc|99cc99|669966"

        These should be given in the event to update 
        */
        // Change selected layer style to defined style
        var mapLayer = this.getOLMapLayers(layer);
        if(mapLayer != null) {
            mapLayer[0].mergeNewParams({
                // TODO: check if we want to generate SLD from DB with VIS_ID 
                VIS_ID : layer.getCurrentStyle().getName(),
                // OR generate from given params (VIS_ID should be -1 or undefined if we go here)
                VIS_NAME : "ows:Kunnat2013",
                VIS_ATTR : "Kuntakoodi",
                VIS_CLASSES : "020,091|186,086,982|111,139,740",
                VIS_COLORS : "choro:ccffcc|99cc99|669966"
            });
        }
    },

    _afterStatsVisualizationChangeEvent: function(event) {
        var layer = event.getLayer();
        var params = event.getParams();

        // For testing. Otherwise OpenLayers won't update the tiles, since no params have been changed.
        params.randomNumberForTheLulz = Math.random();

        var mapLayer = this.getOLMapLayers(layer);
        if(mapLayer != null) {
            mapLayer[0].mergeNewParams(params);
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
