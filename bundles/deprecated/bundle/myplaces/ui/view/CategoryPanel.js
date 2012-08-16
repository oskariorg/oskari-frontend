Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.CategoryPanel', {
    extend : 'Ext.panel.Panel',
    layout : 'fit',
    border: false,
    frame: false, 

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};
        config.category = null;
        config.defaults = this.oskariConfig.defaults;

        config.loc = {};
        config.loc.deleteTip = this.oskariConfig.localizationSet.category.deleteTip;
        config.loc.categoryLabel = this.oskariConfig.localizationSet.wizard.categoryLabel;
        config.loc.lineColorLabel = this.oskariConfig.localizationSet.category.lineColorLabel;
        config.loc.fillColorLabel = this.oskariConfig.localizationSet.category.fillColorLabel;
        config.loc.lineWidthLabel = this.oskariConfig.localizationSet.category.lineWidthLabel;
        config.loc.dotColorLabel = this.oskariConfig.localizationSet.category.dotColorLabel;
        config.loc.dotSizeLabel = this.oskariConfig.localizationSet.category.dotSizeLabel;
        config.loc.backBtn = this.oskariConfig.localizationSet.category.backBtn;
        config.loc.saveBtn = this.oskariConfig.localizationSet.saveBtn;
        config.loc.deleteConfirmTitle = this.oskariConfig.localizationSet.deleteConfirmTitle;
        config.loc.deleteConfirm = this.oskariConfig.localizationSet.category.deleteConfirm;
        config.loc.errorNoName = this.oskariConfig.localizationSet.category.errorNoName;
        config.loc.errorDeleteDefault = this.oskariConfig.localizationSet.category.errorDeleteDefault;

        // build panel
        this._buildItems(config);
        this._buildDockedButtons(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method setParams
     * Set the category to be edited or dummy model for new category
     */
    setParams : function(params) {
        var me = this;

        if(params.isNew || params.categoryModel.get('isDefault')) {
            // disable delete for new and default category
            me.uiItems.deleteCategoryButton.disable();
        } else {
            me.uiItems.deleteCategoryButton.enable();
        }

        me.uiItems.categoryName.setValue(params.categoryModel.get('name'));

        var lineWidth = params.categoryModel.get('lineWidth');
        if(!lineWidth) {
            lineWidth = me.defaults.lineWidth;
        }
        me.uiItems.lineWidthCombo.select(lineWidth);
        
        var dotSize = params.categoryModel.get('dotSize');
        if(!dotSize) {
            dotSize = me.defaults.dotSize;
        }
        me.uiItems.dotSizeCombo.select(dotSize);

        var fillColor = params.categoryModel.get('fillColor');
        if(!fillColor) {
            fillColor = me.defaults.fillColor;
        }
        me.uiItems.fillColorPicker.select(fillColor);

        var lineColor = params.categoryModel.get('lineColor');
        if(!lineColor) {
            lineColor = me.defaults.lineColor;
        }
        me.uiItems.lineColorPicker.select(lineColor);
        
        var dotColor = params.categoryModel.get('dotColor');
        if(!dotColor) {
            dotColor = me.defaults.dotColor;
        }
        me.uiItems.dotColorPicker.select(dotColor);

        me.category = params.categoryModel;
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        //        var me = this;

        var dotColorPicker = Ext.create('Ext.picker.Color', {
            value : config.defaults.dotColor, // initial selected color
            fieldLabel : config.loc.dotColorLabel
        });
        config.uiItems.dotColorPicker = dotColorPicker;
        
        var lineColorPicker = Ext.create('Ext.picker.Color', {
            value : config.defaults.lineColor, // initial selected color
            fieldLabel : config.loc.lineColorLabel
        });
        config.uiItems.lineColorPicker = lineColorPicker;

        var fillColorPicker = Ext.create('Ext.picker.Color', {
            value : config.defaults.fillColor, // initial selected color
            fieldLabel : config.loc.fillColorLabel
        });
        config.uiItems.fillColorPicker = fillColorPicker;

        // The data store containing the list of states
        var lineWidthStore = Ext.create('Ext.data.Store', {
            fields : ['lineWidth'],
            data : [{
                lineWidth : "1"
            }, {
                lineWidth : "2"
            }, {
                lineWidth : "4"
            }, {
                lineWidth : "8"
            }, {
                lineWidth : "16"
            }]
        });
        
        // The data store containing the list of states
        var dotSizeStore = Ext.create('Ext.data.Store', {
            fields : ['dotSize'],
            data : [{
                dotSize : "1"
            }, {
                dotSize : "2"
            }, {
                dotSize : "4"
            }, {
                dotSize : "8"
            }, {
                dotSize : "16"
            }]
        });

        var dotSizeCombo = Ext.create('Ext.form.ComboBox', {
            fieldLabel : config.loc.dotSizeLabel,
            border : true,
            frame : true,
            editable : false,
            forceSelection : true,
            value : config.defaults.dotSize,
            store : dotSizeStore,
            displayField : 'dotSize',
            valueField : 'dotSize',
            queryMode : 'local'
        });
        config.uiItems.dotSizeCombo = dotSizeCombo;
        
        // Create the combo box, attached to the states data store
        var lineWidthCombo = Ext.create('Ext.form.ComboBox', {
            fieldLabel : config.loc.lineWidthLabel,
            border : true,
            frame : true,
            editable : false,
            forceSelection : true,
            value : config.defaults.lineWidth,
            store : lineWidthStore,
            displayField : 'lineWidth',
            valueField : 'lineWidth',
            queryMode : 'local'
        });
        config.uiItems.lineWidthCombo = lineWidthCombo;

        var dotColorField = Ext.create('Ext.panel.Panel', {
            bodyPadding : 10,
            layout : 'fit',
            items : [{
                xtype : 'label',
                forId : 'dotColorPicker',
                text : config.loc.dotColorLabel
            }, dotColorPicker]
        });
        var lineColorField = Ext.create('Ext.panel.Panel', {
            bodyPadding : 10,
            layout : 'fit',
            items : [{
                xtype : 'label',
                forId : 'lineColorPicker',
                text : config.loc.lineColorLabel
            }, lineColorPicker]
        });

        var fillColorField = Ext.create('Ext.panel.Panel', {
            bodyPadding : 10,
            layout : 'fit',
            items : [{
                xtype : 'label',
                forId : 'fillColorPicker',
                text : config.loc.fillColorLabel
            }, fillColorPicker]
        });

        var colorPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 10,
            layout : 'hbox',
            items : [dotColorField, lineColorField, fillColorField]
        });
        
        var sizePanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 10,
            layout : 'hbox',
            items : [dotSizeCombo, lineWidthCombo]
        });

        var mainPanel = Ext.create('Ext.form.Panel', {
            border : false,
            frame : false,
            bodyPadding : 10,
            items : [colorPanel, sizePanel]
        });

        config.uiItems.mainPanel = mainPanel;
        config.items = [mainPanel];
    },
    /**
     * @method _cancelCategoryEdit
     * Internal method to handle cancel button
     */
    _cancelCategoryEdit : function() {
        this.cancelAction();
    },
    /**
     * @method _commitCategoryEdit
     * Internal method to handle save button
     */
    _commitCategoryEdit : function() {
        var me = this;
        var categoryName = me.uiItems.categoryName.getValue().trim();
        // check empty name
        if(!categoryName) {
            alert(me.loc.errorNoName);
        } else {
            me.category.set('name', me.uiItems.categoryName.getValue());
            me.category.set('lineWidth', me.uiItems.lineWidthCombo.getValue());
            me.category.set('fillColor', me.uiItems.fillColorPicker.getValue());
            me.category.set('lineColor', me.uiItems.lineColorPicker.getValue());
            
            me.category.set('dotSize', me.uiItems.dotSizeCombo.getValue());
            me.category.set('dotColor', me.uiItems.dotColorPicker.getValue());
            
            this.finishedAction(me.category);
        }
    },
    /**
     * @method _buildDockedButtons
     * Internal method to build top toolbar (category name/delete) and bottom toolbar (save/cancel)
     */
    _buildDockedButtons : function(config) {
        var me = this;

        // TOP TOOLBAR

        var categoryName = Ext.create('Ext.form.TextField', {
            fieldLabel : config.loc.categoryLabel,
            emptyText: config.loc.errorNoName,
            flex : 1
        });
        config.uiItems.categoryName = categoryName;

        var deleteCategoryButton = Ext.create('Ext.button.Button', {
            //text: 'X',
            cls : 'x-btn-icon',
            scale : 'small',
            iconCls : 'myplaces_delete_category',
            tooltip : config.loc.deleteTip,
            handler : function() {
            	// don't allow default category delete
            	// button should be disabled but just to be sure
		        if(me.category.get('isDefault')) {
		            alert(me.loc.errorDeleteDefault);
		            return;
		        }
		        // deleteCategoryAction is given as callback param from wizard
		        me.deleteCategoryAction(me.category);
            }
        });
        config.uiItems.deleteCategoryButton = deleteCategoryButton;

        // BOTTOM TOOLBAR
        var saveButton = Ext.create('Ext.Button', {
            text : config.loc.saveBtn,
            handler : function() {
                me._commitCategoryEdit();
            }
        });
        config.uiItems.saveButton = saveButton;

        var backButton = Ext.create('Ext.Button', {
            text : config.loc.backBtn,
            handler : function() {
                me._cancelCategoryEdit();
            }
        });
        config.uiItems.backButton = backButton;

        config.dockedItems = [{
            xtype : 'toolbar',
            dock : 'top',
            items : [categoryName, deleteCategoryButton]
        }, {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [{xtype:'tbfill'}, backButton, saveButton]
        }];
    }
});
