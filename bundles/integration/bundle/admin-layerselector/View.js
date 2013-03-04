/**
 * @class Oskari.integration.bundle.todo.View
 *
 * This is an reference implementation View which implements functionality
 *  with BackboneJS within Oskari flyouts.
 *
 * THIS WILL DECLARE FOLLOWING
 *
 * - eventHandlers  which will receive notifications from Oskari
 * - requirementsConfig to support loading with require - This might change though
 * - requirements - INITIAL REQUIREMENTS
 *
 * This example is based on ToDO app from BackboneJS which required *some*
 * modifications to fit into model/collection/view/template form.
 * Sample was not fully fixed but will do as an example.
 *
 *
 */
Oskari.clazz.define('Oskari.integration.bundle.admin-layerselector.View', function() {
}, {

    _mapLayerUrl : '/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetMapLayerClasses',
//    _mapLayerUrl : '/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetAdminMapLayers',

    /**
     * @property eventHandlers
     * a set of event handling functions for this view
     * These will be registered/unregistered automagically
     *
     */
    "eventHandlers" : {
        "MapLayerVisibilityChangedEvent" : function(event) {
            console.log("YEP", event);
        },
        "AfterMapMoveEvent" : function(event) {

        },
        'MapLayerEvent' : function(event) {

            var sandbox = this.getSandbox();
            // populate layer list
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var layers = mapLayerService.getAllLayers();
            if(this.view != null){
debugger;
                this.view.addToCollection(layers);
            }
        
            // for(var i = 0; i < this.layerTabs.length; ++i) {
            //     var tab = this.layerTabs[i];
            //     // populate tab if it has grouping method
            //     if(tab.groupingMethod) {
            //         var layersCopy = layers.slice(0);
            //         var groups = this._getLayerGroups(layersCopy, tab.groupingMethod);
            //         tab.showLayerGroups(groups);
            //     }
            // }

            // var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            // var layerId = event.getLayerId();

            // if(event.getOperation() === 'add') {
            //     var layer = mapLayerService.findMapLayer(layerId);
            //     //this.plugins['Oskari.userinterface.Flyout'].handleLayerAdded(layer);
            //     // refresh layer count
            //     //this.plugins['Oskari.userinterface.Tile'].refresh();
            // }
        }
    },

    /**
     * @property requirementsConfig
     *
     * requirejs requirements config to fix paths
     *
     */
    "requirementsConfig" : {
        "waitSeconds" : 15,
        "paths" : {
            '_bundle' : '../../../Oskari/bundles/integration/bundle/admin-layerselector'
        }
    },


    init : function() {

/*        var me = this;
        var sandbox = me.getSandbox()
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        jQuery.ajax({
            type : "GET",
            dataType: 'json',
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
            url : me._mapLayerUrl,
            success : function(pResp) {
//                me._loadAllLayersAjaxCallBack(pResp, callbackSuccess);
                me._loadAllLayersAjaxCallBack(pResp, null, mapLayerService);
            },
            error : function(jqXHR, textStatus) {
                if(callbackFailure && jqXHR.status != 0) {
                    callbackFailure();
                }
            }
        }); 



/*
        var sandbox = this.getSandbox()
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        sandbox.registerAsStateful(this.instance.mediator.bundleId, this);
        
        var successCB = function() {
            // massive update so just recreate the whole ui
            //me.plugins['Oskari.userinterface.Flyout'].populateLayers();
            // added through maplayerevent
        };
        var failureCB = function() {
            alert(me.getLocalization('errors').loadFailed);
        };
        mapLayerService.loadAllLayersAjax(successCB, failureCB);
*/        
    },

    /**
     * @method render
     * This is called when *everything* is ready for Backbone to be started
     * Called with requirements from above as arguments to method in
     * defined order.
     */
    "render" : function() {
        var me = this;
        var container = this.getEl();
        container.addClass("admin-layerselector");

        var locale = this.getLocalization();
        var confRequirementsConfig = 
            (this.getConfiguration()||{}).requirementsConfig;
        var requirementsConfig = 
            confRequirementsConfig||this.requirementsConfig;

        require.config(requirementsConfig);
        require(["_bundle/views/layerSelectorView"], function(LayerSelectorView) {

            // Finally, we kick things off by creating the **App**.
            me.view = new LayerSelectorView({
                el : container,
                instance : me.instance,
                locale : me.locale
            });
        });
    },
// copy-paste
    _loadAllLayersAjaxCallBack : function(pResp, callbackSuccess, mapLayerService) {
        var me = this,
        sandbox = me.getSandbox();
//        var allLayers = pResp;//pResp.layers;
debugger;
        var keys = _.keys(pResp);
        for(var i = 0; i < keys.length; i++){
            var id = keys[i];
            var organization = pResp[id];
            var layerKeys = _.keys(organization.maplayers);
            for(var j = 0; j < layerKeys.length; j++) {
                var layer = organization.maplayers[layerKeys[j]];

                var mapLayer = me.createMapLayer(layer);
                if(mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
                    mapLayerService.addLayer(mapLayer, true);
                }
            }
        }

/*
        for(var i = 0; i < allLayers.length; i++) {
            
            var mapLayer = this.createMapLayer(allLayers[i]);
            if(this._reservedLayerIds[mapLayer.getId()] !== true) {
                this.addLayer(mapLayer, true);
            }
        }
*/
        // notify components of added layer if not suppressed
        this._allLayersAjaxLoaded = true;
        var event = sandbox.getEventBuilder('MapLayerEvent')(null, 'add');
        sandbox.notifyAll(event);
        if(callbackSuccess) {
            callbackSuccess();
        }
    },

/*    addLayer : function(layerModel, suppressEvent) {

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
*/    
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

        var baseLayer = Oskari.clazz.rceate('Oskari.mapframework.domain.WmsLayer');
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
        if( !baseLayer.getMetadataIdentifier() && baseLayer.getDataUrl() ) {
                var tempPartsForMetadata = baseLayer.getDataUrl().split("uuid=");
                if( tempPartsForMetadata.length == 2 ) {
                    baseLayer.setMetadataIdentifier(tempPartsForMetadata[1]);
                }
            }
        
        if(baseMapJson.orgName) {
            baseLayer.setOrganizationName(baseMapJson.orgName);
        }
        else {
            baseLayer.setOrganizationName("");
        }
        
        if(baseMapJson.inspire) {
            baseLayer.setInspireName(baseMapJson.inspire);
        }
        else {
            baseLayer.setInspireName("");
        }
        baseLayer.setLegendImage(baseMapJson.legendImage);
        baseLayer.setDescription(baseMapJson.info);

        baseLayer.setQueryable(false);
        
        if(baseMapJson.permissions) {
            for(var perm in baseMapJson.permissions) {
                baseLayer.addPermission(perm, baseMapJson.permissions[perm]);   
            }
        }

        for(var i = 0; i < baseMapJson.subLayer.length; i++) {
            // Notice that we are adding layers to baselayers sublayers array
            var subLayer = this._createActualMapLayer(baseMapJson.subLayer[i]);
            
            baseLayer.getSubLayers().push(subLayer);
        }
        
        // Opacity
        if(baseMapJson.opacity != null) {
            baseLayer.setOpacity(baseMapJson.opacity);
        } else if(baseLayer.getSubLayers().length > 0) {
            var subLayerOpacity = baseLayer.getSubLayers()[0].getOpacity();
            if(subLayerOpacity != null) {
                baseLayer.setOpacity(subLayerOpacity);
            }
            else {
                baseLayer.setOpacity(100);
            }
        } else {
            baseLayer.setOpacity(100);
        }


        return baseLayer;
    },    /**
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

            //these may be implemented as jsonHandler
            if(mapLayerJson.type == 'wmslayer') {
                this._populateWmsMapLayerAdditionalData(layer, mapLayerJson);
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
            
            if(mapLayerJson.opacity != null) {
                layer.setOpacity(mapLayerJson.opacity);
            }
            else {
                layer.setOpacity(100);
            }
            layer.setMaxScale(mapLayerJson.maxScale);
            layer.setMinScale(mapLayerJson.minScale);
            layer.setDescription(mapLayerJson.subtitle);
            layer.setQueryable(mapLayerJson.isQueryable == true);
            
            // metadata 
            layer.setDataUrl(mapLayerJson.dataUrl);             
            layer.setMetadataIdentifier(mapLayerJson.dataUrl_uuid);
            if( !layer.getMetadataIdentifier() && layer.getDataUrl() ) {
                var tempPartsForMetadata = layer.getDataUrl().split("uuid=");
                if( tempPartsForMetadata.length == 2 ) {
                    layer.setMetadataIdentifier(tempPartsForMetadata[1]);
                }
            }
            
            // backendstatus 
            if(mapLayerJson.backendStatus && layer.setBackendStatus) {
                layer.setBackendStatus(mapLayerJson.backendStatus);
            }
                        
            // for grouping: organisation and inspire 
            if(mapLayerJson.orgName) {
                layer.setOrganizationName(mapLayerJson.orgName);
            }
            else {
                layer.setOrganizationName("");
            }
            
            if(mapLayerJson.inspire) {
                layer.setInspireName(mapLayerJson.inspire);
            }
            else {
                layer.setInspireName("");
            }
            layer.setVisible(true);
            
            // extent  
            if(mapLayerJson.geom && layer.setGeometryWKT) {
                layer.setGeometryWKT(mapLayerJson.geom);
            }
            
            // permissions
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

}, {
    "extend" : ["Oskari.integration.bundle.bb.View"]
});
