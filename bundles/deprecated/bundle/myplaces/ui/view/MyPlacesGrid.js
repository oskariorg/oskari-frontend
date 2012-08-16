Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGrid', {
    extend : 'Ext.grid.Panel',
    layout : 'fit',
    category : null,
    service : null,
    places : null,
    placesHandler : null,
    module : null,
    

    /**
     * Initialize the component
     */
    initComponent : function() {

		// define a common myplace grid model
        if(!Ext.ClassManager.get('MyPlaceGridModel')) {
            var modelFields = ['id', 'name', 'desc', 'type', 'createDate', 'updateDate'];

            Ext.define('MyPlaceGridModel', {
                extend : 'Ext.data.Model',
                fields : modelFields
            });
        }
        // create config object
        var config = {};
        
        var myPlacesStore = Ext.create('Ext.data.Store', {
            model : 'MyPlaceGridModel'
        });
        config.store = myPlacesStore;
        
        // set the panel title
        config.title = this.category.get('name');

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
        
        if(this.places) {
        	this.populateGrid(this.places);
        }
    },
    
    /**
     * @method _formatDate
     * Internal methdo to parse the given date and formats it for the grid
     * @param dateStr string date as returned from geoserver 
     */
    _formatDate : function(dateStr) {
		var dateArray = this.service.parseDate(dateStr);
		
		var time = '';
		if(dateArray.length == 0) {
    		// return empty if no date
    		return '';
    	}
    	else if(dateArray.length > 1) {
    		time = dateArray[1];
    	} 
    	
		return dateArray[0] + ' ' + time;
    },
    
    updateGrid : function(pCategory, myPlacesList) {
        var me = this;
        this.category = pCategory;
        this.setTitle(pCategory.get('name'));
        this.populateGrid(myPlacesList);
	},
    populateGrid : function(myPlacesList) {
        var me = this;
    	    	
    	// populate it with
        var gridModelList = [];
        for(var i = 0; i < myPlacesList.length; ++i) {
        	var type = me.module.getDrawModeFromGeometry(myPlacesList[i].get('geometry'));
            var gridModel = Ext.create('MyPlaceGridModel', {
                id : myPlacesList[i].get('id'),
                name : myPlacesList[i].get('name'),
                description : myPlacesList[i].get('description'),
            	linkText : '<a href="#" onClick="return false;">' + me.localizationSet.grid.linkValue + '</a>',
                createDate : me._formatDate(myPlacesList[i].get('createDate')),
                updateDate : me._formatDate(myPlacesList[i].get('updateDate')),
                type : me.localizationSet.grid.type[type]
            });
            gridModelList.push(gridModel);
        }

        this.getStore().loadData(gridModelList);
    },
    /**
     * @method selectPlace
     * Selects the place in grid
     * @param myPlace place to select 
     */
    getCategory : function() {
    	return this.category;
    },
    /**
     * @method selectPlace
     * Selects the place in grid
     * @param myPlace place to select 
     */
    selectPlace : function(myPlace) {
    	
	    if(myPlace) {
        	// found matching place, now convert it to grid model for selection
	    	var modelToSelect = null;
		    this.getStore().findBy(function(record, id) {
		    	var featureId = record.get('id');
		    	if(featureId == myPlace.get('id')) {
		    		modelToSelect = record;
		    	} 
		    });
		    if(modelToSelect) {
    			this.getSelectionModel().select([modelToSelect]);
    			this._placeSelected(modelToSelect, false);
		    }
	    }
    },
    /**
     * @method placeSelected
     * Internal method that notifies the rest of the module that a place has been selected
     * @param myGridPlace model used by this grid
     * @param wasDblClicked true if double clicked
     */
    _placeSelected : function(myGridPlace, wasDblClicked) {
    	var myPlace = this.service.findMyPlace(myGridPlace.get('id'));
    	this.placesHandler.placeSelected(myPlace, wasDblClicked);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;

        var gridColumns = [{
            header : this.localizationSet.grid.placeName,
            dataIndex : 'name'
        }, {
            header : this.localizationSet.grid.placeDesc,
            flex : 1,
            dataIndex : 'description'
        }, {
            header : this.localizationSet.grid.type.label,
            dataIndex : 'type'
        },{
            header : this.localizationSet.grid.linkHeader,
            width: 120,
            dataIndex : 'linkText'
        }, {
            header : this.localizationSet.grid.createDate,
            width: 120,
            dataIndex : 'createDate'
        }, {
            header : this.localizationSet.grid.updateDate,
            width: 120,
            dataIndex : 'updateDate'
        }];

        
        config.listeners = {
		        itemdblclick: function(dv, record, item, index, e) {            
			    	me._placeSelected(record, true);
		        },
			    itemclick: function(dv, record, item, index, e) {
			    	me._placeSelected(record, false);
			    },
			    cellClick: function (grid, cellEl, colIndex, record, rowEl, rowIndex, event,listeners){
			    	me._cellClicked(grid, cellEl, colIndex, record, rowEl, rowIndex, event,listeners);
			    }
			};
        config.columns = gridColumns;
    },
    
    
    
    
    _cellClicked : function(pGrid, cellEl, colIndex, record, rowEl, rowIndex, event,listeners) {
    	// need to get the column name from grid
    	// model has initially same field order, but user might have changed column order in ui
    	var key = pGrid.getGridColumns()[colIndex].dataIndex;
    	if(key === 'linkText') {
    		var myPlace = this.service.findMyPlace(record.get('id'));
    		this.placesHandler.moveMapTo(myPlace);
    	}
    }
});
