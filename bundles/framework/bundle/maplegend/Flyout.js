/**
 * @class Oskari.mapframework.bundle.maplegend.Flyout
 * 
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.maplegend.LayerSelectorBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.templateLayer = null;
	this.templateLayerGroup = null;
	this.templateGroupingTool = null;
	this.state = null;
	// default grouping
	this.grouping = 'getInspireName';
	this.groupingTools = [];
	this.filterField = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.maplegend.Flyout';
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
		if(!jQuery(this.container).hasClass('maplegend')) {
			jQuery(this.container).addClass('maplegend');
		}
	},
	
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
	startPlugin : function() {
		
		var me = this;
		this.template = jQuery('<div class="groupingTabs"><ul></ul></div><br clear="all"/>' +
				'<div class="allLayersTabContent">' + 
                '<div class="filter"></div>' + 
				'<div class="layerList volatile"></div></div>');
				
		this.templateLayer = jQuery('<div class="layer"><input type="checkbox" /> ' +
				'<div class="layer-tools"><div class="layer-icon"></div><div class="layer-info"></div></div>' + 
				'<div class="layer-title"></div>' + 
				'<div class="layer-keywords"></div>' + 
			'</div>');
		this.templateLayerGroup = jQuery('<div class="layerGroup"><div class="header"><div class="groupIcon"></div><div class="groupHeader"><span class="groupName"></span><span class="layerCount"></span></div></div></div>');	
		this.templateGroupingTool = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
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
        
 
    },
    getContentState : function() {
     
        return {
            
        };
    },
    
    createUi: function() {
    	
    	
    },
    
    /**
     * @method handleLayerSelectionChanged
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer
     *           layer that was changed
     * @param {Boolean} isSelected
     *           true if layer is selected, false if removed from selection
     * @param {Boolean} keepLayersOrder
     *           true to ignore baselayer placement
     * If isSelected is false, removes the matching layer container from the UI.
     * If isSelected is true, constructs a matching layer container and adds it
     * to the UI.
     */
    handleLayerSelectionChanged : function(layer, isSelected, keepLayersOrder) {
    	
    },
    
     /**
     * @method handleLayerStyleChanged
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer that had its style changed
     *
     * Handles style dropdown change when it is changed externally
     */
    handleLayerStyleChanged : function(layer) {
        
        /* this might show different legend for different styles IF we had those stored */
        
    }

	

}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
