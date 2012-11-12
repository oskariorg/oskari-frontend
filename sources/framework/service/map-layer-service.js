/**
 * @class Oskari.mapframework.service.MapLayerServiceModelBuilder
 * Protocol/interface declaration for MapLayer JSON parser implementations.
 * Provides an interface for bundles to add custom map layer implementations/data.
 * Used to parse a JSON into a given maplayer object. Used in conjuntion with 
 * Oskari.mapframework.service.MapLayerService.registerLayerModel() and 
 * Oskari.mapframework.service.MapLayerService.registerLayerModelBuilder()
 */
Oskari.clazz.define('Oskari.mapframework.service.MapLayerServiceModelBuilder',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method parseLayerData
     * Interface method declaration. Implementation should do the parsing from JSON to MapLayer Object
     * 
     * @param {Object} layer layer object? TODO: check
     * @param {Object} layerJson JSON data representing the map layer
     * @param {Oskari.mapframework.service.MapLayerService} maplayerService
     * reference to map layer service
     */
    parseLayerData : function(layer, layerJson, maplayerService) {

    }
});

/**
 * @class Oskari.mapframework.service.MapLayerService
 *
 * Handles everything MapLayer related.
 * Sends out Oskari.mapframework.event.common.MapLayerEvent
 * to notify application components when data is changed.
 */
