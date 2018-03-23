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
            // TODO do not load all places at startup, load when category is selected
            // me.tabsContainer.addTabChangeListener(function(prevTab, newTab){
            //    newTab.handleSelection(true);
            // });
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
                var me = this;
                var sandbox = me.instance.sandbox;
                var service = sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService');
                var editReqBuilder = Oskari.requestBuilder('MyPlaces.EditCategoryRequest');
                var deleteReqBuilder = Oskari.requestBuilder('MyPlaces.DeleteCategoryRequest');
                var categories = service.getAllCategories();
                categories.forEach(function (cat) {
                    var id = cat.getId();
                    var panel = me.tabPanels[id];
                    if (!panel) {
                        panel = me._createCategoryTab(cat);
                        me.tabsContainer.addPanel(panel);
                        me.tabPanels[id] = panel;
                    } else {
                        // lets set a name for the panel
                        panel.setTitle(cat.name);
                        // update panel graphics
                        me.tabsContainer.updatePanel(panel);
                    }
                    // update places
                    me._populatePlaces(id);
                    panel.getContainer().empty();
                    panel.grid.renderTo(panel.getContainer());

                    var editLink = me.linkTemplate.clone();
                    editLink.addClass('categoryOp');
                    editLink.addClass('edit');
                    editLink.append(me.loc('tab.editCategory'));
                    editLink.on('click', function () {
                        sandbox.request(me.instance, editReqBuilder(id));
                        return false;
                    });
                    panel.getContainer().append(editLink);

                    var deleteLink = me.linkTemplate.clone();
                    deleteLink.addClass('categoryOp');
                    deleteLink.addClass('delete');
                    deleteLink.append(me.loc('tab.deleteCategory'));
                    deleteLink.on('click', function () {
                        sandbox.request(me.instance, deleteReqBuilder(id));
                        return false;
                    });
                    panel.getContainer().append(deleteLink);
                });
                this._removeObsoleteCategories();

                var places = service.getAllMyPlaces();
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
            var me = this;
            var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
            var center = mapModule.getCentroidFromGeoJSON(geometry);
            var bounds = me._fitBounds(mapModule.getBoundsFromGeoJSON(geometry));
            var mapmoveRequest = Oskari.requestBuilder('MapMoveRequest')(center.x, center.y, bounds);
            this.instance.sandbox.request(this.instance, mapmoveRequest);
            // add the myplaces layer to map
            var layerId = 'myplaces_' + categoryId;
            var layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                var request = Oskari.requestBuilder('AddMapLayerRequest')(layerId, true);
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
            var me = this;
            var sandbox = this.instance.sandbox;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
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
            var cancelBtn = dialog.createCloseButton(me.loc('tab.notification.delete.btnCancel'));
            var confirmMsg = me.loc('tab.notification.delete.confirm', {name: data.name});
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
        // TODO move to more common place
        _getDrawModeFromGeometry: function (geometry) {
            if (geometry === null) {
                return null;
            }
            var type = geometry.type;
            if (type === 'MultiPoint' || type === 'Point') {
                return 'point';
            } else if (type === 'MultiLineString' || type === 'LineString') {
                return 'line';
            } else if (type === 'MultiPolygon' || type === 'Polygon') {
                return 'area';
            }
            return null;
        },
        /**
         * @method _createCategoryTab
         * Populates given categorys grid
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory} category category to populate
         * @private
         */
        _createCategoryTab: function (category) {
            var me = this;
            var id = category.getId();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setId(me.instance.idPrefix + '-category-' + id);
            panel.setTitle(category.getName());
            // TODO do not load all places at startup, load when category is selected
            /* var selectionHandler = function (selected) {
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
            // setup localization
            visibleFields.forEach(function (field) {
                panel.grid.setColumnUIName(field, me.loc('tab.grid.' + field));
            });
            // set up the link from name field
            panel.grid.setColumnValueRenderer('name', function (name, data) {
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
            });
            // set up the link from edit field
            panel.grid.setColumnValueRenderer('edit', function (name, data) {
                var link = me.linkTemplate.clone();
                link.append(name);
                link.bind('click', function () {
                    me._editPlace(data);
                    return false;
                });
                return link;
            });
            // set up the link from edit field
            panel.grid.setColumnValueRenderer('delete', function (name, data) {
                var link = me.linkTemplate.clone();
                link.append(name);
                link.bind('click', function () {
                    me._deletePlace(data);
                    return false;
                });
                return link;
            });
            return panel;
        },
        /**
         * @method _populatePlaces
         * Populates given categorys grid
         * @param {Number} categoryId id for category to populate
         */
        _populatePlaces: function (categoryId) {
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService');
            var panel = this.tabPanels[categoryId];
            // update places
            var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            gridModel.setIdField('id');
            panel.grid.setDataModel(gridModel);

            var places = service.getPlacesInCategory(categoryId); // service.getAllMyPlaces(),
            if (!places) {
                return;
            }
            for (var i = 0; i < places.length; ++i) {
                var mapmodule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
                var geometry = places[i].getGeometry();
                var drawMode = this._getDrawModeFromGeometry(geometry);
                var measurement = mapmodule.getMeasurementResult(geometry);
                var formatedMeasurement = mapmodule.formatMeasurementResult(measurement, drawMode);
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
            // returns an array with date on first index and time on the second when available
            var time = service.parseDate(date);
            if (time.length > 0) {
                return time[0];
            }
            return '';
        },
        /**
         * @method _removeObsoleteCategories
         * Removes tabs for categories that have been removed
         */
        _removeObsoleteCategories: function () {
            var me = this;
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService');
            var panels = this.tabPanels;
            Object.keys(panels).forEach(function (catId) {
                var id = parseInt(catId);
                var category = service.findCategory(id);
                if (category) {
                    return;
                }

                // category has been removed -> clean up the UI
                me.tabsContainer.removePanel(panels[id]);
                panels[id].grid = undefined;
                delete panels[id].grid;
                panels[id] = undefined;
                delete panels[id];
            });
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
            var me = this;
            var sandbox = this.instance.getSandbox();
            // faking to be module with getName/onEvent methods
            Object.keys(this.eventHandlers).forEach(function (eventName) {
                sandbox.registerForEventByName(me, eventName);
            });
        },
        /**
         * @method unbindEvents
         * Unregister tab as eventlistener
         */
        unbindEvents: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            // faking to be module with getName/onEvent methods
            Object.keys(this.eventHandlers).forEach(function (eventName) {
                sandbox.unregisterFromEventByName(me, eventName);
            });
        },

        _informOfMaxFeatures: function (container) {
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
            if (gbounds.bottom === gbounds.top && gbounds.left === gbounds.right) {
                gbounds.bottom = gbounds.bottom - 100;
                gbounds.left = gbounds.left - 100;
                gbounds.top = gbounds.top + 100;
                gbounds.right = gbounds.right + 100;
            }

            return gbounds;
        }
    });
