/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * RightJS-UI Tooltips v2.2.1
 * http://rightjs.org/ui/tooltips
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var Tooltip=RightJS.Tooltip=function(a,b){function c(a,c){c||(c=a,a="DIV");var d=new b.Class(b.Element.Wrappers[a]||b.Element,{initialize:function(c,d){this.key=c;var e=[{"class":"rui-"+c}];this instanceof b.Input||this instanceof b.Form||e.unshift(a),this.$super.apply(this,e),b.isString(d)&&(d=b.$(d)),d instanceof b.Element&&(this._=d._,"$listeners"in d&&(d.$listeners=d.$listeners),d={}),this.setOptions(d,this);return b.Wrapper.Cache[b.$uid(this._)]=this},setOptions:function(a,c){c&&(a=b.Object.merge(a,(new Function("return "+(c.get("data-"+this.key)||"{}")))())),a&&b.Options.setOptions.call(this,b.Object.merge(this.options,a));return this}}),e=new b.Class(d,c);b.Observer.createShortcuts(e.prototype,e.EVENTS||b([]));return e}var d=b,e=b.$,f=b.$w,g=b.$uid,h=b.Element,i=new c({extend:{version:"2.2.1",EVENTS:f("show hide"),Options:{cssRule:"[data-tooltip]",fxName:"fade",fxDuration:400,delay:400,move:!0,idSuffix:"-tooltip"},current:null,instances:d([]),find:function(a){var b=a.target;if(b.match(i.Options.cssRule)){var c=g(b);return i.instances[c]||(i.instances[c]=new i(b))}}},initialize:function(b,c){this.associate=b=e(b),this.$super("tooltip").setOptions(c,b).insert('<div class="rui-tooltip-arrow"></div><div class="rui-tooltip-container">'+(b.get("title")||b.get("alt"))+"</div>").on({mouseout:this._mouseOut,mouseover:this._cancelTimer}).insertTo(a.body),b.has("id")&&this.set("id",b.get("id")+this.options.idSuffix),b.set({title:"",alt:""})},hide:function(){this._cancelTimer(),this._timer=d(function(){h.prototype.hide.call(this,this.options.fxName,{engine:"javascript",duration:this.options.fxDuration}),i.current=null,this.fire("hide")}).bind(this).delay(100);return this},show:function(a){i.instances.each(function(a){a&&a!==this&&a.hide()},this),this._timer=d(function(){h.prototype.show.call(this.stop(),this.options.fxName,{engine:"javascript",duration:this.options.fxDuration}),i.current=this.fire("show")}).bind(this).delay(this.options.delay);return i.current=this},moveToEvent:function(a){this.options.move&&(this._.style.left=a.pageX+"px",this._.style.top=a.pageY+"px");return this},_cancelTimer:function(){this._timer&&(this._timer.cancel(),this._timer=null);return!1},_mouseOut:function(a){a.stop(),a.relatedTarget!==this.associate&&this.hide()}});e(a).on({mouseenter:function(a){var b=i.find(a);b&&b.show().moveToEvent(a)},mouseleave:function(a){var b=i.find(a);b&&b.hide()},mousemove:function(a){var b=i.current;b!==null&&b.options.move&&b.moveToEvent(a)}});var j=a.createElement("style"),k=a.createTextNode("div.rui-tooltip{display:none;position:absolute;z-index:99999;font-size:90%;margin-top:16pt;margin-left:5pt;color:#FFF;text-shadow:0 0 .2em #000;border:.3em solid rgba(255,255,255,0.2);background-color:rgba(25,25,25,0.92);background-color:#000 \\9;border:.3em solid #444 \\9;background-image:-webkit-gradient(linear,0% 0%,0% 100%,from(transparent) ,to(#000) );border-radius:.4em;-moz-border-radius:.4em;-webkit-border-radius:.4em;box-shadow:0 0 .4em #555;-moz-box-shadow:0 0 .4em #555;-webkit-box-shadow:0 0 .4em #555}div.rui-tooltip-container{margin:.4em .6em}");j.type="text/css",a.getElementsByTagName("head")[0].appendChild(j),j.styleSheet?j.styleSheet.cssText=k.nodeValue:j.appendChild(k);return i}(document,RightJS)/**
 * @class Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance
 *
 * Main component and starting point for the "all layers" functionality. 
 * Lists all the layers available in Oskari.mapframework.service.MapLayerService and updates 
 * UI if Oskari.mapframework.event.common.MapLayerEvent is received.
 * 
 * See Oskari.mapframework.bundle.layerselector2.LayerSelectorBundle for bundle definition. 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'LayerSelector',
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
    	if(!this._localization) {
    		this._localization = Oskari.getLocalization(this.getName());
    	}
    	if(key) {
    		return this._localization[key];
    	}
        return this._localization;
    },
	/**
	 * @method start
	 * implements BundleInstance protocol start method
	 */
	"start" : function() {
		var me = this;

		if(me.started) {
            return;
		}

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		
		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
		sandbox.request(this, request);

		// draw ui
		me.createUi();
		
    	var mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
    	
        sandbox.registerAsStateful(this.mediator.bundleId, this);
        
		var successCB = function() {
			// massive update so just recreate the whole ui
			me.createUi();
		};
		var failureCB = function() {
			alert(me.getLocalization('errors').loadFailed);
		};
		mapLayerService.loadAllLayersAjax(successCB, failureCB);
	},
	/**
	 * @method init
	 * implements Module protocol init method - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
		/**
		 * @method AfterMapLayerRemoveEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
		 * 
		 * Calls flyouts handleLayerSelectionChanged() method
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), false);
		},
		/**
		 * @method AfterMapLayerAddEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
		 * 
		 * Calls flyouts handleLayerSelectionChanged() method
		 */
		'AfterMapLayerAddEvent' : function(event) {
			this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), true);
		},
		/**
		 * @method MapLayerEvent
		 * @param {Oskari.mapframework.event.common.MapLayerEvent} event
		 */
		'MapLayerEvent' : function(event) {
			
        	var mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        	var layerId = event.getLayerId();
        	
        	if(event.getOperation() === 'update') {
        		var layer = mapLayerService.findMapLayer(layerId);
				this.plugins['Oskari.userinterface.Flyout'].handleLayerModified(layer);
			}
			else if(event.getOperation() === 'add') {
        		var layer = mapLayerService.findMapLayer(layerId);
				this.plugins['Oskari.userinterface.Flyout'].handleLayerAdded(layer);
				// refresh layer count
				this.plugins['Oskari.userinterface.Tile'].refresh();
			}
			else if(event.getOperation() === 'remove') {
				this.plugins['Oskari.userinterface.Flyout'].handleLayerRemoved(layerId);
				// refresh layer count
				this.plugins['Oskari.userinterface.Tile'].refresh();
			}
		}
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

        this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.layerselector2.Flyout
	 * Oskari.mapframework.bundle.layerselector2.Tile
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.Tile', this);
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the component 
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the component 
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method createUi
	 * (re)creates the UI for "all layers" functionality
	 */
	createUi : function() {
		var me = this;
		this.plugins['Oskari.userinterface.Flyout'].createUi();
		this.plugins['Oskari.userinterface.Tile'].refresh();
	},
    
    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
    setState : function(state) {
        this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
    },
    
    /**
     * @method getState
     * @return {Object} bundle state as JSON
     */
    getState : function() {
        return this.plugins['Oskari.userinterface.Flyout'].getContentState();
        /*
        var state = {
            
            
        };
        
        return state;
        */
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
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
				'<div class="filter"><input name="text-filter" type="text" /></div>' + 
				'<div class="layerList volatile"></div></div>');
				
		this.templateLayer = jQuery('<div class="layer"><input type="checkbox" /> ' +
				'<div class="layer-tools"><div class="layer-icon"></div><div class="layer-info"></div></div>' + 
				'<div class="layer-title"></div>' + 
				'<div class="layer-keywords"></div>' + // <br clear="all" /> 
			'</div>');
		this.templateLayerGroup = jQuery('<div class="layerGroup"><div class="groupHeader"><span class="groupName"></span><span class="layerCount"></span></div></div>');
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
        jQuery(this.container).find('input[name=text-filter]').val('');
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
        jQuery(this.container).find('input[name=text-filter]').val(filter);
        this._filterLayers(state.filter);
        
        if(!state.filter && state.groups) {
            var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup');
            //groupContainer.addClass('remove');
            for(var i=0; i < state.groups.length; ++i) {
                var group = state.groups[i];
                
                var groupTitleContainer = layerGroups.find('span.groupName:contains(' + group + ')');
                if(groupTitleContainer) {
                    var groupContainer = groupTitleContainer.parent().parent();
                    groupContainer.addClass('open');
                    groupContainer.find('div.layer').show();
                }
            }
        }
    },
    getContentState : function() {
        var filterText = jQuery(this.container).find('input[name=text-filter]').val();
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
		var field = cel.find('input[name=text-filter]');
		field.attr('placeholder', this.instance.getLocalization('filter').text);
		field.keyup(function() {
    		var field = jQuery(this);
    		var value = field.val();
    		me._filterLayers(value);
		});
		
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
					// and hide the group
					groupDiv.hide();
				}
				// layers in group match the keyword
				else {
					// mark group with open flag if not already flagged
					if(!groupDiv.hasClass('open')) {
						groupDiv.addClass('open');
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
			var keyword = jQuery(this.container).find('input[name=text-filter]').val();
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
		var groupHeader = jQuery(layerGroupDiv).find('div.groupHeader');
		groupHeader.find('span.groupName').append(groupName);
		groupHeader.click(function() {
    		var groupDiv = jQuery(this).parent();
			var isOpen = groupDiv.hasClass('open');
			// layer is open -> close it
			if(isOpen) {
				groupDiv.removeClass('open');
				groupDiv.find('div.layer').hide();
			}
			// layer is closed -> open it
			else {
				groupDiv.addClass('open');
                // show only the layers that match filtering keyword
                var filter = jQuery(me.container).find('input[name=text-filter]').val();
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
			//icon.addClass('base');
			icon.attr('title', tooltips['type-base']);
			// tooltip = mapservice_basemap_image_tooltip
		}
		else if(layer.isLayerOfType('WMS')) {
			if(layer.isGroupLayer()) {
                icon.addClass('layer-group');
				//icon.addClass('group');
			}
			else {
                icon.addClass('layer-wms');
				//icon.addClass('wms');
			}
			icon.attr('title', tooltips['type-wms']);
			// tooltip = mapservice_maplayer_image_tooltip
		}
		// FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
		// but since it would require some refactoring to make this general
		// I'll just leave this like it was on old implementation
		else if(layer.isLayerOfType('WMTS')) {
			//icon.addClass('wmts');
            icon.addClass('layer-wmts');
			icon.attr('title', tooltips['type-wms']);
			// tooltip = mapservice_maplayer_image_tooltip
		}
		else if(layer.isLayerOfType('WFS')) {
			//icon.addClass('wfs');
            icon.addClass('layer-wfs');
			icon.attr('title', tooltips['type-wfs']);
			// tooltip = selected_layers_module_wfs_icon_tooltip
		}
		else if(layer.isLayerOfType('VECTOR')) {
			//icon.addClass('vector');
            icon.addClass('layer-vector');
			icon.attr('title', tooltips['type-wms']);
			// tooltip = mapservice_maplayer_image_tooltip
		}
		
		
        if(layer.getDataUrl()) {
		    tools.find('div.layer-info').addClass('icon-info');
        	tools.find('div.layer-info').click(function() {
				alert('TODO: send ShowOverlayPopupRequest with ' + layer.getDataUrl());
				// 'ShowOverlayPopupRequest\',[\'' + dataUrl + '\']
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
/**
 * @class Oskari.mapframework.bundle.layerselector2.Tile
 * Renders the "all layers" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.badge = Oskari.clazz.create('Oskari.userinterface.component.Badge');
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.layerselector2.Tile';
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
		this.container = jQuery(el);
		 var status = this.container.children('.oskari-tile-status');
	      this.badge.insertTo(status);
	},
	/**
	 * @method startPlugin
	 * Interface method implementation, calls #refresh() 
	 */
	startPlugin : function() {
		this.refresh();
	},
	/**
	 * @method stopPlugin 
	 * Interface method implementation, clears the container 
	 */
	stopPlugin : function() {
		this.container.empty();
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the tile 
	 */
	getTitle : function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the tile 
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
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	/**
	 * @method refresh
	 * Creates the UI for a fresh start
	 */
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
		var layers = mapLayerService.getAllLayers();

		this.badge.setContent(''+layers.length);
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Tile']
});
