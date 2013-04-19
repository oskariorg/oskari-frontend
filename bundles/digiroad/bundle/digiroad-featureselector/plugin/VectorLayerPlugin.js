/**
 * @class Oskari.digiroad.bundle.featureselector.plugin.VectorLayerPlugin
 */
Oskari.clazz.define('Oskari.digiroad.bundle.featureselector.plugin.VectorLayerPlugin',
    function() {
        this.mapModule = null;
        this.pluginName = null;
        this.openLayers = {};
        this._sandbox = null;
        this._map = null;
        this._controls = {};
        this._supportedFormats = {};
        this._sldFormat = new OpenLayers.Format.SLD( {
            multipleSymbolizers : false,
            namedLayersAsArray : true
        });
    }, {
        __name : 'DigiroadVectorLayerPlugin',

        _layerType: 'DR_VECTOR',

        getName : function() {
            return this.pluginName;
        },

        getMapModule : function() {
            return this.mapModule;
        },
        setMapModule : function(mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },
        getOpenLayers : function() {
            return this.openLayers;
        },
    /**
     * @method hasUI
     * @return {Boolean} 
     * This plugin doesn't have an UI so always returns false
     */
    hasUI : function() {
        return false;
    },

    register : function() {
        this.getMapModule().setLayerPlugin('dr-vectorlayer',this);
    },
    unregister : function() {
        this.getMapModule().setLayerPlugin('dr-vectorlayer',null);
    },

    init : function(sandbox) {
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        if(mapLayerService) {
            mapLayerService.registerLayerModel('dr-vectorlayer', 'Oskari.digiroad.bundle.featureselector.domain.VectorLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.digiroad.bundle.featureselector.domain.VectorLayerModelBuilder', sandbox);
            mapLayerService.registerLayerModelBuilder('dr-vectorlayer', layerModelBuilder);
        }
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        this.registerVectorFormats();

        sandbox.register(this);
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    stopPlugin : function(sandbox) {

        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },

       /* @method start 
     * called from sandbox
     */
    start: function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     * 
     */
    stop: function(sandbox) {
    },
    
    
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'FeaturesAvailableEvent' : function(event) {
            this.handleFeaturesAvailableEvent(event);
        },
        'FeatureHighlightEvent': function(event) {
            var type = event.getHighlightType(),
                feature = event.getFeature(),
                layerName = event.getLayerName();

            switch(type) {
                case "highlight":
                    this.highlightFeature(layerName, feature);
                    break;
                case "unHighlight":
                    this.unHighlightFeature(layerName, feature);
                    break;
            }
        }
    },

    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this,
                [ event ]);
    },

    /**
     * 
     */
    preselectLayers: function(layers)  {
        var sandbox = this._sandbox;
        for ( var i = 0 ; i < layers.length ; i++) {
            var layer = layers[i];
            var layerId = layer.getId();
            
            
            if (!layer.isLayerOfType(this._layerType)) 
                continue;
            
            sandbox.printDebug("preselecting " + layerId);
            this.addMapLayerToMap(layer,true,layer.isBaseLayer());
        }

    },

    
    /***********************************************************
     * Handle AfterMapLaeyrAddEvent
     * 
     * @param {Object}
     *            event
     */
    afterMapLayerAddEvent : function(event) {
        this.addMapLayerToMap(event.getMapLayer(), event
                .getKeepLayersOrder(), event.isBasemap());
    },

    /**
     * adds vector format to props of known formats
     */
    registerVectorFormat : function(mimeType, formatImpl) {
        this._supportedFormats[mimeType] = formatImpl;
    },

    /**
     * registers default vector formats
     */
    registerVectorFormats : function() {
        this.registerVectorFormat("application/json",
                new OpenLayers.Format.GeoJSON( {}));
        this.registerVectorFormat(
                "application/nlsfi-x-openlayers-feature",
                new function() {
                    this.read = function(data) {
                        return data;
                    };
                });
    },

    /**
     * primitive for adding layer to this map
     */
    addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap, filter) {
        if (!layer.isLayerOfType(this._layerType))
            return;

        var layerId = layer.getId();
        var markerLayer = this._map.getLayersByName("Markers");
        this._map.removeLayer(markerLayer[0], false);

//                      var layerScales = this.getMapModule().calculateLayerScales(layer
//                              .getMaxScale(), layer.getMinScale());
        
        var styleOpts = {
            "defaultStrokeColor": "#FF2222",
            "selectStrokeColor": "#FF0000"
        };
        var styleMap = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                'strokeWidth': 5,
                'strokeOpacity': 0.6,
                'strokeColor': styleOpts["defaultStrokeColor"],
                'pointRadius': 6,
                'fillColor': "#ff9966",
                'fillOpacity': 0.6
            }),
            'select': new OpenLayers.Style({
                'strokeWidth': 7,
                'strokeOpacity': 1,
                'strokeColor': styleOpts["selectStrokeColor"],
                'pointRadius': 6,
                'fillColor': "#ff9966",
                'fillOpacity': 1
            })
        });

        var strategies = [];
        var strategyTypes = layer.getStrategyTypes();
        if(strategyTypes && strategyTypes.length) {
            for (var i = 0; i < strategyTypes.length; ++i) {
                var s = strategyTypes[i];
                strategies.push(new OpenLayers.Strategy[s]());
            }
        }
        
        var layerOpts = {
            styleMap : styleMap,
            strategies: strategies,
            minScale: layer.getMinScale(),
            maxScale: layer.getMaxScale()
        };
