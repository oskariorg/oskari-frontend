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
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.element = undefined;
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
        /*this.getMapModule().setLayerPlugin('layers', this);*/
    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
        /*this.getMapModule().setLayerPlugin('layers', null);*/
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
        	'<div class="header"><div class="header-icon icon-maximize"></div></div>' +
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
        'AfterMapLayerAddEvent' : function(event) {
        	// TODO: update ui
        }
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
    selectBaseLayer : function(layerId) {
        var baseLayersDiv = this.element.find('div.content div.baselayers');
    	var input = div.find('input[value=' + layerId + ']');
    	input.attr('checked', 'checked');
		this._changedBaseLayer();
    },
    /**
     * @method addLayer
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
     * @method removeLayer
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
     * @method removeLayer
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
     */
    removeLayer : function(layer) {
        var div = this.layerRefs[layer.getId()];
    	div.remove();
    	delete this.layerRefs[layer.getId()];
    },
    /**
     * @method addBaseLayer
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
     * @method removeBaseLayer
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
    openSelection : function() {
        var icon = this.element.find('div.header div.header-icon');
        icon.removeClass('icon-maximize'); 
        icon.addClass('icon-minimize'); 
        var content = this.element.find('div.content').show();
    },
    closeSelection : function() { 
        var icon = this.element.find('div.header div.header-icon');
        icon.removeClass('icon-minimize');
        icon.addClass('icon-maximize'); 
        var content = this.element.find('div.content').hide();
    },
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
    
    _createUI : function() {
        // get div where the map is rendered from openlayers
        var me = this;
        var parentContainer = jQuery(this._map.div);
        var pluginLocation = parentContainer.find('.mapplugin.left');
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
        
        parentContainer.append(this.element);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
