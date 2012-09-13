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
		this.groupingTools = [
			{
				"title" : this.instance.getLocalization('filter').inspire,
				"callback" : function() {
					me.doGrouping('getInspireName');
				}
			},
			{
				"title" : this.instance.getLocalization('filter').organization,
				"callback" : function() {
					me.doGrouping('getOrganizationName');
				}
			}
		];
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
		
		// clone content container from template
		var content = this.template.clone();
		// add content container to flyout
		cel.append(content);
		
		var toolsContainer = cel.find('div.groupingTabs ul');
		this._populateGroupingTools(toolsContainer);
		
		
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();
        field.bindChange(function(event) {
            me._filterLayers(field.getValue());
        }, true);
        cel.find('div.filter').append(field.getField());
        this.filterField = field;
        
		// populate layer list
		var layerListContainer = cel.find('div.layerList');
		this._populateLayerList(layerListContainer);
		
		// select layers that were possibly added before this bundle was loaded
		var selectedLayers = sandbox.findAllSelectedMapLayers();
		for(var i = 0; i < selectedLayers.length; ++i) {
			this.handleLayerSelectionChanged(selectedLayers[i], true);
		}
	},
	/**
	 * @method _filterLayers
	 * @private
	 * @param {String} keyword
	 * 		keyword to filter layers by
	 * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
	 * Also checks if all layers in a group is hidden and hides the group as well.
	 */
	_filterLayers : function(keyword) {
	    
		// TODO: optimization propably needed
		var layerGroups = jQuery('div.layerList div.layerGroup');
		if(keyword && keyword.length > 0) {
			// show all groups
			layerGroups.show();
			// hide all layers
			layerGroups.find('div.layer').hide();
			// show the layers that match keyword
			layerGroups.find('div.layer div.layer-keywords:contains(' + keyword.toLowerCase() + ')').parent().show();
			// hide groups with no layers visible
			layerGroups.each(function(index) {
				var groupDiv = jQuery(this); 
				// get the visible layers so we know how the group container should be handled
				var visibleLayers = groupDiv.find('div.layer').filter(":visible");
				// no layers in group match the keyword 
				if(visibleLayers.length == 0) {
					// clear 'open' flag at this point
					groupDiv.removeClass('open');
			        groupDiv.find('div.groupIcon').removeClass('icon-arrow-down');
			        groupDiv.find('div.groupIcon').addClass('icon-arrow-right');
					// and hide the group
					groupDiv.hide();
				}
				// layers in group match the keyword
				else {
					// mark group with open flag if not already flagged
					if(!groupDiv.hasClass('open')) {
						groupDiv.addClass('open');
				        groupDiv.find('div.groupIcon').removeClass('icon-arrow-right');
				        groupDiv.find('div.groupIcon').addClass('icon-arrow-down');
					}
					
                    visibleLayers.removeClass('odd');
                    visibleLayers.filter(':odd').addClass("odd");
				}
			});
			// TODO: check if there are no groups visible -> show 'no matches' notification?
		}
		else {
			// show all groups
			layerGroups.show();
			// layer groups are closed by default so remove 'open' flag
			layerGroups.removeClass('open');
	        layerGroups.find('div.groupIcon').removeClass('icon-arrow-down');
	        layerGroups.find('div.groupIcon').addClass('icon-arrow-right');
			// and hide layers
			layerGroups.find('div.layer').hide();
		}
	},
	/**
	 * @method _layerListComparator
	 * Uses the private property #grouping to sort layer objects in the wanted order for rendering
	 * The #grouping property is the method name that is called on layer objects.
	 * If both layers have same group, they are ordered by layer.getName()
	 * @private
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
	 */
	_layerListComparator : function(a, b) {
		var nameA = a[this.grouping]().toLowerCase();
		var nameB = b[this.grouping]().toLowerCase();
		if(nameA == nameB) {
			nameA = a.getName().toLowerCase();
			nameB = b.getName().toLowerCase();			
		}
		if (nameA < nameB) {return -1}
		if (nameA > nameB) {return 1}
		return 0;
	},
	/**
	 * @method _populateLayerList
	 * @private
	 * @param {Object} layerListContainer reference to jQuery object representing the layerlist placeholder
	 * Renders layer information as list to the given container object.
	 * Layers are sorted by grouping & name 
	 */
	_populateLayerList : function(layerListContainer) {
		var me = this;
		var sandbox = this.instance.getSandbox();
		// clear list
		layerListContainer.empty();
		
		// populate layer list
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
		var layers = mapLayerService.getAllLayers();
		
		// sort layers by grouping & name
		layers.sort(function(a,b) {
			return me._layerListComparator(a,b);
		});
		
		var layerGroupContainer = null;
		var layerGroup = null;
		var layerCount = 0;
		var isOddLayer = true;
		for(var n = 0; n < layers.length; ++n) {
			var layer = layers[n];
			var layerContainer = this._createLayerContainer(layer);
			var groupAttr = layer[this.grouping]();
			// group changed
			if(layerGroup != groupAttr) {
				// update layer count
				if(layerGroupContainer) {
					// dont' try on first group since there is no previous group
					layerGroupContainer.find('span.layerCount').html(' (' + layerCount +')');
				}
				// create new group
				layerGroupContainer = this._createLayerGroupContainer(groupAttr);
				layerListContainer.append(layerGroupContainer);
				layerGroup = groupAttr;
				// reset counter
				layerCount = 0;
				isOddLayer = true;
			}
			if(isOddLayer) {
				layerContainer.addClass('odd');
			}
			isOddLayer = !isOddLayer;
			layerGroupContainer.append(layerContainer);
			layerCount++;
			
		}
		if(layerGroupContainer) {
			// write layer count to last group
			layerGroupContainer.find('span.layerCount').html(' (' + layerCount +')');
			// do filtering (in case this was initiated by grouping change etc)
			var keyword = this.filterField.getValue();
			me._filterLayers(keyword);
		}
	},
	/**
	 * @method doGrouping
	 * Assigns a private property #grouping that will be used to sort layer objects
	 * in the wanted order when rendering.
	 * The #grouping property is the method name that is called on layer objects.
	 * Redraws the layer list with the new ordering when done 
	 * 
	 * @param {String} methodName name of the method on a layer domain object that returns the property we want to sort by
	 */
	doGrouping : function(methodName) {
		this.grouping = methodName;
		var layerListContainer = jQuery(this.container).find('div.layerList');
		this._populateLayerList(layerListContainer);
	},

	/**
	 * @method _populateGroupingTools
	 * @private
	 * Creates tools to the given container based on #groupingTools 
	 * @param {Object} tools reference to container that tools will be added to
	 */
	_populateGroupingTools : function(tools) {
		var me = this;
	    for(var i = 0; i < this.groupingTools.length; ++i) {
	    	var tool = this.groupingTools[i];
	    	var toolContainer = this.templateGroupingTool.clone();
	    	if(i == 0) {
	        	toolContainer.addClass('active');
	    	}
	    	toolContainer.find('a').html(tool.title);
	        tools.append(toolContainer);
	    	toolContainer.bind('click', function() {
	    		var tab = jQuery(this);
                var toolIndex = tab.index();
	    		me.groupingTools[toolIndex].callback();
	    		// mark as selected
				tab.closest('ul').find('li').removeClass('active');
	        	tab.addClass('active');
	        });
        }
	},
	/**
	 * @method _createLayerGroupContainer
	 * @private
	 * Creates the layer group containers
	 * @param {String} groupName title for the group
	 */
	_createLayerGroupContainer : function(groupName) {
		var me = this;
		var sandbox = me.instance.getSandbox();
		
		// clone from layer group template
		var layerGroupDiv = this.templateLayerGroup.clone();
    	var groupHeader = jQuery(layerGroupDiv).find('div.header');
        groupHeader.find('span.groupName').append(groupName);
        groupHeader.click(function() {
        	var groupDiv = jQuery(this).parent();
			var isOpen = groupDiv.hasClass('open');
			// layer is open -> close it
			if(isOpen) {
				groupDiv.removeClass('open');
		        groupDiv.find('div.groupIcon').removeClass('icon-arrow-down');
		        groupDiv.find('div.groupIcon').addClass('icon-arrow-right');
				groupDiv.find('div.layer').hide();
			}
			// layer is closed -> open it
			else {
				groupDiv.addClass('open');
		        groupDiv.find('div.groupIcon').removeClass('icon-arrow-right');
				groupDiv.find('div.groupIcon').addClass('icon-arrow-down');
                // show only the layers that match filtering keyword
                var filter = me.filterField.getValue();
                if(filter) {
                    groupDiv.find('div.layer div.layer-keywords:contains(' + filter.toLowerCase() + ')').parent().show();
                }
                else {
                    var visibleLayers = groupDiv.find('div.layer');
                    visibleLayers.removeClass('odd');
                    visibleLayers.filter(':odd').addClass("odd");
                    visibleLayers.show();
                }
			}
		});
		
		return layerGroupDiv;
	},
	/**
	 * @method _createLayerContainer
	 * @private
	 * Creates the layer containers
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
	 */
	_createLayerContainer : function(layer) {
		
		var me = this;
		var sandbox = me.instance.getSandbox();
		var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
		var removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
		
		// clone from layer template
		var layerDiv = this.templateLayer.clone();
		
		// setup filtering keywords and hide them from ui
		var keywords = jQuery(layerDiv).find('.layer-keywords');
		keywords.append(layer.getName().toLowerCase());
		keywords.append(' ' + layer.getInspireName().toLowerCase());
		keywords.append(' ' + layer.getOrganizationName().toLowerCase());
		keywords.hide();
		
		var tooltips = this.instance.getLocalization('tooltip');
		var tools = jQuery(layerDiv).find('div.layer-tools');
		var icon = tools.find('div.layer-icon'); 
		if(layer.isBaseLayer()) {
            icon.addClass('layer-base');
			icon.attr('title', tooltips['type-base']);
		}
		else if(layer.isLayerOfType('WMS')) {
			if(layer.isGroupLayer()) {
                icon.addClass('layer-group');
			}
			else {
                icon.addClass('layer-wms');
			}
			icon.attr('title', tooltips['type-wms']);
		}
		// FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
		// but since it would require some refactoring to make this general
		// I'll just leave this like it was on old implementation
		else if(layer.isLayerOfType('WMTS')) {
            icon.addClass('layer-wmts');
			icon.attr('title', tooltips['type-wms']);
		}
		else if(layer.isLayerOfType('WFS')) {
            icon.addClass('layer-wfs');
			icon.attr('title', tooltips['type-wfs']);
		}
		else if(layer.isLayerOfType('VECTOR')) {
            icon.addClass('layer-vector');
			icon.attr('title', tooltips['type-wms']);
		}
		
		
        if(layer.getDataUrl()) {
		    tools.find('div.layer-info').addClass('icon-info');
        	tools.find('div.layer-info').click(function() {
				  var rn = 'catalogue.ShowMetadataRequest';
				  var uuid = layer.getDataUrl();
				  var idx = uuid.indexOf('uuid=');
				  if (idx >= 0) {
				      uuid = uuid.substring(idx + 5);
				  }
				  idx = uuid.indexOf('&');
				  if (idx >= 0) {
				      uuid = uuid.substring(0, idx);
				  }
				  sandbox.postRequestByName(rn, [
				      { uuid : uuid }
				  ]);
			});
		}
		
		// setup id
		jQuery(layerDiv).attr('layer_id', layer.getId());
		jQuery(layerDiv).find('.layer-title').append(layer.getName());
		jQuery(layerDiv).find('input').change(function() {
    		var checkbox = jQuery(this);
    		var request = null;
    		
    		if(checkbox.is(':checked')) {
	  			request = addRequestBuilder(layer.getId(), true);
    		}
    		else {
	  			request = removeRequestBuilder(layer.getId());
    		}
            sandbox.request(me.instance.getName(), request);
		});
		
		return layerDiv;
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
		var layerDiv = jQuery(this.container).find('div[layer_id=' + layer.getId() +']');
		layerDiv.find('input').attr('checked', (isSelected == true));
	},
    /**
     * @method handleLayerModified
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was modified
     * let's refresh ui to match current layers
     */
    handleLayerModified : function(layer) {
        var me = this;
		var layerDiv = jQuery(this.container).find('div[layer_id=' + layer.getId() +']');
		jQuery(layerDiv).find('.layer-title').html(layer.getName());
    },
    /**
     * @method handleLayerAdded
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was added
     * let's refresh ui to match current layers
     */
    handleLayerAdded : function(layer) {
        var me = this;
        // we could just add the layer to correct group and update the layer count for the group
        // but saving time to do other finishing touches
		var layerListContainer = jQuery(this.container).find('div.layerList');
		this._populateLayerList(layerListContainer);
    },
    /**
     * @method handleLayerRemoved
     * @param {String} layerId
     *           id of layer that was removed
     * let's refresh ui to match current layers
     */
    handleLayerRemoved : function(layerId) {
        var me = this;
        // we could  just remove the layer and update the layer count for the group
        // but saving time to do other finishing touches
		var layerListContainer = jQuery(this.container).find('div.layerList');
		this._populateLayerList(layerListContainer);
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