/*                      var sldSpec = layer.getStyledLayerDescriptor();

        if (sldSpec) {
            this._sandbox.printDebug(sldSpec);
            var styleInfo = this._sldFormat.read(sldSpec);

            window.styleInfo = styleInfo;
            var styles = styleInfo.namedLayers[0].userStyles;

            var style = styles[0];
            // if( style.isDefault) {
            styleMap.styles["default"] = style;
            // }
        }*/

        var openLayer = new OpenLayers.Layer.Vector(
                'layer_' + layerId, layerOpts);

        openLayer.opacity = layer.getOpacity() / 100;

        this._map.addLayer(openLayer);
        this.openLayers[layerId] = openLayer;

        var protocol = this.createProtocol(layer);

        this._controls[layerId] = {};
        this._controls[layerId]['getFeature'] = this.activateGetFeature(layer, openLayer, protocol, filter);
        this._controls[layerId]['selectFeature'] = this.activateSelectFeature(openLayer);

        this._sandbox
                .printDebug("#!#! CREATED VECTOR / OPENLAYER.LAYER.VECTOR for "
                        + layer.getId());

        if (keepLayerOnTop) {
            this._map.setLayerIndex(openLayer,
                    this._map.layers.length);
        } else {
            this._map.setLayerIndex(openLayer, 0);
        }

        this._map.addLayer(markerLayer[0]);
    },

    createProtocol: function(layer) {
        var protocol = null;
        if(layer.getProtocolType() == "WFS") {
            var protocol_opts = layer.getProtocolOpts();
            protocol = new OpenLayers.Protocol.WFS(protocol_opts);
        }
        return protocol;
    },

    activateSelectFeature: function(openLayer) {
        var control = new OpenLayers.Control.SelectFeature(openLayer, {
            callbacks: {
                click: function() { return false; }
            }
        });
        this._map.addControl(control);
        control.activate;
        return control;
    },

    activateGetFeature: function(layer, openLayer, protocol, filter) {
        var control = new OpenLayers.Control.GetFeature({
            protocol: protocol,
            filterType: OpenLayers.Filter.Spatial.BBOX,
            customFilter: filter,
            toggleKey: "ctrlKey",
            box: true,
            handlerOptions: {
                'box': {keyMask: OpenLayers.Handler.MOD_ALT}
            }
        });
        
        if(layer.getId() === "liikenne_elementti_vector") {
            control.multiple = true;
        }
        
        if(layer.getId() === 'kaantymismaarays_vector') {
            this._registerEventsForKaantymismaarays(control, layer, openLayer, protocol);
        } else {
            control.events.register("beforefeatureselected", this, function(e) {
                if(this._map.getZoom() < 8) {
                    return false;
                }
            });
            control.events.register("featureselected", this, function(e) {
                openLayer.addFeatures([e.feature]);

                var sandbox = this._sandbox;
                var eventBuilder = sandbox.getEventBuilder("FeaturesAddedEvent");
                if(eventBuilder) {
                    var event = eventBuilder(layer.getId(), [e.feature]);
                    sandbox.notifyAll(event);
                }
            });
            control.events.register("featureunselected", this, function(e) {
                openLayer.removeFeatures([e.feature]);

                var sandbox = this._sandbox;
                var eventBuilder = sandbox.getEventBuilder("FeaturesRemovedEvent");
                if(eventBuilder) {
                    var event = eventBuilder(layer.getId(), [e.feature]);
                    sandbox.notifyAll(event);
                }
            });
        }
        
        this._map.addControl(control);
        control.activate();
        return control;
    },
    
    _registerEventsForKaantymismaarays: function(control, layer, openLayer, protocol) {
        var me = this;
        control.single = false;

        control.events.register("beforefeaturesselected", this, function(e) {
            var features = e.features,
                filters = [],
                filter;

            // For each feature we need to get the 'KAANTMAAR_'
            // property and create a filter based on it.
            // This is because we're not adding the features
            // the user just clicked over on, but rather requesting
            // every element there is for that 'kaantymismaarays'. 
            for(var i = 0; i < features.length; ++i) {
                var kmaar_code = features[i].attributes['KAANTMAAR_'];
                var kmaarFilter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "KAANTMAAR_",
                    value: kmaar_code
                });
                filters.push(kmaarFilter);
            }
            if(filters.length > 1) {
                filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR,
                    filters: filters
                });
            } else {
                filter = filters[0];
            }
            
            // The user is a basic user if he has a 'kuntaKoodi' parameter greater than 0.
            // In case he doesn't we're assuming he's an admin.
            // OBS! This is just a quick fix to Get It Work™, should most definitely implement better.
            if(kuntayllapito.user.kuntaKoodi > 0) {
                filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND,
                    filters: [
                        filter,
                        new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: "TIEE_KUNTA",
                            value: kuntayllapito.user.kuntaKoodi
                        })
                    ]
                });
            }
            
            protocol.read({
                filter: filter,
                callback: function(resp) {
                    var features = resp.features;
                    me._handleGetKaantymismaarays(features, layer, openLayer);
                }
            });
            return false;
        });
        // Clicking out removes all the features.
        control.events.register("clickout", this, function(e) {
            var sandbox = me._sandbox;
            var eventBuilder = sandbox.getEventBuilder("FeaturesRemovedEvent");
            if(eventBuilder) {
                var event = eventBuilder(layer.getId());
                sandbox.notifyAll(event);
            }
            openLayer.removeAllFeatures();
        })
    },

    _handleGetKaantymismaarays: function(features, layer, openLayer) {
        if(!features) {
            return;
        }
        var featCollection = {},
            notifyFeatures = [],
            featAtts,
            feat;

        // Grouping the features based on the kaantymismaarays object id
        // and deducing whether the element is the first or the last one
        // (or the middle one, but apparently that is not used atm).
        for(var i = 0; i < features.length; ++i) {
            var f = features[i];
            var f_kaantm = featCollection[f.attributes['KAANTMAAR_']];
            if(!f_kaantm) {
                f_kaantm = featCollection[f.attributes['KAANTMAAR_']] = {};
            }
            switch(f.attributes['ELEM_JAR_1']) {
                case 1:
                    f_kaantm.firstElem = f;
                    break;
                case 2:
                    f_kaantm.middleElem = f;
                    break;
                case 3:
                    f_kaantm.lastElem = f;
                    break;
            }
        }

        // Creating the features we're sending with the 'FeaturesAddedEvent'.
        // This is mainly for the 'FeatureSelector' bundle.
        for(var kFeature in featCollection) {
            var f = featCollection[kFeature];
            featAtts = {
                "firstElementId": f.firstElem.attributes['ELEMENT_OB'],
                "lastElementId": f.lastElem.attributes['ELEMENT_OB'],
                "firstElement": f.firstElem,
                "lastElement": f.lastElem,
                "TYYPPI": f.firstElem.attributes['TYYPPI'],
                "OID_TUNNUS": f.firstElem.attributes['OID_TUNNUS'],
                "GUID": f.firstElem.attributes['ELEMENT_OB'].toString() + f.lastElem.attributes['ELEMENT_OB'].toString()
            }
            feat = new OpenLayers.Feature.Vector(null, featAtts);
            notifyFeatures.push(feat);
        }

        var sandbox = this._sandbox;
        var eventBuilder = sandbox.getEventBuilder("FeaturesAddedEvent");
        if(eventBuilder) {
            var event = eventBuilder(layer.getId(), notifyFeatures);
            sandbox.notifyAll(event);
        }
        
        // Lastly we're adding the real features to the map
        // (that is, those which have a geometry property).
        openLayer.addFeatures(features);
    },

    /***********************************************************
     * Handle AfterMapLayerRemoveEvent
     * 
     * @param {Object}
     *            event
     */
    afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();
        this.removeMapLayerFromMap(layer);
    },

    removeMapLayerFromMap : function(layer) {
        if (!layer.isLayerOfType(this._layerType))
            return;

        for(c in this._controls[layer.getId()]) {
            var control = this._controls[layer.getId()][c];
            control.deactivate();
            this._map.removeControl(control);
        }

        delete this.openLayers[layer.getId()];
        var remLayer = this._map
                .getLayersByName('layer_' + layer.getId());
        /* This should free all memory */
        remLayer[0].destroy();

    },
    getOLMapLayers : function(layer) {

        if (!layer.isLayerOfType(this._layerType)) {
            return;
        }

        return this._map
                .getLayersByName('layer_' + layer.getId());
    },
    /**
     * 
     */
    handleFeaturesAvailableEvent : function(event) {
        var layer = event.getMapLayer();

        var mimeType = event.getMimeType();
        var features = event.getFeatures();
//                      var projCode = event.getProjCode();
        var op = event.getOp();

        var mapLayer = this._map
                .getLayersByName('layer_' + layer.getId())[0];
        if (!mapLayer) {
            return;
        }

        if (op && op == 'replace') {
            mapLayer.removeFeatures(mapLayer.features);
        }

        var format = this._supportedFormats[mimeType];

        if (!format) {
            return;
        }

        var fc = format.read(features);

        mapLayer.addFeatures(fc);
    },

    highlightFeature: function(layerName, feature) {
        this._controls[layerName+'_vector']['selectFeature'].select(feature);
    },

    unHighlightFeature: function(layerName, feature) {
        this._controls[layerName+'_vector']['selectFeature'].unselect(feature);
    }
},
{
    'protocol' : [
        "Oskari.mapframework.module.Module",
        "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
    ]
});