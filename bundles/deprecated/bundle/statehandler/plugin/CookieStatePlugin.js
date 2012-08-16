/**
 * @class Oskari.mapframework.bundle.statehandler.plugin.CookieStatePlugin
 * Provides functionality to save and read the application state to/from a
 * browser cookie using Ext JS
 * 
 * NOTE: statehandler gathers much more information about application state now
 * and this might not all fit into the cookie.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.plugin.CookieStatePlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		isn't used anywhere for now
 */
function(config) {
    this.handler = null;
    this.pluginName = null;
    this._sandbox = null;
    this._conf = config;
    this._cookieName = 'mapwindowstate';
}, {
    /** @static @property __name plugin name */
    __name : 'statehandler.CookieStatePlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getHandler
     * @return
     * {Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule}
     * reference to state handler
     */
    getHandler : function() {
        return this.handler;
    },
    /**
     * @method setHandler
     * @param
     * {Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule}
     * reference to state handler
     */
    setHandler : function(statehandler) {
        this.handler = statehandler;
        this.pluginName = statehandler.getName() + this.__name;
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
     * @method getState
     * @return {Object} JSON presentation of application state as saved in a
     * cookie or null if not found
     */
    getState : function() {
        var cookieData = Ext.util.Cookies.get(this._cookieName);
        if(!cookieData) {
            return null;
        }
        // string to json
        var jsonObj = Ext.decode(cookieData);
        return jsonObj;
    },
    /**
     * @method resetState
     * Clears the cookie with saved application state
     */
    resetState : function() {
        // clear cookie
        Ext.util.Cookies.clear(this._cookieName);
    },
    /**
     * @method saveState
     * Uses
     * Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule.getCurrentState()
     * to get the current application state and saves it to a cookie.
     */
    saveState : function() {
        var state = this.handler.getCurrentState();
        var encodedState = Ext.encode(state);
        Ext.util.Cookies.set(this._cookieName, encodedState);
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol.
     * Binds window.onbeforeunload to saving the state.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        var me = this;
        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        jQuery(document).ready(function() {
            window.onbeforeunload = function() {
                // set cookie
                me.saveState();
            };
        });
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.bundle.statehandler.plugin.Plugin"]
});
