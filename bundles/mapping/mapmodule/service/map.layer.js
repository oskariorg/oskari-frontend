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
        this._mapLayerUrl = mapLayerUrl || Oskari.urls.getRoute('GetMapLayers') + '&lang=' + Oskari.getLang();
        this._sandbox = sandbox;
        this._allLayersAjaxLoaded = false;
        this._loadedLayersList = [];
        // used to detect duplicate ids since looping through the list is slow
        this._reservedLayerIds = {};
        // used to store sticky layer ids - key = layer id, value = true if sticky (=layer cant be removed)
        this._stickyLayerIds = {};
        this._layerGroups = [];
        this._dataProviders = [];
        this.composingModels = {};

        this.loc = Oskari.getMsg.bind(null, 'MapModule');

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

        this._popupService = sandbox.getService('Oskari.userinterface.component.PopupService');
        this.popupCoolOff = false;

        /*
         * Layer filters
         */
        const rasterLayerTypes = ['wmts', 'bingmaps', 'arcgis', 'wms', 'arcgis93'];
        this.layerFilters = {
            featuredata: function (layer) {
                return layer.hasFeatureData();
            },
            newest: function (layer) {
                // kinda heavy, but get a list of 20 newest layers and check if the requested layer is one them
                // getNewestLayers() caches the result so in practice it's not as heavy as it looks.
                return !!me.getNewestLayers(20).find(function (newLayer) {
                    return layer.getId() === newLayer.getId();
                });
            },
            timeseries: function (layer) {
                return layer.hasTimeseries();
            },
            raster: layer => rasterLayerTypes.includes(layer.getLayerType())
        };

        Oskari.makeObservable(this);
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.mapframework.service.MapLayerService',
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: 'MapLayerService',
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
        getActiveFilters: function () {
            var me = this;
            var registeredFilters = [];
            Object.keys(this.layerFilters).forEach(function (key) {
                if (me.filterHasLayers(key)) {
                    registeredFilters.push(key);
                }
            });
            return registeredFilters;
        },
        filterHasLayers: function (filter) {
            return this.getFilteredLayers(filter).length !== 0;
        },
        /**
         * @method addLayer
         * Adds the layer to them Oskari system so it can be added to the map etc.
         * @param {Oskari.mapframework.domain.AbstractLayer} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         * @throws error if layer with the same id already exists
         */
        addLayer: function (layerModel, suppressEvent) {
            var me = this;
            if (!layerModel) {
                Oskari.log(this.getName()).warn('Called addLayer without a layer!');
                return;
            }
            // if parent id is present, forward to addSubLayer()
            if (layerModel.getParentId() !== -1) {
                this.addSubLayer(layerModel.getParentId(), layerModel, suppressEvent);
                return;
            }

            const layerId = layerModel.getId();
            // throws exception if the id is reserved to existing maplayer
            // we need to check again here
            this.checkForDuplicateId(layerId, layerModel.getName());

            this._reservedLayerIds[layerId] = true;
            // everything ok, lets add the layer
            this._loadedLayersList.push(layerModel);

            // flush cache for newest filter when layer is added
            this._newestLayers = null;

            const groups = layerModel.getGroups();
            if (groups && groups.length > 0) {
                // for each group on the layer
                groups.forEach(function (group) {
                    // find the group details
                    if (group.id === -1) {
                        return;
                    }
                    var groupConf = me.findLayerGroupById(group.id);
                    if (!groupConf) {
                        return;
                    }
                    groupConf.addChildren({
                        type: 'layer',
                        id: layerId,
                        order: 1000000
                    });
                });
            }

            if (suppressEvent !== true) {
                // notify components of added layer if not suppressed
                var event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'add');
                this.getSandbox().notifyAll(event);
            }
        },
        /**
         * Adds a tool the layer and notifies other components about is with MapLayerEvent typed with 'tool'
         * @param {Oskari.mapframework.domain.AbstractLayer} layerModel   layer to modify
         * @param {Oskari.mapframework.domain.Tool} tool                  tool to add
         * @param {Boolean} suppressEvent true to not send event (notify manually later to signal a batch update)
         */
        addToolForLayer: function (layerModel, tool, suppressEvent) {
            if (!layerModel || !tool) {
                throw new Error('Invalid params');
            }
            layerModel.addTool(tool);

            if (suppressEvent !== true) {
                // notify components of modified layer tools if not suppressed
                var event = Oskari.eventBuilder('MapLayerEvent')(layerModel.getId(), 'tool');
                this.getSandbox().notifyAll(event);
            }
        },

        /**
         * @method addSubLayer
         * Adds the layer to parent layer's sublayer list
         * @param {String} parentLayerId the id of the parent layer to which we're adding the layerModel.
         * @param {Oskari.mapframework.domain.AbstractLayer} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         */
        addSubLayer: function (parentLayerId, layerModel, suppressEvent) {
            var parentLayer = this.findMapLayer(parentLayerId);
            if (!parentLayer || !parentLayer.isBaseLayer() || !parentLayer.isGroupLayer()) {
                throw new Error('Trying to add a sublayer to unsupported parent (id:' + parentLayerId + ')');
            }

            layerModel.setParentId(parentLayerId);
            if (!parentLayer.addSubLayer(layerModel)) {
                // wasn't added - already added -> skip event since nothing was updated
                return;
            }

            if (suppressEvent !== true) {
                // notify components of added layer if not suppressed
                var evt = Oskari.eventBuilder('MapLayerEvent')(parentLayer.getId(), 'update');
                this.getSandbox().notifyAll(evt);
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
            var layer = this.findMapLayer(layerId);
            var parentLayer = null;
            var sandbox = this.getSandbox();

            if (!layer) {
                // not found in layers OR sublayers!
                // TODO: should we notify somehow?
                return;
            }
            // remove the layer from map state (selected layers)
            sandbox.getMap().removeLayer(layerId);

            // remove layer from groups (needs to be done when the layer can still be found by id)
            layer.getGroups().forEach(group => this.removeLayerFromGroup(group.id, layerId, true));

            // default to all layers
            var layerList = this._loadedLayersList;
            if (layer.getParentId() !== -1) {
                // referenced layer is a sublayer
                parentLayer = this.findMapLayer(layer.getParentId());
                if (!parentLayer) {
                    return;
                }
                // work on sublayers instead
                layerList = parentLayer.getSubLayers();
            }
            var indexToRemove = layerList.findIndex(function (item) {
                return item.getId() + '' === layerId + '';
            });
            if (indexToRemove !== -1) {
                layerList.splice(indexToRemove, 1);
            }

            this._reservedLayerIds[layerId] = false;

            // flush cache for newest filter when layer is removed
            this._newestLayers = null;

            if (layer && suppressEvent !== true) {
                var mapLayerEvent = Oskari.eventBuilder('MapLayerEvent');

                // notify components of layer removal
                if (parentLayer) {
                    // notify a collection layer has been updated
                    sandbox.notifyAll(mapLayerEvent(parentLayer.getId(), 'update'));
                } else {
                    // free up the layerId if actual removal
                    this._reservedLayerIds[layerId] = false;
                    // notify a layer has been removed
                    sandbox.notifyAll(mapLayerEvent(layer.getId(), 'remove'));
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

            // Scales need to be set always so they can be cleared with the admin.
            // The server doesn't return scale if not set -> these will not get updated if only updated when value exists
            layer.setMinScale(newLayerConf.minScale);
            layer.setMaxScale(newLayerConf.maxScale);

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

            if (newLayerConf.dataproviderId) {
                layer.setDataProviderId(newLayerConf.dataproviderId);
                const provider = this.getDataProviderById(newLayerConf.dataproviderId);
                if (provider) {
                    layer.setOrganizationName(provider.name || '');
                } else {
                    layer.setOrganizationName(newLayerConf.orgName || '');
                }
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
            if (newLayerConf.srs) {
                layer.setSrsList(newLayerConf.srs);
            }

            // optional attributes
            if (newLayerConf.attributes) {
                layer.setAttributes(newLayerConf.attributes);
            }

            if (newLayerConf.options) {
                layer.setOptions(newLayerConf.options);
            }

            if (newLayerConf.params) {
                layer.setParams(newLayerConf.params);
            }

            if (newLayerConf.groups) {
                const newGroups = newLayerConf.groups;
                // remove layer from groups it's no longer part of
                const newGroupIds = newGroups.map(g => g.id);
                const oldGroupIds = layer.getGroups().map(group => group.id);
                const removeFromGroups = oldGroupIds.filter(id => !newGroupIds.includes(id));
                removeFromGroups.forEach(groupId => this.removeLayerFromGroup(groupId, layer.getId(), true));

                // add layer to groups it wasn't previously part of
                const addToGroups = newGroups.filter(g => !oldGroupIds.includes(g.id));
                addToGroups.forEach(group => this.addLayerToGroup(group.id, layer.getId(), group.orderNumber, true));
            }

            if (newLayerConf.orderNumber) {
                layer.setOrderNumber(newLayerConf.orderNumber);
            }

            // wms specific
            // TODO: we need to figure this out some other way
            // we could remove the old layer and create a new one in admin bundle
            if (newLayerConf.type === 'wmslayer') {
                // TODO: remove styles and wmsurls??
                this._populateWmsMapLayerAdditionalData(layer, newLayerConf);
            }

            // notify components of layer update
            var evt = Oskari.eventBuilder('MapLayerEvent')(layer.getId(), 'update');
            this.getSandbox().notifyAll(evt);
        },
        /**
         * Adds reference to layer for group and reference to group for layer
         * @param {Number} groupId id of group to add a layer into
         * @param {Number|String} layerId id of layer to add to a group
         * @param {Boolean} suppressEvent defaults to false, true to NOT send an event (for mass updates)
         */
        addLayerToGroup: function (groupId, layerId, orderNumber = 1000000, suppressEvent = false) {
            if (groupId === -1) {
                // group of -1 is "ungrouped"
                return;
            }
            const group = this.findLayerGroupById(groupId);
            if (!group) {
                return;
            }
            var layer = this.findMapLayer(layerId);
            if (!layer) {
                return;
            }
            // give layer a note it's on this group
            layer.addGroup({
                id: group.getId(),
                name: Oskari.getLocalized(group.getName())
            });
            // give group a note that the layer is on that group
            group.addChildren({
                id: layerId,
                type: 'layer',
                order: orderNumber
            });

            if (!suppressEvent) {
                this.trigger('theme.update');
            }
        },
        /**
         * Removes reference to layer from group and reference to group from layer
         * @param {Number} groupId id of group to remove a layer from
         * @param {Number|String} layerId id of layer to remove from a group
         * @param {Boolean} suppressEvent defaults to false, true to NOT send an event (for mass updates)
         */
        removeLayerFromGroup: function (groupId, layerId, suppressEvent = false) {
            if (groupId === -1) {
                // group of -1 is "ungrouped"
                return;
            }
            const group = this.findLayerGroupById(groupId);
            if (!group) {
                return;
            }
            var layer = this.findMapLayer(layerId);
            if (!layer) {
                return;
            }
            // remove group from layer
            layer.setGroups(layer.getGroups().filter(g => g.id !== groupId));
            // remove layer from group
            group.removeChild('layer', layerId);

            if (!suppressEvent) {
                this.trigger('theme.update');
            }
        },
        /**
         * Delete layer group
         * @method deleteLayerGroup
         * @param  {Integer}         id group id
         * @param {Integer}          parentId parent id
         * @param {Boolean}          deleteLayers deleteLayers
         */
        deleteLayerGroup: function (id, parentId, deleteLayers) {
            let groupsList = this.getAllLayerGroups();
            if (parentId) {
                const parentGroup = this.findLayerGroupById(parentId);
                if (parentGroup) {
                    groupsList = parentGroup.getGroups();
                }
            }
            const allLayers = this.getAllLayers();
            const isLayerInGroup = (layer) => layer.getGroups().filter(g => g.getId() === id).length > 0;
            const layersInDeletedGroup = allLayers.filter(isLayerInGroup).map(l => l.getId());

            if (deleteLayers) {
                layersInDeletedGroup.forEach(layerId => this.removeLayer(layerId));
            } else {
                layersInDeletedGroup.forEach(layerId => this.removeLayerFromGroup(id, layerId, true));
            }

            const groupIndex = groupsList.findIndex(group => group.id === id);
            if (groupIndex >= 0) {
                groupsList.splice(groupIndex, 1);
            }
            this.trigger('theme.update');
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
                var evt = Oskari.eventBuilder('MapLayerEvent')(layer.getId(), 'sticky');
                this.getSandbox().notifyAll(evt);
            }
            // TODO: notify if layer not found?
        },
        showUnsupportedPopup: function () {
            if (this.popupCoolOff) {
                return;
            }
            var popup = this._popupService.createPopup();

            var buttons = [popup.createCloseButton('OK')];
            const dimension = this.getSandbox().getMap().getSupports3D() ? '3D' : '2D';
            popup.show(this.loc('unsupportedProjHeader'), this.loc('unsupportedProj', { dimension }).replace(/[\n]/g, '<br>'), buttons);

            this.popupCoolOff = true;
            setTimeout(function () {
                this.popupCoolOff = false;
            }.bind(this), 500);
        },

        /**
         * @method loadAllLayerGroupsAjax
         * Loads layers JSON using the ajax URL given on #create()
         * and parses it to internal layer objects by calling #createMapLayer() and #addLayer()
         * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
         * @param {Function} callbackFailure method to be called when something went wrong
         * @param {Object} options (optional) extra options like forceProxy.
         */
        loadAllLayerGroupsAjax: function (callbackSuccess, callbackFailure, options) {
            var me = this;
            // Used to bypass browsers' cache especially in IE, which seems to cause
            // problems with displaying publishing permissions in some situations.
            var timeStamp = new Date().getTime();
            var queryData = {
                timestamp: timeStamp,
                srs: me.getSandbox().getMap().getSrsName(),
                lang: Oskari.getLang()
            };
            jQuery.extend(queryData, options || {});
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: queryData,
                url: Oskari.urls.getRoute('GetHierarchicalMapLayerGroups'),
                success: function (pResp) {
                    me._loadAllLayerGroupsAjaxCallBack(pResp, callbackSuccess);
                },
                error: function (jqXHR, textStatus) {
                    if (callbackFailure && jqXHR.status !== 0) {
                        callbackFailure();
                    }
                }
            });
        },

        /**
         * @method addLayerGroup
         * @param {Oskari.mapframework.domain.MaplayerGroup} group map layer group to add.
         */
        addLayerGroup: function (newGroup, parentId) {
            if (parentId) {
                let temp = [];
                for (var group of this._layerGroups) {
                    const subgroups = this.pushSubLayerGroup(group, parentId, newGroup);
                    temp.push(subgroups);
                }
                this._layerGroups = temp;
            } else {
                this._layerGroups.push(newGroup);
            }
            this.trigger('theme.update');
        },

        pushSubLayerGroup: function (group, parentId, newGroup) {
            if (group.id === parentId) {
                group.groups.push(newGroup);
                return group;
            }
            if (group.groups.length !== 0) {
                let temp = [];
                for (var g of group.groups) {
                    const subgroups = this.pushSubLayerGroup(g, parentId, newGroup);
                    temp.push(subgroups);
                }
                group.setGroups(temp);
            }
            return group;
        },
        updateGroupRecursively: function (group, newGroup) {
            if (group.id === newGroup.id) {
                const locale = Oskari.getLocalized(newGroup.getLocale());
                group.setName(locale.name);
                group.setDescription(locale.description);
                return group;
            }
            if (group.groups.length !== 0) {
                let temp = [];
                for (var g of group.groups) {
                    const subgroups = this.updateGroupRecursively(g, newGroup);
                    temp.push(subgroups);
                }
                group.setGroups(temp);
            }
            return group;
        },

        /**
         * @method updateLayerGroup
         * @param {Oskari.mapframework.domain.MaplayerGroup} group map layer group to update.
         */
        updateLayerGroup: function (group) {
            // Update group to layerGroups
            const index = this._layerGroups.findIndex(g => g.getId() === group.getId());
            if (index !== -1) {
                const locale = Oskari.getLocalized(group.getLocale());
                this._layerGroups[index].setName(locale.name);
                this._layerGroups[index].setDescription(locale.description);
            } else {
                let temp = [];
                for (var g of this._layerGroups) {
                    const subgroups = this.updateGroupRecursively(g, group);
                    temp.push(subgroups);
                }
                this._layerGroups = temp;
            }
            // Update group to needed layers. Groups under layer only contains group name with current localization
            this.getAllLayers().filter(l =>
                l._groups.filter(g => g.id === group.id).map(g => {
                    const locale = Oskari.getLocalized(group.getLocale());
                    g.name = locale.name;
                    g.description = locale.description;
                    return g;
                }));
            this.trigger('theme.update');
        },

        /**
         * @method updateDataProvider
         * @param dataProvider object with structure like {id: 1, name "Provider name"}
         */
        updateDataProvider: function (dataProvider) {
            // Update dataProvider to dataProviders
            const index = this._dataProviders.findIndex(g => g.id === dataProvider.id);
            if (index !== -1) {
                this._dataProviders[index] = dataProvider;
            }
            // Update dataProvider to layers.
            this.getAllLayers()
                .filter(l => l.getDataProviderId() === dataProvider.id)
                .forEach(l => l.setOrganizationName(dataProvider.name));
            this.trigger('dataProvider.update');
        },
        setDataProviders: function (dataProviders) {
            this._dataProviders = dataProviders;
            this.trigger('dataProvider.update');
        },

        getDataProviderById: function (id) {
            const index = this._dataProviders.findIndex(g => g.id === id);
            if (index === -1) {
                return null;
            }
            // return a copy
            return {
                ...this._dataProviders[index]
            };
        },

        getDataProviders: function () {
            return this._dataProviders;
        },
        /**
         * @method deleteDataProvider
         * @param dataProvider object with structure like {id: 1, name "Provider name"}
         * @param deleteLayers boolean should layers be deleted
         */
        deleteDataProvider: function (dataProvider, deleteLayers) {
            // Delete dataProvider from dataProviders
            const index = this._dataProviders.findIndex(g => g.id === dataProvider.id);
            if (index !== -1) {
                const d = [...this._dataProviders];
                d.splice(index, 1);
                this._dataProviders = d;
            }
            if (deleteLayers) {
                // Remove layers
                const layers = this._loadedLayersList.filter(l => {
                    return l.getDataProviderId() !== dataProvider.id;
                });
                this._loadedLayersList = layers;
            } else {
                // Clear data provider from needed layers.
                this.getAllLayers()
                    .filter(l => l.getDataProviderId() === dataProvider.id)
                    .forEach(l => {
                        l.setDataProviderId(null);
                        l.setOrganizationName('');
                    });
            }
            this.trigger('dataProvider.update');
        },
        /**
         * @method addDataProvider
         * @param dataProvider object with structure like {id: 1, name "Provider name"}
         */
        addDataProvider: function (dataProvider) {
            this._dataProviders.push(dataProvider);
            this.trigger('dataProvider.update');
        },

        /**
         * @method _loadAllLayerGroupsAjaxCallBack
         * Internal callback method for ajax loading in #loadAllLayerGroupsAjax()
         * @param {Object} pResp ajax response in JSON format
         * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
         * @private
         */
        _loadAllLayerGroupsAjaxCallBack: function (pResp, callbackSuccess) {
            // we don't want to reset "this._layerGroups" at the beginning since there groups
            //  created at runtime like one for statistical regionsets and we don't want to remove those.
            const groupModels = pResp.groups
                .map(group => Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));
            this._layerGroups.push(...groupModels);

            const providers = Object.keys(pResp.providers).map(id => {
                return {
                    id,
                    name: pResp.providers[id].name,
                    desc: pResp.providers[id].desc
                };
            });
            this.setDataProviders(providers);

            const flatLayerGroups = [];
            const gatherFlatGroups = (groups = []) => {
                groups.forEach((group) => {
                    flatLayerGroups.push(group);
                    gatherFlatGroups(group.getGroups());
                });
            };
            gatherFlatGroups(this._layerGroups);

            // FIXME: refactor codebase to get rid of these circular references.
            const allLayers = this.getAllLayers();
            const sandbox = this.getSandbox();
            this._loadLayersRecursive(pResp.layers, () => {
                // groups are expected to contain the layer objects -> inject layers to groups based on list of ids the group holds
                flatLayerGroups.forEach((group) => {
                    const layerIdList = group.getLayerIdList();
                    // layers are expected to have reference to groups they are in -> injecting groups to layer
                    allLayers
                        .filter((layer) => layerIdList.includes(layer.getId()))
                        .forEach((layer) => {
                            layer.getGroups().push({
                                id: group.getId(),
                                name: group.getName(),
                                description: group.getDescription()
                            });
                        });
                });

                // notify components of added layers
                sandbox.notifyAll(Oskari.eventBuilder('MapLayerEvent')(null, 'add'));
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            });
        },

        /**
         * @method _loadLayersRecursive
         * Internal callback method for load layers recursive
         * @param {Object} pResp ajax response in JSON format
         * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
         * @private
         */
        _loadLayersRecursive: function (layers, callbackSuccess) {
            var me = this;
            // check if recursion should end
            if (layers.length === 0) {
                me._allLayersAjaxLoaded = true;
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
                return;
            }
            // remove the first one for recursion
            var json = layers.shift();
            var mapLayer = me.createMapLayer(json);
            // unsupported maplayer type returns null so check for it
            if (mapLayer && me._reservedLayerIds[mapLayer.getId()] !== true) {
                me.addLayer(mapLayer, true);
            }
            // process remaining layers
            if (layers.length % 100 !== 0) {
                // do it right a way
                me._loadLayersRecursive(layers, callbackSuccess);
            } else {
                // yield cpu time after every 100 layers
                setTimeout(function () {
                    me._loadLayersRecursive(layers, callbackSuccess);
                }, 0);
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
         * @return {Oskari.mapframework.domain.AbstractLayer[]}
         */
        getAllLayers: function () {
            return this._loadedLayersList;
        },

        /**
         * @method getAllLayerGroups
         * Returns an array of layer groups added to the service
         * @param {String|Integer} id if defined return only requested group (deprecated - use findLayerGroupById() instead)
         * @return {Oskari.clazz.define.getGroups[]}
         */
        getAllLayerGroups: function (id) {
            if (typeof id !== 'undefined' && id !== null) {
                return this.findLayerGroupById(id);
            }
            return this._layerGroups;
        },
        /**
         * @method findLayerGroupById
         * Returns the requested group matching the id or null if not found.
         * @param {String|Integer} id id for requested group
         * @param {Oskari.mapframework.domain.MaplayerGroup[]} array of groups to search from (optional, defaults to all groups). Recurses to subgroups
         * @return {Oskari.clazz.define.getGroups[]}
         */
        findLayerGroupById: function (id, groupsToSearchFrom) {
            if (!groupsToSearchFrom) {
                return this.findLayerGroupById(id, this.getAllLayerGroups());
            }
            let requestedGroup = null;
            groupsToSearchFrom.forEach(group => {
                if (group.getId() + '' === id + '') {
                    requestedGroup = group;
                }
                if (requestedGroup) {
                    // already found it
                    return;
                }
                // keep searching - result may be null so we might need to dig deeper still
                requestedGroup = this.findLayerGroupById(id, group.getGroups());
            });
            return requestedGroup;
        },

        /**
         * @method getAllLayersByMetaType
         * Returns an array of layers added to the service that have the given metatype (layer.getMetaType() === type).
         *
         * @param {String} type
         *            metatype to filter the layers with
         * @return {Oskari.mapframework.domain.AbstractLayer[]}
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
         * @return {Oskari.mapframework.domain.AbstractLayer[]}
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
         * @return {Oskari.mapframework.domain.AbstractLayer[]}
         */
        getNewestLayers: function (count) {
            if (this._newestLayers) {
                return this._newestLayers;
            }
            var layersWithCreatedDate = [];
            var layersWithoutCreatedDate = [];
            this._loadedLayersList.forEach(function (layer) {
                if (layer.getCreated() !== null && !isNaN(layer.getCreated().getTime())) {
                    layersWithCreatedDate.push(layer);
                } else {
                    layersWithoutCreatedDate.push(layer);
                }
            });

            layersWithCreatedDate.sort(function (a, b) {
                if (a.getCreated() > b.getCreated()) {
                    return -1;
                } else if (a.getCreated() < b.getCreated()) {
                    return 1;
                } else {
                    return 0;
                }
            });

            var list = layersWithCreatedDate.slice(0, count);
            if (list.length < count) {
                // add layers without create date to fill in latest array
                list = list.concat(layersWithoutCreatedDate.slice(count - list.length));
            }
            this._newestLayers = list;
            return list;
        },
        /**
         * @method getLayerByMetadataId
         * Returns an array of layers added to the service corresponding to given metadata identifier
         *
         * @param {String} metadataIdentifier
         *            metadata identifier to filter the layers with
         * @return {Oskari.mapframework.domain.AbstractLayer[]}
         */
        getLayersByMetadataId: function (metadataIdentifier) {
            return this._loadedLayersList.filter(function (layer) {
                return layer.getMetadataIdentifier() === metadataIdentifier;
            });
        },
        /**
         * @method  @public registerLayerFilter Register layer filter
         * @param  {String} filterId       filter identifier
         * @param  {Function} filterFunction filter function
         */
        registerLayerFilter: function (filterId, filterFunction) {
            var me = this;
            if (typeof filterFunction !== 'function') {
                Oskari.log(this.getName()).warn('[MapLayerService] "' + filterId + '" -layer filter has not filter function! Not register layer filter.');
                return;
            }
            if (typeof filterId !== 'string') {
                Oskari.log(this.getName()).warn('[MapLayerService] "' + filterId + '" -layer filter has not string name. Not register layer filter.');
                return;
            }

            if (me.layerFilters[filterId]) {
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
        getFilteredLayers: function (filterId) {
            var me = this;
            var filterFunction = me.layerFilters[filterId];
            var allLayers = me.getAllLayers();
            if (!filterFunction) {
                Oskari.log(this.getName()).warn('[MapLayerService] not found layer filter "' + filterId + '". Returning all layers.');
                return allLayers;
            }
            return allLayers.filter(filterFunction);
        },
        /**
         * @method  @public getFilteredLayers  Get filtered layer groups
         * @param  {String} filterId filter id
         * @return {Array}   filtered layers list, if not found filter by id then return all layers
         */
        getFilteredLayerGroups: function (filterId) {
            var me = this;
            var allLayerGroups = me.getAllLayerGroups();
            var filteredLayers = me.getFilteredLayers(filterId);

            var hasFilteredLayer = function (layerId) {
                var layers = filteredLayers.filter(function (l) {
                    return layerId === l.getId();
                });
                return layers.length > 0;
            };

            var getRecursiveFilteredGroups = function (groups) {
                var filteredGroups = [];

                groups.forEach(function (group) {
                    var filteredLayers = [];

                    group.getLayerIdList().forEach(function (mapLayerId) {
                        if (hasFilteredLayer(mapLayerId)) {
                            let layer = me.findMapLayer(mapLayerId);
                            filteredLayers.push({
                                id: layer.getId(),
                                orderNumber: layer.getOrderNumber()
                            });
                        }
                    });

                    var json = {
                        id: group.getId(),
                        name: group.getName(),
                        layers: filteredLayers,
                        selectable: group.hasSelectable(),
                        orderNumber: group.getOrderNumber(),
                        groups: getRecursiveFilteredGroups(group.getGroups())
                    };
                    var groupModel = Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', json);
                    filteredGroups.push(groupModel);
                });

                return filteredGroups;
            };

            return getRecursiveFilteredGroups(allLayerGroups);
        },
        /**
         * @method registerLayerModel
         *      Register an external layer model type (to be used by extension bundles).
         * Adds a new type to #typeMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         * @param {String|Function} modelRef
         *            layer model clazz name (like 'Oskari.mapframework.domain.WmsLayer') or constructor function
         * @param {Oskari.mapframework.domain.LayerComposingModel} composingModel
         */
        registerLayerModel: function (type, modelRef, composingModel) {
            this.typeMapping[type] = modelRef;
            if (composingModel) {
                this.composingModels[type] = composingModel;
                this.trigger('availableLayerTypesUpdated', type);
            }
        },
        getVersionsForType (type) {
            const composingModel = this.composingModels[type];
            if (!composingModel) {
                return [];
            }
            return composingModel.getVersions();
        },
        getComposingModelForType (type) {
            return this.composingModels[type];
        },
        getLayerTypes () {
            return Object.keys(this.composingModels) || [];
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
            delete this.typeMapping[type];
            delete this.composingModels[type];
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
            Oskari.log(this.getName()).debug('[MapLayerService] registering handler for type ' + type);
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
        hasSupportForLayerType: function (type) {
            if (this.typeMapping[type]) {
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
         * @return {Oskari.mapframework.domain.AbstractLayer} layerModel
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
            const baseLayer = this.createLayerTypeInstance('wmslayer');
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

            baseLayer.setMetadataIdentifier(baseMapJson.metadataUuid);

            // for grouping by dataprovider
            baseLayer.setDataProviderId(baseMapJson.dataproviderId);
            const provider = this.getDataProviderById(baseMapJson.dataproviderId);
            if (provider) {
                baseLayer.setOrganizationName(provider.name || '');
            } else {
                baseLayer.setOrganizationName(baseMapJson.orgName || '');
            }

            baseLayer.setDescription(baseMapJson.info);
            baseLayer.setQueryable(false);

            if (baseMapJson.permissions) {
                for (const perm in baseMapJson.permissions) {
                    if (baseMapJson.permissions.hasOwnProperty(perm)) {
                        baseLayer.addPermission(perm, baseMapJson.permissions[perm]);
                    }
                }
            }

            if (baseMapJson.subLayer) {
                for (let i = 0; i < baseMapJson.subLayer.length; i++) {
                    // Notice that we are adding layers to baselayers sublayers array
                    const subLayer = this._createActualMapLayer(baseMapJson.subLayer[i]);
                    subLayer.setParentId(baseMapJson.id);
                    baseLayer.getSubLayers().push(subLayer);
                }
            }
            // Opacity
            if (baseMapJson.opacity !== null && baseMapJson.opacity !== undefined) {
                baseLayer.setOpacity(baseMapJson.opacity);
            } else if (baseLayer.getSubLayers().length > 0) {
                const subLayerOpacity = baseLayer.getSubLayers()[0].getOpacity();
                if (subLayerOpacity !== null && subLayerOpacity !== undefined) {
                    baseLayer.setOpacity(subLayerOpacity);
                } else {
                    baseLayer.setOpacity(100);
                }
            } else {
                baseLayer.setOpacity(100);
            }

            if (baseMapJson.groups) {
                baseLayer.setGroups(baseMapJson.groups);
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
            var modelRef = this.typeMapping[type];
            if (!modelRef) {
                return null;
            }
            if (typeof modelRef === 'function') {
                return new modelRef(params, options);
            }
            return Oskari.clazz.create(modelRef, params, options);
        },
        /**
         * @method _createActualMapLayer
         * @private
         *
         * Parses the given JSON Object to a MapLayer Object.
         * Called internally from #createMapLayer() and #_createGroupMapLayer().
         *
         * @param {Object} mapLayerJson JSON presentation of a single maplayer
         * @return {Oskari.mapframework.domain.AbstractLayer} layerModel
         *            parsed layer model that can be added with #addLayer()
         */
        _createActualMapLayer: function (mapLayerJson) {
            if (!mapLayerJson) {
                // Oskari.log(this.getName()).warn("Trying to create mapLayer without JSON data");
                return null;
            }
            var layer = this.createLayerTypeInstance(mapLayerJson.type, mapLayerJson.params);
            if (!layer) {
                Oskari.log(this.getName()).warn('Unknown layer type: ' + mapLayerJson.type);
                return null;
            }
            // these may be implemented as jsonHandler
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
            if (mapLayerJson.layerName) {
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
            layer.setQueryable(mapLayerJson.isQueryable === 'true' ||
                mapLayerJson.isQueryable === true);

            layer.setRealtime(mapLayerJson.realtime);
            layer.setRefreshRate(mapLayerJson.refreshRate);

            layer.setVersion(mapLayerJson.version);
            layer.setSrs_name(mapLayerJson.srs_name);
            layer.setSrsList(mapLayerJson.srs);

            // metadata
            layer.setMetadataIdentifier(mapLayerJson.metadataUuid);

            // backendstatus
            if (mapLayerJson.backendStatus && layer.setBackendStatus) {
                layer.setBackendStatus(mapLayerJson.backendStatus);
            }

            // for grouping by dataprovider
            layer.setDataProviderId(mapLayerJson.dataproviderId);
            const provider = this.getDataProviderById(mapLayerJson.dataproviderId);
            if (provider) {
                layer.setOrganizationName(provider.name || '');
            } else {
                layer.setOrganizationName(mapLayerJson.orgName || '');
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
            // optional options
            if (mapLayerJson.options) {
                layer.setOptions(mapLayerJson.options);
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

            var builder = this.modelBuilderMapping[mapLayerJson.type];
            if (builder) {
                builder.parseLayerData(layer, mapLayerJson, this);
            }

            if (mapLayerJson.groups) {
                layer.setGroups(mapLayerJson.groups);
            }

            if (mapLayerJson.created && isNaN(Date.parse(mapLayerJson.created)) === false) {
                var created = new Date(mapLayerJson.created);
                if (created) {
                    layer.setCreated(created);
                }
            }

            layer.setOrderNumber(mapLayerJson.orderNumber);

            if (mapLayerJson.styles) {
                this.populateStyles(layer, mapLayerJson.styles);
            }
            // styles have to be populated by this or builder/layer impl before selecting
            layer.selectStyle(mapLayerJson.style);

            return layer;
        },
        parseUrls: function (commaSeparatedUrlList) {
            if (!commaSeparatedUrlList) {
                return [];
            }
            return commaSeparatedUrlList.split(',');
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
            layer.setGfiContent(jsonLayer.gfiContent);
        },
        /**
         * @method populateStyles
         * @param {Oskari.mapframework.domain.AbstractLayer} layerModel
         * @param {Array} styles
         */
        populateStyles: function (layer, styles) {
            if (!Array.isArray(styles)) {
                return;
            }
            const styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');
            styles.forEach(({ name, title, legend }) => {
                const style = styleBuilder();
                style.setName(name);
                style.setTitle(title);
                style.setLegend(legend);
                layer.addStyle(style);
            });
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
                throw new Error("Trying to add map layer with id '" + id + ' (' + name + ")' but that id is already reserved for '" + foundLayer.getName() + "'");
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
         * @return {Oskari.mapframework.domain.AbstractLayer}
         *  layerModel if found matching id or null if not found
         */
        findMapLayer: function (id, layerList) {
            if (typeof id === 'undefined') {
                return;
            }
            if (!layerList) {
                layerList = this._loadedLayersList;
            }
            var layer = layerList.find(function (layer) {
                return layer.getId() + '' === id + '';
            });
            if (layer) {
                return layer;
            }
            // layer not found in regular layers, check sublayers
            var sublayers = [];
            layerList.forEach(function (layer) {
                sublayers = sublayers.concat(layer.getSubLayers());
            });
            if (!sublayers.length) {
                return null;
            }
            return this.findMapLayer(id, sublayers);
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
         * @return {Oskari.mapframework.domain.AbstractLayer}
         *  layerModel if found matching name or null if not found
         */
        findMapLayerByName: function (name, layerList) {
            if (!layerList) {
                layerList = this._loadedLayersList;
            }
            var layer = layerList.find(function (layer) {
                return layer.getLayerName() + '' === name + '';
            });
            if (layer) {
                return layer;
            }
            // layer not found in regular layers, check sublayers
            var sublayers = [];
            layerList.forEach(function (layer) {
                sublayers = sublayers.concat(layer.getSubLayers());
            });
            if (!sublayers.length) {
                return null;
            }
            return this.findMapLayerByName(name, sublayers);
        },
        /**
         * Checks if the layers in view data are available
         *
         * @method hasLayers
         * @param {Number[]} layerIds array of layer id
         * @return {Boolean} Returns true if service has all layers in layerId's
         */
        hasLayers: function (layerIds) {
            if (!layerIds) {
                // nothing was requested so we don't need to check for existance
                return true;
            }
            var me = this;
            var layers = this.getAllLayers();
            var missingLayer = layerIds.find(function (id) {
                // return true of layer was NOT found
                return !me.findMapLayer(id, layers);
            });
            // return true if all layers were found
            return !missingLayer;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    });
