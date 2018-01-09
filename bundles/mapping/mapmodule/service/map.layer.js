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
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     * @param {String}
     *            mapLayerUrl ajax URL for map layer operations (not used atm)
     */

    function (sandbox, mapLayerUrl) {
        var me = this;
        this._mapLayerUrl = mapLayerUrl || sandbox.getAjaxUrl('GetMapLayers') + '&lang=' + Oskari.getLang();
        this._sandbox = sandbox;
        this._allLayersAjaxLoaded = false;
        this._loadedLayersList = [];
        // used to detect duplicate ids since looping through the list is slow
        this._reservedLayerIds = {};
        // used to store sticky layer ids - key = layer id, value = true if sticky (=layer cant be removed)
        this._stickyLayerIds = {};

        /**
         * @property typeMapping
         * Mapping from map-layer json "type" parameter to a class in Oskari
         * - registering these to instance instead of clazz
         */
        this.typeMapping = {
            wmslayer: 'Oskari.mapframework.domain.WmsLayer',
            vectorlayer: 'Oskari.mapframework.domain.VectorLayer'
        };

        /**
         * @property modelBuilderMapping
         * Mapping of types to classes implementing
         *   'Oskari.mapframework.service.MapLayerServiceModelBuilder'
         * - registering these to instance instead of clazz
         */
        this.modelBuilderMapping = {};

        // used for cache newest layers
        this._newestLayers = null;

        /*
        * Layer filters
         */
        this.layerFilters = {
            'featuredata': function(layer) {
                return (layer.hasFeatureData());
            },
            'newest': function(layer) {
                me.getNewestLayers(20);
                var ids = [];
                jQuery(me._newestLayers).each(function(index, layer){
                   ids.push(layer.getId());
                });
                return (jQuery.inArray(layer.getId(), ids) !== -1);
            }
        };
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: "Oskari.mapframework.service.MapLayerService",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: "MapLayerService",
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this._sandbox;
        },
        /**
         * @method addLayer
         * Adds the layer to them Oskari system so it can be added to the map etc.
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         * @throws error if layer with the same id already exists
         */
        addLayer: function (layerModel, suppressEvent) {
            if(!layerModel) {
                Oskari.log(this.getName()).warn('Called addLayer without a layer!');
                return;
            }
            // if parent id is present, forward to addSubLayer()
            if(layerModel.getParentId() != -1) {
                this.addSubLayer(layerModel.getParentId(), layerModel, suppressEvent);
                return;
            }

            // throws exception if the id is reserved to existing maplayer
            // we need to check again here
            this.checkForDuplicateId(layerModel.getId(), layerModel.getName());

            this._reservedLayerIds[layerModel.getId()] = true;
            // everything ok, lets add the layer
            this._loadedLayersList.push(layerModel);

            if (suppressEvent !== true) {
                // notify components of added layer if not suppressed
                var event = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'add');
                this._sandbox.notifyAll(event);
            }
        },
        /**
         * Adds a tool the layer and notifies other components about is with MapLayerEvent typed with 'tool'
         * @param {Oskari.mapframework.domain.AbstractLayer} layerModel   layer to modify
         * @param {Oskari.mapframework.domain.Tool} tool                  tool to add
         * @param {Boolean} suppressEvent true to not send event (notify manually later to signal a batch update)
         */
        addToolForLayer : function(layerModel, tool, suppressEvent) {
            if(!layerModel || !tool) {
                throw new Error('Invalid params');
            }
            layerModel.addTool(tool);

            if (suppressEvent !== true) {
                // notify components of modified layer tools if not suppressed
                var event = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'tool');
                this._sandbox.notifyAll(event);
            }
        },

        /**
         * @method addSubLayer
         * Adds the layer to parent layer's sublayer list
         * @param {String} parentLayerId the id of the parent layer to which we're adding the layerModel.
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         */
        addSubLayer: function (parentLayerId, layerModel, suppressEvent) {
            var parentLayer = this.findMapLayer(parentLayerId),
                subLayers;

            if (parentLayer && (parentLayer.isBaseLayer() || parentLayer.isGroupLayer())) {

                layerModel.setParentId(parentLayerId);
                subLayers = parentLayer.getSubLayers();
                if(!parentLayer.addSubLayer(layerModel)) {
                    // wasn't added - already added
                    return;
                }

                if (suppressEvent !== true) {
                    // notify components of added layer if not suppressed
                    var evt = this._sandbox.getEventBuilder('MapLayerEvent')(parentLayer.getId(), 'update');
                    this._sandbox.notifyAll(evt);
                }
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
        removeLayer: function (layerId, suppressEvent) {
            var layer = this.findMapLayer(layerId),
                parentLayer = null,
                evt = null;
            if(!layer) {
                // not found in layers OR sublayers!
                // TODO: should we notify somehow?
                return;
            }
            // remove the layer from core.
            this._sandbox.removeMapLayer(layerId);
            // default to all layers
            var layerList = this._loadedLayersList;
            if(layer.getParentId() != -1) {
                // referenced layer is a sublayer
                parentLayer = this.findMapLayer(layer.getParentId());
                if(!parentLayer) {
                    return;
                }
                // work on sublayers instead
                layerList = parentLayer.getSubLayers();
            }

            for (var i = 0; i < layerList.length; i++) {
                if ((layerList[i].getId() + '') === (layerId + '')) {
                    layerList.splice(i, 1);
                    break;
                }
            }
            if (layer && suppressEvent !== true) {
                // notify components of layer removal
                if(parentLayer) {
                    // notify a collection layer has been updated
                    evt = this._sandbox.getEventBuilder('MapLayerEvent')(parentLayer.getId(), 'update');
                }
                else {
                    // notify a layer has been removed
                    evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'remove');
                    // free up the layerId if actual removal
                    this._reservedLayerIds[layerId] = false;
                }
                this._sandbox.notifyAll(evt);
            }
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
        updateLayer: function (layerId, newLayerConf) {
            var layer = this.findMapLayer(layerId);
            if (!layer) {
                // couldn't find layer to update
                // TODO: should we try to insert it or notify if layer not found?
                return;
            }

            if (newLayerConf.url) {
                layer.setLayerUrls(this.parseUrls(newLayerConf.url));
            }

            if (newLayerConf.dataUrl) {
                layer.setDataUrl(newLayerConf.dataUrl);
            }

            if (newLayerConf.legendImage) {
                layer.setLegendImage(newLayerConf.legendImage);
            }

            if (newLayerConf.minScale) {
                layer.setMinScale(newLayerConf.minScale);
            }

            if (newLayerConf.maxScale) {
                layer.setMaxScale(newLayerConf.maxScale);
            }
            if (newLayerConf.opacity) {
                layer.setOpacity(newLayerConf.opacity);
            }

            if (newLayerConf.name) {
                layer.setName(newLayerConf.name);
            }

            if (newLayerConf.layerName) {
                layer.setLayerName(newLayerConf.layerName);
            }

            if (newLayerConf.subtitle) {
                layer.setDescription(newLayerConf.subtitle);
            }

            if (newLayerConf.orgName) {
                layer.setOrganizationName(newLayerConf.orgName);
            }
            if (newLayerConf.inspire) {
                layer.setInspireName(newLayerConf.inspire);
            }
            if (newLayerConf.realtime) {
                layer.setRealtime(newLayerConf.realtime);
            }
            if (newLayerConf.refreshRate) {
                layer.setRefreshRate(newLayerConf.refreshRate);
            }
            if (newLayerConf.version) {
                layer.setVersion(newLayerConf.version);
            }
            if (newLayerConf.srs_name) {
                layer.setSrs_name(newLayerConf.srs_name);
            }

            if (newLayerConf.admin) {
                layer.setAdmin(newLayerConf.admin);
            }

            // optional attributes
            if (newLayerConf.attributes) {
                layer.setAttributes(newLayerConf.attributes);
            }

            if (newLayerConf.params) {
                layer.setParams(newLayerConf.params);
            }

            // wms specific
            // TODO: we need to figure this out some other way
            // we could remove the old layer and create a new one in admin bundle
            if (newLayerConf.type === 'wmslayer') {
                // TODO: remove styles and wmsurls??
                this._populateWmsMapLayerAdditionalData(layer, newLayerConf);
            }

            // notify components of layer update
            var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'update');
            this._sandbox.notifyAll(evt);
        },
        /**
         * @method makeLayerSticky
         * Set layer visibility switch off disable
         *
         * @param {String} layerId
         *            id for the layer to be set
         * @param {boolean} if true, set layer switch off disable
         *
         */
        makeLayerSticky: function (layerId, isSticky) {
            var layer = this.findMapLayer(layerId);
            // Get id for postprocess after map layer load
            this._stickyLayerIds[layerId] = (isSticky === true);
            if (layer) {
                layer.setSticky(isSticky);
                // notify components of layer update
                var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'sticky');
                this._sandbox.notifyAll(evt);
            }
            // TODO: notify if layer not found?
        },
        /**
         * @method loadAllLayersAjax
         * Loads layers JSON using the ajax URL given on #create()
         * and parses it to internal layer objects by calling #createMapLayer() and #addLayer()
         * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
         * @param {Function} callbackFailure method to be called when something went wrong
         */
        loadAllLayersAjax: function (callbackSuccess, callbackFailure) {
            var me = this,
                epsg = me._sandbox.getMap().getSrsName();
            // Used to bypass browsers' cache especially in IE, which seems to cause
            // problems with displaying publishing permissions in some situations.
            var timeStamp = new Date().getTime();

            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    timestamp : timeStamp,
                    srs : epsg
                },
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: this._mapLayerUrl,
                success: function (pResp) {
                    me._loadAllLayersAjaxCallBack(pResp, callbackSuccess);
                },
                error: function (jqXHR, textStatus) {
                    if (callbackFailure && jqXHR.status !== 0) {
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
         * @private
         */
        _loadAllLayersAjaxCallBack: function (pResp, callbackSuccess) {
            var allLayers = pResp.layers,
                i,
                mapLayer;

            for (i = 0; i < allLayers.length; i++) {
                mapLayer = this.createMapLayer(allLayers[i]);
                if (!mapLayer) {
                    // unsupported map type, skip
                    // continue with next layer
                    continue;
                }

                if (this._reservedLayerIds[mapLayer.getId()] !== true) {
                    this.addLayer(mapLayer, true);
                }
            }
            // notify components of added layer if not suppressed
            this._allLayersAjaxLoaded = true;
            this._sandbox.notifyAll(Oskari.eventBuilder('MapLayerEvent')(null, 'add'));
            if (callbackSuccess) {
                callbackSuccess();
            }
        },

        /**
         * @method isAllLayersLoaded
         * @return {Boolean}
         */
        isAllLayersLoaded: function () {
            return this._allLayersAjaxLoaded;
        },

        /**
         * @method getAllLayers
         * Returns an array of layers added to the service for example via #addLayer()
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getAllLayers: function () {
            return this._loadedLayersList;
        },
        /**
         * @method getAllLayersByMetaType
         * Returns an array of layers added to the service that have the given metatype (layer.getMetaType() === type).
         *
         * @param {String} type
         *            metatype to filter the layers with
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getAllLayersByMetaType: function (type) {
            var list = [],
                i,
                layer;
            for (i = 0; i < this._loadedLayersList.length; ++i) {
                layer = this._loadedLayersList[i];
                if (layer.getMetaType && layer.getMetaType() === type) {
                    list.push(layer);
                }
            }
            return list;
        },
        /**
         * @method getLayersOfType
         * Returns an array of layers added to the service that are of given type (layer.isLayerOfType(type)).
         *
         * @param {String} type
         *            type to filter the layers with
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getLayersOfType: function (type) {
            var list = [],
                i,
                layer;
            for (i = 0; i < this._loadedLayersList.length; ++i) {
                layer = this._loadedLayersList[i];
                if (layer.isLayerOfType(type)) {
                    list.push(layer);
                }
            }
            return list;
        },
        /**
         * Get newest layers
         * @method  @public getNewestLayers
         * @param  {Integer} count how many newest layer wanted to get
         * @return {{Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getNewestLayers: function (count) {
            var me = this;
            if(me._newestLayers) {
                return me._newestLayers;
            }
            var list = [],
                i;

            var layersWhereCreatedDate = jQuery.grep(this._loadedLayersList, function(layer) {
                return  layer._created !== null && !isNaN(layer._created.getTime());
            });

            var layersWhereNoCreatedDate = jQuery.grep(this._loadedLayersList, function(layer) {
                return  layer._created === null || (layer._created !== null && isNaN(layer._created.getTime()));
            });

            var newestToOldestLayers = layersWhereCreatedDate.sort(function(a,b){
                if(a.getCreated() > b.getCreated()) {
                    return -1;
                } else if(a.getCreated() < b.getCreated()) {
                    return 1;
                } else {
                    return 0;
                }
            });

            for (i = 0; i<newestToOldestLayers.length; i++) {
                list.push(newestToOldestLayers[i]);
                if(list.length === count) {
                    break;
                }
            }

            if(list.length < count) {
                for (i = 0; i<layersWhereNoCreatedDate.length; i++) {
                    list.push(layersWhereNoCreatedDate[i]);
                    if(list.length === count) {
                        break;
                    }
                }
            }
            me._newestLayers = list;
            return list;
        },
        /**
         * @method getLayerByMetadataId
         * Returns an array of layers added to the service corresponding to given metadata identifier
         *
         * @param {String} metadataIdentifier
         *            metadata identifier to filter the layers with
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getLayersByMetadataId: function(metadataIdentifier) {
            var list = [],
                i,
                layer;
            for (i = 0; i < this._loadedLayersList.length; ++i) {
                layer = this._loadedLayersList[i];
                if (layer.getMetadataIdentifier() ===  metadataIdentifier) {
                    list.push(layer);
                }
            }
            return list;
        },
        /**
         * @method  @public registerLayerFilter Register layer filter
         * @param  {String} filterId       filter identifier
         * @param  {Function} filterFunction filter function
         */
        registerLayerFilter: function (filterId, filterFunction) {
            var me = this;
            if(typeof filterFunction !== 'function') {
                Oskari.log(this.getName()).warn('[MapLayerService] "' + filterId + '" -layer filter has not filter function! Not register layer filter.');
                return;
            }
            if(typeof filterId !== 'string') {
                Oskari.log(this.getName()).warn('[MapLayerService] "' + filterId + '" -layer filter has not string name. Not register layer filter.');
                return;
            }

            if(me.layerFilters[filterId]) {
                Oskari.log(this.getName()).warn('[MapLayerService] "' + filterId + '" -layer filter has allready defined. Not register layer filter.');
                return;
            }
            me.layerFilters[filterId] = filterFunction;
        },
        /**
         * @method  @public getFilteredLayers  Get filtered layers
         * @param  {String} filterId filter id
         * @return {Array}   filtered layers list, if not found filter by id then return all layers
         */
        getFilteredLayers: function(filterId) {
            var me = this;
            var filterFunction = me.layerFilters[filterId];
            var allLayers = me.getAllLayers();
            if(!filterFunction) {
                Oskari.log(this.getName()).warn('[MapLayerService] not found layer filter "' + filterId + '". Returning all layers.');
                return allLayers;
            }
            var filteredLayers = [];
            allLayers.forEach(function(layer){
                if(filterFunction(layer)) {
                    filteredLayers.push(layer);
                }
            });
            return filteredLayers;
        },
        /**
         * @method registerLayerModel
         *      Register an external layer model type (to be used by extension bundles).
         * Adds a new type to #typeMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         * @param {String} modelName
         *            layer model name (like 'Oskari.mapframework.domain.WmsLayer')
         */
        registerLayerModel: function (type, modelName) {
            this.typeMapping[type] = modelName;
        },
        /**
         * @method unregisterLayerModel
         *      Unregister an external layer model type (to be used by well behaving extension bundles).
         * Removes type from #typeMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         */
        unregisterLayerModel: function (type) {
            this.typeMapping[type] = undefined;
            delete this.typeMapping[type];
        },

        /**
         * @method registerLayerModelBuilder
         *      Register a handler for an external layer model type (to be used by extension bundles).
         * Adds a new type to #modelBuilderMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         * @param {Oskari.mapframework.service.MapLayerServiceModelBuilder} specHandlerClsInstance
         *            layer model handler instance
         */
        registerLayerModelBuilder: function (type, specHandlerClsInstance) {
            Oskari.log(this.getName()).debug("[MapLayerService] registering handler for type " + type);
            this.modelBuilderMapping[type] = specHandlerClsInstance;
        },
        /**
         * @method unregisterLayerModel
         *      Unregister handler for an external layer model type (to be used by well behaving extension bundles).
         * Removes handler from #modelBuilderMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         */
        unregisterLayerModelBuilder: function (type) {
            this.modelBuilderMapping[type] = undefined;
            delete this.modelBuilderMapping[type];
        },
        /**
         * Return true if layer type is supported (model class registered)
         * @param  {String}  type layer type like 'wmslayer'
         * @return {Boolean}  true if supported
         */
        hasSupportForLayerType : function(type) {
            if(this.typeMapping[type]) {
                return true;
            }
            return (type === 'base' || type === 'groupMap');
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
        createMapLayer: function (mapLayerJson) {

            var mapLayer = null;
            if (mapLayerJson.type === 'base') {
                // base map layer, create base map and its sublayers
                mapLayer = this._createGroupMapLayer(mapLayerJson, true);
            } else if (mapLayerJson.type === 'groupMap') {
                mapLayer = this._createGroupMapLayer(mapLayerJson, false);
            } else {
                // create map layer
                mapLayer = this._createActualMapLayer(mapLayerJson);
            }

            // Set additional data
            if (mapLayer && mapLayerJson.admin !== null && mapLayerJson.admin !== undefined) {
                mapLayer.admin = mapLayerJson.admin;
            }
            if (mapLayer && mapLayerJson.names !== null && mapLayerJson.names !== undefined) {
                mapLayer.names = mapLayerJson.names;
            }

            if (mapLayer && this._stickyLayerIds[mapLayer.getId()]) {
                mapLayer.setSticky(true);
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
        _createGroupMapLayer: function (baseMapJson, isBase) {
            var baseLayer = this.createLayerTypeInstance('wmslayer'),
                tempPartsForMetadata,
                perm,
                i,
                subLayer,
                subLayerOpacity;
            if (isBase) {
                baseLayer.setAsBaseLayer();
            } else {
                baseLayer.setAsGroupLayer();
            }

            baseLayer.setVisible(true);
            baseLayer.setId(baseMapJson.id);

            baseLayer.setName(baseMapJson.name);

            baseLayer.setMaxScale(baseMapJson.maxScale);
            baseLayer.setMinScale(baseMapJson.minScale);

            baseLayer.setRealtime(baseMapJson.realtime);
            baseLayer.setRefreshRate(baseMapJson.refreshRate);
            baseLayer.setAdmin(baseMapJson.admin);

            baseLayer.setDataUrl(baseMapJson.dataUrl);
            baseLayer.setMetadataIdentifier(baseMapJson.dataUrl_uuid);
            if (!baseLayer.getMetadataIdentifier() && baseLayer.getDataUrl()) {
                tempPartsForMetadata = baseLayer.getDataUrl().split("uuid=");
                if (tempPartsForMetadata.length === 2) {
                    baseLayer.setMetadataIdentifier(tempPartsForMetadata[1]);
                }
            }

            if (baseMapJson.orgName) {
                baseLayer.setOrganizationName(baseMapJson.orgName);
            } else {
                baseLayer.setOrganizationName("");
            }

            if (baseMapJson.inspire) {
                baseLayer.setInspireName(baseMapJson.inspire);
            } else {
                baseLayer.setInspireName("");
            }
            baseLayer.setLegendImage(baseMapJson.legendImage);
            baseLayer.setDescription(baseMapJson.info);
            baseLayer.setQueryable(false);

            if (baseMapJson.permissions) {
                for (perm in baseMapJson.permissions) {
                    if (baseMapJson.permissions.hasOwnProperty(perm)) {
                        baseLayer.addPermission(perm, baseMapJson.permissions[perm]);
                    }
                }
            }

            if (baseMapJson.subLayer) {
                for (i = 0; i < baseMapJson.subLayer.length; i++) {
                    // Notice that we are adding layers to baselayers sublayers array
                    subLayer = this._createActualMapLayer(baseMapJson.subLayer[i]);
                    subLayer.setParentId(baseMapJson.id);

                    //if (baseMapJson.subLayer[i].admin) {
                    subLayer.admin = baseMapJson.subLayer[i].admin || {};
                    //}

                    baseLayer.getSubLayers().push(subLayer);
                }
            }
            // Opacity
            if (baseMapJson.opacity !== null && baseMapJson.opacity !== undefined) {
                baseLayer.setOpacity(baseMapJson.opacity);
            } else if (baseLayer.getSubLayers().length > 0) {
                subLayerOpacity = baseLayer.getSubLayers()[0].getOpacity();
                if (subLayerOpacity !== null && subLayerOpacity !== undefined) {
                    baseLayer.setOpacity(subLayerOpacity);
                } else {
                    baseLayer.setOpacity(100);
                }
            } else {
                baseLayer.setOpacity(100);
            }


            return baseLayer;
        },
        /**
         * Creates an empty domain object instance for given type. Passes params and options to constructor.
         * Given type should match a key in typeMapping, otherwise [null] is returned
         *
         * @method createLayerTypeInstance
         *
         * @param {String} type type of the layer (should match something on the typeMapping)
         * @param {Object} params object for constructor (optional)
         * @param {Object} options object for constructor (optional)
         * @return {Oskari.mapframework.domain.AbstractLayer} empty layer model for the layer type
         */
        createLayerTypeInstance: function (type, params, options) {
            var clazz = this.typeMapping[type];
            if (!clazz) {
                return null;
            }
            return Oskari.clazz.create(clazz, params, options);
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
        _createActualMapLayer: function (mapLayerJson) {
            if (!mapLayerJson) {
                 //Oskari.log(this.getName()).warn("Trying to create mapLayer without JSON data");
                return null;
            }

            var layer = this.createLayerTypeInstance(mapLayerJson.type, mapLayerJson.params, mapLayerJson.options);
            if (!layer) {
                Oskari.log(this.getName()).warn("Unknown layer type: " + mapLayerJson.type);
                return null;
            }
            //these may be implemented as jsonHandler
            if (mapLayerJson.type === 'wmslayer') {
                this._populateWmsMapLayerAdditionalData(layer, mapLayerJson);
            } else if (mapLayerJson.type === 'vectorlayer') {
                layer.setStyledLayerDescriptor(mapLayerJson.styledLayerDescriptor);
            }

            if (mapLayerJson.metaType && layer.setMetaType) {
                layer.setMetaType(mapLayerJson.metaType);
            }

            // set common map layer data
            layer.setAsNormalLayer();
            layer.setId(mapLayerJson.id);

            layer.setName(mapLayerJson.name);
            if(mapLayerJson.layerName) {
                layer.setLayerName(mapLayerJson.layerName);
            }

            if (mapLayerJson.opacity !== null && mapLayerJson.opacity !== undefined) {
                layer.setOpacity(mapLayerJson.opacity);
            } else {
                layer.setOpacity(100);
            }
            layer.setMaxScale(mapLayerJson.maxScale);
            layer.setMinScale(mapLayerJson.minScale);
            layer.setDescription(mapLayerJson.subtitle);
            layer.setQueryable(mapLayerJson.isQueryable === "true" ||
                mapLayerJson.isQueryable === true);

            layer.setRealtime(mapLayerJson.realtime);
            layer.setRefreshRate(mapLayerJson.refreshRate);
            layer.setAdmin(mapLayerJson.admin);

            layer.setVersion(mapLayerJson.version);
            layer.setSrs_name(mapLayerJson.srs_name);

            // metadata
            layer.setDataUrl(mapLayerJson.dataUrl);
            layer.setMetadataIdentifier(mapLayerJson.dataUrl_uuid);
            if (!layer.getMetadataIdentifier() && layer.getDataUrl()) {
                var tempPartsForMetadata = layer.getDataUrl().split("uuid=");
                if (tempPartsForMetadata.length === 2) {
                    layer.setMetadataIdentifier(tempPartsForMetadata[1]);
                }
            }

            // backendstatus
            if (mapLayerJson.backendStatus && layer.setBackendStatus) {
                layer.setBackendStatus(mapLayerJson.backendStatus);
            }

            // for grouping: organisation and inspire
            if (mapLayerJson.orgName) {
                layer.setOrganizationName(mapLayerJson.orgName);
            } else {
                layer.setOrganizationName("");
            }

            if (mapLayerJson.inspire) {
                layer.setInspireName(mapLayerJson.inspire);
            } else {
                layer.setInspireName("");
            }
            layer.setVisible(true);

            // extent
            if (mapLayerJson.geom && layer.setGeometryWKT) {
                layer.setGeometryWKT(mapLayerJson.geom);
            }

            // optional attributes
            if (mapLayerJson.attributes) {
                layer.setAttributes(mapLayerJson.attributes);
            }

            // permissions
            if (mapLayerJson.permissions) {
                for (var perm in mapLayerJson.permissions) {
                    if (mapLayerJson.permissions.hasOwnProperty(perm)) {
                        layer.addPermission(perm, mapLayerJson.permissions[perm]);
                    }
                }
            }

            if (mapLayerJson.url) {
                layer.setLayerUrls(this.parseUrls(mapLayerJson.url));
            }

            layer.setLegendImage(mapLayerJson.legendImage);

            if (mapLayerJson.localization) {
                // overrides name/desc/inspire/organization if defined!!
                layer.setLocalization(mapLayerJson.localization);
            }

            var builder = this.modelBuilderMapping[mapLayerJson.type];
            if (builder) {
                builder.parseLayerData(layer, mapLayerJson, this);
            }

            if(mapLayerJson.created && isNaN(Date.parse(mapLayerJson.created)) === false){
                var created = new Date(mapLayerJson.created);
                if(created) {
                    layer.setCreated(created);
                }
            }

            return layer;
        },
        parseUrls : function(commaSeparatedUrlList) {
            if(!commaSeparatedUrlList) {
                return [];
            }
            return commaSeparatedUrlList.split(",");
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
        _populateWmsMapLayerAdditionalData: function (layer, jsonLayer) {
            if(jsonLayer.wmsName) {
                layer.setWmsName(jsonLayer.wmsName);
            }
            layer.setGfiContent(jsonLayer.gfiContent);

            /*prefer url - param, fall back to wmsUrl if not available*/
            if (jsonLayer.url) {
                layer.setLayerUrls(this.parseUrls(jsonLayer.url));
            } else if (jsonLayer.wmsUrl) {
                layer.setLayerUrls(this.parseUrls(jsonLayer.wmsUrl));
            }

            // default to enabled, only check if it is disabled
            layer.setFeatureInfoEnabled(jsonLayer.gfi !== 'disabled');
            layer.setVersion(jsonLayer.version);

            if (jsonLayer.formats) {
                layer.setQueryFormat(jsonLayer.formats.value);
                layer.setAvailableQueryFormats(jsonLayer.formats.available);
            }
            return this.populateStyles(layer, jsonLayer);
        },
        /**
         * @method populateStyles
         *
         * Parses styles attribute from JSON and adds them as a
         * Oskari.mapframework.domain.Style to the layer Object.
         * If no styles attribute is present, adds an empty
         * dummy style and sets that as current style.
         *
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         * @param {Object} jsonLayer JSON presentation for the maplayer
         * @param {Oskari.mapframework.domain.Style} defaultStyle
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} returns the same layer object with populated styles for convenience
         */
        populateStyles: function (layer, jsonLayer, defaultStyle) {
            var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style'),
                i,
                styleJson,
                blnMultipleStyles,
                style;


            if (jsonLayer.styles) {
                // has styles
                for (i = 0; i < jsonLayer.styles.length; i++) {

                    styleJson = jsonLayer.styles;
                    // TODO: can be removed if impl now returns
                    // an array always so loop works properly
                    blnMultipleStyles = !(isNaN(i));
                    if (blnMultipleStyles) {
                        styleJson = jsonLayer.styles[i];
                    }
                    // setup backwards compatibility for WMTS layer style
                    if(styleJson.identifier) {
                        //   use identifier as name and title if not set explicitly
                        if(!styleJson.name) {
                            styleJson.name = styleJson.identifier;
                        }
                        if(!styleJson.title) {
                            styleJson.title = styleJson.identifier;
                        }
                        // use isDefault styles identifier as default style if not set
                        if(styleJson.isDefault && !jsonLayer.style) {
                            jsonLayer.style = styleJson.identifier;
                        }
                    }
                    // /WMTS style backwards compatibility end

                    style = styleBuilder();
                    style.setName(styleJson.name);
                    style.setTitle(styleJson.title);
                    style.setLegend(styleJson.legend);
                    layer.addStyle(style);

                    // only add the style once if not an array
                    if (!blnMultipleStyles) {
                        break;
                    }
                }

                // set the default style
                layer.selectStyle(jsonLayer.style);
            }
            if(defaultStyle) {
                layer.addStyle(defaultStyle);
                layer.selectStyle(defaultStyle.getName());
            }
            if (layer.getLayerType() === 'wfs') {
                //style none -> not rendered in transport
                var locNoneStyle = layer.localization['none-style'];
                var noneStyle = Oskari.clazz.create('Oskari.mapframework.domain.Style');
                noneStyle.setName("oskari_none");
                noneStyle.setTitle(locNoneStyle);
                noneStyle.setLegend("");
                layer.addStyle(noneStyle);
            }

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
        checkForDuplicateId: function (id, name) {
            if (this._reservedLayerIds[id] === true) {
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
         *            layerList (optional) array of maplayer objects, defaults to all layers
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         *  layerModel if found matching id or null if not found
         */
        findMapLayer: function (id, layerList) {
            var i,
                layer,
                subLayers = [];
            if (!layerList) {
                layerList = this._loadedLayersList;
            }
            for (i = 0; i < layerList.length; i++) {
                layer = layerList[i];
                if (layer.getId() + '' === id + '') {
                    return layer;
                } else {
                    subLayers = subLayers.concat(layer.getSubLayers());
                }
            }
            // didnt find layer from base level, try sublayers if there are any
            if (subLayers.length > 0) {
                return this.findMapLayer(id, subLayers);
            } else {
                return null;
            }
        },
        /**
         * @method findMapLayerByName
         * Tries to find maplayer with given name from given map layer array. Uses
         * recursion to loop through all layers and its sublayers
         *
         * @param {String}
         *            name layer name we want to find. For example: "oskari:kunnat2013"
         * @param {Array}
         *            layerList (optional) array of maplayer objects, defaults to all layers
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         *  layerModel if found matching name or null if not found
         */
        findMapLayerByName: function (name, layerList) {
            var i,
                layer,
                subLayers = [];
            if (!layerList) {
                layerList = this._loadedLayersList;
            }
            for (i = 0; i < layerList.length; i++) {
                layer = layerList[i];
                if (layer.getLayerName() + '' === name + '') {
                    return layer;
                } else {
                    subLayers = subLayers.concat(layer.getSubLayers());
                }
            }
            // didn't find layer from base level, try sublayers if there are any
            if (subLayers.length > 0) {
                return this.findMapLayerByName(name, subLayers);
            } else {
                return null;
            }
        },
        /**
         * Checks if the layers in view data are available
         *
         * @method hasLayers
         * @param {Number[]} layerIds array of layer id
         * @return {Boolean} Returns true if service has all layers in layerId's
         */
        hasLayers: function (layerIds) {
            var layers = this.getAllLayers(),
                i,
                layer;
            for (i = 0; i < layerIds.length; ++i) {
                layer = this.findMapLayer(layerIds[i], layers);
                if (!layer) {
                    return false;
                }
            }
            return true;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    });