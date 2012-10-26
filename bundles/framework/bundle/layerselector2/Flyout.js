/**
 * @class Oskari.mapframework.bundle.layerselector2.Flyout
 * 
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.state = null;
	this.layerTabs = [];
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.layerselector2.Flyout';
	},
	/**
	 * @method setEl
	 * @param {Object} el 
	 * 		reference to the container in browser
	 * @param {Number} width 
	 * 		container size(?) - not used
	 * @param {Number} height 
	 * 		container size(?) - not used 
	 * 
	 * Interface method implementation
	 */
	setEl : function(el, width, height) {
		this.container = el[0];
		if(!jQuery(this.container).hasClass('layerselector2')) {
			jQuery(this.container).addClass('layerselector2');
		}
	},
	
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
	startPlugin : function() {
		
		var me = this;
		this.template = jQuery('<div class="allLayersTabContent"></div>');
		
        var inspireTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.LayersTab", this.instance, this.instance.getLocalization('filter').inspire);
        var orgTab = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.view.LayersTab", this.instance, this.instance.getLocalization('filter').organization);
		this.layerTabs.push(inspireTab);
        this.layerTabs.push(orgTab);
	},
	/**
	 * @method stopPlugin 
	 * 
	 * Interface method implementation, does nothing atm 
	 */
	stopPlugin : function() {

	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the flyout 
	 */
	getTitle : function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the flyout 
	 */
	getDescription : function() {
		return this.instance.getLocalization('desc');
	},
	/**
	 * @method getOptions 
	 * Interface method implementation, does nothing atm 
	 */
	getOptions : function() {

	},
	/**
	 * @method setState 
	 * @param {String} state
	 * 		close/minimize/maximize etc
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
    /**
     * @method _teardownState
     * @private
     * Tears down previous content state so we can set a new one
     */
    _teardownContentState : function() {
        
        jQuery(this.container).find('div.groupingTabs li').removeClass('active');
        var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup');
        layerGroups.removeClass('open');
        layerGroups.find('div.groupIcon').removeClass('icon-arrow-down');
        layerGroups.find('div.groupIcon').addClass('icon-arrow-right');
        this.filterField.setValue('');
    },
    setContentState : function(state) {
        return;
        this._teardownContentState();    
        // or just: this.createUi(); ??
        
        // prepare for complete state reset
        if(!state) {
            state = {};
        }
        
        // default need to be set incase we don't have complete state information
        if(!state.tab) {
            state.tab = this.groupingTools[0].title;
        }
        var activeTab = jQuery(this.container).find('div.groupingTabs li:contains(' + state.tab + ')');
        activeTab.addClass('active');
        for(var i=0; i < this.groupingTools.length; ++i) {
            var group = this.groupingTools[i];
            if(group.title == state.tab) {
                group.callback();
            }
        }
        
        var filter = state.filter;
        if(!filter) {
            filter = '';
        }
        this.filterField.setValue(filter);
        this._filterLayers(state.filter);
        
        if(!state.filter && state.groups) {
            var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup');
            for(var i=0; i < state.groups.length; ++i) {
                var group = state.groups[i];
                
                var groupTitleContainer = layerGroups.find('span.groupName:contains(' + group + ')');
                if(groupTitleContainer) {
                    var groupContainer = groupTitleContainer.parent().parent();
                    groupContainer.addClass('open');
			        groupContainer.find('div.groupIcon').removeClass('icon-arrow-right');
			        groupContainer.find('div.groupIcon').addClass('icon-arrow-down');
                    groupContainer.find('div.layer').show();
                }
            }
        }
    },
    getContentState : function() {
        return;
        var filterText = this.filterField.getValue();
        var openGroups = [];  
        
        var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup.open');
        for(var i=0; i < layerGroups.length; ++i) {
            var group = layerGroups[i];
            openGroups.push(jQuery(group).find('.groupName').text());
        }
        var activeTab = jQuery(this.container).find('div.groupingTabs li.active').text();
        return {
            tab : activeTab,
            filter : filterText,
            groups : openGroups
        };
    },
	/**
	 * @method createUi
	 * Creates the UI for a fresh start
	 */
	createUi : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();
		
		// clear container
		var cel = jQuery(this.container);
		cel.empty();
		
        var tabContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
        tabContainer.insertTo(cel);
        
        // populate layer list
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var layers = mapLayerService.getAllLayers();
        
        for(var i = 0; i < this.layerTabs.length; ++i) {
		  var tab = this.layerTabs[i];
          // populate tab
          var inspireLayers = layers.slice(0);
          var groups = this._getLayerGroups(inspireLayers, 'getInspireName')
          tab.showLayerGroups(groups);
          
		  tabContainer.addPanel(tab.getTabPanel());
		}		
		/*
		
		// select layers that were possibly added before this bundle was loaded
		var selectedLayers = sandbox.findAllSelectedMapLayers();
		for(var i = 0; i < selectedLayers.length; ++i) {
			this.handleLayerSelectionChanged(selectedLayers[i], true);
		}
		*/
	},
	/**
	 * @method _getLayerGroups
	 * @private
	 */
	_getLayerGroups : function(layers, groupingMethod) {
        var me = this;
        var sandbox = this.instance.getSandbox();

        var groupList = [];

        // sort layers by grouping & name
        layers.sort(function(a, b) {
            return me._layerListComparator(a, b, groupingMethod);
        });
        var group = null;
        for (var n = 0; n < layers.length; ++n) {
            var layer = layers[n];
            var groupAttr = layer[groupingMethod]();
            if (!group || group.getTitle() != groupAttr) {
                if (group) {
                    groupList.push(group);
                }
                group = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.model.LayerGroup", groupAttr);
            }
            group.addLayer(layer);

        }
        return groupList;
    },
    /**
     * @method _layerListComparator
     * Uses the private property #grouping to sort layer objects in the wanted order for rendering
     * The #grouping property is the method name that is called on layer objects.
     * If both layers have same group, they are ordered by layer.getName()
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
     * @param {String} groupingMethod method name to sort by
     */
    _layerListComparator : function(a, b, groupingMethod) {
        var nameA = a[groupingMethod]().toLowerCase();
        var nameB = b[groupingMethod]().toLowerCase();
        if(nameA == nameB) {
            nameA = a.getName().toLowerCase();
            nameB = b.getName().toLowerCase();          
        }
        if (nameA < nameB) {return -1}
        if (nameA > nameB) {return 1}
        return 0;
    },
    /**
     * @method handleLayerSelectionChanged
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was changed
	 * @param {Boolean} isSelected
     *           true if layer is selected, false if removed from selection
     * let's refresh ui to match current layer selection
     */
	handleLayerSelectionChanged : function(layer, isSelected) {
		//var layerDiv = jQuery(this.container).find('div[layer_id=' + layer.getId() +']');
		//layerDiv.find('input').attr('checked', (isSelected == true));
	},
    /**
     * @method handleLayerModified
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was modified
     * let's refresh ui to match current layers
     */
    handleLayerModified : function(layer) {
        var me = this;
		//var layerDiv = jQuery(this.container).find('div[layer_id=' + layer.getId() +']');
		//jQuery(layerDiv).find('.layer-title').html(layer.getName());
    },
    /**
     * @method handleLayerAdded
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was added
     * let's refresh ui to match current layers
     */
    handleLayerAdded : function(layer) {
        var me = this;
        //me.createUi();
        // we could just add the layer to correct group and update the layer count for the group
        // but saving time to do other finishing touches
		//var layerListContainer = jQuery(this.container).find('div.layerList');
		//this._populateLayerList(layerListContainer);
    },
    /**
     * @method handleLayerRemoved
     * @param {String} layerId
     *           id of layer that was removed
     * let's refresh ui to match current layers
     */
    handleLayerRemoved : function(layerId) {
        var me = this;
        //me.createUi();
        // we could  just remove the layer and update the layer count for the group
        // but saving time to do other finishing touches
		//var layerListContainer = jQuery(this.container).find('div.layerList');
		//this._populateLayerList(layerListContainer);
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
