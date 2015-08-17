/**
 * @class Oskari.liikennevirasto.bundle.lakapa.layerselector2.Flyout
 * 
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.layerselector2.Flyout',

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
		return 'Oskari.liikennevirasto.bundle.lakapa.layerselector2.Flyout';
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
		
        var inspireTab = Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.layerselector2.view.LayersTab", this.instance, this.instance.getLocalization('filter').inspire);
        inspireTab.groupingMethod = 'getInspireName';
        
		me.layerTabs.push(inspireTab);
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
	},
    setContentState : function(state) {
        // prepare for complete state reset
        if(!state) {
            state = {};
        }
        
        for(var i = 0; i < this.layerTabs.length; ++i) {
            var tab = this.layerTabs[i];
            if(tab.getTitle() == state.tab) {
                this.tabContainer.select(tab.getTabPanel());
                tab.setState(state);
            }
        }
    },
    getContentState : function() {
        var state = {};
        for(var i = 0; i < this.layerTabs.length; ++i) {
            var tab = this.layerTabs[i];
            if(this.tabContainer.isSelected(tab.getTabPanel())) {
                state = tab.getState();
                break;
            }
        }
        return state;
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
		
        this.tabContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
        this.tabContainer.insertTo(cel);
        for(var i = 0; i < this.layerTabs.length; ++i) {
            var tab = this.layerTabs[i];
            this.tabContainer.addPanel(tab.getTabPanel());
        }
        //this.tabContainer.addTabChangeListener(me._tabsChanged); // -> filter with same keyword when changing tabs?
        this.populateLayers();
	},
    populateLayers : function() {
        var sandbox = this.instance.getSandbox();
        // populate layer list
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var layers = mapLayerService.getAllLayers();
        
        for(var i = 0; i < this.layerTabs.length; ++i) {
          var tab = this.layerTabs[i];
          // populate tab if it has grouping method
          if(tab.groupingMethod) {
              var layersCopy = layers.slice(0);
              var groups = this._getLayerGroups(layersCopy, tab.groupingMethod);
              tab.showLayerGroups(groups);
          }
        }
    },
	/**
	 * @method _getLayerGroups
	 * @private
	 */
	_getLayerGroups : function(layers, groupingMethod) {
        var me = this;
        var sandbox = this.instance.getSandbox();

        var groupList = [];          
       
        var layersSorted = {};
        
        jQuery.each(me.instance.conf.orders, function(key, order){
           var temp = jQuery.grep(layers, function(layer, i){
                var name = layer.getInspireName().toLowerCase();
                return name == key;
           });
           if(typeof layersSorted[order] == 'undefined') layersSorted[order] = [];
           layersSorted[order] = layersSorted[order].concat(temp);
        });        
        
        var group = null;
        jQuery.each(layersSorted, function(key, layers){
            for (var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                if(layer.getMetaType && layer.getMetaType() == 'published') {
                    // skip published layers
                    continue;
                }
                var groupAttr = layer[groupingMethod]();
                if (!group || group.getTitle() != groupAttr) {
                    group = Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.layerselector2.model.LayerGroup", groupAttr);
                    groupList.push(group);
                }
                group.addLayer(layer);
    
            }
        });
        return groupList;
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
      for(var i = 0; i < this.layerTabs.length; ++i) {
          var tab = this.layerTabs[i];
	      tab.setLayerSelected(layer.getId(), isSelected);
	  }
	},
    /**
     * @method handleLayerModified
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was modified
     * let's refresh ui to match current layers
     */
    handleLayerModified : function(layer) {
        var me = this;
        for (var i = 0; i < this.layerTabs.length; ++i) {
            var tab = this.layerTabs[i];
            tab.updateLayerContent(layer.getId(), layer);
        }
    },

    /**
     * @method handleLayerAdded
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was added
     * let's refresh ui to match current layers
     */
    handleLayerAdded : function(layer) {
        var me = this;
        this.populateLayers();
    },
    /**
     * @method handleLayerRemoved
     * @param {String} layerId
     *           id of layer that was removed
     * let's refresh ui to match current layers
     */
    handleLayerRemoved : function(layerId) {
        var me = this;
        this.populateLayers();
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