Oskari.clazz.define('Oskari.mapframework.service.MapLayerService', 

/**
 * @method create called automatically on construction
 * @static
 * 
 * @param {String}
 *            mapLayerUrl ajax URL for map layer operations (not used atm)
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 */
function(mapLayerUrl, sandbox) {

    /** searchUrl url that will give us results */
    this._mapLayerUrl = mapLayerUrl;
    this._sandbox = sandbox;
    this._loadedLayersList = new Array();
	// used to detect duplicate ids since looping through the list is slow
	this._reservedLayerIds = {};

    /**
     * @property typeMapping 
     * Mapping from map-layer json "type" parameter to a class in Oskari
     * - registering these to instance instead of clazz
     */
    this.typeMapping = {
        wmslayer : 'Oskari.mapframework.domain.WmsLayer',
    	// FIXME: WMTS is from a bundle, why is this in here?
        wmtslayer : 'Oskari.mapframework.wmts.domain.WmtsLayer',
        wfslayer : 'Oskari.mapframework.domain.WfsLayer',
        vectorlayer : 'Oskari.mapframework.domain.VectorLayer'

    },

    /**
     * @property modelBuilderMapping 
     * Mapping of types to classes implementing
     *   'Oskari.mapframework.service.MapLayerServiceModelBuilder'
     * - registering these to instance instead of clazz
     */
    this.modelBuilderMapping = {

    };

}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.mapframework.service.MapLayerService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "MapLayerService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method addLayer
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
     *            parsed layer model to be added (must be of type declared in #typeMapping)
     * @param {Boolean} suppressEvent (optional)
     *            true to not send event (should only be used on initial load to avoid unnecessary events)
     * @throws error if layer with the same id already exists
     */
    addLayer : function(layerModel, suppressEvent) {

        // throws exception if the id is reserved to existing maplayer
        // we need to check again here
        this.checkForDuplicateId(layerModel.getId(), layerModel.getName());
		
		this._reservedLayerIds[layerModel.getId()] = true;
        // everything ok, lets add the layer
        this._loadedLayersList.push(layerModel);

        if(suppressEvent !== true) {
            // notify components of added layer if not suppressed
            var event = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'add');
            this._sandbox.notifyAll(event);
        }
    },
    /**
     * @method removeLayer
     * Removes the layer from internal layerlist and
     * sends out a MapLayerEvent if it was found & removed
     * @param {String} layerId
     *            id for the layer to be removed
     * @param {Boolean} suppressEvent (optional)
     *            true to not send event (should only be used on test cases to avoid unnecessary events)
     */
    removeLayer : function(layerId, suppressEvent) {
        var layer = null;
        for(var i = 0; i < this._loadedLayersList.length; i++) {
            if(this._loadedLayersList[i].getId() == layerId) {
                layer = this._loadedLayersList[i];
                this._loadedLayersList.splice(i, 1);
                break;
            }
        }
        if(layer && suppressEvent !== true) {
            // notify components of layer removal
            var event = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'remove');
            this._sandbox.notifyAll(event);
        }
		this._reservedLayerIds[layerId] = false;
        // TODO: notify if layer not found?
    },
    /**
     * @method updateLayer
     * Updates layer in internal layerlist and
     * sends out a MapLayerEvent if it was found & modified
     *
     * @param {String} layerId
     *            id for the layer to be updated
     * @param {Object} newLayerConf
     *            json conf for the layer. NOTE! Only updates name for now
     */
    updateLayer : function(layerId, newLayerConf) {
        var layer = this.findMapLayer(layerId);
        if(layer) {
            layer.setName(newLayerConf.name);

            // notify components of layer update
            var event = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'update');
            this._sandbox.notifyAll(event);
        }
        // TODO: notify if layer not found?
    },
    /**
     * @method loadAllLayers
     * @deprecated what should this do when we have separate #loadAllLayersAjax()?
	 * @throws Error as default, not implemented yet
     */
    loadAllLayers : function() {
        throw 'TBD: loading not implemented';
    },
    /**
     * @method loadAllLayersAjax
     * Loads layers JSON using the ajax URL given on #create() 
     * and parses it to internal layer objects by calling #createMapLayer() and #addLayer()
     * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
     * @param {Function} callbackFailure method to be called when something went wrong
     */
    loadAllLayersAjax : function(callbackSuccess, callbackFailure) {
    	var me = this;
		jQuery.ajax({
			type : "GET",
		    dataType: 'json',
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
			url : this._mapLayerUrl,
			success : function(pResp) {
				me._loadAllLayersAjaxCallBack(pResp, callbackSuccess);
			},
			error : function(jqXHR, textStatus) {
				if(callbackFailure && jqXHR.status != 0) {
					callbackFailure();
				}
			}
		});	
    },
    /**
     * @method _loadAllLayersAjaxCallBack
     * Internal callback method for ajax loading in #loadAllLayersAjax()
     * @param {Object} pResp ajax response in JSON format
     * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
     */
    _loadAllLayersAjaxCallBack : function(pResp, callbackSuccess) {
	    var allLayers = pResp.layers;
        for(var i = 0; i < allLayers.length; i++) {
        	
			var mapLayer = this.createMapLayer(allLayers[i]);
			if(this._reservedLayerIds[mapLayer.getId()] !== true) {
            	this.addLayer(mapLayer, true);
			}
		}
        // notify components of added layer if not suppressed
        var event = this._sandbox.getEventBuilder('MapLayerEvent')(null, 'add');
        this._sandbox.notifyAll(event);
		if(callbackSuccess) {
			callbackSuccess();
		}
    },
    /**
     * @method getAllLayers
     * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]} 
     * 	 Returns an array of layers added to the service for example via #addLayer()
     */
    getAllLayers : function() {
        return this._loadedLayersList;
    },
    /**
     * @method getAllLayersByMetaType
     * @param {String} type
     *            metatype to filter the layers with
     * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
     * 	 Returns an array of layers added to the service that have the given metatype (layer.getMetaType() === type).
     */
    getAllLayersByMetaType : function(type) {
        var list = [];
        for(var i = 0; i < this._loadedLayersList.length; ++i) {
            var layer = this._loadedLayersList[i];
            if(layer.getMetaType && layer.getMetaType() === type) {
                list.push(layer);
            }
        }
        return list;
    },
    /**
     * @method registerLayerModel
     * 		Register an external layer model type (to be used by extension bundles).
     * Adds a new type to #typeMapping
     * 
     * @param {String} type
     *            Mapping from map-layer json "type" parameter to a class as in #typeMapping 
     * @param {String} modelName
     *            layer model name (like 'Oskari.mapframework.domain.WmsLayer')
     */
    registerLayerModel : function(type, modelName) {
        this.typeMapping[type] = modelName;
    },
    /**
     * @method unregisterLayerModel
     * 		Unregister an external layer model type (to be used by well behaving extension bundles).
     * Removes type from #typeMapping
     * 
     * @param {String} type
     *            Mapping from map-layer json "type" parameter to a class as in #typeMapping 
     */
    unregisterLayerModel : function(type) {
        this.typeMapping[type] = undefined;
    },

    /**
     * @method registerLayerModelBuilder
     * 		Register a handler for an external layer model type (to be used by extension bundles).
     * Adds a new type to #modelBuilderMapping
     * 
     * @param {String} type
     *            Mapping from map-layer json "type" parameter to a class as in #typeMapping 
     * @param {Oskari.mapframework.service.MapLayerServiceModelBuilder} specHandlerClsInstance
     *            layer model handler instance
     */
    registerLayerModelBuilder : function(type, specHandlerClsInstance) {
        this._sandbox.printDebug("[MapLayerService] registering handler for type " + type);
        this.modelBuilderMapping[type] = specHandlerClsInstance;
    },
    /**
     * @method unregisterLayerModel
     * 		Unregister handler for an external layer model type (to be used by well behaving extension bundles).
     * Removes handler from #modelBuilderMapping
     * 
     * @param {String} type
     *            Mapping from map-layer json "type" parameter to a class as in #typeMapping 
     */
    unregisterLayerModelBuilder : function(type) {
        this.modelBuilderMapping[type] = undefined;
    },
    /**
     * @method createMapLayer
     * 
     * Parses the given JSON Object to a MapLayer Object. The JSON must have unique id attribute 
     * and type attribute that matches a type in #typeMapping. TypeMappings can be added by bundles,
     * but they also need to register a handler for the new type with #registerLayerModelBuilder().
     * 
     * @param {Object} mapLayerJson JSON presentation of a maplayer
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
     *            parsed layer model that can be added with #addLayer() (must be of type declared in #typeMapping)
     * @throws Error if json layer type is not declared in #typeMapping
     */
    createMapLayer : function(mapLayerJson) {

        var mapLayer = null;
        if(mapLayerJson.type == 'base') {
            // base map layer, create base map and its sublayers
            mapLayer = this._createGroupMapLayer(mapLayerJson, true);
        } else if(mapLayerJson.type == 'groupMap') {
            mapLayer = this._createGroupMapLayer(mapLayerJson, false);
        } else {
            // create map layer
            mapLayer = this._createActualMapLayer(mapLayerJson);
        }
        return mapLayer;
    },
    /**
     * @method _createGroupMapLayer
     * @private
     * 
     * Parses the given JSON Object to a Oskari.mapframework.domain.WmsLayer with sublayers. 
     * Called internally from #createMapLayer(). 
     * Sublayers are parsed as normal maplayers with #_createActualMapLayer(). 
     * 
     * @param {Object} mapLayerJson JSON presentation of a maplayer with sublayers
     * @param {Boolean} isBase true for baselayer (positioned in bottom on UI), false for a group layer (like base layer but is positioned like normal layers in UI)
     * @return {Oskari.mapframework.domain.WmsLayer} layerModel
     *            parsed layer model that can be added with #addLayer(). Only supports WMS layers for now.
     */
    _createGroupMapLayer : function(baseMapJson, isBase) {

        /** TODO check wfs vs wms * */
        var baseLayer = Oskari.clazz.create('Oskari.mapframework.domain.WmsLayer');
        if(isBase) {
            baseLayer.setAsBaseLayer();
        } else {
            baseLayer.setAsGroupLayer();
        }

        baseLayer.setVisible(true);

        baseLayer.setId(baseMapJson.id);
        baseLayer.setName(baseMapJson.name);

        baseLayer.setMaxScale(baseMapJson.maxScale);
        baseLayer.setMinScale(baseMapJson.minScale);
        
        baseLayer.setDataUrl(baseMapJson.dataUrl);
        baseLayer.setMetadataIdentifier(baseMapJson.dataUrl_uuid);
        
        
        baseLayer.setOrganizationName(baseMapJson.orgName);
        baseLayer.setInspireName(baseMapJson.inspire);

        baseLayer.setFeatureInfoEnabled(false);
        
        if(baseMapJson.permissions) {
            	for(var perm in baseMapJson.permissions) {
            		baseLayer.addPermission(perm, baseMapJson.permissions[perm]);	
            	}
            }


        for(var i = 0; i < baseMapJson.subLayer.length; i++) {
            // Notice that we are adding layers to baselayers subclass array
            var subLayer = this._createActualMapLayer(baseMapJson.subLayer[i]);
            baseLayer.getSubLayers().push(subLayer);
        }

        /* Opacity */
        if(baseMapJson.opacity != null) {
            baseLayer.setOpacity(baseMapJson.opacity);
        } else if(baseLayer.getSubLayers().length > 0) {
            baseLayer.setOpacity(baseLayer.getSubLayers()[0].getOpacity());
        } else {
            baseLayer.setOpacity(100);
        }

        /* Legend image */
        if(baseMapJson.legendImage != null && baseMapJson.legendImage != "") {
            baseLayer.setLegendImage(baseMapJson.legendImage);
        }

        /* Info */
        if(baseMapJson.info != null && baseMapJson.info != "") {
            baseLayer.setDescription(baseMapJson.info);
        }

        return baseLayer;
    },
    /**
     * @method _createActualMapLayer
     * @private
     * 
     * Parses the given JSON Object to a MapLayer Object. 
     * Called internally from #createMapLayer() and #_createGroupMapLayer(). 
     * 
     * @param {Object} mapLayerJson JSON presentation of a single maplayer
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
     *            parsed layer model that can be added with #addLayer()
     */
    _createActualMapLayer : function(mapLayerJson) {
        var layer = null;
        var mapLayerId = mapLayerJson.id;

        if(mapLayerJson != null) {
            if(!this.typeMapping[mapLayerJson.type]) {
                throw "Unknown layer type '" + mapLayerJson.type + "'";
            }
            layer = Oskari.clazz.create(this.typeMapping[mapLayerJson.type]);

            /*
             * these may be implemented as jsonHandler
             */
            if(mapLayerJson.type == 'wmslayer') {
                this._populateWmsMapLayerAdditionalData(layer, mapLayerJson);
            } else if(mapLayerJson.type == 'wmtslayer') {
            	// FIXME: WMTS is from a bundle, why is this in here? 
                this._populateWmtsMapLayerAdditionalData(layer, mapLayerJson);
            } else if(mapLayerJson.type == 'vectorlayer') {
                layer.setStyledLayerDescriptor(mapLayerJson.styledLayerDescriptor);
            }

            if(mapLayerJson.metaType && layer.setMetaType) {
                layer.setMetaType(mapLayerJson.metaType);
            }

            // set common map layer data
            layer.setAsNormalLayer();
            layer.setId(mapLayerId);
            layer.setName(mapLayerJson.name);
            layer.setOpacity(mapLayerJson.opacity);
            layer.setMaxScale(mapLayerJson.maxScale);
            layer.setMinScale(mapLayerJson.minScale);
            layer.setDescription(mapLayerJson.subtitle);
            layer.setDataUrl(mapLayerJson.dataUrl);
            layer.setMetadataIdentifier(mapLayerJson.dataUrl_uuid);
            layer.setBackendStatus(mapLayerJson.backendStatus);
            layer.setOrganizationName(mapLayerJson.orgName);
            layer.setInspireName(mapLayerJson.inspire);
            layer.setOrderNumber(mapLayerJson.orderNumber);
            layer.setVisible(true);
            
            layer.setGeometryWKT(mapLayerJson.geom);
            if(mapLayerJson.permissions) {
            	for(var perm in mapLayerJson.permissions) {
            		layer.addPermission(perm, mapLayerJson.permissions[perm]);	
            	}
            }

            var builder = this.modelBuilderMapping[mapLayerJson.type];
            if(builder) {
                builder.parseLayerData(layer, mapLayerJson, this);
            }

        } else {
            // sandbox.printDebug
            /*
             * console.log("[LayersService] " + "Trying to create mapLayer
             * without " + "backing JSON data - id: " +mapLayerId);
             */
        }

        return layer;
    },
    /**
     * @method _populateWmsMapLayerAdditionalData
     * 
     * Parses WMS specific data from JSON to a Oskari.mapframework.domain.WmsLayer Object
     * 
     * @private 
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     * @param {Object} jsonLayer JSON presentation for a WMS layer
     * @return {Oskari.mapframework.domain.WmsLayer} returns the same layer object with populated values for convenience
     */
    _populateWmsMapLayerAdditionalData : function(layer, jsonLayer) {
        layer.setWmsName(jsonLayer.wmsName);
        if(jsonLayer.wmsUrl) {
            var wmsUrls = jsonLayer.wmsUrl.split(",");
            for(var i = 0; i < wmsUrls.length; i++) {
                layer.addWmsUrl(wmsUrls[i]);
            }
        }
        // default to enabled, only check if it is disabled
        layer.setFeatureInfoEnabled(jsonLayer.gfi !== 'disabled');
        return this._populateStyles(layer, jsonLayer);
    },
    /**
     * @method _populateWmtsMapLayerAdditionalData
     * @deprecated
	 * 
	 * FIXME: WMTS is from a bundle, why is this in here?  
	 * Same things are done in Oskari.mapframework.wmts.service.WmtsLayerModelBuilder 
     * 
     * Parses WMTS specific data from JSON to a Oskari.mapframework.wmts.domain.WmtsLayer Object
     * 
     * @private 
     * @param {Oskari.mapframework.wmts.domain.WmtsLayer} layer
     * @param {Object} jsonLayer JSON presentation for a WMTS layer
     * @return {Oskari.mapframework.wmts.domain.WmtsLayer} returns the same layer object with populated values for convenience
     */
    _populateWmtsMapLayerAdditionalData : function(layer, jsonLayer) {
        layer.setWmtsName(jsonLayer.wmtsName);
        if(jsonLayer.wmtsUrl) {
            var wmtsUrls = jsonLayer.wmtsUrl.split(",");
            for(var i = 0; i < wmtsUrls.length; i++) {
                layer.addWmtsUrl(wmtsUrls[i]);
            }
        }
        return this._populateStyles(layer, jsonLayer);
    },
    /**
     * @method _populateStyles
	 * 
     * Parses styles attribute from JSON and adds them as a 
     * Oskari.mapframework.domain.Style to the layer Object.
     * If no styles attribute is present, adds an empty 
     * dummy style and sets that as current style.
     * 
     * @private 
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
     * @param {Object} jsonLayer JSON presentation for the maplayer
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} returns the same layer object with populated styles for convenience
     */
    _populateStyles : function(layer, jsonLayer) {

        var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

        if(jsonLayer.styles) {
            // has styles
            for(var i = 0; i < jsonLayer.styles.length; i++) {

                var styleJson = jsonLayer.styles;
                // TODO: can be removed if impl now returns
                // an array always so loop works properly
                var blnMultipleStyles = !(isNaN(i));
                if(blnMultipleStyles) {
                    styleJson = jsonLayer.styles[i];
                }

                var style = styleBuilder();
                style.setName(styleJson.name);
                style.setTitle(styleJson.title);
                style.setLegend(styleJson.legend);
                layer.addStyle(style);

                // only add the style once if not an array
                if(!blnMultipleStyles) {
                    break;
                }
            }

            // set the default style
            layer.selectStyle(jsonLayer.style);
        }

        // Create empty style that works as default if none available
        if(layer.getStyles().length == 0) {

            var style = styleBuilder();
            style.setName("");
            style.setTitle("");
            style.setLegend("");
            layer.addStyle(style);
            layer.selectStyle("");
        }

        layer.setQueryable(jsonLayer.isQueryable);
        layer.setLegendImage(jsonLayer.legendImage);
        layer.setDataUrl(jsonLayer.dataUrl);
        layer.setQueryFormat(jsonLayer.formats.value);

        return layer;
    },
    /**
     * @method checkForDuplicateId
     * Checks that the layer we are trying to create will actually have unique
     * id inside domain. This is a must if we want our core domain logic to
     * work.
     *
     * @param {String}
     *            id we want to check against already added layers
     * @param {String}
     *            name (optional) only used for error message
     * @throws Error if layer with the given id was found
     */
    checkForDuplicateId : function(id, name) {
    	
		if(this._reservedLayerIds[id] === true) {
			var foundLayer = this.findMapLayer(id);
            throw "Trying to add map layer with id '" + id + " (" + name + ")' but that id is already reserved for '" + foundLayer.getName() + "'";
		}
    },
    /**
     * @method findMapLayer
     * Tries to find maplayer with given id from given map layer array. Uses
     * recursion to loop through all layers and its sublayers
     *
     * @param {String}
     *            id layer id we want to find
     * @param {Array}
     *            layerList (optional) array of maplayer objects, defaults to all added layers
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     * 	layerModel if found matching id or null if not found
     */
    findMapLayer : function(id, layerList) {
        if(!layerList) {
            layerList = this._loadedLayersList;
        }
        for(var i = 0; i < layerList.length; i++) {
            var layer = layerList[i];
            if(layer.getId() == id) {
                return layer;
            }

        }
        for(var i = 0; i < layerList.length; i++) {
            var layer = layerList[i];
            /* recurse to sublayers */
            var subLayers = layer.getSubLayers();
            var subLayer = this.findMapLayer(id, subLayers);
            if(subLayer != null) {
                return subLayer;
            }
        }

        return null;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */