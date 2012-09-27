/**
 * @class Oskari.mapframework.bundle.mappublished.LogoPlugin
 * Provides the NLS logo and link to terms of use for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
    this.template = null;
    this.element = null;
}, {
    /** @static @property __name plugin name */
    __name : 'LogoPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if(mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method init
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        this.template = jQuery("<div class='logoplugin'><div class='icon'></div>" +
                "<div class='terms'><a href='JavaScript:void(0);'></a></div>" +
            "</div>");
    },
    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this._createUI();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
        
        // TODO: check if added?
        // unbind change listener and remove ui
        this.element.find('a').unbind('click');
        this.element.remove();
        this.element = undefined;
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
    	/*
        'DummyEvent' : function(event) {
            alert(event.getName());
        }*/
    },

	/** 
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    
    /**
     * @method _createUI
     * @private
     * Creates logo and terms of use links on top of map
     */
    _createUI : function() {
    	
		var sandbox = this._sandbox;
        // get div where the map is rendered from openlayers
        var parentContainer = jQuery(this._map.div);
        if(!this.element) {
            this.element = this.template.clone();
        }
        		
        parentContainer.append(this.element);
        
        var pluginLoc = this.getMapModule().getLocalization('plugin');
        var myLoc = pluginLoc[this.__name];
        
        var link = this.element.find('div.icon');
        link.bind('click', function(){
			var linkParams = sandbox.generateMapLinkParameters();
	    	var url = myLoc.mapLinkBase + sandbox.generateMapLinkParameters();
	    	window.open(url, '_blank');
            return false;
	    });
        
        var link = this.element.find('a');
        link.append(myLoc["terms"]); // 
        link.bind('click', function(){
	    	var url = myLoc["termsLink"]
	    	window.open(url, '_blank');
            return false;
	    });
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
