/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides a maplayer selection "dropdown" on top of the map. 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.element = undefined;
    this.conf = config;
}, {
    /** @static @property __name module name */
    __name : 'LayerSelectionPlugin',

    /**
     * @method getName
     * @return {String} module name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * Returns reference to map module this plugin is registered to
     * @return {Oskari.mapframework.ui.module.common.MapModule} 
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if(mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * @return {Boolean}
     * This plugin doesn't have an UI so always returns false
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method getMap
     * @return {OpenLayers.Map} reference to map implementation
     *
     */
    getMap : function() {
        return this._map;
    },
    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {
    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
    },
    /**
     * @method init
     *
     * Interface method for the module protocol. Initializes the request
     * handlers.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        this.template = jQuery("<div class='layerSelectionPlugin'>" +
        	'<div class="header"><div class="header-icon icon-arrow-white-right"></div></div>' +
        	'<div class="content"><div class="layers"></div><div class="baselayers"></div></div>' +
            "</div>");
        this.templateLayer = jQuery("<div class='layer'><span></span></div>");
        this.templateCheckbox = jQuery("<input type='checkbox' />");
        this.templateRadiobutton = jQuery("<input type='radio' name='defaultBaselayer'/>");
    	this.templateBaseLayerHeader = jQuery('<div class="baseLayerHeader"></div>');
        
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Registers requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();
        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
		
		this._createUI();

		// reacting to conf
		if(this.conf && this.conf.baseLayers) {
			// TODO: currently not tested, TEST ON PUBLISHED MAP!
			for(var i = 0; i < this.conf.baseLayers.length; ++i) {
				this.addBaseLayer(this.conf.baseLayers[i]);
			}
			if(this.conf.defaultBase) {
				this.selectBaseLayer(this.conf.defaultBase);
			}
		}
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol. Unregisters requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        
        // remove ui
        if(this.element) {
	        this.element.remove();
	        this.element = undefined;
        }
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method preselectLayers
     * Does nothing, protocol method for mapmodule-plugin
     */
    preselectLayers : function(layers) {
    },
    /**
     * @method selectBaseLayer
     * Tries to find given layer from baselayers and select it programmatically
     * @param {String} layerId id for layer to select
     */
    selectBaseLayer : function(layerId) {
        var baseLayersDiv = this.element.find('div.content div.baselayers');
        if(!baseLayersDiv || baseLayersDiv.length == 0) {
        	return;
        }
    	var input = baseLayersDiv.find('input[value=' + layerId + ']');
    	input.attr('checked', 'checked');
		this._changedBaseLayer();
    },
    /**
     * @method addLayer
     * Adds given layer to the selection
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to add
     */
    addLayer : function(layer) {
    	var me = this;
        var content = this.element.find('div.content');
        var layersDiv = content.find('div.layers');
    	
    	var div = this.templateLayer.clone();
    	div.find('span').append(layer.getName());
    	
    	var input = this.templateCheckbox.clone();
    	input.attr('value', layer.getId());
    	if(layer.isVisible()) {
    		input.attr('checked', 'checked');
    	}
    	this._bindCheckbox(input, layer);
    	
        div.find('span').before(input);
        this.layerRefs[layer.getId()] = div;
        layersDiv.append(div);
    },
    /**
     * @method _bindCheckbox
     * Binds given checkbox to control given layers visibility
     * @param {jQuery} input input to bind
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to control
     * @private
     */
    _bindCheckbox : function(input, layer) {
    	var me = this;

        input.change(function() {
            var checkbox = jQuery(this);
            var isChecked = checkbox.is(':checked');
            if (isChecked) {
    			// send request to show map layer
				me._setLayerVisible(layer, true);
            } else {
        		// send request to hide map layer
				me._setLayerVisible(layer, false);
            }
        });
    },
    /**
     * @method _setLayerVisible
     * Makes given layer visible or hides it
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to control
     * @param {Boolean} blnVisible true to show, false to hide
     * @private
     */
    _setLayerVisible : function(layer, blnVisible) {
    	var sandbox = this._sandbox;
        var visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
        var request = visibilityRequestBuilder(layer.getId(), blnVisible);
        sandbox.request(this, request);
        
        // ensure that checkbox is in correct state
        var div = this.layerRefs[layer.getId()];
        var input = div.find('input');
		if(blnVisible) {
			if(!input.is(':checked')) {
    			input.attr('checked', 'checked');
			}
		}
		else {
			if(input.is(':checked')) {
    			input.removeAttr('checked');
			}
		}
    },
    /**
     * @method removeLayer
     * Removes given layer from the selection
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to remove
     */
    removeLayer : function(layer) {
        var div = this.layerRefs[layer.getId()];
    	div.remove();
    	delete this.layerRefs[layer.getId()];
    },
    /**
     * @method addBaseLayer
     * Assumes that the layer is already added as normal layer and moves it to being a base layer
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
     */
    addBaseLayer : function(layer) {
        var div = this.layerRefs[layer.getId()];
    	div.remove();
    	
    	var input = div.find('input');
		input.remove();
		input = this.templateRadiobutton.clone();
    	input.attr('value', layer.getId());
    	
    	var me = this;
    	input.bind('change', function(evt) {
			me._changedBaseLayer();
		});
		
        div.find('span').before(input);
		
        var baseLayersDiv = this.element.find('div.content div.baselayers');
    	// add text if first selection available
        if(baseLayersDiv.find('div.layer').length == 0) {
	        var pluginLoc = this.getMapModule().getLocalization('plugin');
	        var myLoc = pluginLoc[this.__name];
	        var header = this.templateBaseLayerHeader.clone();
	        header.append(myLoc.chooseDefaultBaseLayer);
	    	baseLayersDiv.before(header);
	    	input.attr('checked', 'checked');
        }
    	baseLayersDiv.append(div);
		me._changedBaseLayer();
    },
    /**
     * @method removeBaseLayer
     * Assumes that the layer is already added as base layer and moves it to being a normal layer
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
     */
    removeBaseLayer : function(layer) {
        var div = this.layerRefs[layer.getId()];
    	div.remove();
    	
    	var input = div.find('input');
		input.remove();
		input = this.templateCheckbox.clone();
    	input.attr('value', layer.getId());
    	this._bindCheckbox(input, layer);
        div.find('span').before(input);
        
        // default back as visible when returning from baselayers
        var layersDiv = this.element.find('div.content div.layers');
    	layersDiv.append(div);
		this._setLayerVisible(layer, true);
    	
    	// remove text if nothing to select 
        var baseLayersDiv = this.element.find('div.content div.baselayers');
        var baseLayers = baseLayersDiv.find('div.layer');
        if(baseLayers.length == 0) {
        	
        	var baselayerHeader = this.element.find('div.content div.baseLayerHeader');
        	baselayerHeader.remove();
        }
        else {
        	var checked = baseLayers.find('input:checked');
        	if(checked.length == 0) {
        		// if the selected one was removed -> default to first
        		jQuery(baseLayers.find('input').get(0)).attr('checked', 'checked');
        		// notify baselayer change
				this._changedBaseLayer();
        	}
        }
    },
    /**
     * @method _changedBaseLayer
     * Checks which layer is currently the selected base layer, shows it and hides the rest  
     * @private
     */
    _changedBaseLayer : function() {
        var values = this.getBaseLayers();
        for(var i = 0 ; i < values.baseLayers.length; ++i) {
			var layerId = values.baseLayers[i];
        	var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
    		this._setLayerVisible(layer, (values.defaultBase == layerId));
        }
    },
    /**
     * @method setupLayers
     * Adds all the maps selected layers to the selection.
     */
    setupLayers : function() {
    	var me = this;
        delete this.layerRefs;
        this.layerRefs = {};
        
        var layers = this._sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < layers.length; ++i) {
			me.addLayer(layers[i]);
        }
    },
    /**
     * @method openSelection
     * Programmatically opens the plugins interface as if user had clicked it open
     */
    openSelection : function() {
        var icon = this.element.find('div.header div.header-icon');
        icon.removeClass('icon-arrow-white-right'); 
        icon.addClass('icon-arrow-white-down'); 
        var content = this.element.find('div.content').show();
    },
    /**
     * @method closeSelection
     * Programmatically closes the plugins interface as if user had clicked it close
     */
    closeSelection : function() { 
        var icon = this.element.find('div.header div.header-icon');
        icon.removeClass('icon-arrow-white-down');
        icon.addClass('icon-arrow-white-right'); 
        var content = this.element.find('div.content').hide();
    },
    /**
     * @method getBaseLayers
     * Returns list of the current base layers and which one is selected
     * @return {Object} returning object has property baseLayers as a {String[]} list of base layer ids and 
     * {String} defaultBase as the selected base layers id
     */
    getBaseLayers : function() { 
        var inputs = this.element.find('div.content div.baselayers div.layer input');
    	var layers = [];
    	var checkedLayer = null;
    	for(var i=0; i < inputs.length; ++i) {
    		var input = jQuery(inputs[i]);
    		layers.push(input.val());
    		if(input.is(':checked')) {
    			checkedLayer = input.val();
    		}
    	}
    	return {
    		baseLayers : layers,
    		defaultBase : checkedLayer
    	}
    },
    /**
     * @method  _createUI
     * Creates the whole ui from scratch and writes the plugin in to the UI.
     * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
     * If it exists, checks if there are other bundles and writes itself as the first one.
     * If the placeholder doesn't exist the plugin is written to the mapmodules div element.  
     * @private
     */
    _createUI : function() {
        var me = this;
        if(!this.element) {
            this.element = this.template.clone();
        }		
		
        
        var pluginLoc = this.getMapModule().getLocalization('plugin');
        var myLoc = pluginLoc[this.__name];
        var header = this.element.find('div.header'); 
        header.append(myLoc.title);
        
        header.bind('click', function(){
        	var content = me.element.find('div.content'); 
        	if(content.is(':hidden')) {
        		me.openSelection();
        	}
        	else {
        		me.closeSelection();
        	}
	    });
        this.closeSelection();
        
        this.setupLayers();
        
    	// get div where the map is rendered from openlayers
        var parentContainer = jQuery('div.mapplugins.left');
        if(!parentContainer || parentContainer.length == 0) {
        	// fallback to OL map div
        	parentContainer = jQuery(this._map.div);
        	content.addClass('mapplugin');
        	parentContainer.append(this.element);
        }
        else {
        	// add always as first plugin
        	var existingPlugins = parentContainer.find('div'); 
        	if(!existingPlugins || existingPlugins.length == 0) {
        		// no existing plugins -> just put it there
        		parentContainer.append(this.element);
        	}
        	else {
        		// put in front of existing plugins
        		existingPlugins.first().before(this.element);
        	}
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
