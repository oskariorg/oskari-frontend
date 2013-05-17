/**
 * @class Oskari.mapframework.bundle.mappublished.LogoPlugin
 * Displays the NLS logo and provides a link to terms of use on top of the map.
 * Gets base urls from localization files.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.element = null;
}, {

	templates : {
		main : jQuery("<div class='logoplugin'><div class='icon'></div>" +
                "<div class='terms'><a href='JavaScript:void(0);'></a></div>" +
            "</div>")
	},

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
		console.log("init");
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
		console.log("Starting plugin");
		var me = this;
        me._sandbox = sandbox;
        me._map = me.getMapModule().getMap();

        sandbox.register(me);
        for(p in me.eventHandlers ) {
            sandbox.registerForEventByName(me, p);
        }
        me._createUI();
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
	
		var me = this;

        for(p in me.eventHandlers ) {
            sandbox.unregisterFromEventByName(me, p);
        }

        sandbox.unregister(me);
        me._map = null;
        me._sandbox = null;
        
        // TODO: check if added?
        // unbind change listener and remove ui
        me.element.find('a').unbind('click');
        me.element.remove();
        me.element = undefined;
    },
    /**
     * @method start
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
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
	
		console.log("Creating logo UI");
    	
		var me = this;
		
		var sandbox = me._sandbox;
        // get div where the map is rendered from openlayers
        var parentContainer = jQuery(me._map.div);
        if(!me.element) {
            me.element = me.templates.main.clone();
        }
        		
        parentContainer.append(me.element);
        
        var pluginLoc = me.getMapModule().getLocalization('plugin', true);
        var myLoc = pluginLoc[me.__name];
        
        var link = me.element.find('div.icon');
        link.bind('click', function(){
			var linkParams = sandbox.generateMapLinkParameters();
	    	var url = myLoc.mapLinkBase + sandbox.generateMapLinkParameters();
	    	window.open(url, '_blank');
            return false;
	    });
        
        var link = me.element.find('a');
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
