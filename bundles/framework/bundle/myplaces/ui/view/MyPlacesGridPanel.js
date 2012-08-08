Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGridPanel', {
    extend : 'Ext.tab.Panel',
    layout : 'fit',

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        
        config.service = this.oskariConfig.service;
        
        // set the panel title
        config.title = this.oskariConfig.localizationSet.grid.title;

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
        
		this.customTooltip = Ext.create('Ext.tip.ToolTip', {
		    autoHide: true
		});
    },
    /**
     * @method placeSelected
     * Internal method that notifies the rest of the module that a place has been selected
     * @param myPlace model that was selected
     * @param wasDblClicked true if double clicked
     */
    placeSelected : function(myPlace, wasDblClicked) {
    	
        var event = this.oskariConfig.sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')(myPlace, wasDblClicked);
        this.oskariConfig.sandbox.notifyAll(event);
        
    },
    /**
     * @method moveMapTo
     * @param myPlace model to show in map
     */
    moveMapTo : function(myPlace) {
        // center map on selected place
    	var center = myPlace.get('geometry').getCentroid();
    	var mapmoveRequest = this.oskariConfig.sandbox.getRequestBuilder('MapMoveRequest')
                    	(center.x, center.y, myPlace.get('geometry').getBounds(), false); 
        this.oskariConfig.sandbox.request(this.oskariConfig.module.getName(), mapmoveRequest);
    },
    
    /**
     * @method showCategory
     * Changes tab to show category
     */
    showCategory : function(categoryId) {
    	if(!categoryId) {
	    	this.setActiveTab(0);
	    	return this.getActiveTab();
    	}
    	else {
	    	var grid = this.child('#myplaceCat_' + categoryId);
	    	this.setActiveTab(grid.tab);
			grid.show();
	    	return grid;
    	}
    },
    removeCategory : function(categoryId) {
    	var grid = this.child('#myplaceCat_' + categoryId);
    	if(grid) {
	    	this.remove(grid.tab);
	    	grid.destroy();
	    	grid = null;
    	}
    },
    addOrUpdateCategory : function(category) {
    	var me = this;
    	var categoryId = category.get('id');
    	var grid = this.child('#myplaceCat_' + categoryId);
        var myPlacesList = this.service.getPlacesInCategory(categoryId);
    	if(grid) {
    		grid.updateGrid(category, myPlacesList);
    	}
    	else {
	        var tab = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGrid', {
	        	category : category,
	    		itemId: 'myplaceCat_' + categoryId,
	        	service : me.service,
	        	places : myPlacesList,
	        	localizationSet : me.oskariConfig.localizationSet,
	        	placesHandler : me,
	        	module : me.oskariConfig.module
	        });
	        this.add(tab);
    	}
    },
    getSelectedCategory : function() {
    	var selectedTab = this.getActiveTab(); 
    	if(selectedTab) {
    		return selectedTab.getCategory();
    	}
    	return null;
    },
    
    /**
     * @method handleMapClick
     * Tries to map grid items to a click event sent from map
     * @param event from click 
     */
    handleMapClick : function(event) {
    	var zoom = this.oskariConfig.sandbox.getMap().getZoom();
        var places = this.service.findMyPlaceByLonLat(event.getLonLat(), zoom);
        if(places.length > 0) {
        	var grid = this.showCategory(places[0].get('categoryID'));
        	grid.selectPlace(places[0]);
        }
    },
    
    /**
     * @method handleHover
     * Tries to map grid items to a hover event sent from map
     * TODO: maybe modify the common MouseHoverEvent or find another way to show tooltip at mouse location?
     * @param event from hover 
     */
    handleHover : function(event) {
    	var zoom = this.oskariConfig.sandbox.getMap().getZoom();
        var places = this.service.findMyPlaceByLonLat(event.getLonLat(), zoom);
        
        // create the tooltip text
        var str = '';
        for(var i = 0; i < places.length; ++i) {
    		if(str) {
    			str = str + '<hr/>';
    		}
    		// create the html for tooltip
    		// add any places that are under the mouse (might be more than one)
    		str = str + '<b>' + places[i].get('name') + '</b>';
    		var desc = places[i].get('description');
    		if(desc && desc.trim().length > 0) {
				str = str + '<br/>' + desc;
    		}
        }
        // show popup if anything to show
        if(str) {
			this.customTooltip.update(str);
			// need to show before setting position
			this.customTooltip.show();
			//this.customTooltip.alignTo(cellEl);
			this.customTooltip.setPagePosition(event.getHoverEvent().pageX, event.getHoverEvent().pageY);
        }
        else {
			this.customTooltip.hide();
        }
    }
});
