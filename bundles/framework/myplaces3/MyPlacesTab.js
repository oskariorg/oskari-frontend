/**
 * @class Oskari.mapframework.bundle.myplaces3.MyPlacesTab
 * Renders the "personal data" myplaces tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.MyPlacesTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
     * instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.tabsContainer = undefined;
        this.tabPanels = {};

        this.linkTemplate = jQuery('<a href="JavaScript:void(0);"></a>');
        this.iconTemplate = jQuery('<div class="icon"></div>');
    }, {
        /**
         * @method getName
         * @return {String} name of the component
         * (needed because we fake to be module for listening to
         * events (getName and onEvent methods are needed for this))
         */
        getName: function () {
            return 'MyPlaces3.MyPlaces';
        },
        getTitle: function () {
            return this.loc('tab.title');
        },
        getTabsContainer: function () {
            return this.tabsContainer;
        },
        getContent: function () {
            return this.tabsContainer.ui;
        },
        initContainer: function () {
            var me = this;
            me.addAddLayerButton();
            me.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabDropdownContainer', me.loc('tab.nocategories'), me.addLayerButton);
            //TODO do not load all places at startup, load when category is selected
            //me.tabsContainer.addTabChangeListener(function(prevTab, newTab){
            //    newTab.handleSelection(true);
            //});
        },

        addAddLayerButton: function () {
            var me = this;
            me.addLayerButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            // TODO I18N
            me.addLayerButton.setTitle(me.loc('tab.addCategoryFormButton'));
            me.addLayerButton.setHandler(function () {
                me.instance.openAddLayerDialog('div.personaldata ul li select', 'right');
            });
            return me.addLayerButton;
        },

        addTabContent: function (container) {
            var me = this;
            me.initTabContent();
            container.append(me.tabsContainer.ui);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MyPlaces.MyPlacesChangedEvent
             * Updates the category tabs and grids inside them with current data
             */
            'MyPlaces.MyPlacesChangedEvent': function () {
                var me = this,
                    service = me.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService'),
                    categories = service.getAllCategories();
                var editLinkClosure = function (id) {
                    return function () {
                        var request = me.instance.sandbox.getRequestBuilder('MyPlaces.EditCategoryRequest')(id);
                        me.instance.sandbox.request(me.instance, request);
                        return false;
                    };
                };
                var deletelinkClosure = function (id) {
                    return function () {
                        var request = me.instance.sandbox.getRequestBuilder('MyPlaces.DeleteCategoryRequest')(id);
                        me.instance.sandbox.request(me.instance, request);
                        return false;
                    };
                };
                var i,
                    id,
                    panel;
                for (i = 0; i < categories.length; ++i) {
                    id = categories[i].getId();
                    panel = this.tabPanels[id];
                    if (!panel) {
                        panel = this._createCategoryTab(categories[i]);
                        this.tabsContainer.addPanel(panel);
                        this.tabPanels[id] = panel;
                    } else {
                        //lets set a name for the panel
                        panel.setTitle(categories[i].name);
                        // update panel graphics
                        me.tabsContainer.updatePanel(panel);
                    }
                    // update places
                    this._populatePlaces(id);
                    panel.getContainer().empty();
                    panel.grid.renderTo(panel.getContainer());

                    var editLink = this.linkTemplate.clone();
                    editLink.addClass('categoryOp');
                    editLink.addClass('edit');
                    editLink.append(this.loc('tab.editCategory'));
                    editLink.on('click', editLinkClosure(id));
                    panel.getContainer().append(editLink);

                    var deleteLink = this.linkTemplate.clone();
                    deleteLink.addClass('categoryOp');
                    deleteLink.addClass('delete');
                    deleteLink.append(this.loc('tab.deleteCategory'));
                    deleteLink.on('click', deletelinkClosure(id));
                    panel.getContainer().append(deleteLink);

                }
                this._removeObsoleteCategories();

                // Inform user of some features not being loaded due to
                // the max features restriction
                if (this.instance.conf &&
                    this.instance.conf.maxFeatures &&
                    this.instance.conf.maxFeatures === places.length) {
                    this._informOfMaxFeatures(this.getContent());
                }
            }
        },
        /**
         * @method _showPlace
         * Moves the map so the given geometry is visible on viewport. Adds the myplaces
         * layer to map if its not already selected.
         * @param {OpenLayers.Geometry} geometry place geometry to move map to
         * @param {Number} categoryId categoryId for the place so we can add it's layer to map
         * @private
         */
        _showPlace: function (geometry, categoryId) {
            // center map on selected place
            var me = this,
                mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule'),
                center = mapModule.getCentroidFromGeoJSON(geometry),
                bounds = me._fitBounds(mapModule.getBoundsFromGeoJSON(geometry)),
                mapmoveRequest = this.instance.sandbox.getRequestBuilder('MapMoveRequest')(center.x, center.y, bounds);
            this.instance.sandbox.request(this.instance, mapmoveRequest);
            // add the myplaces layer to map
            var layerId = 'myplaces_' + categoryId,
                layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                var request = this.instance.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
                this.instance.sandbox.request(this.instance, request);
            }
        },
        /**
         * @method _editPlace
         * Requests for given place to be opened for editing
         * @param {Object} data grid data object for place
         * @private
         */
        _editPlace: function (data) {
            // focus on map
            this._showPlace(data.geometry, data.categoryId);
            // request form
            var request = this.instance.sandbox.getRequestBuilder('MyPlaces.EditPlaceRequest')(data.id);
            this.instance.sandbox.request(this.instance, request);
        },
        /**
         * @method _deletePlace
         * Confirms delete for given place and deletes it if confirmed. Also shows
         * notification about cancel, deleted or error on delete.
         * @param {Object} data grid data object for place
         * @private
         */
        _deletePlace: function (data) {
            var me = this,
                sandbox = this.instance.sandbox,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(me.loc('tab.notification.delete.btnDelete'));
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                dialog.close();
                var service = sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService');
                var callback = function (isSuccess) {
                    var request;

                    if (isSuccess) {
                        dialog.show(me.loc('tab.notification.delete.title'), me.loc('tab.notification.delete.success'));
                        request = me.instance.sandbox
                            .getRequestBuilder('MyPlaces.DeletePlaceRequest')(data.categoryId);

                        me.instance.sandbox.request(me.instance, request);
                    } else {
                        dialog.show(me.loc('tab.notification.delete.title'), me.loc('tab.notification.delete.error'));
                    }
                    dialog.fadeout();
                };
                service.deleteMyPlace(data.id, callback);
            });
            var cancelBtn = dialog.createCloseButton(me.loc('tab.notification.delete.btnCancel')),
                confirmMsg = me.loc('tab.notification.delete.confirm', {name: data.name});
            dialog.show(me.loc('tab.notification.delete.title'), confirmMsg, [cancelBtn, okBtn]);
            dialog.makeModal();
        },
        /**
         * @method _getDrawModeFromGeometry
         * Returns a matching draw mode string-key for the geometry
         * @param {Object} GeoJSON geometry from my place model
         * @return {String} matching draw mode string-key for the geometry
         * @private
         */
         //TODO move to more common place
        _getDrawModeFromGeometry: function (geometry) {
            if (geometry === null) {
                return null;
            }
            var ret = null,
                type = geometry.type;
            if (type === 'MultiPoint' || type === 'Point') {
                ret = 'point';
            } else if (type === 'MultiLineString' || type === 'LineString') {
                ret = 'line';
            } else if (type === 'MultiPolygon'|| type === 'Polygon') {
                ret = 'area';
            }
            return ret;
        },
        /**
         * @method _createCategoryTab
         * Populates given categorys grid
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory} category category to populate
         * @private
         */
        _createCategoryTab: function (category) {
            var me = this,
                id = category.getId(),
                panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setId(me.instance.idPrefix + '-category-' + id);
            panel.setTitle(category.getName());
            //TODO do not load all places at startup, load when category is selected
            /*var selectionHandler = function (selected) {
                if (selected){
                    if (!category.isLoaded()){
                        var service = me.instance.getService();
                        service.loadPlacesInCategory(id);
                        
                    }
                }
            };
            panel.setSelectionHandler(selectionHandler);
            */

            panel.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
            var visibleFields = ['name', 'desc', 'createDate', 'updateDate', 'measurement', 'edit', 'delete'];
            panel.grid.setVisibleFields(visibleFields);
            // set up the link from name field
            var nameRenderer = function (name, data) {
                var link = me.linkTemplate.clone();
                var linkIcon = me.iconTemplate.clone();
                var shape = me._getDrawModeFromGeometry(data.geometry);
                linkIcon.addClass('myplaces-' + shape);
                link.append(linkIcon);
                link.append(name);
                link.bind('click', function () {
                    me._showPlace(data.geometry, data.categoryId);
                    return false;
                });
                return link;
            };
            panel.grid.setColumnValueRenderer('name', nameRenderer);
            // set up the link from edit field
            var editRenderer = function (name, data) {
                var link = me.linkTemplate.clone();
                link.append(name);
                link.bind('click', function () {
                    me._editPlace(data);
                    return false;
                });
                return link;
            };
            panel.grid.setColumnValueRenderer('edit', editRenderer);
            // set up the link from edit field
            var deleteRenderer = function (name, data) {
                var link = me.linkTemplate.clone();
                link.append(name);
                link.bind('click', function () {
                    me._deletePlace(data);
                    return false;
                });
                return link;
            };
            panel.grid.setColumnValueRenderer('delete', deleteRenderer);
            // setup localization
            var i,
                key;
            for (i = 0; i < visibleFields.length; ++i) {
                key = visibleFields[i];
                panel.grid.setColumnUIName(key, me.loc('tab.grid.' + key));
            }
            return panel;
        },
        /**
         * @method _populatePlaces
         * Populates given categorys grid
         * @param {Number} categoryId id for category to populate
         */
        _populatePlaces: function (categoryId) {
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService'),
                places = service.getPlacesInCategory(categoryId), //service.getAllMyPlaces(),
                panel = this.tabPanels[categoryId];
            // update places
            var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            gridModel.setIdField('id');
            panel.grid.setDataModel(gridModel);
            if (!places){
                return;
            }
            for (var i = 0; i < places.length; ++i) {
                var mapmodule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule'),
                    geometry = places[i].getGeometry(),
                    drawMode = this._getDrawModeFromGeometry(geometry),
                    measurement = mapmodule.getMeasurementResult(geometry),
                    formatedMeasurement = mapmodule.formatMeasurementResult(measurement, drawMode);
                gridModel.addData({
                    'id': places[i].getId(),
                    'name': places[i].getName(),
                    'desc': places[i].getDescription(),
                    'attentionText': places[i].getAttentionText(),
                    'geometry': geometry,
                    'categoryId': places[i].getCategoryId(),
                    'edit': this.loc('tab.edit'),
                    'delete': this.loc('tab.delete'),
                    'createDate': this._formatDate(service, places[i].getCreateDate()),
                    'updateDate': this._formatDate(service, places[i].getUpdateDate()),
                    'measurement': formatedMeasurement
                });
            }
        },
        /**
         * @method _formatDate
         * Formats timestamp for UI
         * @return {String}
         */
        _formatDate: function (service, date) {
            var time = service.parseDate(date),
                value = '';
            if (time.length > 0) {
                value = time[0];
            }
            return value;
        },
        /**
         * @method _removeObsoleteCategories
         * Removes tabs for categories that have been removed
         */
        _removeObsoleteCategories: function () {
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService'),
                categoryId,
                category;
            for (var key in this.tabPanels) {                
                if (this.tabPanels.hasOwnProperty(key)) {
                    categoryId = parseInt(key);
                    category = service.findCategory(parseInt(categoryId));
                    if (!category) {
                        // removed
                        this.tabsContainer.removePanel(this.tabPanels[categoryId]);
                        this.tabPanels[categoryId].grid = undefined;
                        delete this.tabPanels[categoryId].grid;
                        this.tabPanels[categoryId] = undefined;
                        delete this.tabPanels[categoryId];
                    }
                }
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event an Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },
        /**
         * @method bindEvents
         * Register tab as eventlistener
         */
        bindEvents: function () {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                p;
            // faking to be module with getName/onEvent methods
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

        },
        /**
         * @method unbindEvents
         * Unregister tab as eventlistener
         */
        unbindEvents: function () {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                p;
            // faking to be module with getName/onEvent methods
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
        },

        _informOfMaxFeatures: function(container) {
            var alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');
            alert.insertTo(container);
            alert.setContent(this.loc('tab.maxFeaturesExceeded'));
        },
        /**
         * Expand bounds, if bounds area is zero
         * @param gbounds Object geometry bounds
         * @returns {*}  expanded bounds or as is
         * @private
         * TODO: maybe config for expansion frame size
         */
        _fitBounds: function (gbounds) {

            if (gbounds.bottom === gbounds.top &&
                gbounds.left === gbounds.right)
            {
                gbounds.bottom = gbounds.bottom - 100;
                gbounds.left = gbounds.left - 100;
                gbounds.top = gbounds.top + 100;
                gbounds.right = gbounds.right + 100;
            }

            return gbounds;
        }
    });
