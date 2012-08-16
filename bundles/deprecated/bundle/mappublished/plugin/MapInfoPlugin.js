/**
 * @class Oskari.mapframework.bundle.mappublished.MapInfoPlugin
 * Provides the NLS logo and link to terms of use for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mappublished.MapInfoPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 * Config is needed atleast for:
 *  - config.parentContainer  as the HTML div id where to render the UI
 *  - config.termsUrl to create the link to terms of use page
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
}, {
    /** @static @property __name plugin name */
    __name : 'mappublished.MapInfoPlugin',

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
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
    },
    /**
     * @method register
     *
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     *
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
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
        // unbind change listener on dropdown and remove ui
    	jQuery("#finnish-geoportal-logo").unbind('click');
        jQuery("#logo-image").remove();
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
		// create dropdown
		var logoHtml = "<div id='logo-image'><img id='finnish-geoportal-logo' style='cursor: pointer;' src='" + 
        		startup.imageLocation +"/resource/images/logo_pieni.png'/></div>";   
        
        jQuery(logoHtml).appendTo("#" + this._conf.parentContainer);
        
        jQuery("#finnish-geoportal-logo").click(function(){
	    	var url = sandbox.generatePublishedMapLinkToFinnishGeoportalPage();
	    	window.open(url, '_blank');
	    });
	    
		var text = "<span id='terms-of-use-link' class='link-no-hover-gray'><a href='" + this._conf.termsUrl + "'  target='_blank'>" + sandbox.getText("published_map_terms_of_use") + "</a></span>"
    	jQuery(text).appendTo("#logo-image");
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
