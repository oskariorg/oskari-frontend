/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin', 
                    function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
    this._wmtsLayerClazz = Oskari.clazz.create("Oskari.openlayers.Patch.layer.WMTS");
}, {
    __name : 'WmtsLayerPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMap : function() {
        return this._map;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    register : function() {
        this.getMapModule().setLayerPlugin('WmtsLayer', this);
    },
    unregister : function() {
        this.getMapModule().setLayerPlugin('WmtsLayer', null);
    },
    init : function(sandbox) {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /*
     * @method start called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop called from sandbox
     *
     */
    stop : function(sandbox) {
    },
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this.afterChangeMapLayerStyleEvent(event);
        }
    },

    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     *
     */
    preselectLayers : function(layers) {

        var sandbox = this._sandbox;
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(!layer.isLayerOfType('WMTS'))
                continue;

            sandbox.printDebug("preselecting " + layerId);
            this.addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /***********************************************************
     * Handle AfterMapLaeyrAddEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerAddEvent : function(event) {
        this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * primitive for adding layer to this map
     */
    addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        if(!layer.isLayerOfType('WMTS'))
            return;

        var me = this;
        var map = me.getMap();
        
        var matrixIds = layer.getWmtsMatrixSet().matrixIds;
        var layerDef = layer.getWmtsLayerDef();

        var layerName = null;
        if(layer.isBaseLayer()) {
            layerName = 'basemap_' + layer.getId();
        } else {
            layerName = 'layer_' + layer.getId();
        }

        var sandbox = this._sandbox;

        var wmtsUrl = layer.getWmtsUrls()[0];
        var matrixSet = layer.getWmtsMatrixSet();

        var wmtsLayerConfig = {
            visibility : true,
            transparent : true,
            // id : layerId, // this would break OpenLayers
            format : "image/png",
            url : wmtsUrl,
            layer : layer.getWmtsName(),
            style : layer.getCurrentStyle().getName(),
            matrixIds : matrixSet.matrixIds,
            matrixSet : matrixSet.identifier,
            isBaseLayer : layer.isBaseLayer(),
            buffer : 0,
            minScale : layer.getMinScale(),
            maxScale : layer.getMaxScale()
        };

        sandbox.printDebug("[WmtsLayerPlugin] creating WMTS Layer " + 
                           matrixSet.identifier + " / " + 
                           wmtsLayerConfig.id + "/" + 
                           wmtsLayerConfig.layer + "/" + 
                           wmtsLayerConfig.url);

        var fix = OpenLayers.Util.applyDefaults(wmtsLayerConfig, {
            url : wmtsUrl,
            name : layerName,
            style : layer.getCurrentStyle().getName(),
            matrixIds : matrixSet.matrixIds,
            layerDef : layerDef
        });

        // var wmtsLayer = new OpenLayers.Layer.WMTS(fix);
        var layerClazz = this._wmtsLayerClazz.getPatch();
        // Oskari.$("WMTSLayer");
        var wmtsLayer = new layerClazz(fix);
        wmtsLayer.opacity = layer.getOpacity() / 100;

        sandbox.printDebug("[WmtsLayerPlugin] created WMTS layer " + 
                           wmtsLayer);

        map.addLayers([wmtsLayer]);

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

        if(!layer.isLayerOfType('WMTS'))
            return;

        if(layer.isBaseLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
                    var remLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                    remLayer[0].destroy();
                }
            } else {
                var remLayer = this._map.getLayersByName('layer_' + layer.getId());
                remLayer[0].destroy();
            }
        } else {
            var remLayer = this._map.getLayersByName('layer_' + layer.getId());
            /* This should free all memory */
            remLayer[0].destroy();
        }
    },
    getOLMapLayers : function(layer) {

        if(!layer.isLayerOfType('WMTS'))
            return null;

        if(layer.isBaseLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
                    return this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                }
            } else {
                return this._map.getLayersByName('layer_' + layer.getId());
            }
        } else {
            return this._map.getLayersByName('layer_' + layer.getId());
        }
        return null;
    },
    afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType('WMTS'))
            return;

        if(layer.isBaseLayer()) {
            if(layer.getSubLayers().length > 0) {
                for(var bl = 0; bl < layer.getSubLayers().length; bl++) {
                    var mapLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
                if(mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(mapLayer[0] != null) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        }
    },
    /***********************************************************
     * Handle AfterChangeMapLayerStyleEvent
     *
     * @param {Object}
     *            event
     */
    afterChangeMapLayerStyleEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType('WMTS'))
            return;

        /** Change selected layer style to defined style */
        if(!layer.isBaseLayer()) {
            var styledLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(styledLayer != null) {
                styledLayer[0].mergeNewParams({
                    styles : layer.getCurrentStyle().getName()
                });
            }
        }
    }
}, {
    'protocol' : [ "Oskari.mapframework.module.Module",
                   "Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
Oskari.clazz.define('Oskari.mapframework.wmts.domain.WmtsLayer', function() {

    /** Internal id for this map layer */
    this._id = null;
    this._name = null;
    this._WmtsLayerName = null;
    this._WmtsMatrixSet = null;
    this._inspireName = null;
    this._organizationName = null;
    this._dataUrl = null;
    this._type = null;
    this._opacity = null;
    this._featureInfoEnabled = null;
    this._subLayers = [];

    /** Array of styles that this layer supports */
    this._styles = [];

    /** Description for layer */
    this._description = null;
    this._WmtsUrls = [];

    /** dataurl */
    this._dataUrl = null;
    this._legendImage = null;
    this._maxScale = null;
    this._minScale = null;
    this._queryable = null;
    this._currentStyle = null;
    this._visible = null;
    this._queryFormat = null;
    
    this._orderNumber = null;

	// f.ex. permissions.publish
	/* values are 
	-1 not publishable
	0 need to login to publish
	1 can be published
	2 can be published, but current user doesn't have the needed priviledges
	 */
    this._permissions = {};
    // if given, tells where the layer has content
    // array of Openlayers.Geometry[] objects if already processed from _geometryWKT
    this._geometry = [];
    // wellknown text for polygon geometry
    this._geometryWKT = null;
}, {
    /**
     * @method setGeometryWKT
     * Set geometry as wellknown text
     * @param {String} value 
     * 			WKT geometry
     */
    setGeometryWKT : function(value) {
        this._geometryWKT = value;
    },
    /**
     * @method getGeometryWKT
     * Get geometry as wellknown text
     * @return {String} WKT geometry
     */
    getGeometryWKT : function() {
        return this._geometryWKT;
    },
    /**
     * @method setGeometry
     * @param {OpenLayers.Geometry.Geometry[]} value 
     * 			array of WKT geometries or actual OpenLayer geometries
     */
    setGeometry : function(value) {
        this._geometry = value;
    },
    /**
     * @method getGeometry
     * @return {OpenLayers.Geometry.Geometry[]}  
     * 			array of WKT geometries or actual OpenLayer geometries
     */
    getGeometry : function() {
        return this._geometry;
    },
    /**
     * @method addPermission
     * @param {String} action 
     * 			action key that we want to add permission setting for
     * @param {String} permission 
     * 			actual permission setting for action
     */
    addPermission : function(action, permission) {
        this._permissions[action] = permission;
    },
    /**
     * @method removePermission
     * @param {String} action 
     * 			action key from which permission setting should be removed
     */
    removePermission : function(action) {
        this._permissions[action] = null;
    },
    /**
     * @method getPermission
     * @param {String} action 
     * 			action key for which permission we want
     * @return {String} permission setting for given action
     */
    getPermission : function(action) {
        return this._permissions[action];
    },

    setId : function(id) {
        this._id = id;
    },
    getId : function() {
        return this._id;
    },
    setQueryFormat : function(queryFormat) {
        this._queryFormat = queryFormat;
    },
    getQueryFormat : function() {
        return this._queryFormat;
    },
    setName : function(name) {
        this._name = name;
    },
    getName : function() {
        return this._name;
    },
    setWmtsName : function(WmtsName) {
        this._WmtsName = WmtsName;
    },
    getWmtsName : function() {
        return this._WmtsName;
    },
    setWmtsMatrixSet : function(matrixSet) {
    	this._WmtsMatrixSet = matrixSet;
    },
    getWmtsMatrixSet : function() {
        return this._WmtsMatrixSet;
    },
    setWmtsLayerDef : function(def) {
        this._WmtsLayerDef = def;
    },
    getWmtsLayerDef : function() {
        return this._WmtsLayerDef;
    },
    setType : function(type) {
        this._type = type;
    },
    getType : function() {
        return this._type;
    },
    setOpacity : function(opacity) {
        this._opacity = opacity;
    },
    getOpacity : function() {
        return this._opacity;
    },
    setDataUrl : function(param) {
        this._dataUrl = param;
    },
    getDataUrl : function() {
        return this._dataUrl;
    },
    setOrganizationName : function(param) {
        this._organizationName = param;
    },
    getOrganizationName : function() {
        return this._organizationName;
    },
    setInspireName : function(param) {
        this._inspireName = param;
    },
    getInspireName : function() {
        return this._inspireName;
    },
    setFeatureInfoEnabled : function(featureInfoEnabled) {
        this._featureInfoEnabled = featureInfoEnabled;
    },
    isFeatureInfoEnabled : function() {
    	if(this._featureInfoEnabled === true) {
    		return true;
    	}
        return false;
    },
    setDescription : function(description) {
        this._description = description;
    },
    getDescription : function() {
        return this._description;
    },
    addWmtsUrl : function(WmtsUrl) {
        this._WmtsUrls.push(WmtsUrl);
    },
    getWmtsUrls : function() {
        return this._WmtsUrls;
    },
    addStyle : function(style) {
        this._styles.push(style);
    },
    getStyles : function() {
        return this._styles;
    },
    addSubLayer : function(layer) {
        this._subLayers.push(layer);
    },
    getSubLayers : function() {
        return this._subLayers;
    },
    setLegendImage : function(legendImage) {
        this._legendImage = legendImage;
    },
    getLegendImage : function() {
        return this._legendImage;
    },
    setMaxScale : function(maxScale) {
        this._maxScale = maxScale;
    },
    getMaxScale : function() {
        return this._maxScale;
    },
    setMinScale : function(minScale) {
        this._minScale = minScale;
    },
    getMinScale : function() {
        return this._minScale;
    },
    setQueryable : function(queryable) {
        this._queryable = queryable;
    },
    getQueryable : function() {
        return this._queryable;
    },
    setAsGroupLayer : function() {
        this._type = "GROUP_LAYER";
    },    
    setAsBaseLayer : function() {
        this._type = "BASE_LAYER";
    },
    setAsNormalLayer : function() {
        this._type = "NORMAL_LAYER";
    },
    setOrderNumber : function(orderNumber) {
        this._orderNumber = orderNumber;
    },
    getOrderNumber : function() {
        return this._orderNumber;
    },
    isBaseLayer : function() {
        if(this._type == "BASE_LAYER") {
            return true;
        } /*else if(this._type == "NORMAL_LAYER") {
            return false;
        }*/ else {
            //throw "We found layer that is not NORMAL_LAYER or BASE_LAYER. Type '" + this._type + "' is not correct!";
            return false;
        }
    },
    selectStyle : function(styleName) {
        var style = null;
        // Layer have styles
        if(this._styles.length > 0) {
            // There is default style defined
            if(styleName !== "") {
                for(var i = 0; i < this._styles.length; i++) {
                    style = this._styles[i];
                    if(style.getName() == styleName) {
                        this._currentStyle = style;
                        return;
                    }
                }
            }
            // There is not default style defined
            else {
                //var style =
                // Oskari.clazz.create('Oskari.mapframework.domain.Style');

                // Layer have more than one style, set first
                // founded style to default
                // Because of layer style error this if clause
                // must compare at there is more than one style.
                if(this._styles.length > 1) {
                    this._currentStyle = this._styles[0];
                }
                // Layer have not styles, add empty style to
                // default
                else {
                    style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
                    style.setName("");
                    style.setTitle("");
                    style.setLegend("");
                    this._currentStyle = style;
                }

                return;
            }
        }
        // Layer have not styles
        else {
            style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
            style.setName("");
            style.setTitle("");
            style.setLegend("");
            this._currentStyle = style;
            return;
        }

        style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
        style.setName("");
        style.setTitle("");
        style.setLegend("");
        this._currentStyle = style;
    },
    getCurrentStyle : function() {
        return this._currentStyle;
    },
    isVisible : function() {
        return this._visible;
    },
    setVisible : function(visible) {
        this._visible = visible;
    },
    /**
     * @method isInScale
     * @param {Number} scale scale to compare to
     * @return {Boolean} true if given scale is between this layers min/max scales. Always return true for base-layers.
     */
    isInScale : function(scale) {
        var _return = this.isBaseLayer();
        if(!scale) {
	        var sandbox = Oskari.$().sandbox;
	        scale = sandbox.getMap().getScale();
        }

        // Check layer scales only normal layers
        if(!this.isBaseLayer()) {
            if(scale > this.getMaxScale() && scale < this.getMinScale()) {
                _return = true;
            }
        }
        return _return;
    },
    isLayerOfType : function(flavour) {
        return flavour == 'WMTS' || flavour == 'wmtslayer';
    },
    isGroupLayer : function() {
        if(this._type == "GROUP_LAYER") {
            return true;
        } else {
        	return false;
        } 
    }

});
/**
 * 
 * A service to act as a WMTS Layer Source
 * 
 * Requires services from MapLayerService (addLayer,removeLayer) (Will create
 * own domain objects, though)
 * 
 * This implements temporarily WMTS Caps parsing. WMTS Caps will be parsed in
 * backend.
 * 
 * 
 */

Oskari.clazz
		.define(
				'Oskari.mapframework.wmts.service.WMTSLayerService',
				function(mapLayerService) {
					this.mapLayerService = mapLayerService;
					this.capabilities = {};
					this.capabilitiesClazz = Oskari.clazz
							.create("Oskari.openlayers.Patch.WMTSCapabilities_v1_0_0");
				},
				{
					/**
					 * TEmp
					 */
					setCapabilities : function(name, caps) {
						this.capabilities[name] = caps;

					},

					/**
					 * Temp
					 */
					getCapabilities : function(name) {
						return this.capabilities[name];
					},

					/**
					 * This is a temporary solution actual capabilities to be
					 * read in backend
					 * 
					 */
					readWMTSCapabilites : function(wmtsName, capsPath,
							matrixSet) {

						var me = this;
						var formatClazz = this.capabilitiesClazz.getPatch();
						// Oskari.$("WMTSCapabilities_v1_0_0");
						var format = new formatClazz();// OpenLayers.Format.WMTSCapabilities();

						OpenLayers.Request.GET( {
							url : capsPath,
							params : {
								SERVICE : "WMTS",
								VERSION : "1.0.0",
								REQUEST : "GetCapabilities"
							},
							success : function(request) {
								var doc = request.responseXML;
								if (!doc || !doc.documentElement) {
									doc = request.responseText;
								}
								var caps = format.read(doc);

								me.setCapabilities(wmtsName, caps);
								me.parseCapabilitiesToLayers(wmtsName, caps,
										matrixSet);

							},
							failure : function() {
								alert("Trouble getting capabilities doc");
								OpenLayers.Console.error.apply(
										OpenLayers.Console, arguments);
							}
						});

					},

					/**
					 * This is a temporary solution actual capabilities to be
					 * read in backend
					 * 
					 */
					parseCapabilitiesToLayers : function(wmtsName, caps,
							matrixSet) {

						var me = this;
						var mapLayerService = this.mapLayerService;
						var getTileUrl = null;
						if( caps.operationsMetadata.GetTile.dcp.http.getArray ) {
							getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
						} else {
							getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
						}
						var capsLayers = caps.contents.layers;
						var contents = caps.contents;
						var matrixSet = contents.tileMatrixSets[matrixSet];

						for ( var n = 0; n < capsLayers.length; n++) {

							var spec = capsLayers[n];
							var mapLayerId = spec.identifier;
							var mapLayerName = spec.identifier;
							/*
							 * hack
							 */
							var mapLayerJson = {
								name : mapLayerId,
								minScale : 10000000,
								maxScale : 1,
								opacity : 100,
								wmtsName : mapLayerId,
								descriptionLink : "",
								orgName : "WMTS",
								type : "wmtslayer",
								legendImage : "",
								formats : {
									value : "text/html"
								},
								isQueryable : true,
								minScale : 4 * 4 * 4 * 4 * 40000,
								style : "",
								dataUrl : "",

								name : mapLayerId,
								opacity : 100,
								inspire : "WMTS",
								maxScale : 1
							};

							var layer = Oskari.clazz
									.create('Oskari.mapframework.wmts.domain.WmtsLayer');

							layer.setAsNormalLayer();
							layer.setId(mapLayerId);
							layer.setName(mapLayerJson.name);
							layer.setWmtsName(mapLayerJson.wmtsName);
							layer.setOpacity(mapLayerJson.opacity);
							layer.setMaxScale(mapLayerJson.maxScale);
							layer.setMinScale(mapLayerJson.minScale);
							layer.setDescription(mapLayerJson.info);
							layer.setDataUrl(mapLayerJson.dataUrl);
							layer.setOrganizationName(mapLayerJson.orgName);
							layer.setInspireName(mapLayerJson.inspire);
							layer.setWmtsMatrixSet(matrixSet)
							layer.setWmtsLayerDef(spec);

							layer.addWmtsUrl(getTileUrl);

							var styleBuilder = Oskari.clazz
									.builder('Oskari.mapframework.domain.Style');

							var styleSpec;

							for ( var i = 0, ii = spec.styles.length; i < ii; ++i) {
								styleSpec = spec.styles[i];
								var style = styleBuilder();
								style.setName(styleSpec.identifier);
								style.setTitle(styleSpec.identifier);

								layer.addStyle(style);
								if (styleSpec.isDefault) {
									layer.selectStyle(styleSpec.identifier);
									break;
								}
							}

							mapLayerService.addLayer(layer, false);

						}

					}
				});
/*
 * @class
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.wmts.service.WmtsLayerModelBuilder',
				function() {

				},
				{
					/**
					 * parses any additional fields to model
					 */
					parseLayerData : function(layer, mapLayerJson,
							maplayerService) {

						layer.setWmtsName(mapLayerJson.wmsName);
						if (mapLayerJson.wmsUrl) {
							var wmsUrls = mapLayerJson.wmsUrl.split(",");
							for ( var i = 0; i < wmsUrls.length; i++) {
								layer.addWmtsUrl(wmsUrls[i]);
							}
						}

						var styleBuilder = Oskari.clazz
								.builder('Oskari.mapframework.domain.Style');

						var styleSpec;

						for ( var i = 0, ii = mapLayerJson.styles.length; i < ii; ++i) {
							styleSpec = mapLayerJson.styles[i];
							var style = styleBuilder();
							style.setName(styleSpec.identifier);
							style.setTitle(styleSpec.identifier);

							layer.addStyle(style);
							if (styleSpec.isDefault) {
								layer.selectStyle(styleSpec.identifier);
								break;
							}
						}

						/*
						 * layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
						 * 
						 * layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
						 */
						
						layer.setFeatureInfoEnabled(true);
						if (mapLayerJson.tileMatrixSetData) {
							layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
							layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
						}
						
					}
				});
