Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesPlaceSelectedControls', {
    extend : 'Ext.panel.Panel',
    layout : 'anchor',
    border : false,
    frame : false,
    title : 'jee',
    closable : true,
    closeAction : 'hide',

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};

        config.module = this.oskariConfig.module;
        config.mainPanel = this.oskariConfig.mainPanel;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

		this.on("beforeclose", function() {
	    	this.module.cleanupAfterMyPlaceOperation();
		});
		
        // call parent
        this.callParent(arguments);
    },
    
    /**
     * @method placeSelected
     * Modifies the ui texts and functionality to match the currently selected place
     * @param myPlace currently selected place
     */
    placeSelected : function(myPlace) {
        var me = this;
        if(myPlace) {
            // send request to activate edit controls on map
	        var request = {};
        	// clone the geometry so openlayers doesn't modify the original 
	        request.geometry = myPlace.get('geometry').clone();
            var mode = this.oskariConfig.module.getDrawModeFromGeometry(request.geometry);
        	request.drawMode = this.oskariConfig.module.getDrawModeFromGeometry(request.geometry);
	        this.mainPanel.sendDrawRequest(request);
	        
	        // update ui texts
	    	this.setTitle(myPlace.get('name')); 
	        this.uiItems.btnSave.setText(this.oskariConfig.localizationSet.mainpanel.editSaveBtn[request.drawMode]);
	        this.uiItems.editHelp.update(this.oskariConfig.localizationSet.mainpanel.editHelp[request.drawMode]);

			// update tooltips to show which place we are working with?
            this.uiItems.btnEdit.setTooltip(this.oskariConfig.localizationSet.mainpanel.btnEdit + ': ' + myPlace.get('name'));
            this.uiItems.btnDelete.selectedPlace = myPlace;
            this.uiItems.btnDelete.setTooltip(this.oskariConfig.localizationSet.mainpanel.btnDelete + ': ' + myPlace.get('name'));
        } else {
            this.uiItems.btnDelete.selectedPlace = null;
        }
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;
        
        var editHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.editHelp.point
        });
        config.uiItems.editHelp = editHelp;
        
        var btnSave = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.saveBtn,
            tooltip: this.oskariConfig.localizationSet.saveBtn,
            scale : 'medium',
            handler : function() {
        		me.oskariConfig.module.saveMyPlaceGeometry();
            }
        });
        var saveButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnSave]
        });
        config.uiItems.btnSave = btnSave;
        
        var editDescHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.editHelp.desc
        });
        
        var btnEdit = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.mainpanel.btnEdit,
            tooltip: this.oskariConfig.localizationSet.mainpanel.btnEdit,
            scale : 'medium',
            iconCls : 'myplaces_edit_place',
            handler : function() {
                config.module.startWizard();
            }
        });
        var editButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnEdit]
        });
        config.uiItems.btnEdit = btnEdit;

        var deleteHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.deleteHelp
        });
        var btnDelete = Ext.create('Ext.Button', {
            scale : 'medium',
            tooltip: this.oskariConfig.localizationSet.mainpanel.btnDelete,
            iconCls : 'myplaces_delete_place',
            text : this.oskariConfig.localizationSet.mainpanel.btnDelete,
            selectedPlace: null,
            handler : function() {
            	
		        Ext.Msg.show({
		            title : me.oskariConfig.localizationSet.deleteConfirmTitle,
		            modal : true,
		            msg : me.oskariConfig.localizationSet.mainpanel.deleteConfirm + this.selectedPlace.get('name'),
		            buttons : Ext.Msg.OKCANCEL,
		            icon : Ext.MessageBox.QUESTION,
		            fn : function(btn) {
		                if(btn === 'ok') {
                			me.oskariConfig.module.deleteMyPlace();
		                }
		            }
		        });
            }
        });
        
        var deleteButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnDelete]
        });
        config.uiItems.btnDelete = btnDelete;
        
        config.items = [editHelp, saveButtonsPanel, editDescHelp, editButtonsPanel, deleteHelp, deleteButtonsPanel];
    }
});
