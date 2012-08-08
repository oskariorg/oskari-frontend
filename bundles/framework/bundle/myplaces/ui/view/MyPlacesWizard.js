Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
    extend : 'Ext.window.Window',
    height : 400,
    width : 600,
    layout : 'fit',
    closable : false,
	id: 'myplaces-popup',
//    hideMode : 'offsets',

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        config.uiItems.panels = {};
        config.wizard = {};
        config.service = this.oskariConfig.service;

        config.title = this.oskariConfig.localizationSet.wizard.title;
        var categoryStore = Ext.create('Ext.data.Store', {
            model : 'Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory',
            data : config.service.getAllCategories()
        });
        config.categoryStore = categoryStore;

        // place info stored here while category panel shown because of wysiwyg bug
        config.place = {};

        // build panel confs
        this._buildItems(config);

        // init to first step
        config.wizard.currentView = config.uiItems.panels.myPlacePanel;

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;
        var categoryPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.CategoryPanel', {
        	id: 'myplace-popup-categorypanel',
            categoryStore : config.categoryStore,
            oskariConfig : {
                localizationSet : me.oskariConfig.localizationSet,
                defaults: me.oskariConfig.module.defaults
            },
            finishedAction : function(categoryModel) {
                me._commitCategory(categoryModel);
            },
            deleteCategoryAction : function(categoryModel) {
                me._confirmDeleteCategory(categoryModel);
            },
            cancelAction : function() {
                me._showMyPlaceForm();
            }
        });
        config.uiItems.panels.categoryPanel = categoryPanel;
        
        var myPlacePanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacePanel', {
            categoryStore : config.categoryStore,
            //hideMode : 'offsets',
            oskariConfig : {
                localizationSet : me.oskariConfig.localizationSet,
                service : me.oskariConfig.service                
            },
            finishedAction : function(myPlaceModel, oldCategoryId) {
                me._wizardFinished(myPlaceModel, oldCategoryId);
            },
            categoryOperation : function(params) {
                me._showCategoryForm(params);
            }
        });
        config.uiItems.panels.myPlacePanel = myPlacePanel;

        // initially show myplace form
        config.items = [myPlacePanel];
    },
    /**
     * @method _showCategoryForm
     * Internal method to set category form as current view and show it with drawPanels()
     */
    _showCategoryForm : function(params) {
        var me = this;
        // get the myplace values so we can repopulate after category edit (WYSIWYG BUG))
        me.uiItems.panels.myPlacePanel.saveValues();
        me.uiItems.panels.categoryPanel.setParams(params);

        me.wizard.currentView = me.uiItems.panels.categoryPanel;
        me._drawPanels();
    },
    /**
     * @method _showMyPlaceForm
     * Internal method to set myplaces form as current view and show it with drawPanels()
     */
    _showMyPlaceForm : function() {
        var me = this;
        me.wizard.currentView = me.uiItems.panels.myPlacePanel;
        // form fields need to be recreated because of WYSIWYG bug
        me.uiItems.panels.myPlacePanel.recreatePanel();
        me._drawPanels();
    },
    /**
     * @method _confirmDeleteCategory
     * Internal method confirm category delete
     */
    _confirmDeleteCategory : function(categoryModel) {
    
        var me = this;
        var defaultCategory = me.service.getDefaultCategory();
        var places = me.service.getPlacesInCategory(categoryModel.get('id'));
                
        var buttons = [
        	{
        		text: me.oskariConfig.localizationSet.confirm.btnCancel
        	},
        	'break'
        ];
        var deleteBtnText = me.oskariConfig.localizationSet.confirm.btnDelete;
        var message = me.oskariConfig.module.formatMessage(
        	me.oskariConfig.localizationSet.confirm.deleteConfirm, 
        	[
        		categoryModel.get('name'),
        		places.length
        	]);
        if(places.length > 0) {
        	message = message + '<br/><br/>' +
	        	me.oskariConfig.module.formatMessage(
	        		me.oskariConfig.localizationSet.confirm.deleteConfirmMoveText, 
	        	[
	        		defaultCategory.get('name')
	        	]);
	        buttons.push({
	        		text: me.oskariConfig.localizationSet.confirm.btnMove, 
	        		handler: function () {
	        			 
                		// move the places in the category to default category
		                me._deleteCategory(categoryModel, true); 
	        		}
	        });
	        deleteBtnText = me.oskariConfig.localizationSet.confirm.btnDeleteAll; 
        }
        buttons.push({
    		text: deleteBtnText, 
    		handler: function () {
            	// delete category and each place in it
                me._deleteCategory(categoryModel, false);
			}
    	});
        
        Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.ConfirmWindow', {
        	title: me.oskariConfig.localizationSet.deleteConfirmTitle,
        	message: message,
        	dialogButtons: buttons
        }).show();
    },
    /**
     * @method _deleteCategory
     * Internal method start actual category delete after confirm
     */
    _deleteCategory : function(categoryModel, movePlaces) {
        var me = this;
        var catId = categoryModel.get('id');
        // add load mask
        this.setLoading(me.oskariConfig.localizationSet.deletemask);
        // wrap callback to get it into the scope we want
        var callBackWrapper = function(success) {
            me._deleteCategoryCallback(success, movePlaces, catId);
        };
		me.service.deleteCategory(catId, movePlaces, callBackWrapper);
    },
    /**
     * @method _deleteCategoryCallback
     * Internal method to handle server response for category delete
     */
    _deleteCategoryCallback : function(success, movePlaces, categoryId) {
    	
        var me = this;
    	// remove load mask
    	this.setLoading(false);
        if(success) {
	        this.refreshCategories();
        	if(movePlaces) {
	        	this._showMyPlaceForm();
        	}
        	else {
        		// place deleceted also, shut down edit dialog and any selection
        		me.oskariConfig.module.cleanupAfterMyPlaceOperation();
        	}
            if(movePlaces) {
            	// places moved to default category -> update it
    			var defCat = me.service.getDefaultCategory();
    			var layerId = this.oskariConfig.module.getMapLayerId(defCat.get('id'));
		        var request = this.oskariConfig.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
		        this.oskariConfig.sandbox.request(this.oskariConfig.module.getName(), request);
            }
        }
        else {
        	// TODO: error handling
        	alert(this.oskariConfig.localizationSet.errorDelete);
        	// console.dir(categoryModel);
        }
    },
    /**
     * @method refreshCategories
     * Refresh the category list content from service
     */
    refreshCategories : function() {
        var me = this;
        me.uiItems.panels.myPlacePanel.setCategories(me.service.getAllCategories());
        me.uiItems.panels.myPlacePanel.setSelectedCategory();
    },
    
    /**
     * @method _commitCategory
     * Internal method - request save for category data
     */
    _commitCategory : function(categoryModel) {
        var me = this;

        // add load mask
        this.setLoading(me.oskariConfig.localizationSet.savemask);
        
        // cleanup the model
        // ext uses the grouping fields value as id in html so it breaks if it has quotes
        // replace " -> '
        var re = /\"/g;
        var name = categoryModel.get('name');
        categoryModel.set('name', name.replace(re, '\''));
        
        // wrap callback to get it into the scope we want
        var callBackWrapper = function(success, pCategoryModel, isNew) {
            me._commitCategoryCallback(success, pCategoryModel, isNew);
        };
        this.service.saveCategory(categoryModel, callBackWrapper);
    },

    /**
     * @method _commitCategoryCallback
     * Internal method to handle server response for category save
     */
    _commitCategoryCallback : function(success, categoryModel, isNew) {
        var me = this;
    	// remove load mask
    	this.setLoading(false);
        if(success) {
	        if(isNew) {
	            // refresh dropdown when adding new category
	            me.uiItems.panels.myPlacePanel.setCategories(me.service.getAllCategories());
	            // id populated on save
	        	//me.uiItems.panels.myPlacePanel.setSelectedCategory(categoryModel.get('id'));
	        	
	        	// request add for new map layer 
	        	me.oskariConfig.module.addLayerToMap(categoryModel.get('id'));
	        }
	        else {
	        	// request update on existing map layer 
		        var request = me.oskariConfig.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(me.oskariConfig.module.getMapLayerId(categoryModel.get('id')), true);
		        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);
	        }
            // id populated on save
        	me.uiItems.panels.myPlacePanel.setSelectedCategory(categoryModel.get('id'));
	        me._showMyPlaceForm();
        }
        else {
        	// TODO: error handling
        	alert(this.oskariConfig.localizationSet.errorSave);
        	// console.dir(categoryModel);
        }
    },
    /**
     * @method setPlace
     * Sets a backing my place model for the form
     * @param myPlaceModel model to populate the form with 
     */
    setPlace : function(myPlaceModel) {
        this.uiItems.panels.myPlacePanel.setPlace(myPlaceModel);
        this.uiItems.panels.myPlacePanel.recreatePanel();
    },
    /**
     * @method setSelectedCategory
     * Sets a predefined category on the my place form
     * @param categoryId id of category to select 
     */
    setSelectedCategory : function(categoryId) {
        this.uiItems.panels.myPlacePanel.setSelectedCategory(categoryId);
    },

    /**
     * @method _wizardFinished
     * Internal method to handle wizard finished
     */
    _wizardFinished : function(myPlaceModel, oldCategoryId) {
        var me = this;
        // if model undefined -> user canceled
        if(myPlaceModel) {
        	// get current geometry from plugin and save
        	var callbackWrapper = function(pGeometry) {
            	myPlaceModel.set('geometry', pGeometry);
        		me.oskariConfig.module.myPlaceFinished(myPlaceModel, oldCategoryId);
        	};
        	
	        var request = me.oskariConfig.sandbox.getRequestBuilder('MyPlaces.GetGeometryRequest')(callbackWrapper);
	        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);
        }
        else {
        	this.oskariConfig.module.myPlaceFinished(myPlaceModel);
        }
    },
    /**
     * @method _drawPanels
     * Internal method to draw the current view
     */
    _drawPanels : function() {
        var me = this;

        me.removeAll(false);
        // false to not destroy
        // for some reason removeall doesn't work too well
        // so we need to hide the panels also, hence the looping
        for(var panelIndex in me.uiItems.panels ) {
            me.uiItems.panels[panelIndex].hide();
        }

        // get the panel for current step, add it and show it
        me.add(me.wizard.currentView);
        me.wizard.currentView.show();
    }
});
