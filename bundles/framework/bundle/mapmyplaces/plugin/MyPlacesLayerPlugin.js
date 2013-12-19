/**
 * Provides functionality to draw MyPlaces layers on the map
 * 
 * @class Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin', 

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
    this.config = config;
    this.ajaxUrl = null;
    this.layers = {};
    if(config && config.ajaxUrl) {
        this.ajaxUrl = config.ajaxUrl;
    }
}, {
    /** @static @property __name plugin name */
    __name : 'MyPlacesLayerPlugin',

    /** @static @property _layerType type of layers this plugin handles */
    _layerType : 'MYPLACES',

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
     * This plugin doesn't have an UI that we would want to ever hide so always returns false
     * 
     * @method hasUI
     * @return {Boolean} 
     */
    hasUI : function() {
        return false;
    },
    /**
     * Interface method for the plugin protocol.
     * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
     * 
     * @method register
     */
    register : function() {
        this.getMapModule().setLayerPlugin('myplaceslayer', this);
    },
    /**
     * Interface method for the plugin protocol
     * Unregisters self from mapmodules layerPlugins
     * 
     * @method unregister
     */
    unregister : function() {
        this.getMapModule().setLayerPlugin('myplaceslayer', null);
    },
    /**
     * Interface method for the module protocol.
     * 
     * @method init
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var sandboxName = ( this.config ? this.config.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);
        
        // register domain builder
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if(mapLayerService) {
            mapLayerService.registerLayerModel('myplaceslayer', 'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder', sandbox);
            mapLayerService.registerLayerModelBuilder('myplaceslayer', layerModelBuilder);
        }

        if (jQuery.browser.msie && jQuery.browser.version < 9) { //TODO: fix me fast
            this._ieHack(); 
        }
    },
    _ieHack: function() {
        OpenLayers.Renderer.VML.prototype.drawText = function(featureId, style, location) {
            var label = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "olv:rect");
            var textbox = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX + "_textbox", "olv:textbox");
            
            var resolution = this.getResolution();
            label.style.left = (((location.x - this.featureDx)/resolution - this.offset.x) | 0) + "px";
            label.style.top = ((location.y/resolution - this.offset.y) | 0) + "px";
            label.style.flip = "y";

            textbox.innerText = style.label;

            if (style.cursor != "inherit" && style.cursor != null) {
                textbox.style.cursor = style.cursor;
            }
            if (style.fontColor) {
                textbox.style.color = style.fontColor;
            }
            
            if (style.fontOpacity) {
                textbox.style.filter = 'alpha(opacity=' + (style.fontOpacity * 100) + ')';
            }
            if (style.fontFamily) {
                textbox.style.fontFamily = style.fontFamily;
            }
            if (style.fontSize) {
                var fontSizeNum = style.fontSize.split("px")[0];
                if (fontSizeNum > 18) {
                    style.fontSize = '18px';    
                }
                textbox.style.fontSize = style.fontSize;
            }
            if (style.fontWeight) {
                textbox.style.fontWeight = style.fontWeight;
            }
            if (style.fontStyle) {
                textbox.style.fontStyle = style.fontStyle;
            }
            if(style.labelSelect === true) {
                label._featureId = featureId;
                textbox._featureId = featureId;
                textbox._geometry = location;
                textbox._geometryClass = location.CLASS_NAME;
            }
            textbox.style.whiteSpace = "nowrap";
            // fun with IE: IE7 in standards compliant mode does not display any
            // text with a left inset of 0. So we set this to 1px and subtract one
            // pixel later when we set label.style.left
            textbox.inset = "1px,0px,0px,0px";
            
            label.appendChild(textbox);
            this.textRoot.appendChild(label);
            
            var align = style.labelAlign || "cm";
            if (align.length == 1) {
                align += "m";
            }
            var xshift = textbox.clientWidth *
                (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(0,1)]);
            var yshift = textbox.clientHeight *
                (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(1,1)]);
            label.style.left = parseInt(label.style.left)-xshift-1+"px";
            label.style.top = parseInt(label.style.top)+yshift+"px";
            
        };
    },
    /**
     * Interface method for the plugin protocol.
     *
     * @method startPlugin
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
            this.ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetAnalysis?';
        }
    },
    /**
     * Interface method for the plugin protocol
     *
     * @method stopPlugin
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
     * Interface method for the module protocol
     *
     * @method start
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * Interface method for the module protocol
     *
     * @method stop
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
        }
    },

    /**
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     * 
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * Adds given analysis layers to map if of type WFS
     * 
     * @method preselectLayers
     * @param {Oskari.mapframework.domain.WfsLayer[]} layers
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
     * @method _afterMapLayerAddEvent
     * @private 
     * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
     *            event
     */
    _afterMapLayerAddEvent : function(event) {
        this._addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * Adds a single MyPlaces layer to this map
     * 
     * @method _addMapLayerToMap
     * @private
     * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    _addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        if(!layer.isLayerOfType(this._layerType)) {
            return;
        }

        var me = this;
        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.removeLayer(markerLayer[mlIdx], false);
                }
            }
        }

        var openLayerId = 'layer_' + layer.getId();
        var imgUrl = layer.getWmsUrl();
        var layerScales = this.getMapModule()
            .calculateLayerScales(layer.getMaxScale(), layer.getMinScale());

        var openLayer = new OpenLayers.Layer.WMS(openLayerId, imgUrl, {
            layers : layer.getWmsName(),
            transparent : true,
            format : "image/png"
        }, {
            scales : layerScales,
            isBaseLayer : false,
            displayInLayerSwitcher : false,
            visibility : true,
            singleTile : true,
            transitionEffect: null
        });

        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

        var attentionLayer = new OpenLayers.Layer.Vector("layer_name_"+layer.getId(), {
            styleMap: new OpenLayers.StyleMap({'default':{
                strokeOpacity: 1,
                fillOpacity: 1.0,
                pointerEvents: "visiblePainted",
                label : "${attentionText}",
                fontColor: "#${color}",
                labelAlign: "${align}",
                labelXOffset: "${xOffset}",
                labelYOffset: "${yOffset}",
                fontSize: "24px",
                fontFamily: "Open Sans",
                fontWeight: "bold",
                labelOutlineColor: "white",
                labelOutlineWidth: 3
            }}), renderers: renderer
        } );

         
        var myPlacesService = this._sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');

        if (myPlacesService) {
            this._addAttentionText(myPlacesService, layer.getId(), attentionLayer);
        }

        attentionLayer.opacity = layer.getOpacity() / 100;
        openLayer.opacity = layer.getOpacity() / 100;
       
        this._map.addLayer(openLayer);
        this._map.addLayer(attentionLayer);

        var myLayersGroup = [];
        myLayersGroup.push(openLayer);
        myLayersGroup.push(attentionLayer);

        this.layers[openLayerId] = myLayersGroup;

        this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for MyPlacesLayer " + layer.getId());

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
     * Adds a single  attention text to MyPlaces layer to this map
     * 
     * @method _addAttentionText
     * @private
     * @param {Oskari.mapframework.bundle.myplaces2.service.MyPlacesService} myPlacesService
     * @param {String} layerId
     * @param {OpenLayers.Layer.Vector} vectorLayer
     */
    _addAttentionText: function (myPlacesService, layerId, vectorLayer) {
        var me = this;
        var categoryId = layerId.split("_")[1];
        var category = myPlacesService.findCategory(categoryId);
        var features = myPlacesService.getPlacesInCategory(categoryId);

        _.forEach(features, function(feature) {
            var name = feature.name;
            
            if (feature.attention_text) {
                name = feature.attention_text;
            }

            if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.MultiPoint") {
                _.forEach(feature.geometry.components, function(component) {
                    vectorLayer.addFeatures(me._createFeature(name, component, category.dotColor, category.dotSize*4));
                });
            } else if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.MultiPolygon"){
                _.forEach(feature.geometry.components, function(component) {
                    var rightMostPoint = _.max(component.components[0].components, function(chr) {
                        return chr.x;
                    });
                    vectorLayer.addFeatures(me._createFeature(name, rightMostPoint, category.dotColor, 5));
                });
            } else if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.LineString") {
                var rightMostPoint = _.max(feature.geometry.components, function(chr) {
                        return chr.x;
                });
                vectorLayer.addFeatures(me._createFeature(name, rightMostPoint, category.dotColor, 5));
            } else if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
               _.forEach(feature.geometry.components, function(component) {
                    var rightMostPoint = _.max(component.components, function(chr) {
                        return chr.x;
                    });
                    vectorLayer.addFeatures(me._createFeature(name, rightMostPoint, category.dotColor, 5));
                });
            }
            
        });
    },
    /**
     * Creating new point feature
     * 
     * @method _createFeature
     * @private
     * @param {String} name
     * @param {Component} component
     * @param {String} color
     * @param {integer} xOffset
     */
    _createFeature: function(name, component, color, xOffset) {
        var pointFeature = new OpenLayers.Feature.Vector(component);
        pointFeature.attributes = {
            attentionText: name,
            color: color,
            align: "lb",
            xOffset : xOffset 
        };
        return pointFeature;
    },
    /**
     * Handle AfterMapLayerRemoveEvent
     * 
     * @method _afterMapLayerRemoveEvent
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
        
    },
    /**
     * Removes the layer from the map
     * 
     * @method _afterMapLayerRemoveEvent
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     */
    _removeMapLayerFromMap : function(layer) {
        if(!layer.isLayerOfType(this._layerType)) {
            return null;
        }

        var mapLayers = this.getOLMapLayers(layer);

        _.forEach(mapLayers, function(mapLayer) {
            mapLayer.destroy();
        });

        /* This should free all memory */
        //mapLayer[0].destroy();
    },
    /**
     * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map. 
     * 
     * @method getOLMapLayers
     * @param {Oskari.mapframework.domain.WfsLayer} layer 
     * @return {OpenLayers.Layer[]}
     */
    getOLMapLayers : function(layer) {
        if(!layer.isLayerOfType(this._layerType)) {
            return null;
        }

        //return this._map.getLayersByName('layer_' + layer.getId());
        return this.layers['layer_' + layer.getId()];
    },
    /**
     * Handle AfterChangeMapLayerOpacityEvent
     * 
     * @method _afterChangeMapLayerOpacityEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
     *            event
     */
    _afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if (!layer.isLayerOfType(this._layerType)) {
            return;
        }

        var opacity = layer.getOpacity() / 100,
            openLayers = this.getOLMapLayers(layer);

        _.forEach(openLayers, function(mapLayer) {
            mapLayer.setOpacity(opacity);
        });
        //openLayer[0].setOpacity(opacity);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
