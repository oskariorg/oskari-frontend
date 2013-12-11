/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a state reset button.
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.MapPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.__elements = {};
    this.__conf = config || {};
    this._ctl = null;
    this._el = null;

}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference
     * to map module
     */
    getMapModule : function() {
        return this.mapModule;
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
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference
     * to map module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this._map = mapModule.getMap();
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method init
     * implements Module protocol init method - declares pan
     * buttons templates
     */
    init : function() {
        var me = this;

    },

    /**
     * @method register
     * mapmodule.Plugin protocol method - does nothing atm
     */
    register : function() {

    },
    /**
     * @method unregister
     * mapmodule.Plugin protocol method - does nothing atm
     */
    unregister : function() {
    },

    /**
     * @method startPlugin
     * mapmodule.Plugin protocol method.
     * Sets sandbox and registers self to sandbox. Constructs the plugin UI and displays it.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);

        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

        this._el = this.createControlEl();
        this._ctl = this.createControlAdapter(this._el);
        this.getMapModule().addMapControl(this.pluginName,this._ctl);
    },

    /**
     * @method stopPlugin
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox and removes plugins UI from screen.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stopPlugin : function(sandbox) {
        if (this.__elements['panbuttons']) {
            this.__elements['panbuttons'].remove();
            delete this.__elements['panbuttons'];
        }
        this._el.clear();
        this.getMapModule().removeMapControl(this.pluginName,this._ctl);
        this._ctl = undefined;

        sandbox.unregister(this);
    },

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or
     * discarded* if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method start
     * Module protocol method - does nothing atm
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * Module protocol method - does nothing atm
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stop : function(sandbox) {
    },

    /* IMPL */

    createControlEl : function() {

    },
    createControlAdapter : function(el) {
        /* this._el.get()[0] */

    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
