/**
 * @class Oskari.mapframework.ui.module.myplaces.MyPlacesModule
 * 
 * Represents the values of the map implementation (openlayers)
 * Map module updates this domain object before sending out MapMoveEvents  
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.myplaces.MyPlacesModule',

/** 
 * @method constructor
 * @static
 * @param {Object} config
 * 					JSON model with initial values
 */ 
function(config) {
    this._sandbox = null;
    this.uiItems = {};
    this._config = config;
    this.myPlacesService = null;
    // used to disable handling hover and click events from map while editing
    this.disableMapEvents = false;
    // init layers from link (for printing) on initial load
    this.initialLoad = true;
    // actual id is set from layer json
    this.selectedMyPlace = null;
    this.localization = {};
    this.defaults = {};
    this.defaults.dotColor = '993300';
    this.defaults.lineColor = '993300';
    this.defaults.fillColor = '993300';
    this.defaults.lineWidth = "1";
    this.defaults.dotSize = "4";
    this.defaults.categoryName = "Omat paikat"; // localization done in this._populateLanguageSet()


}, {
    __name : "MyPlacesModule",
    getName : function() {
        return this.__name;
    },
    /**
     * @method setDisableMapEvents
     * Click events for place selection cannot be handled correctly while editing a geometry.
     * We must disable handling while editing using this method.
     * @param boolean true if clicks and hover is not handled
     */
    setDisableMapEvents : function(blnParam) {
    	// safety check to keep it boolean
		this.disableMapEvents = (blnParam === true);
    },
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        var me = this;
        sandbox.printDebug("Initializing my places module...");
        
        this._populateLanguageSet(sandbox);

        var user = sandbox.getUser();
        if(user.isLoggedIn()) {
        	// override userkey
        	me._config.userKey = user.getUuid(); 
        	// update default category name to have the users name in it 
        	this.defaults.categoryName = this.defaults.categoryName + ' - ' + user.getName();
        }

        // register plugin for map (drawing for my places)
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.myplaces.mapmodule.DrawPlugin');
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
        
        // register plugin for map (hover tooltip for my places)
        var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.myplaces.mapmodule.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;

        // create MyPlacesService
        this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.service.MyPlacesService', {
            sandbox : sandbox,
            user : me._config.userKey,
            url : me._config.actionUrl,
            defaults : me.defaults
        });
        
        // register for listening events
        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        // create UI
        // grid panel for listing places, added in start
        var gridPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGridPanel', {
        	id: 'myplaces-gridpanel',
            oskariConfig : {
                module : me,
                sandbox : sandbox,
                service : me.myPlacesService,
                localizationSet : me.localization
            }
        });
        this.uiItems.gridPanel = gridPanel;

		// accordion panel 
        var mainPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesMainPanel', {
        	id: 'myplaces-mainpanel',
            oskariConfig : {
                module : me,
                sandbox : sandbox,
                localizationSet : me.localization
            }
        });
        this.uiItems.mainPanel = mainPanel;

        // my places dialog
        this.wizardPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
            oskariConfig : {
                service : me.myPlacesService,
                sandbox : me._sandbox,
                localizationSet : me.localization,
                module : me
            }
        });
        
        return mainPanel;
    },
    /**
     * @method _populateLanguageSet
     * Internal method to se localization strings
     */
    _populateLanguageSet : function(sandbox) {
        
		var lang =  sandbox.getLanguage();
		var locale = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces.ui.module.Locale',lang); // Create this once during startup
        this.localization = locale.getCurrentLocale();
		
		// special handling for defaults localization
		if('en' === lang) {
			this.defaults.categoryName = "My places";
		}
		else if('sv' === lang) {
			this.defaults.categoryName = "Mina platser";
		}
		
		if(!this.localization) {
			// default to fin if unknown localization
			this.localization = locale.getLocale('fi');
		}
    },
    
    /**
     * @method saveMyPlaceGeometry
     * Gets the geometry from drawplugin -> updates geometry on currently selected place.
     * Saves the currently selected place. If no place is selected, does nothing.
     */
    saveMyPlaceGeometry : function() {
        if(!this.selectedMyPlace) {
        	return;
        }
        var me = this;
            
    	// get current geometry from plugin and save
    	var getGeometryCallbackWrapper = function(pGeometry) {
        	me.uiItems.mainPanel.setLoading(me.localization.savemask);
        	me.selectedMyPlace.set('geometry', pGeometry);
        	
            var saveCallBackWrapper = function(success) {
                me._saveMyPlaceGeometryCallback(success);
            };
	        me.myPlacesService.saveMyPlace(me.selectedMyPlace, saveCallBackWrapper);
    		//me.myPlaceFinished(me.selectedMyPlace);
    	};
    	
        var request = this._sandbox.getRequestBuilder('MyPlaces.GetGeometryRequest')(getGeometryCallbackWrapper);
        this._sandbox.request(this.getName(), request);
        
    },
    /**
     * @method _saveMyPlaceGeometryCallback
     * Internal method to handle server response from save geometry.
     */
    _saveMyPlaceGeometryCallback : function(success) {
        var me = this;
    	// remove load mask
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            //this.uiItems.gridPanel.placesChanged();
	        
	        var layerId = this.getMapLayerId();
	        // send update request
	        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
	        this._sandbox.request(this.getName(), request);
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorSave);
        	// console.dir(myPlaceModel);
        }
    },
   
    /**
     * @method myPlaceFinished
     * Saves the place given as parameter
     * @param myPlace model to be saved
     */
    myPlaceFinished : function(myPlaceModel, oldCategoryId) {
        var me = this;
        // saving
        if(myPlaceModel) {
            // add load mask
            if(this.wizardPanel) {
            	this.wizardPanel.setLoading(this.localization.savemask);
            }
			
            // wrap callback to get it into the scope we want
            var callBackWrapper = function(success, pMyPlaceModel, isNew) {
                me._commitMyPlaceCallback(success, myPlaceModel, isNew, oldCategoryId);
            };
            this.myPlacesService.saveMyPlace(myPlaceModel, callBackWrapper);
        } else {
            // canceled
            this.cleanupAfterMyPlaceOperation();
        }
    },

    /**
     * @method _commitMyPlaceCallback
     * Internal method to handle server response from save my place model.
     * alerts on error and resets the functionality to start state on success
     */
    _commitMyPlaceCallback : function(success, myPlaceModel, isNew, oldCategoryId) {
        var me = this;
    	// remove load masks
    	if(this.wizardPanel) {
    		this.wizardPanel.setLoading(false);
    	}
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            //this.uiItems.gridPanel.placesChanged();
	        this.cleanupAfterMyPlaceOperation();
	        
        	var newCategoryId = myPlaceModel.get('categoryID');
        	// change tab in grid
			this.uiItems.gridPanel.showCategory(newCategoryId);
	        // send update request for places category maplayer
	        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(this.getMapLayerId(newCategoryId), true);
	        this._sandbox.request(this.getName(), request);
        	if(oldCategoryId !== newCategoryId) {
        		// category changed -> update old layer also
		        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(this.getMapLayerId(oldCategoryId), true);
		        this._sandbox.request(this.getName(), request);
        	}
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorSave);
        	// console.dir(myPlaceModel);
        }
    },
    /**
     * @method cleanupAfterMyPlaceOperation
     * Clean up after save or cancel/resets the functionality to start state
     */
    cleanupAfterMyPlaceOperation : function() {
        // tell everything to reset selected place
        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
        this._sandbox.notifyAll(event);
        // tell plugin to disable draw
        this.uiItems.mainPanel.sendStopDrawRequest();
    	this.closeWizard();
    },
    /**
     * @method startWizard
     * Starts the my place dialog.
     * Populates dialog if a place is selected.
     */
    startWizard : function() {
        var me = this;
        if(this.wizardPanel && this.wizardPanel.isVisible()) {
        	this.closeWizard();
        }
        // extjs seems to explode if we try to reuse the dialog so just create a new one and be happy
        this.wizardPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
            oskariConfig : {
                service : me.myPlacesService,
                sandbox : me._sandbox,
                localizationSet : me.localization,
                module : me
            }
        });
        var selCategory = this.uiItems.gridPanel.getSelectedCategory();
        if(selCategory) {
        	this.wizardPanel.setSelectedCategory(selCategory.get('id'))
        }
        this.wizardPanel.show();
        if(this.selectedMyPlace) {
	    	this.wizardPanel.setPlace(this.selectedMyPlace);
        }
    },
    /**
     * @method closeWizard
     * Closes the my place dialog.
     */
    closeWizard : function() {
    	if(this.wizardPanel) {
	    	this.wizardPanel.hide();
	    	this.wizardPanel.removeAll(true);
	    	this.wizardPanel.destroy();
    		this.wizardPanel = null;
	    }
    },
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
        // add gridPanel to the south panel
        Oskari.$("UI.facade").addUIComponent(this.getName() + '_grid', this.uiItems.gridPanel, 'S');
    },
    stop : function(sandbox) {
        // remove gridPanel that was added on start
        Oskari.$("UI.facade").removeUIComponent(this.getName() + '_grid');
    },
    
    processStartupLinkLayers: function(sandbox) {
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
            if(layerId !== null && layerId.indexOf(this.idPrefix) !== -1) {
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
    
    /**
     * @method getDrawModeFromGeometry
     * Returns a matching drawmode string-key for the geometry
     * @param geometry openlayers geometry from my place model
     */
    getDrawModeFromGeometry : function(geometry) {
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
	 * Formats given message with the given params array values
	 * FIXME: copypasted from language service
	 * @param msg message to be formatter
	 * @param params array of params that has values for {arrayIndex} in param msg
	 */
    formatMessage : function(msg, params) {
        var formatted = msg;
        for(var index in params) {
            formatted = formatted.replace("{" + index + "}", params[index]);
        }
        return formatted;
    },
    /**
     * @method deleteMyPlace
     * Calls service to delete the currently selected my place
     */
    deleteMyPlace : function() {
        
        var me = this;
        if(this.selectedMyPlace) {
            // add load mask
            this.uiItems.mainPanel.setLoading(this.localization.deletemask);

            // wrap callback to get it into the scope we want
            var callBackWrapper = function(success) {
                me._deleteMyPlaceCallback(success);
            };
            this.myPlacesService.deleteMyPlace(this.selectedMyPlace.get('id'), callBackWrapper);
        }
    },
    /**
     * @method _deleteMyPlaceCallback
     * Internal method to handle server response from delete my place model.
     */
    _deleteMyPlaceCallback : function(success) {
        var me = this;
        var catID = this.selectedMyPlace.get('categoryID');
        var layerId = this.getMapLayerId();
    	// remove load mask
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            //this.uiItems.gridPanel.placesChanged();
	        this.cleanupAfterMyPlaceOperation();
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorDelete);
        }
        // send update request
        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
        this._sandbox.request(this.getName(), request);
    },
    /**
     * @method handleFinishedDrawingEvent
     * Handles FinishedDrawingEvent (sent from drawplugin)
     * Starts the wizard if the place is new
     */
    handleFinishedDrawingEvent : function(event) {
    	// TODO: pref just check if a place is selected?
        if(!event.isModification()) {
            // new place, start wizard
            this.startWizard();
        }
    },
    /**
     * @method getSelectedPlace
     * @return the currently selected my place or null if no selected
     */
    getSelectedPlace : function() {
    	return this.selectedMyPlace;
    },
    
    /**
     * @method _handlePlacesChanged
     * Called when a place or category is added, updated or deleted (and on initial load)
     */
    _handlePlacesChanged : function() {
    	
    	// notify grid that data is ready/changed
        //this.uiItems.gridPanel.placesChanged();
        if(this.wizardPanel) {
        	this.wizardPanel.refreshCategories();
        }
        
        
        // check map layers for categorychanges
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        var categories = this.myPlacesService.getAllCategories();
        
        var mapLayers = mapLayerService.getAllLayersByMetaType(this.idPrefix);
        
        // check for removal
        for(var i = 0; i < mapLayers.length; ++i) {
        	var layer = mapLayers[i];
        	var found = false;
        	for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
        		var cat = categories[catIdx];
	    		if(this.getMapLayerId(cat.get('id')) === layer.getId()) {
        			found = true;
        		}
        	}
        	// remove map layer if the category is no longer available
        	if(!found) {
        		// remove maplayer from selected
        		// TODO: do we need to check if the layer is selected or just send this out every time?
                this._sandbox.requestByName(this.getName(), "RemoveMapLayerRequest", [layer.getId()]);
                // remove maplayer from all layers
	            mapLayerService.removeLayer(layer.getId());
	            
                // remove grid tab for category
                var catID = layer.getId().substring(this.idPrefix.length + 1);
                this.uiItems.gridPanel.removeCategory(catID);
        	}
        }
        
        
        
        
        // check for update or add
    	for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
    		var cat = categories[catIdx];
        	var found = false;
        	for(var i = 0; i < mapLayers.length; ++i) {
	    		if(this.getMapLayerId(cat.get('id')) === mapLayers[i].getId()) {
	    			// found matching maplayer
        			found = true;
	    			// check name change
		    		if(cat.get('name') !== mapLayers[i].getName()) {
		    			var layerConf = {
		    				name: cat.get('name')
		    			};
		    			// update maplayer name if category name has changed
		    			mapLayerService.updateLayer(mapLayers[i].getId(), layerConf);
		    		}
	    		}
	    	}
        	if(!found) {
        		// add maplayer
        		var json = this.getMapLayerJson(cat);
	            var myplacesLayer = mapLayerService.createMapLayer(json);
	            mapLayerService.addLayer(myplacesLayer);
        	}
            this.uiItems.gridPanel.addOrUpdateCategory(cat);
    	}
        
    	if(this.initialLoad) {
	        // add the myplaces layers programmatically since enhancements 
	        // cant do this (run before the bundle adds the layers)
	        this.processStartupLinkLayers(this._sandbox);
	        // done here because layers aren't added to the service before this
    		this.initialLoad = false;
        
			// preselect the first category
			this.uiItems.gridPanel.showCategory();
    	}
    },
    
    /**
     * @method handleMyPlaceSelected
     * Sets the currently selected place
     * @param the new selected place model
     */
    handleMyPlaceSelected : function(pSelectedMyPlace) {
    	
        // keep a reference to the place so we know what to delete/edit
        this.selectedMyPlace = pSelectedMyPlace;

        if(this.wizardPanel && this.wizardPanel.isVisible()) {
	    	this.wizardPanel.setPlace(this.selectedMyPlace);
        }
	    this.uiItems.mainPanel.placeSelected(pSelectedMyPlace);
    },
    eventHandlers : {
        'MyPlaces.FinishedDrawingEvent' : function(event) {
            this.handleFinishedDrawingEvent(event);
        },
        'MyPlaces.MyPlaceSelectedEvent' : function(event) {
            Oskari.$('UI.facade').expandPart('E');
        	this.uiItems.mainPanel.expand(true);
            this.handleMyPlaceSelected(event.getPlace());
            if(event.isDblClick()) {
            	this.startWizard();
            };
        },
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
        	this._handlePlacesChanged();
        },
        'MyPlaces.MyPlaceHoverEvent' : function(event) {
			// check if drawing before doing this
			if(this.disableMapEvents === false) { 
            	this.uiItems.gridPanel.handleHover(event);
           	}
        },
		'AfterMapLayerRemoveEvent' : function(event) {
        	var layer = event.getMapLayer(); 
        	// check that layer was a my places layer
            if(layer.getMetaType &&  layer.getMetaType() === this.idPrefix) {
        		// check if there is any myplaces layers left
        		var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        		var mapLayers = mapLayerService.getAllLayersByMetaType(this.idPrefix);
        		if(mapLayers.length === 0) {
	                // deactivate hover plugin
	                this.hoverPlugin.deactivate();
        		}
            }
		},
		'MapClickedEvent' : function(event) {
			// check if drawing before doing this
			if(this.disableMapEvents === false) { 
				this.uiItems.gridPanel.handleMapClick(event);
			}
		},
        'AfterMapLayerAddEvent' : function(event) {
        	var layer = event.getMapLayer(); 
        	// check that layer was a my places layer
            if(layer.getMetaType &&  layer.getMetaType() === this.idPrefix) {
                
                // find the main panel (accordion panel in this case) and expand
                Oskari.$('UI.facade').expandPart('E');
            	this.uiItems.mainPanel.expand(true);
            	
                // do same for grid component 
                Oskari.$('UI.facade').showUIComponent(this.getName() + '_grid');
                
                // change tab to added category
                var catID = layer.getId().substring(this.idPrefix.length + 1);
				this.uiItems.gridPanel.showCategory(catID);
                
                // TODO: hover should not trigger on layers that are not selected
                // activate hover plugin
                this.hoverPlugin.activate();
            }
        }
    },

    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    
    /**
     * @method addLayerToMap
     * Adds the my places map layer to selected if it is not there already
     */
    addLayerToMap : function(categoryId) {
    	var layerId = this.getMapLayerId(categoryId);
        var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
	        var request = this._sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
	        this._sandbox.request(this.getName(), request);
        }
    },
    getMapLayerId : function(categoryId) {
    	if(!categoryId) {
    		if(this.selectedMyPlace) {
    			// default to selected place id
    			categoryId = this.selectedMyPlace.get('categoryID');
    		}
    		else {
    			// default to default category id(?)
    			var defCat = this.myPlacesService.getDefaultCategory();
    			if(defCat) {
    				
    				categoryId = defCat.get('id');
    			}
    			else {
    				categoryId = '-99';
    			}
    		}
    	}
    	return this.idPrefix + '_' + categoryId;
    },
    /**
     * @method getMapLayerJson
     * Populates the category based data to the base maplayer json 
     * @return maplayer json for the category
     */
    getMapLayerJson : function(categoryModel) {
    	var baseJson = this._getMapLayerJsonBase();
    	// wmsurl = "/karttatiili/myplaces?myCat="
    	baseJson.wmsUrl = this._config.wmsUrl + categoryModel.get('id') + "&";
    	baseJson.name = categoryModel.get('name');
    	baseJson.id = this.getMapLayerId(categoryModel.get('id'));
    	return baseJson;
    },
    
    /**
     * @method _getMapLayerJsonBase
     * Returns a base maplayer json for my places map layer
     */
    _getMapLayerJsonBase : function() {
		var json = {
			wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            orgName: this.localization.title,
            type: "wmslayer",
            metaType: this.idPrefix,
            baseLayerId:-1,
            legendImage:"",
            gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:false,
            minScale:12000000,
            opacity:75,
            inspire: this.localization.title,
            maxScale:1
		};
        return json;
    }
}, {
	/**
	 * @property protocol
	 * @static 
	 */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */