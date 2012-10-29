/**
 * @class Oskari.mapframework.bundle.personaldata.MyPlacesTab
 * Renders the "personal data" myplaces tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.MyPlacesTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
 * instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
    this.instance = instance;
    this.loc = localization;
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
    getName : function() {
        return 'PersonalData.MyPlaces';
    },
    getTitle : function() {
        return this.loc.title;
    },
    addTabContent : function(container) {
        var me = this;
        
        this.tabsContainer = 
            Oskari.clazz.create('Oskari.userinterface.component.TabDropdownContainer', 
            this.loc['nocategories']);
        this.tabsContainer.insertTo(container);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method MyPlaces.MyPlacesChangedEvent
         * Updates the category tabs and grids inside them with current data 
         */
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
            var categories = service.getAllCategories();
            var places = service.getAllMyPlaces();
            var me = this;
            var editLinkClosure = function(id) {
                return function() {
                    var request = me.instance.sandbox.getRequestBuilder('MyPlaces.EditCategoryRequest')(id);
                    me.instance.sandbox.request(me.instance, request);
                    return false;
                };
            }
            var deletelinkClosure = function(id) {
                return function() {
                    var request = me.instance.sandbox.getRequestBuilder('MyPlaces.DeleteCategoryRequest')(id);
                    me.instance.sandbox.request(me.instance, request);
                    return false;
                };
            }
            
            for(var i = 0; i < categories.length; ++i) {
                var id = categories[i].getId();
                var panel = this.tabPanels[id];
                if(!panel) {
                    panel = this._createCategoryTab(categories[i]);
                    this.tabsContainer.addPanel(panel);
                    this.tabPanels[id] = panel;
                }
                // update places
                this._populatePlaces(id);
                panel.getContainer().empty();
                panel.grid.renderTo(panel.getContainer());
                
                var editLink = this.linkTemplate.clone();
                editLink.append(this.loc.editCategory);
                editLink.bind('click', editLinkClosure(id));
                panel.getContainer().append(editLink);
                
                var deleteLink = this.linkTemplate.clone();
                deleteLink.append(this.loc.deleteCategory);
                deleteLink.bind('click', deletelinkClosure(id));
                panel.getContainer().append(deleteLink);
            }
            this._removeObsoleteCategories();
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
    _showPlace : function(geometry, categoryId) {
        // center map on selected place
        var center = geometry.getCentroid();
        var mapmoveRequest = this.instance.sandbox.getRequestBuilder('MapMoveRequest')
                        (center.x, center.y, geometry.getBounds(), false); 
        this.instance.sandbox.request(this.instance, mapmoveRequest);
        
        // add the myplaces layer to map
        var layerId = 'myplaces_' + categoryId; 
        var layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
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
    _editPlace : function(data) {
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
    _deletePlace : function(data) {
    	var me = this;
    	var sandbox = this.instance.sandbox;
        var loc = this.loc.notification['delete'];
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(loc.btnDelete);
    	okBtn.addClass('primary');

    	okBtn.setHandler(function() {
			dialog.close();
            var service = sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
            var callback = function(isSuccess) {
            	
            	/* let's refresh map also if there */
            	var categoryId = data.categoryId;
            	var layerId = 'myplaces_' + categoryId; 
        		var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
        		if(layer) {
        			var updateRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')
        			var updateRequest = updateRequestBuilder(layerId, true);
                    sandbox.request(me.instance, updateRequest);    
        		}
            	
                if(isSuccess) {
                    dialog.show(loc.title, loc.success);
                }
                else {
                    dialog.show(loc.title, loc['error']);
                }
                dialog.fadeout();
            };
            service.deleteMyPlace(data.id, callback);
    	});
    	var cancelBtn = dialog.createCloseButton(loc.btnCancel);    
        var confirmMsg = loc.confirm + '"' + data.name + '"' + '?';
    	dialog.show(loc.title, confirmMsg, [cancelBtn, okBtn]);
    	dialog.makeModal();
    },
    /**
     * @method getDrawModeFromGeometry
     * Returns a matching drawmode string-key for the geometry
     * @param geometry openlayers geometry from my place model
     */
    _getDrawModeFromGeometry : function(geometry) {
        var olClass = geometry.CLASS_NAME;
        if('OpenLayers.Geometry.Point' === olClass) {
        	return 'point';
        } 
        else if('OpenLayers.Geometry.LineString' === olClass) {
        	return 'line';
        }
        else if('OpenLayers.Geometry.Polygon' === olClass){
        	return 'area';
        }
        return null;
    },
    /**
     * @method _populatePlaces
     * Populates given categorys grid
     * @param {Number} categoryId id for category to populate
     */
    _createCategoryTab : function(category) {
        var me = this;
        var id = category.getId();
        
        var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        panel.setTitle(category.getName());

        panel.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        var visibleFields = ['name', 'desc', 'createDate', 'updateDate', 'edit', 'delete'];
        panel.grid.setVisibleFields(visibleFields);
        // set up the link from name field
        var nameRenderer = function(name, data) {
            var link = me.linkTemplate.clone();
            var linkIcon = me.iconTemplate.clone();
            var shape = me._getDrawModeFromGeometry(data.geometry);
            linkIcon.addClass('myplaces-' + shape);
            link.append(linkIcon);
            
            link.append(name);
            link.bind('click', function() {
                me._showPlace(data.geometry,data.categoryId);
                return false;
            });
            return link;
        };
        panel.grid.setColumnValueRenderer('name', nameRenderer);
        // set up the link from edit field
        var editRenderer = function(name, data) {
            var link = me.linkTemplate.clone();
            link.append(name);
            link.bind('click', function() {
                me._editPlace(data);
                return false;
            });
            return link;
        };
        panel.grid.setColumnValueRenderer('edit', editRenderer);
        // set up the link from edit field
        var deleteRenderer = function(name, data) {
            var link = me.linkTemplate.clone();
            link.append(name);
            link.bind('click', function() {
                me._deletePlace(data);
                return false;
            });
            return link;
        };
        panel.grid.setColumnValueRenderer('delete', deleteRenderer);
        // setup localization
        for(var i=0; i < visibleFields.length; ++i) {
            var key = visibleFields[i];
            panel.grid.setColumnUIName(key, this.loc.grid[key]);
        }
        return panel;
    },
    /**
     * @method _populatePlaces
     * Populates given categorys grid
     * @param {Number} categoryId id for category to populate
     */
    _populatePlaces : function(categoryId) {
        var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
        var places = service.getAllMyPlaces();
        var panel = this.tabPanels[categoryId];
        // update places
        var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        gridModel.setIdField('id');
        panel.grid.setDataModel(gridModel);
        
        for(var i = 0; i < places.length; ++i) {
            // check if this category
            if(places[i].getCategoryID() != categoryId) {
                // skip to next place
                continue;
            }
            gridModel.addData({
                'id': places[i].getId(),
                'name' : places[i].getName(),
                'desc' : places[i].getDescription(),
                'geometry' : places[i].getGeometry(),
                'categoryId' : places[i].getCategoryID(),
                'edit' : this.loc['edit'],
                'delete' : this.loc['delete'],
                'createDate' : this._formatDate(service, places[i].getCreateDate()),
                'updateDate' : this._formatDate(service, places[i].getUpdateDate())
            });
        }
    },
    /**
     * @method _formatDate
     * Formats timestamp for UI
     * @return {String}
     */
    _formatDate : function(service, date) {
        var time = service.parseDate(date);
        var value = '';
        if(time.length > 0) {
            value = time[0];
        }
        // skip time
        /*if(time.length > 1) {
            value = value  + ' ' + time[1];
        }*/
        return value;
    },
    /**
     * @method _removeObsoleteCategories
     * Removes tabs for categories that have been removed
     */
    _removeObsoleteCategories : function() {
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
        
            for(var categoryId in this.tabPanels) {
                var category = service.findCategory(categoryId);
                if(!category) {
                    // removed
                    this.tabsContainer.removePanel(this.tabPanels[categoryId]);
                    this.tabPanels[categoryId].grid = undefined;
                    delete this.tabPanels[categoryId].grid;
                    this.tabPanels[categoryId] = undefined;
                    delete this.tabPanels[categoryId];
                }
            }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler)
            return;

        return handler.apply(this, [event]);

    },
    /**
     * @method bindEvents
     * Register tab as eventlistener
     */
    bindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

    },
    /**
     * @method unbindEvents
     * Unregister tab as eventlistener
     */
    unbindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.unregisterForEventByName(this, p);
        }
    }
});
