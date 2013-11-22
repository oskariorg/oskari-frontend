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
     *          reference to application sandbox
     */

    function (mapLayerUrl, sandbox) {

        this._mapLayerUrl = mapLayerUrl;
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
        this.modelBuilderMapping = {

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
         * @method addLayer
         * Adds the layer to them Oskari system so it can be added to the map etc.
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         * @throws error if layer with the same id already exists
         */
        addLayer: function (layerModel, suppressEvent) {

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
                subLayers,
                len,
                i;

            if (parentLayer && (parentLayer.isBaseLayer() || parentLayer.isGroupLayer())) {
                subLayers = parentLayer.getSubLayers();

                for (i = 0, len = subLayers.length; i < len; ++i) {
                    if (subLayers[i].getId() === layerModel.getId()) {
                        return false;
                    }
                }

                subLayers.push(layerModel);

                if (suppressEvent !== true) {
                    // notify components of added layer if not suppressed
                    var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'add');
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
            var layer = null,
                i;
            for (i = 0; i < this._loadedLayersList.length; i++) {
                if ((this._loadedLayersList[i].getId() + '') === (layerId + '')) {
                    layer = this._loadedLayersList[i];
                    this._loadedLayersList.splice(i, 1);
                    break;
                }
            }
            if (layer && suppressEvent !== true) {
                // notify components of layer removal
                var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'remove');
                this._sandbox.notifyAll(evt);
            }
            this._reservedLayerIds[layerId] = false;
            // TODO: notify if layer not found?
        },

        /**
         * @method removeSubLayer
         * Removes the layer from parent layer's sublayers and
         * sends out a MapLayerEvent if it was found & removed
         * @param {String} parentLayerId
         * @param {String} layerId
         *            id for the layer to be removed
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on test cases to avoid unnecessary events)
         */
        removeSubLayer: function (parentLayerId, layerId, suppressEvent) {
            var parentLayer = this.findMapLayer(parentLayerId),
                subLayers,
                subLayer,
                len,
                i;

            if (parentLayer && (parentLayer.isBaseLayer() || parentLayer.isGroupLayer())) {
                subLayers = parentLayer.getSubLayers();

                for (i = 0, len = subLayers.length; i < len; ++i) {
                    if (subLayers[i].getId() === layerId) {
                        subLayer = subLayers[i];
                        subLayers.splice(i, 1);
                        break;
                    }
                }

                if (subLayer && suppressEvent !== true) {
                    // notify components of added layer if not suppressed
                    var event = this._sandbox.getEventBuilder('MapLayerEvent')(subLayer.getId(), 'remove');
                    this._sandbox.notifyAll(event);
                }
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
            //console.log("MapLayerService: updateLayer");
            var layer = this.findMapLayer(layerId),
                i;
            if (layer) {
                //console.log("New layer config:");
                //console.log(newLayerConf);

                if (newLayerConf.dataUrl) {
                    layer.setDataUrl(newLayerConf.dataUrl);
                }

                /*
            if (newLayerConf.formats) {
                //layer.set();
            }
            */

                /*
            if (newLayerConf.isQueryable) {
                // layer.set();
            }
            */

                if (newLayerConf.legendImage) {
                    layer.setLegendImage(newLayerConf.legendImage);
                }

                if (newLayerConf.minScale) {
                    layer.setMinScale(newLayerConf.minScale);
                }

                if (newLayerConf.maxScale) {
                    layer.setMaxSclae(newLayerConf.maxScale);
                }

                if (newLayerConf.name) {
                    layer.setName(newLayerConf.name);
                }

                /*
            if (newLayerConf.orgName) {
                // layer.set();
            }
            */
                /*
            if (newLayerConf.style) {
                layer.setStyle(newLayerConf.style);
            }
            */

                /*
            if (newLayerConf.styles) {
                // layer.set();
            }
            */

                if (newLayerConf.type) {
                    layer.setType(newLayerConf.type);
                }

                /*
            if (newLayerConf.updated) {
                // layer.set();
            }
            */

                if (newLayerConf.wmsName) {
                    layer.setWmsName(newLayerConf.wmsName);
                }

                if (newLayerConf.wmsUrl) {
                    layer.setWmsUrls(newLayerConf.wmsUrl.split(','));
                }

                for (i in newLayerConf.admin) {
                    if (newLayerConf.admin.hasOwnProperty(i)) {
                        if (newLayerConf.admin[i]) {
                            layer.admin[i] = newLayerConf.admin[i];
                        }
                    }
                }

                //console.log(layer);
                // notify components of layer update
                var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'update');
                this._sandbox.notifyAll(evt);
            }
            // TODO: notify if layer not found?
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
            //console.log("loadAllLayersAjax");
            var me = this;
            // Used to bypass browsers' cache especially in IE, which seems to cause
            // problems with displaying publishing permissions in some situations.
            var timeStamp = new Date().getTime();

            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: this._mapLayerUrl + '&timestamp=' + timeStamp + '&',
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
                mapLayer,
                existingLayer,
                exSubLayers,
                mapSubLayers,
                subI,
                existingSubLayer;


            for (i = 0; i < allLayers.length; i++) {

                mapLayer = this.createMapLayer(allLayers[i]);

                if (this._reservedLayerIds[mapLayer.getId()] !== true) {
                    this.addLayer(mapLayer, true);
                } else {
                    // Set additional data to an existing layer.
                    existingLayer = this.findMapLayer(mapLayer.getId());

                    if (allLayers[i].admin !== null && allLayers[i].admin !== undefined) {
                        existingLayer.admin = allLayers[i].admin;
                    }
                    if (allLayers[i].names) {
                        existingLayer.names = allLayers[i].names;
                    }

                    if (existingLayer.getSubLayers() !== null && existingLayer.getSubLayers() !== undefined) { // Set additional data to an sublayers

                        exSubLayers = existingLayer.getSubLayers();
                        mapSubLayers = mapLayer.getSubLayers();

                        for (subI = 0; subI < exSubLayers.length; subI++) {

                            existingSubLayer = exSubLayers[subI];
                            if (exSubLayers[subI].admin !== null && exSubLayers[subI].admin !== undefined) {
                                existingSubLayer.admin = mapSubLayers[subI].admin;
                            }
                            if (exSubLayers[subI].names) {
                                existingSubLayer.names = mapSubLayers[subI].names;
                            }
                        }
                    }
                }
            }
            // notify components of added layer if not suppressed
            this._allLayersAjaxLoaded = true;
            var evt = this._sandbox.getEventBuilder('MapLayerEvent')(null, 'add');
            this._sandbox.notifyAll(evt);
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
            this._sandbox.printDebug("[MapLayerService] registering handler for type " + type);
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

            if (this._stickyLayerIds[mapLayer.getId()]) {
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
            //Oskari.clazz.create('Oskari.mapframework.domain.WmsLayer');
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
                // sandbox.printDebug
                /*
                 * console.log("[LayersService] " + "Trying to create mapLayer
                 * without " + "backing JSON data - id: " +mapLayerId);
                 */
                return null;
            }

            var layer = this.createLayerTypeInstance(mapLayerJson.type, mapLayerJson.params, mapLayerJson.options),
                perm;
            if (!layer) {
                throw "Unknown layer type '" + mapLayerJson.type + "'";
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

            // permissions
            if (mapLayerJson.permissions) {
                for (perm in mapLayerJson.permissions) {
                    if (mapLayerJson.permissions.hasOwnProperty(perm)) {
                        layer.addPermission(perm, mapLayerJson.permissions[perm]);
                    }
                }
            }

            if (mapLayerJson.url) {
                layer.addLayerUrl(mapLayerJson.url);
            }

            if (mapLayerJson.localization) {
                // overrides name/desc/inspire/organization if defined!!
                layer.setLocalization(mapLayerJson.localization);
            }

            var builder = this.modelBuilderMapping[mapLayerJson.type];
            if (builder) {
                builder.parseLayerData(layer, mapLayerJson, this);
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
        _populateWmsMapLayerAdditionalData: function (layer, jsonLayer) {
            var wmsUrls,
                i;
            layer.setWmsName(jsonLayer.wmsName);
            if (jsonLayer.wmsUrl) {
                wmsUrls = jsonLayer.wmsUrl.split(",");
                for (i = 0; i < wmsUrls.length; i++) {
                    layer.addWmsUrl(wmsUrls[i]);
                }
            }
            // default to enabled, only check if it is disabled
            layer.setFeatureInfoEnabled(jsonLayer.gfi !== 'disabled');
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
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} returns the same layer object with populated styles for convenience
         */
        populateStyles: function (layer, jsonLayer) {

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

            // Create empty style that works as default if none available
            if (layer.getStyles().length === 0) {

                style = styleBuilder();
                style.setName("");
                style.setTitle("");
                style.setLegend("");
                layer.addStyle(style);
                layer.selectStyle("");
            }

            layer.setLegendImage(jsonLayer.legendImage);

            if (jsonLayer.formats && jsonLayer.formats.value) {
                layer.setQueryFormat(jsonLayer.formats.value);
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
                subLayers,
                subLayer;
            if (!layerList) {
                layerList = this._loadedLayersList;
            }
            for (i = 0; i < layerList.length; i++) {
                layer = layerList[i];
                if (layer.getId() + '' === id + '') {
                    return layer;
                }

            }
            // didnt find layer from base level, try sublayers
            for (i = 0; i < layerList.length; i++) {
                layer = layerList[i];
                // recurse to sublayers
                subLayers = layer.getSubLayers();
                subLayer = this.findMapLayer(id, subLayers);
                if (subLayer !== null && subLayer !== undefined) {
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
        'protocol': ['Oskari.mapframework.service.Service']
    });