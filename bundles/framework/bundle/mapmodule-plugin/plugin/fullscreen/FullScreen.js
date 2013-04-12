/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.FullScreen
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.FullScreen',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._fullscreen = null;
    this.__templates = {};
}, {
    /** @static @property __name plugin name */
    __name : 'FullScreen',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
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
     * This plugin has an UI so always returns true
     * @return {Boolean} true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method init
     * Interface method for the module protocol.
     * Creates a template for the full screen toggle button.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this,
            fsimg = this.getMapModule().getImageUrl() + '/framework/bundle/mapmodule-plugin/plugin/fullscreen/images/';

        // template
        this.__templates['fullscreen'] = jQuery(
            '<div class="fullscreenDiv">' + 
                '<img class="fullscreenDivImg" src="' + fsimg + 'full-screen-toggle.png' + '"></img>' +
            '</div>'
        );
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
     * @method startPlugin
     * Interface method for the plugin protocol.
     * Adds the fullscreen toggle button to the DOM.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this.createUI();
    },
    /**
     * @method stopPlugin
     * Interface method for the plugin protocol.
     * Removes the fullscreen toggle button from the map div
     * and unregisters itself from the core.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        jQuery('div.fullscreenDiv').remove();

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },

    /**
    * @method createUI
    * Binds a click event to the toggle image and adds the div to the DOM.
    */
    createUI: function() {
        var me = this,
            fullScreenDiv = this.__templates['fullscreen'].clone();

        fullScreenDiv.find('.fullscreenDivImg').bind('click', function(event) {
            event.preventDefault();
            me._sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');
        });

        jQuery(this._map.div).append(fullScreenDiv);
    },

    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    },

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
