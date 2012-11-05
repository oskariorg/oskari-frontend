/**
 * @class Oskari.mapframework.bundle.myplaces2.CategoryHandler
 * 
 * Handles category related functionality for my places (map layers etc)
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.CategoryHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    // init layers from link (for printing) on initial load
    this.initialLoad = true;
    this.validateTool = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
}, {
    __name : 'MyPlacesCategoryHandler',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;
        
        var sandbox = this.instance.sandbox;
        var user = sandbox.getUser();
        
        if(user.isLoggedIn()) {
            sandbox.register(me);
            for(p in me.eventHandlers) {
                sandbox.registerForEventByName(me, p);
            }
        }
    },
        
    /**
     * @method stop
     * implements Module protocol stop method
     */
    stop : function() {
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method MyPlaces.MyPlacesChangedEvent
         * Checks if categories have been changed and updates corresponding maplayers accordingly
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
            this._handlePlacesChanged();
        }
    },
    /**
     * @method _handlePlacesChanged
     * Called when a place or category is added, updated or deleted (and on initial load)
     */
    _handlePlacesChanged : function() {
        var sandbox = this.instance.sandbox;
        // check map layers for categorychanges
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        var categories = this.instance.getService().getAllCategories();
        
        var mapLayers = mapLayerService.getAllLayersByMetaType(this.instance.idPrefix);
        
        // check for removal
        for(var i = 0; i < mapLayers.length; ++i) {
            var layer = mapLayers[i];
            var found = false;
            for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
                var cat = categories[catIdx];
                if(this._getMapLayerId(cat.getId()) === layer.getId()) {
                    found = true;
                }
            }
            // remove map layer if the category is no longer available
            if(!found) {
                // remove maplayer from selected
                // TODO: do we need to check if the layer is selected or just send this out every time?
                sandbox.requestByName(this.getName(), "RemoveMapLayerRequest", [layer.getId()]);
                // remove maplayer from all layers
                mapLayerService.removeLayer(layer.getId());
                
                // remove grid tab for category
                //var catID = layer.getId().substring(this.instance.idPrefix.length + 1);
                //this.uiItems.gridPanel.removeCategory(catID);
            }
        }
        
        // check for update or add
        for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
            var cat = categories[catIdx];
            var found = false;
            for(var i = 0; i < mapLayers.length; ++i) {
                if(this._getMapLayerId(cat.getId()) === mapLayers[i].getId()) {
                    // found matching maplayer
                    found = true;
                    // check name change
                    if(cat.getName() !== mapLayers[i].getName()) {
                        var layerConf = {
                            name: cat.getName()
                        };
                        // update maplayer name if category name has changed
                        mapLayerService.updateLayer(mapLayers[i].getId(), layerConf);
                    }
                }
            }
            if(!found) {
                // add maplayer
                var json = this._getMapLayerJson(cat);
                var myplacesLayer = mapLayerService.createMapLayer(json);
                mapLayerService.addLayer(myplacesLayer);
            }
            //this.uiItems.gridPanel.addOrUpdateCategory(cat);
        }
        
        if(this.initialLoad) {
            // add the myplaces layers programmatically since normal link processing 
            // cant do this (run before the bundle adds the layers)
            this._processStartupLinkLayers(sandbox);
            // done here because layers aren't added to the service before this
            this.initialLoad = false;
        
            // preselect the first category
            //this.uiItems.gridPanel.showCategory();
        }
    },
    /**
     * @method addLayerToMap
     * Adds the my places map layer to selected if it is not there already
     */
    addLayerToMap : function(categoryId) {
        var layerId = this._getMapLayerId(categoryId);
        var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
            var request = this.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
            // FIXME: not a registered module so this should fail?
            this.sandbox.request(this.getName(), request);
        }
    },
    /**
     * @method addLayerToService
     * Adds the my places map layer service
     */
    addLayerToService : function(category) {
        // add maplayer to Oskari
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var json = this._getMapLayerJson(category);
        var myplacesLayer = mapLayerService.createMapLayer(json);
        mapLayerService.addLayer(myplacesLayer);
    },
    _getMapLayerId : function(categoryId) {
        if(!categoryId) {
            // default to default category id(?)
            var defCat = this.myPlacesService.getDefaultCategory();
            if(defCat) {
                
                categoryId = defCat.getId();
            }
            else {
                categoryId = '-99';
            }
        }
        return this.instance.idPrefix + '_' + categoryId;
    },
    /**
     * @method _getMapLayerJson
     * Populates the category based data to the base maplayer json
     * @private 
     * @return maplayer json for the category
     */
    _getMapLayerJson : function(categoryModel) {
        var baseJson = this._getMapLayerJsonBase();
        baseJson.wmsUrl = this.instance.conf.wmsUrl + categoryModel.getId() + "&";
        //baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + categoryModel.getId() + "&";
        baseJson.name = categoryModel.getName();
        baseJson.id = this._getMapLayerId(categoryModel.getId());
        if(categoryModel.isPublic()) {
            baseJson.permissions = {
                "publish" : "publication_permission_ok" 
            }
        }
        else {
            baseJson.permissions = {
                "publish" : "no_publication_permission"
            }
        }
        return baseJson;
    },
    /**
     * @method _getMapLayerJsonBase
     * Returns a base model for maplayer json to create my places map layer
     * @private 
     * @return {Object}
     */
    _getMapLayerJsonBase : function() {
        var catLoc = this.instance.getLocalization('category');
        var json = {
            wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            type: "wmslayer",
            baseLayerId:-1,
            legendImage:"",
      //      gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:true,
            minScale:12000000,
            opacity: 50,
            metaType: this.instance.idPrefix,
            orgName: catLoc.organization,
            inspire: catLoc.inspire,
            maxScale:1
        };
        return json;
    },
    /**
     * 
     */
    _processStartupLinkLayers: function(sandbox) {
        var mapLayers = sandbox.getRequestParameter('mapLayers');
        
        if(mapLayers === null || mapLayers === "") {
            // no linked layers
            return;
        }
        var layerStrings = mapLayers.split(",");
        var keepLayersOrder = true;

        for(var i = 0; i < layerStrings.length; i++) {
            var splitted = layerStrings[i].split("+");
            var layerId = splitted[0];
            var opacity = splitted[1];
            //var style = splitted[2];
            if(layerId !== null && layerId.indexOf(this.instance.idPrefix) !== -1) {
                var rb = null;
                var r = null;
                rb = sandbox.getRequestBuilder('AddMapLayerRequest');
                r = rb(layerId, keepLayersOrder);
                sandbox.request(this.getName(), r);
                rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                r = rb(layerId, opacity);
                sandbox.request(this.getName(), r);
            } 
        }
    },
    
    editCategory : function(category) {
        var me = this;
        
        this.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        var form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.CategoryForm', me.instance);
        var values = {
            name : category.getName(),
            id : category.getId(),
            dot : {
                size : category.getDotSize(),
                color : category.getDotColor()
            },
            line : {
                size : category.getLineWidth(),
                color : category.getLineColor()
            },
            area : {
                size : category.getAreaLineWidth(),
                lineColor : category.getAreaLineColor(),
                fillColor : category.getAreaFillColor()
            }
        };
        
        form.setValues(values);
        var content = form.getForm();
        
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	
        var buttons = [];
    	var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        var btnLoc = this.instance.getLocalization('buttons');
        var catLoc = this.instance.getLocalization('categoryform').edit;
    	saveBtn.setTitle(btnLoc.save);
    	saveBtn.addClass('primary');
    	saveBtn.setHandler(function() {
            var values = form.getValues();
            var errors = me.validateCategoryFormValues(values);
            if(errors.length != 0) {
                me.showValidationErrorMessage(errors);
                return;
            }
            var category = me.getCategoryFromFormValues(values);
            me.saveCategory(category);
            
            dialog.close();
            me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
        });
    	var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	cancelBtn.setTitle(btnLoc.cancel);
    	cancelBtn.setHandler(function() {
            dialog.close();
    	});
        buttons.push(cancelBtn);
        buttons.push(saveBtn);
        
    	dialog.show(catLoc.title, content, buttons);
    	dialog.moveTo('div.personaldata ul li select', 'right');
    	dialog.makeModal();
    },
    showValidationErrorMessage : function(errors) {
        var loc = this.instance.getLocalization();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(loc.buttons.ok);
    	okBtn.addClass('primary');
    	okBtn.setHandler(function() {
            dialog.close(true);
    	});
    	var content = jQuery('<ul></ul>');
    	for(var i = 0 ; i < errors.length; ++i) {
    		var row = jQuery('<li></li>');
    		row.append(errors[i]['error'])
    		content.append(row);
    	}
    	dialog.show(loc.validation.title, content, [okBtn]);
    },
    /**
     * @method _showMessage
     * Shows user a message with ok button
     * @private
     * @param {String} title popup title
     * @param {String} message popup message
     */
    _showMessage : function(title, message) {
        var loc = this.instance.getLocalization();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(loc.buttons.ok);
        okBtn.addClass('primary');
        okBtn.setHandler(function() {
            dialog.close(true);
        });
        dialog.show(title, message, [okBtn]);
    },
    /**
     * @method hasIllegalChars
     * Checks value for problematic characters
     * @return {Boolean} true if value has illegal characters 
     */
    hasIllegalChars : function(value) {
        this.validateTool.setValue(value);
        return !this.validateTool.checkValue();
    },
    /**
     * @method _validateNumber
     * Checks value for number and number range
     * @return {Boolean} true if value is ok 
     * @private
     */
    _validateNumber : function(value, min, max) {
        return this.validateTool.validateNumberRange(value, min, max);
    },
    /**
     * @method _isColor
     * Checks value for a hex color
     * @return {Boolean} true if ok, false -> not a color
     * @private
     */
    _isColor : function(value) {
        return this.validateTool.validateHexColor(value);
    },
    validateCategoryFormValues : function(values) {
        var errors = [];
        if(!values) {
            return errors;
        }
        var loc = this.instance.getLocalization('validation');
        
        if(!values.name) {
            errors.push({field : 'name', error : loc.categoryName});
        }
        else if(this.hasIllegalChars(values.name)) {
            errors.push({field : 'name', error : loc.categoryNameIllegal});
        }
        
        if(!this._validateNumber(values.dot.size, 1, 50)) {
            errors.push({field : 'dotSize', error : loc.dotSize});
        }
        if(!this._isColor(values.dot.color)) {
            errors.push({field : 'dotColor', error : loc.dotColor});
        }
        if(!this._validateNumber(values.line.size, 1, 50)) {
            errors.push({field : 'lineSize', error : loc.lineSize});
        }
        if(!this._isColor(values.line.color)) {
            errors.push({field : 'lineColor', error : loc.lineColor});
        }
        if(!this._validateNumber(values.area.size, 0, 50)) {
            errors.push({field : 'areaLineSize', error : loc.areaLineSize});
        }
        if(!this._isColor(values.area.lineColor)) {
            errors.push({field : 'areaLineColor', error : loc.areaLineColor});
        }
        if(!this._isColor(values.area.fillColor)) {
            errors.push({field : 'areaFillColor', error : loc.areaFillColor});
        }
        return errors;
    },
    getCategoryFromFormValues : function(values) {
        var category = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
        category.setName(values.name);
        category.setId(values.id);
        
        category.setDotSize(values.dot.size);
        category.setDotColor(values.dot.color);
        
        category.setLineWidth(values.line.size);
        category.setLineColor(values.line.color);
        
        category.setAreaLineWidth(values.area.size);
        category.setAreaLineColor(values.area.lineColor);
        category.setAreaFillColor(values.area.fillColor);
        return category;
    },
    saveCategory : function(category) {
        var me = this;
        var loc = me.instance.getLocalization('notification');
        var serviceCallback = function(blnSuccess, model, blnNew) {
            if (blnSuccess) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show(loc.categorySaved.title, loc.categorySaved.message);
                dialog.fadeout();
                // refresh map layer on map -> send update request
                var layerId = me._getMapLayerId(category.getId());
                var request = me.instance.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
                me.instance.sandbox.request(me, request);
            } else {
                // blnNew should always be true since we are adding a category
                if (blnNew) {
                	me.instance.showMessage(loc['error'].title, loc['error'].addCategory);
                } else {
                	me.instance.showMessage(loc['error'].title, loc['error'].editCategory);
                }
            }
        }
        this.instance.getService().saveCategory(category, serviceCallback);
    },
    /**
     * @method confirmDeleteCategory
     * Shows a confirmation dialog with buttons to continue. 
     * If category has places -> asks if they will be moved to default category or deleted
     * If category is empty -> only has delete and cancel
     * The message will also be different for both cases.
     */
    confirmDeleteCategory : function(category) {
        var me = this;
        var btnLoc = me.instance.getLocalization('buttons');
        var service = this.instance.getService();
        var defaultCategory = service.getDefaultCategory();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        if(defaultCategory.getId() == category.getId()) {
        	// cannot delete default category
        	var loc = me.instance.getLocalization();
			var okBtn = dialog.createCloseButton(loc.buttons.ok);
    		dialog.show(loc.notification.error.title, loc.notification.error.deleteDefault, [okBtn]);
        	return;
        }
        var places = service.getPlacesInCategory(category.getId());
        
    	var buttons = [];
    	
    	var cancelBtn = dialog.createCloseButton(btnLoc.cancel);
    	buttons.push(cancelBtn);
    	
        var loc = me.instance.getLocalization('notification');
    	var content = '';
    	if(places.length > 0) {
	    	
	    	var deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
	    	deleteBtn.setTitle(btnLoc.deleteCategoryAndPlaces);
	    	deleteBtn.setHandler(function() {
				dialog.close();
            	// delete category and each place in it
                me._deleteCategory(category, false);
	    	});    
	    	buttons.push(deleteBtn);		
	    	
	    	var moveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
	    	moveBtn.setTitle(btnLoc.movePlaces);
	    	moveBtn.addClass('primary');
	    	moveBtn.setHandler(function() {
				dialog.close();
        		// move the places in the category to default category
                me._deleteCategory(category, true); 
	    	});     
	    	buttons.push(moveBtn);		
	    	var locParams = [category.getName(), places.length, defaultCategory.getName()];
	    	content = this._formatMessage(loc.categoryDelete.deleteConfirmMove, locParams);
    	}    	
    	else {
    		
	    	var deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
	    	deleteBtn.setTitle(btnLoc.deleteCategory);
	    	deleteBtn.addClass('primary');
	    	buttons.push(deleteBtn);
	    	deleteBtn.setHandler(function() {
				dialog.close();
            	// delete category and each place in it (none since there aren't any places there')
                me._deleteCategory(category, false);
	    	});
	    	
	    	content = this._formatMessage(loc.categoryDelete.deleteConfirm, [category.getName()]);
    	}
        
    	dialog.show(loc.categoryDelete.title, content, buttons);
    	dialog.makeModal();        
    },
	/**
	 *@method _formatMessage
	 * Formats given message with the given params array values
	 * Example:  _formatMessage("Hello {0}!", ["World"]);
	 * @param msg message to be formatted
	 * @param params array of params that has values for {arrayIndex} in param msg
     * @private
	 */
    _formatMessage : function(msg, params) {
        var formatted = msg;
        for(var i = 0; i < params.length; ++i) {
            formatted = formatted.replace("{" + i + "}", params[i]);
        }
        return formatted;
    },
    
    /**
     * @method _deleteCategory
     * Internal method start actual category delete after confirm
     * @private
     */
    _deleteCategory : function(category, movePlaces) {
        var me = this;
        var catId = category.getId();
        // wrap callback to get it into the scope we want
        var callBackWrapper = function(success) {
            me._deleteCategoryCallback(success, movePlaces, catId);
        };
        var service = this.instance.getService();
		service.deleteCategory(catId, movePlaces, callBackWrapper);
    },
    /**
     * @method _deleteCategoryCallback
     * Internal method to handle server response for category delete
     * @private
     */
    _deleteCategoryCallback : function(success, movePlaces, categoryId) {
		var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var service = this.instance.getService();
        var me = this;
        if(success) {
            if(movePlaces) {
            	// places moved to default category -> update it
    			var defCat = service.getDefaultCategory();
    			var layerId = this._getMapLayerId(defCat.getId());
		        var request = this.instance.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
		        this.instance.sandbox.request(this, request);
            }
            // NOTE OK 
        	var loc = me.instance.getLocalization();
    		dialog.show(loc.notification.categoryDelete.title, loc.notification.categoryDelete.deleted);
    		dialog.fadeout();
        }
        else {
        	// error handling
        	var loc = me.instance.getLocalization();
			var okBtn = dialog.createCloseButton(btnLoc.buttons.ok);
    		dialog.show(loc.notification.error.title, loc.notification.error.deleteCategory, [okBtn]);
        }
    },
    confirmPublishCategory : function(category, makePublic) {
        var me = this;
        var loc = me.instance.getLocalization();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var service = this.instance.getService();
        var buttons = [];
        
        var cancelBtn = dialog.createCloseButton(loc.buttons.cancel);
        buttons.push(cancelBtn);
        
        var operationalBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        operationalBtn.addClass('primary');
        operationalBtn.setHandler(function() {
            service.publishCategory(category.getId(), makePublic, function(wasSuccess) {
                me._handlePublishCategory(category, makePublic, wasSuccess);
            });
            dialog.close();
        });
        buttons.push(operationalBtn);        
        var locParams = [category.getName()];

        if(makePublic) {
            operationalBtn.setTitle(loc.buttons.changeToPublic);
            var msg = this._formatMessage(loc.notification.categoryToPublic.message, locParams);
            dialog.show(loc.notification.categoryToPublic.title, msg, buttons);
        }
        else {
            operationalBtn.setTitle(loc.buttons.changeToPrivate);
            var msg = this._formatMessage(loc.notification.categoryToPrivate.message, locParams);
            dialog.show(loc.notification.categoryToPrivate.title, msg, buttons);
        }
    },
    
    _handlePublishCategory : function(category, makePublic, wasSuccess) {
        if(!wasSuccess) {
            var loc = this.instance.getLocalization("notification");
            this._showMessage(loc['error'].title, loc['error'].generic);
            return;
        }
        var sandbox = this.instance.sandbox;
        // check map layers for categorychanges
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        var layerId = this._getMapLayerId(category.getId());
        var mapLayer = mapLayerService.findMapLayer(layerId);
        if(!mapLayer) {
            // maplayer not found, this should not be possible
            var loc = this.instance.getLocalization("notification");
            this._showMessage(loc['error'].title, loc['error'].generic);
            return;
        } 
        if(makePublic) {
            mapLayer.addPermission("publish", "publication_permission_ok");
        }
        else {
            mapLayer.addPermission("publish", "no_publication_permission");
        }
        // send an event to notify other bundles of updated permissions
        var event = sandbox.getEventBuilder('MapLayerEvent')(layerId, 'update');
        sandbox.notifyAll(event);
   }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
