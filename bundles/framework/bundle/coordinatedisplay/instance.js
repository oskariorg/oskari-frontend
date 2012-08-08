/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance
 * 
 * Registers and starts the 
 * Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
    this.started = false;
}, {
    __name : 'coordinatedisplay',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method setSandbox
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox : function(sbx) {
        this.sandbox = sbx;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    update : function() {
        var me = this;
    },
    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    start : function() {
        var me = this;
        if(me.started) {
            return;
        }
        me.started = true;
        // Should this not come as a param?
        var sandbox = Oskari.$('sandbox');
        me.setSandbox(sandbox);

        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin');
        mapModule.registerPlugin(plugin);
        mapModule.startPlugin(plugin);
        this.plugin = plugin;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    stop : function() {
        this.sandbox = null;
        this.started = false;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.bundle.BundleInstance']
});
