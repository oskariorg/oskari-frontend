/**
 * @class Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin
 * Provides WFS grid link on top of map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 *      JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
    this.__elements = {};
    this.__templates = {};
    this.__templates['main'] = jQuery('<div class="mapplugin featuredataplugin">' +
        '<a href="JavaScript: void(0);"></a>' +
        '</div>');
    this.instance = config.instance;
}, {
    /** @static @property __name plugin name */
    __name : 'FeaturedataPlugin',

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
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },

    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
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
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        this._createUI();
    },

    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        if(this.__elements['main']) {
            this.__elements['main'].remove();
            delete this.__elements['main'];
        }

        sandbox.unregister(this);
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
     * @method _createUI
     * @private
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     */
    _createUI : function() {
        var sandbox = this._sandbox;
        var me = this;

        // get div where the map is rendered from openlayers
        var parentContainer = jQuery(this._map.div);

        if(!me.__elements['main']) {
            me.__elements['main'] = me.__templates['main'].clone();
        }
        var link = me.__elements['main'].find('a');
        link.html(this.instance.getLocalization('title'));
        link.bind('click', function() {
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'detach']);
            return false;
        });
        me.__elements['main'].mousedown(function(event) {
            event.stopPropagation();
        });
        parentContainer.append(me.__elements['main']);        
        this.update();
    },

    /**
     * @method update
     * Updates the plugins interface (hides if no WFS layer selected)
     */
    update : function() {
        var sandbox = this.mapModule.getSandbox();
        var layers = sandbox.findAllSelectedMapLayers();
        var layerCount = 0;
        // count amount of wfs layers == number of tabs
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if(layer.isLayerOfType('WFS')) {
                layerCount++;
            }
        }
        var me = this;
        if(layerCount > 0) {
            me.__elements['main'].show();
        }
        else {
            me.__elements['main'].hide();
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