/**
 * Let's add missing TileMatrixLimits support 
 * (c) 2011-11 NLSFI 
 */
/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/WMTSCapabilities.js
 * @requires OpenLayers/Format/OWSCommon/v1_1_0.js
 */

/**
 * Class: OpenLayers.Format.WMTSCapabilities.v1_0_0 Read WMTS Capabilities
 * version 1.0.0.
 * 
 * Inherits from: - <OpenLayers.Format.WMTSCapabilities>
 */
Oskari.clazz
		.define(
				'Oskari.openlayers.Patch.WMTSCapabilities_v1_0_0',
				function() {

				},

				{
					getPatch : function() {

						if (this.patch)
							return this.patch;
						
						return this.buildPatch();
					},

					buildPatch : function() {

						this.patch = OpenLayers
								.Class(
										OpenLayers.Format.OWSCommon.v1_1_0,
										{

											/**
											 * Property: version {String} The
											 * parser version ("1.0.0").
											 */
											version : "1.0.0",

											/**
											 * Property: namespaces {Object}
											 * Mapping of namespace aliases to
											 * namespace URIs.
											 */
											namespaces : {
												ows : "http://www.opengis.net/ows/1.1",
												wmts : "http://www.opengis.net/wmts/1.0",
												xlink : "http://www.w3.org/1999/xlink"
											},

											/**
											 * Property: yx {Object} Members in
											 * the yx object are used to
											 * determine if a CRS URN
											 * corresponds to a CRS with y,x
											 * axis order. Member names are CRS
											 * URNs and values are boolean.
											 * Defaults come from the
											 * <OpenLayers.Format.WMTSCapabilities>
											 * prototype.
											 */
											yx : null,

											/**
											 * Property: defaultPrefix {String}
											 * The default namespace alias for
											 * creating element nodes.
											 */
											defaultPrefix : "wmts",

											/**
											 * Constructor:
											 * OpenLayers.Format.WMTSCapabilities.v1_0_0
											 * Create a new parser for WMTS
											 * capabilities version 1.0.0.
											 * 
											 * Parameters: options - {Object} An
											 * optional object whose properties
											 * will be set on this instance.
											 */
											initialize : function(options) {
												OpenLayers.Format.XML.prototype.initialize
														.apply(this,
																[ options ]);
												this.options = options;
												var yx = OpenLayers.Util
														.extend(
																{},
																OpenLayers.Format.WMTSCapabilities.prototype.yx);
												this.yx = OpenLayers.Util
														.extend(yx, this.yx);
											},

											/**
											 * APIMethod: read Read capabilities
											 * data from a string, and return
											 * info about the WMTS.
											 * 
											 * Parameters: data - {String} or
											 * {DOMElement} data to read/parse.
											 * 
											 * Returns: {Object} Information
											 * about the SOS service.
											 */
											read : function(data) {
												if (typeof data == "string") {
													data = OpenLayers.Format.XML.prototype.read
															.apply(this,
																	[ data ]);
												}
												if (data && data.nodeType == 9) {
													data = data.documentElement;
												}
												var capabilities = {};
												this.readNode(data,
														capabilities);
												capabilities.version = this.version;
												return capabilities;
											},

											props : {
												'wmts' : {
													'TileMatrixLimits' : {
														"MinTileRow" : [
																"minTileRow",
																parseInt ],
														"MaxTileRow" : [
																"maxTileRow",
																parseInt ],
														"MinTileCol" : [
																"minTileCol",
																parseInt ],
														"MaxTileCol" : [
																"maxTileCol",
																parseInt ],
														"TileMatrix" : [
																"tileMatrix",
																null ]
													}
												}
											},
											/**
											 * Property: readers Contains public
											 * functions, grouped by namespace
											 * prefix, that will be applied when
											 * a namespaced node is found
											 * matching the function name. The
											 * function will be applied in the
											 * scope of this parser with two
											 * arguments: the node being read
											 * and a context object passed from
											 * the parent.
											 */
											readers : {
												
												"wmts" : {
													"Capabilities" : function(
															node, obj) {
														this.readChildNodes(
																node, obj);
													},
													"Contents" : function(node,
															obj) {
														obj.contents = {};
														obj.contents.layers = [];
														obj.contents.tileMatrixSets = {};
														this.readChildNodes(
																node,
																obj.contents);
													},
													"Layer" : function(node,
															obj) {
														var layer = {
															styles : [],
															formats : [],
															tileMatrixSetLinks : [],
															tileMatrixSetLinksMap : {}
														};
														layer.layers = [];
														this.readChildNodes(
																node, layer);
														obj.layers.push(layer);
													},
													"Style" : function(node,
															obj) {
														var style = {};
														style.isDefault = (node
																.getAttribute("isDefault") === "true");
														this.readChildNodes(
																node, style);
														obj.styles.push(style);
													},
													"Format" : function(node,
															obj) {
														obj.formats
																.push(this
																		.getChildValue(node));
													},
													"TileMatrixSetLink" : function(
															node, obj) {
														var tileMatrixSetLink = {};
														this
																.readChildNodes(
																		node,
																		tileMatrixSetLink);
														obj.tileMatrixSetLinks
																.push(tileMatrixSetLink);
														obj.tileMatrixSetLinksMap[tileMatrixSetLink.tileMatrixSet] = tileMatrixSetLink;
													},
													"TileMatrixSet" : function(
															node, obj) {
														// node
														// could be
														// child of
														// wmts:Contents
														// or
														// wmts:TileMatrixSetLink
														// duck type
														// wmts:Contents
														// by
														// looking
														// for
														// layers
														if (obj.layers) {
															// TileMatrixSet
															// as
															// object
															// type
															// in
															// schema
															var tileMatrixSet = {
																matrixIds : []
															};
															this
																	.readChildNodes(
																			node,
																			tileMatrixSet);
															obj.tileMatrixSets[tileMatrixSet.identifier] = tileMatrixSet;
														} else {
															// TileMatrixSet
															// as
															// string
															// type
															// in
															// schema
															obj.tileMatrixSet = this
																	.getChildValue(node);
														}
													},
													"TileMatrix" : function(
															node, obj) {
														var tileMatrix = {
															supportedCRS : obj.supportedCRS
														};
														this.readChildNodes(
																node,
																tileMatrix);
														obj.matrixIds
																.push(tileMatrix);
													},
													"ScaleDenominator" : function(
															node, obj) {
														obj.scaleDenominator = parseFloat(this
																.getChildValue(node));
													},
													"TopLeftCorner" : function(
															node, obj) {
														var topLeftCorner = this
																.getChildValue(node);
														var coords = topLeftCorner
																.split(" ");
														// decide on
														// axis
														// order for
														// the
														// given CRS
														var yx;
														if (obj.supportedCRS) {
															// extract
															// out
															// version
															// from
															// URN
															var crs = obj.supportedCRS
																	.replace(
																			/urn:ogc:def:crs:(\w+):.+:(\w+)$/,
																			"urn:ogc:def:crs:$1::$2");
															yx = !!this.yx[crs];
														}
														if (yx) {
															obj.topLeftCorner = new OpenLayers.LonLat(
																	coords[1],
																	coords[0]);
														} else {
															obj.topLeftCorner = new OpenLayers.LonLat(
																	coords[0],
																	coords[1]);
														}
													},
													"TileWidth" : function(
															node, obj) {
														obj.tileWidth = parseInt(this
																.getChildValue(node));
													},
													"TileHeight" : function(
															node, obj) {
														obj.tileHeight = parseInt(this
																.getChildValue(node));
													},
													"MatrixWidth" : function(
															node, obj) {
														obj.matrixWidth = parseInt(this
																.getChildValue(node));
													},
													"MatrixHeight" : function(
															node, obj) {
														obj.matrixHeight = parseInt(this
																.getChildValue(node));
													},
													"ResourceURL" : function(
															node, obj) {
														obj.resourceUrl = obj.resourceUrl
																|| {};
														obj.resourceUrl[node
																.getAttribute("resourceType")] = {
															format : node
																	.getAttribute("format"),
															template : node
																	.getAttribute("template")
														};
													},
													// not used for
													// now, can be
													// added in
													// the future
													// though
													/*
													 * "Themes": function(node,
													 * obj) { obj.themes = [];
													 * this.readChildNodes(node,
													 * obj.themes); }, "Theme":
													 * function(node, obj) { var
													 * theme = {};
													 * this.readChildNodes(node,
													 * theme); obj.push(theme); },
													 */
													"WSDL" : function(node, obj) {
														obj.wsdl = {};
														obj.wsdl.href = node
																.getAttribute("xlink:href");
														// TODO:
														// other
														// attributes
														// of
														// <WSDL>
														// element
													},
													"ServiceMetadataURL" : function(
															node, obj) {
														obj.serviceMetadataUrl = {};
														obj.serviceMetadataUrl.href = node
																.getAttribute("xlink:href");
														// TODO:
														// other
														// attributes
														// of
														// <ServiceMetadataURL>
														// element
													},
													"TileMatrixSetLimits" : function(
															node, obj) {

														var tileMatrixSetLimits = {
															tileMatrixLimits : []
														};

														obj.tileMatrixSetLimits = tileMatrixSetLimits;

														/**
														 * Too deep recursion
														 * and you'll break IE
														 * Let's see what
														 * happens
														 */
														this
																.readChildNodes(
																		node,
																		tileMatrixSetLimits);

														/**
														 * Let's enhance
														 * original data
														 * assuming single entry
														 * per tileMatrix URI
														 * (should read spec)
														 */
														var tileMatrixSetLimitsMap = {};

														for ( var n = 0; n < tileMatrixSetLimits.tileMatrixLimits.length; n++) {
															var limit = tileMatrixSetLimits.tileMatrixLimits[n];
															tileMatrixSetLimitsMap[limit.tileMatrix] = limit;
														}

														obj.tileMatrixSetLimitsMap = tileMatrixSetLimitsMap;

													},
													"TileMatrixLimits" : function(
															node, obj) {

														var nodes = this
																.getElementsByTagNameNS(
																		node,
																		this.namespaces.wmts,
																		'*');
														var props = this.props.wmts['TileMatrixLimits'];

														var tileMatrixLimits = {};

														for ( var n = 0; n < nodes.length; n++) {
															var nd = nodes[n];
															// .item(n);
															var val = this
																	.getChildValue(nd);
															var local = nd.localName
																	|| nd.nodeName
																			.split(
																					":")
																			.pop();
															var prop = props[local][0];
															var propFunc = props[local][1];
															tileMatrixLimits[prop] = propFunc ? propFunc(val)
																	: val;
														}

														/**
														 * 
														 */

														obj.tileMatrixLimits
																.push(tileMatrixLimits);
													}
												},
												/**
												 * Let's override DCP/HTTP[Get]
												 */
												"ows" : OpenLayers.Util.applyDefaults({
													"HTTP": function(node, dcp) {
									                	dcp.http = {};
									                	this.readChildNodes(node, dcp.http);
									            	},
									            	"Get": function(node, http) {
									            		var href = this.getAttributeNS(node, 
									            				this.namespaces.xlink, "href");
									            		
									            		if( !http.get )
									            			http.get = href;

									            		if( !http.getArray )
									            			http.getArray = [];

									            		http.getArray.push(href);
									            		
									            	}
													
												},OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"])
											},

					

											CLASS_NAME : "OpenLayers.Format.WMTSCapabilities.v1_0_0"

										});

						return this.patch;
					}

				}, {
					'protocol' : [ "Oskari.openlayers.Patch" ]
				});
/**
 * Let's fix missing tileMatrixSetLimits handling for WMTS layers. (c) 2011-11
 * NLSFI
 */
/*
 var x = {
 "styles" : [ {
 "isDefault" : true,
 "identifier" : "_null"
 } ],
 "formats" : [ "image/png" ],
 "tileMatrixSetLinks" : [ {
 "tileMatrixSet" : "EPSG_3067_PTI",
 "tileMatrixSetLimits" : {
 "tileMatrixLimits" : [ {
 "tileMatrix" : "EPSG_3067_PTI:0",
 "minTileRow" : "5",
 "maxTileRow" : "8",
 "minTileCol" : "0",
 "maxTileCol" : "1"
 } ]
 }
 } ],
 "layers" : [],
 "title" : "pti_yleiskartta_8m",
 "identifier" : "pti_yleiskartta_8m"
 };
 */

/*
 * Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for full
 * list of contributors). Published under the Clear BSD license. See
 * http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of
 * the license.
 */

/**
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.WMTS Instances of the WMTS class allow viewing of
 * tiles from a service that implements the OGC WMTS specification version
 * 1.0.0.
 * 
 * Inherits from: - <OpenLayers.Layer.Grid>
 */
Oskari.clazz
		.define(
				'Oskari.openlayers.Patch.layer.WMTS',
				function() {

				},
				{
					getPatch : function() {
						if (this.patch)
							return this.patch;

						return this.buildPatch();
					},
					buildPatch : function() {
						this.patch = OpenLayers
								.Class(
										OpenLayers.Layer.Grid,
										{

											/**
											 * APIProperty: isBaseLayer
											 * {Boolean} The layer will be
											 * considered a base layer. Default
											 * is true.
											 */
											isBaseLayer : true,

											/**
											 * Property: version {String} WMTS
											 * version. Default is "1.0.0".
											 */
											version : "1.0.0",

											/**
											 * APIProperty: requestEncoding
											 * {String} Request encoding. Can be
											 * "REST" or "KVP". Default is
											 * "KVP".
											 */
											requestEncoding : "KVP",

											/**
											 * APIProperty: url {String} The
											 * base URL for the WMTS service.
											 * Must be provided.
											 */
											url : null,

											/**
											 * APIProperty: layer {String} The
											 * layer identifier advertised by
											 * the WMTS service. Must be
											 * provided.
											 */
											layer : null,

											/**
											 * WMTS Layer definition to support
											 * TileMatrixSetLimits processing
											 */
											layerDef : null,

											/**
											 * APIProperty: matrixSet {String}
											 * One of the advertised matrix set
											 * identifiers. Must be provided.
											 */
											matrixSet : null,

											/**
											 * APIProperty: style {String} One
											 * of the advertised layer styles.
											 * Must be provided.
											 */
											style : null,

											/**
											 * APIProperty: format {String} The
											 * image MIME type. Default is
											 * "image/jpeg".
											 */
											format : "image/jpeg",

											/**
											 * APIProperty: tileOrigin {<OpenLayers.LonLat>}
											 * The top-left corner of the tile
											 * matrix in map units. If the tile
											 * origin for each matrix in a set
											 * is different, the <matrixIds>
											 * should include a topLeftCorner
											 * property. If not provided, the
											 * tile origin will default to the
											 * top left corner of the layer
											 * <maxExtent>.
											 */
											tileOrigin : null,

											/**
											 * APIProperty: tileFullExtent {<OpenLayers.Bounds>}
											 * The full extent of the tile set.
											 * If not supplied, the layer's
											 * <maxExtent> property will be
											 * used.
											 */
											tileFullExtent : null,

											/**
											 * APIProperty: formatSuffix
											 * {String} For REST request
											 * encoding, an image format suffix
											 * must be included in the request.
											 * If not provided, the suffix will
											 * be derived from the <format>
											 * property.
											 */
											formatSuffix : null,

											/**
											 * APIProperty: matrixIds {Array} A
											 * list of tile matrix identifiers.
											 * If not provided, the matrix
											 * identifiers will be assumed to be
											 * integers corresponding to the map
											 * zoom level. If a list of strings
											 * is provided, each item should be
											 * the matrix identifier that
											 * corresponds to the map zoom
											 * level. Additionally, a list of
											 * objects can be provided. Each
											 * object should describe the matrix
											 * as presented in the WMTS
											 * capabilities. These objects
											 * should have the propertes shown
											 * below.
											 * 
											 * Matrix properties: identifier -
											 * {String} The matrix identifier
											 * (required). topLeftCorner - {<OpenLayers.LonLat>}
											 * The top left corner of the
											 * matrix. Must be provided if
											 * different than the layer
											 * <tileOrigin>. tileWidth -
											 * {Number} The tile width for the
											 * matrix. Must be provided if
											 * different than the width given in
											 * the layer <tileSize>. tileHeight -
											 * {Number} The tile height for the
											 * matrix. Must be provided if
											 * different than the height given
											 * in the layer <tileSize>.
											 */
											matrixIds : null,

											/**
											 * APIProperty: dimensions {Array}
											 * For RESTful request encoding,
											 * extra dimensions may be
											 * specified. Items in this list
											 * should be property names in the
											 * <params> object. Values of extra
											 * dimensions will be determined
											 * from the corresponding values in
											 * the <params> object.
											 */
											dimensions : null,

											/**
											 * APIProperty: params {Object}
											 * Extra parameters to include in
											 * tile requests. For KVP
											 * <requestEncoding>, these
											 * properties will be encoded in the
											 * request query string. For REST
											 * <requestEncoding>, these
											 * properties will become part of
											 * the request path, with order
											 * determined by the <dimensions>
											 * list.
											 */
											params : null,

											/**
											 * APIProperty: zoomOffset {Number}
											 * If your cache has more levels
											 * than you want to provide access
											 * to with this layer, supply a
											 * zoomOffset. This zoom offset is
											 * added to the current map zoom
											 * level to determine the level for
											 * a requested tile. For example, if
											 * you supply a zoomOffset of 3,
											 * when the map is at the zoom 0,
											 * tiles will be requested from
											 * level 3 of your cache. Default is
											 * 0 (assumes cache level and map
											 * zoom are equivalent).
											 * Additionally, if this layer is to
											 * be used as an overlay and the
											 * cache has fewer zoom levels than
											 * the base layer, you can supply a
											 * negative zoomOffset. For example,
											 * if a map zoom level of 1
											 * corresponds to your cache level
											 * zero, you would supply a -1
											 * zoomOffset (and set the
											 * maxResolution of the layer
											 * appropriately). The zoomOffset
											 * value has no effect if complete
											 * matrix definitions (including
											 * scaleDenominator) are supplied in
											 * the <matrixIds> property.
											 * Defaults to 0 (no zoom offset).
											 */
											zoomOffset : 0,

											/**
											 * Property: formatSuffixMap
											 * {Object} a map between WMTS
											 * 'format' request parameter and
											 * tile image file suffix
											 */
											formatSuffixMap : {
												"image/png" : "png",
												"image/png8" : "png",
												"image/png24" : "png",
												"image/png32" : "png",
												"png" : "png",
												"image/jpeg" : "jpg",
												"image/jpg" : "jpg",
												"jpeg" : "jpg",
												"jpg" : "jpg"
											},

											/**
											 * Property: matrix {Object} Matrix
											 * definition for the current map
											 * resolution. Updated by the
											 * <updateMatrixProperties> method.
											 */
											matrix : null,

											/**
											 * Constructor:
											 * OpenLayers.Layer.WMTS Create a
											 * new WMTS layer.
											 * 
											 * Example: (code) var wmts = new
											 * OpenLayers.Layer.WMTS({ name: "My
											 * WMTS Layer", url:
											 * "http://example.com/wmts", layer:
											 * "layer_id", style: "default",
											 * matrixSet: "matrix_id" }); (end)
											 * 
											 * Parameters: config - {Object}
											 * Configuration properties for the
											 * layer.
											 * 
											 * Required configuration
											 * properties: url - {String} The
											 * base url for the service. See the
											 * <url> property. layer - {String}
											 * The layer identifier. See the
											 * <layer> property. style -
											 * {String} The layer style
											 * identifier. See the <style>
											 * property. matrixSet - {String}
											 * The tile matrix set identifier.
											 * See the <matrixSet> property.
											 * 
											 * Any other documented layer
											 * properties can be provided in the
											 * config object.
											 */
											initialize : function(config) {

												// confirm required properties
												// are
												// supplied
												var required = {
													url : true,
													layer : true,
													style : true,
													matrixSet : true
												};
												for ( var prop in required) {
													if (!(prop in config)) {
														throw new Error(
																"Missing property '"
																		+ prop
																		+ "' in layer configuration.");
													}
												}

												config.params = OpenLayers.Util
														.upperCaseObject(config.params);
												var args = [ config.name,
														config.url,
														config.params, config ];
												OpenLayers.Layer.Grid.prototype.initialize
														.apply(this, args);

												// determine format suffix (for
												// REST)
												if (!this.formatSuffix) {
													this.formatSuffix = this.formatSuffixMap[this.format]
															|| this.format
																	.split("/")
																	.pop();
												}

												// expand matrixIds (may be
												// array of
												// string or array of
												// object)
												if (this.matrixIds) {
													var len = this.matrixIds.length;
													if (len
															&& typeof this.matrixIds[0] === "string") {
														var ids = this.matrixIds;
														this.matrixIds = new Array(
																len);
														for ( var i = 0; i < len; ++i) {
															this.matrixIds[i] = {
																identifier : ids[i]
															};
														}
													}
												}

											},

											/**
											 * Method: setMap
											 */
											setMap : function() {
												OpenLayers.Layer.Grid.prototype.setMap
														.apply(this, arguments);
												this.updateMatrixProperties();
											},

											/**
											 * Method: updateMatrixProperties
											 * Called when map resolution
											 * changes to update matrix related
											 * properties.
											 */
											updateMatrixProperties : function() {
												this.matrix = this.getMatrix();
												if (this.matrix) {
													if (this.matrix.topLeftCorner) {
														this.tileOrigin = this.matrix.topLeftCorner;
													}
													if (this.matrix.tileWidth
															&& this.matrix.tileHeight) {
														this.tileSize = new OpenLayers.Size(
																this.matrix.tileWidth,
																this.matrix.tileHeight);
													}
													if (!this.tileOrigin) {
														this.tileOrigin = new OpenLayers.LonLat(
																this.maxExtent.left,
																this.maxExtent.top);
													}
													if (!this.tileFullExtent) {
														this.tileFullExtent = this.maxExtent;
													}
												}
											},

											/**
											 * Method: moveTo
											 * 
											 * Parameters: bound - {<OpenLayers.Bounds>}
											 * zoomChanged - {Boolean} Tells
											 * when zoom has changed, as layers
											 * have to do some init work in that
											 * case. dragging - {Boolean}
											 */
											moveTo : function(bounds,
													zoomChanged, dragging) {
												if (zoomChanged || !this.matrix) {
													this
															.updateMatrixProperties();
												}
												return OpenLayers.Layer.Grid.prototype.moveTo
														.apply(this, arguments);
											},

											/**
											 * APIMethod: clone
											 * 
											 * Parameters: obj - {Object}
											 * 
											 * Returns: {<OpenLayers.Layer.WMTS>}
											 * An exact clone of this
											 * <OpenLayers.Layer.WMTS>
											 */
											clone : function(obj) {
												if (obj == null) {
													obj = new OpenLayers.Layer.WMTS(
															this.options);
												}
												// get all additions from
												// superclasses
												obj = OpenLayers.Layer.Grid.prototype.clone
														.apply(this, [ obj ]);
												// copy/set any non-init,
												// non-simple
												// values here
												return obj;
											},

											/**
											 * Method: getMatrix Get the
											 * appropriate matrix definition for
											 * the current map resolution.
											 */
											getMatrix : function() {
												var matrix;
												if (!this.matrixIds
														|| this.matrixIds.length === 0) {
													matrix = {
														identifier : this.map
																.getZoom()
																+ this.zoomOffset
													};
												} else {
													// get appropriate matrix
													// given
													// the
													// map scale if
													// possible
													if ("scaleDenominator" in this.matrixIds[0]) {
														// scale denominator
														// calculation
														// based on WMTS
														// spec
														var denom = OpenLayers.METERS_PER_INCH
																* OpenLayers.INCHES_PER_UNIT[this.units]
																* this.map
																		.getResolution()
																/ 0.28E-3;
														var diff = Number.POSITIVE_INFINITY;
														var delta;
														for ( var i = 0, ii = this.matrixIds.length; i < ii; ++i) {
															delta = Math
																	.abs(1 - (this.matrixIds[i].scaleDenominator / denom));
															if (delta < diff) {
																diff = delta;
																matrix = this.matrixIds[i];
															}
														}
													} else {
														// fall back on zoom as
														// index
														matrix = this.matrixIds[this.map
																.getZoom()
																+ this.zoomOffset];
													}
												}
												return matrix;
											},

											/**
											 * Method: getTileInfo Get tile
											 * information for a given location
											 * at the current map resolution.
											 * 
											 * Parameters: loc - {<OpenLayers.LonLat}
											 * A location in map coordinates.
											 * 
											 * Returns: {Object} An object with
											 * "col", "row", "i", and "j"
											 * properties. The col and row
											 * values are zero based tile
											 * indexes from the top left. The i
											 * and j values are the number of
											 * pixels to the left and top
											 * (respectively) of the given
											 * location within the target tile.
											 */
											getTileInfo : function(loc) {
												var res = this.map
														.getResolution();

												var fx = (loc.lon - this.tileOrigin.lon)
														/ (res * this.tileSize.w);
												var fy = (this.tileOrigin.lat - loc.lat)
														/ (res * this.tileSize.h);

												var col = Math.floor(fx);
												var row = Math.floor(fy);

												return {
													col : col,
													row : row,
													i : Math.floor((fx - col)
															* this.tileSize.w),
													j : Math.floor((fy - row)
															* this.tileSize.h)
												};
											},

											/**
											 * Method: getURL
											 * 
											 * Parameters: bounds - {<OpenLayers.Bounds>}
											 * 
											 * Returns: {String} A URL for the
											 * tile corresponding to the given
											 * bounds.
											 */
											getURL : function(bounds) {
												bounds = this
														.adjustBounds(bounds);
												var url = "";

												/**
												 * Check whether we should do
												 * anything (NLSFI)
												 */
												/**
												 * Extent checks default if
												 * negated (NLSFI)
												 */
												if (!(!this.tileFullExtent || this.tileFullExtent
														.intersectsBounds(bounds)))
													return url;

												var center = bounds
														.getCenterLonLat();
												var info = this
														.getTileInfo(center);
												var matrixId = this.matrix.identifier;

												/*
												 * Let's check TileMatrixLimits
												 * (NLSFI)
												 */
												if (this.layerDef
														&& this.layerDef.tileMatrixSetLinksMap) {

													/*
													 * this.matrixSet is key to
													 * tileMatrixSetLinkMap
													 * this.matrix.identifier is
													 * key to
													 * tileMatrixSetLimitsMap
													 */
													var tileMatrixSetLink = this.layerDef.tileMatrixSetLinksMap[this.matrixSet];
													var tileMatrixSetLimits = tileMatrixSetLink ? tileMatrixSetLink.tileMatrixSetLimitsMap[this.matrix.identifier]
															: null;

													/*
													 * Now we should or should
													 * not have
													 * tileMatrixSetLimits
													 */
													var inRowRange = tileMatrixSetLimits ? (info.row >= tileMatrixSetLimits.minTileRow && info.row <= tileMatrixSetLimits.maxTileRow)
															: false;
													var inColRange = tileMatrixSetLimits ? (info.col >= tileMatrixSetLimits.minTileCol && info.col <= tileMatrixSetLimits.maxTileCol)
															: false;
													if (!(inRowRange && inColRange)) {
														return OpenLayers.Util
																.getImagesLocation()
																+ "blank.gif";
													}

												}

												/**
												 * proceed with default
												 * OpenLayers implentation
												 */

												if (this.requestEncoding
														.toUpperCase() === "REST") {

													// include 'version',
													// 'layer'
													// and
													// 'style' in
													// tile resource url
													var path = this.version
															+ "/" + this.layer
															+ "/" + this.style
															+ "/";

													// append optional dimension
													// path
													// elements
													if (this.dimensions) {
														for ( var i = 0; i < this.dimensions.length; i++) {
															if (this.params[this.dimensions[i]]) {
																path = path
																		+ this.params[this.dimensions[i]]
																		+ "/";
															}
														}
													}

													// append other required
													// path
													// elements
													path = path
															+ this.matrixSet
															+ "/"
															+ this.matrix.identifier
															+ "/" + info.row
															+ "/" + info.col
															+ "."
															+ this.formatSuffix;

													if (OpenLayers.Util
															.isArray(this.url)) {
														url = this.selectUrl(
																path, this.url);
													} else {
														url = this.url;
													}
													if (!url.match(/\/$/)) {
														url = url + "/";
													}
													url = url + path;

												} else if (this.requestEncoding
														.toUpperCase() === "KVP") {

													// assemble all required
													// parameters
													var params = {
														SERVICE : "WMTS",
														REQUEST : "GetTile",
														VERSION : this.version,
														LAYER : this.layer,
														STYLE : this.style,
														TILEMATRIXSET : this.matrixSet,
														TILEMATRIX : this.matrix.identifier,
														TILEROW : info.row,
														TILECOL : info.col,
														FORMAT : this.format
													};
													url = OpenLayers.Layer.Grid.prototype.getFullRequestString
															.apply(this,
																	[ params ]);

												}

												return url;
											},

											/**
											 * APIMethod: mergeNewParams Extend
											 * the existing layer <params> with
											 * new properties. Tiles will be
											 * reloaded with updated params in
											 * the request.
											 * 
											 * Parameters: newParams - {Object}
											 * Properties to extend to existing
											 * <params>.
											 */
											mergeNewParams : function(newParams) {
												if (this.requestEncoding
														.toUpperCase() === "KVP") {
													return OpenLayers.Layer.Grid.prototype.mergeNewParams
															.apply(
																	this,
																	[ OpenLayers.Util
																			.upperCaseObject(newParams) ]);
												}
											},

											CLASS_NAME : "OpenLayers.Layer.WMTS"
										});

						return this.patch;
					}

				}, {
					'protocol' : [ "Oskari.openlayers.Patch" ]
				});
/**
 * @class Oskari.mapframework.bundle.MapWmtsBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.MapWmtsBundleInstance", function(b) {
	this.name = 'MapWmts';
	this.mediator = null;
	this.sandbox = null;

	this.service = null;

	/**
	 * These should be SET BY Manifest end
	 */

	this.ui = null;
},
/*
 * prototype
 */
{

	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		var sandbox = Oskari.$('sandbox');
		this.sandbox = sandbox;

		/**
		 * We'll need MapLayerService
		 */
		var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

		/*
		 * We'll register a handler for our type
		 */
		mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer')

		var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');

		mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);

		/**
		 * We'll need WMTSLayerService
		 */
		var service = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', mapLayerService);
		this.service = service;

		this.mediator.setState("started");
		return this;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.MapWmtsBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
