/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin
 * Provides indexmap functionality for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
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
    this._indexMap = null;
    this._indexMapUrl = '/framework/bundle/mapmodule-plugin/plugin/indexmap/images/suomi25m_tm35fin.png';
}, {
    /** @static @property __name plugin name */
    __name : 'IndexMapPlugin',

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
    _createUI : function() {
        /* overview map */
        var graphic = new OpenLayers.Layer.Image('Overview map image', 
            this.getMapModule().getImageUrl() + this._indexMapUrl, 
            new OpenLayers.Bounds(26783, 6608595, 852783, 7787250), new OpenLayers.Size(120, 173));

        /*
         * create an overview map control with non-default
         * options
         */
        var controlOptions = {
            mapOptions : {
                maxExtent : new OpenLayers.Bounds(26783, 6608595, 852783, 7787250),
                units : 'm',
                projection : this._map.getProjection(),
                numZoomLevels : 1
            },
            layers : [graphic],
            size : new OpenLayers.Size(120, 173),
            autoPan : false
        };

        /* Indexmap */
        this._indexMap = new OpenLayers.Control.OverviewMap(controlOptions);
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
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();
        this._createUI();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this.getMapModule().addMapControl('overviewMap', this._indexMap);
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

        this.getMapModule().removeMapControl('overviewMap');

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
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            if(this._indexMap) {
                this._indexMap.update();
            }
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if
     * not.
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
