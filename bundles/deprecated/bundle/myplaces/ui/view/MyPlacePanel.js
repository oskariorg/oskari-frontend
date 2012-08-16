Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacePanel', {
    extend : 'Ext.panel.Panel',
    layout : 'fit',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        
        config.myPlace = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', {
                name : '',
                description : ''
            });

        config.loc = {};
        config.loc.categoryLabel = this.oskariConfig.localizationSet.wizard.categoryLabel;
        config.loc.cancelBtn = this.oskariConfig.localizationSet.myplace.cancelBtn;
        config.loc.finishBtn = this.oskariConfig.localizationSet.saveBtn;
        config.loc.placeName = this.oskariConfig.localizationSet.myplace.placeName;
        config.loc.placeDesc = this.oskariConfig.localizationSet.myplace.placeDesc;
        config.loc.placeCreateDate = this.oskariConfig.localizationSet.myplace.placeCreateDate;
        config.loc.placeUpdateDate = this.oskariConfig.localizationSet.myplace.placeUpdateDate;
        config.loc.errorNoName = this.oskariConfig.localizationSet.myplace.errorNoName;
        config.loc.errorCategoryNotSelected = this.oskariConfig.localizationSet.myplace.errorCategoryNotSelected;

        config.loc.addTip = this.oskariConfig.localizationSet.myplace.addTip;
        config.loc.editTip = this.oskariConfig.localizationSet.myplace.editTip;
        config.category = {};

        // build panel
        config.items = [this._buildItems(config)];
        this._buildDockedButtons(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var panelItems = this._createFormFields(config);

        var mainPanel = Ext.create('Ext.form.Panel', {
        	id: 'myplace-popup-placepanel',
            border : false,
            frame : false,
            padding : 10,
            hideMode : 'offsets',
            style : 'text-align: left;',
            fieldDefaults : {
                labelAlign : 'top',
                msgTarget : 'top'
            },
            defaults : {
                anchor : '100%'
            },
            items : panelItems
        });

        config.uiItems.mainPanel = mainPanel;
        return mainPanel;
    },
    /**
     * @method _createFormFields
     * Internal method to build the panels form fields
     */
    _createFormFields : function(config) {
        var me = this;
        
        if(!config.myPlace) {
        	config.myPlace = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', {
                name : '',
                description : ''
            });
        }
        var panelItems = [];
        var nameField = Ext.create('Ext.form.Text', {
            xtype : 'textfield',
            name : 'name',
            emptyText: config.loc.errorNoName,
            fieldLabel : config.loc.placeName,
            value : config.myPlace.get('name'),
            allowBlank : false
        });
        panelItems.push(nameField);
        
        /*
         * // WYSIWYG is bugged in IE atm so using textArea instead
        var descField = Ext.create('Ext.form.HtmlEditor', {
            name : 'description',
            value : config.myPlace.get('description'),
            fieldLabel : config.loc.placeDesc
        });
        */
       
        var descField = Ext.create('Ext.form.TextArea', {
            name : 'description',
        	grow      : false,
            value : config.myPlace.get('description'),
            fieldLabel : config.loc.placeDesc
        });
       
        panelItems.push(descField);
        
        if(config.myPlace.get('createDate')) {
        	var formattedDate = me._formatDate(config.myPlace.get('createDate'));
            panelItems.push({
                xtype : 'displayfield',
                labelAlign : 'left',
                fieldLabel : config.loc.placeCreateDate,
                name : 'createDate',
                value : formattedDate
            });
        	formattedDate = me._formatDate(config.myPlace.get('updateDate'));
            panelItems.push({
                xtype : 'displayfield',
                labelAlign : 'left',
                fieldLabel : config.loc.placeUpdateDate,
                name : 'updateDate',
                value : formattedDate
            });
        }
        return panelItems;
    },
    /**
     * @method _formatDate
     * Internal method to parse the given date and formats it for the panel
     * @param dateStr string date as returned from geoserver 
     */
    _formatDate : function(dateStr) {
		var dateArray = this.oskariConfig.service.parseDate(dateStr);
		
		var time = '';
		if(dateArray.length == 0) {
    		// return empty if no date
    		return '';
    	}
    	else if(dateArray.length > 1) {
    		var iconSrc = Oskari.$().startup.imageLocation + '/resource/silk-icons/clock.png';
    		time = '<img src="' + iconSrc + '" /> ' + dateArray[1];
    	} 
    	
		var dateIconSrc = Oskari.$().startup.imageLocation + '/resource/silk-icons/calendar.png';
		return '<img src="' + dateIconSrc + '" /> ' + dateArray[0] + ' ' + time;
    },
    /**
     * @method setPlace
     * Sets a backing my place model for the form
     * @param myPlaceModel model to populate the form with 
     */
    setPlace : function(myPlaceModel) {
		if(myPlaceModel) {
			this.myPlace = myPlaceModel;
        	this.setSelectedCategory(myPlaceModel.get('categoryID'));
        }
        else {
        	this.myPlace = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', {
                name : '',
                description : ''
            });
        }
    },
    /**
     * @method saveValues
     * Saves the current form values to the backing my place model
     */
    saveValues : function() {
    	var values = this.uiItems.mainPanel.getValues();
    	this.myPlace.set('name', values.name);
    	this.myPlace.set('description', values.description);
    	
        try {
            var categoryIndex = this._getCategorySelectionIndex();
            var categoryModel = this.categoryStore.getAt(categoryIndex);
            this.myPlace.set('categoryID', categoryModel.get('id'));
        } catch(ignored) {
            // (empty category name)
        }
    },
    
    /**
     * @method recreatePanel
     * This method is used to recreate the form field
     * The WYSIWYG editor breaks if its panel is hidden and shown again
     * This is the only reason why this is done
     * 
     * FIXME: wysiwyg isn't used anymore so deprecated?
     */
    recreatePanel : function() {
        this.uiItems.mainPanel.removeAll();
        var panelItems = this._createFormFields(this);
        this.uiItems.mainPanel.add(panelItems);
    },
    /**
     * @method _myPlaceFinished
     * Internal method to handle save button
     */
    _myPlaceFinished : function() {
        var me = this;

        try {
        	var oldCategoryId = me.myPlace.get('categoryID');
            this.saveValues();
            if(!me.myPlace.get('name')) {
                alert(me.loc.errorNoName);
                return;
            }
            // check that category is selected
            var categoryIndex = this._getCategorySelectionIndex();
            
            this.finishedAction(me.myPlace, oldCategoryId);
        } catch(error) {
            // show possible error (=empty category name)
            alert(error);
        }
    },
    /**
     * @method _myPlaceCanceled
     * Internal method to handle cancel button
     */
    _myPlaceCanceled : function() {
        this.finishedAction();
    },
    /**
     * @method _getCategorySelectionIndex
     * Internal method to determine category selection
     * @return the store index for the current selected category
     * in drop down or -1 if not in store
     */
    _getCategorySelectionIndex : function() {
        var me = this;

        var categoryName = me.uiItems.categoryDropdown.getValue();

        if(!categoryName) {
            throw me.loc.errorCategoryNotSelected;
        }
        // try to find it in store
        var index = me.categoryStore.findBy(function(record, id) {
            // dropdown gives id if found in store
            // and written value if not
            if(isNaN(categoryName)) {
                return record.get('name') == categoryName;
            }
            return record.get('id') == categoryName;
        });
        return index;
    },
    /**
     * @method _handleCategoryControls
     * Internal method to handle dropdown selections and ENTER keypresses after user typing
     * on category drop down
     *
     * @param isAddButton is used to detect if we should be adding a
     * category even when existing category is selected on dropdown
     */
    _handleCategoryControls : function(isAddButton) {
        var me = this;
        var index = -1;
        try {
            index = me._getCategorySelectionIndex();
        } catch(error) {
            // show possible error (=empty category name)
            // dont show if pressed addbutton
            if(!isAddButton) {
                alert(error);
                return;
            }
        }
        var model = null;
        var notFoundInStore = (index == -1);
        // not found in store == new category

        var isNew = (notFoundInStore || isAddButton);

        if(isNew) {
            var categoryName = '';
            if(notFoundInStore) {
                categoryName = me.uiItems.categoryDropdown.getValue();
            }
            // create new model for category form
            model = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory', {
                name : categoryName
            });
        } else {
            // categoryName == store index if not new
            // load the category for editing
            model = me.categoryStore.getAt(index);
        }
        var params = {
            isNew : isNew,
            categoryModel : model
        };

        // categoryOperation is passed by wizard as callback method
        me.categoryOperation(params);

    },
    /**
     * @method setCategories
     * Updates the categories offered to user
     * @param array of myplace category models
     */
    setCategories : function(categoryList) {
        var me = this;
        me.categoryStore.loadData(categoryList);
    },
    /**
     * @method setSelectedCategory
     * Sets the current category programmatically
     * @param categoryId to select (selects default category)
     */
    setSelectedCategory : function(categoryId) {
        var me = this;
        if(!categoryId) {
            //default to first
        	var defaultCategory = this.oskariConfig.service.getDefaultCategory();
        	categoryId = defaultCategory.get('id');
        		/*
            if(me.categoryStore.count() > 0) {
	            categoryId = me.categoryStore.getAt(0).get('id');
            }*/
        } 
        me.uiItems.categoryDropdown.setValue(categoryId);
    },
    /**
     * @method _handleCategoryButtons
     * Internal method to handle button states while typing etc "changehandler"
     */
    _handleCategoryButtons : function() {
        var me = this;

        try {
            var index = me._getCategorySelectionIndex();

            if(index == -1) {
                // new category
                this.uiItems.editCategoryButton.disable();
            } else {
                // existing category
                this.uiItems.editCategoryButton.enable();
            }
        } catch(ignored) {
            // no need to bother with errors here
        }

    },
    /**
     * @method _buildDockedButtons
     * Internal method to build top toolbar (category tools) and bottom toolbar (save/cancel)
     */
    _buildDockedButtons : function(config) {
        var me = this;

        // TOP TOOLBAR

        // Create the combo box
        // categoryStore is passed by MyPlacesWizard when creating this panel
        var categoryDropdown = Ext.create('Ext.form.ComboBox', {
            fieldLabel : config.loc.categoryLabel,
            store : me.categoryStore,
            id: 'myplace-category-dropdown',
            //autoSelect: true,
            typeAhead : true,
            typeAheadDelay : 1000, // wait a second before autocomplete
            flex : 1,
            queryMode : 'local',
            displayField : 'name',
            valueField : 'id',
            listeners : {
                specialKey : function(field, e) {
                    if(e.getKey() == e.ENTER) {
                        me._handleCategoryControls(false);
                    }
                }
            }

        });
        config.uiItems.categoryDropdown = categoryDropdown;
        categoryDropdown.setValue(me.categoryStore.getAt(0));

        // bind changelistener after default value is set
        categoryDropdown.on('change', function() {
            me._handleCategoryButtons();
        });
        var addCategoryButton = Ext.create('Ext.button.Button', {
            //text: '+',
            cls : 'x-btn-icon',
            scale : 'small',
            iconCls : 'myplaces_add_category',
            tooltip : config.loc.addTip,
            handler : function() {
                me._handleCategoryControls(true);
            }
        });
        config.uiItems.addCategoryButton = addCategoryButton;

        var editCategoryButton = Ext.create('Ext.button.Button', {
            //text: 'E',
            cls : 'x-btn-icon',
            scale : 'small',
            iconCls : 'myplaces_edit_category',
            tooltip : config.loc.editTip,
            handler : function() {
                me._handleCategoryControls(false);
            }
        });
        config.uiItems.editCategoryButton = editCategoryButton;

        // BOTTOM TOOLBAR
        var finishedButton = Ext.create('Ext.Button', {
            text : config.loc.finishBtn,
            handler : function() {
                me._myPlaceFinished();
            }
        });
        config.uiItems.finishedButton = finishedButton;

        var cancelButton = Ext.create('Ext.Button', {
            text : config.loc.cancelBtn,
            handler : function() {
                me._myPlaceCanceled();
            }
        });
        config.uiItems.cancelButton = cancelButton;

        config.dockedItems = [{
            xtype : 'toolbar',
            dock : 'top',
            items : [categoryDropdown, editCategoryButton, addCategoryButton]
        }, {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [{xtype:'tbfill'}, cancelButton, finishedButton]
        }];
    }
});
