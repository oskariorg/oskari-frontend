/**
 * @class Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin
 * Abtract MapModule plugin intended to be extended by plugin implementations.
 *
 * TODO: remove Module protocol/interface to clearify intended usage.
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this._mapModule = null;
    this._pluginName = "AbstractPlugin" + Math.floor(Math.random() * (1632960) + 46656).toString(36);
    this._sandbox = null;
    this._map = null;
    this._config = config || {};
    this._eventHandlers = {};
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this._pluginName;
    },
    /**
     * @method getMap
     * @return {OpenLayers.Map} reference to map implementation
     */
    getMap: function () {
        return this._map;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference
     * to map module
     */
    getMapModule : function() {
        // Throw a fit if mapmodule is not set, it'd probably break things.
        if (this._mapModule === null || this._mapModule === undefined) {
            throw "No mapmodule provided!";
        }
        return this._mapModule;
    },
    /**
     * @method setMapModule
     * Setter for MapModule, checks map module reference truthy before assigning
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference
     * to map module
     */
    setMapModule : function(mapModule) {
        if (mapModule) {
            this._mapModule = mapModule;
            this._map = mapModule.getMap();
            this._pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method init
     * Initializes plugin by calling _initImpl, which is overwritten by the
     * implementation when needed.
     */
    init : function() {
        return this._initImpl();
    },
    _initImpl: function() {
    },

    /**
     * @method register
     * Interface method for the module protocol
     * Registers plugin by calling _registerImpl, which is overwritten by the
     * implementation when needed.
     */
    register : function() {
        return this._registerImpl();
    },
    _registerImpl: function() {
    },
    /**
     * @method unregister
     * Interface method for the module protocol
     * Unregisters plugin by calling _registerImpl, which is overwritten by the
     * implementation when needed.
     */
    unregister : function() {
        return this._unregisterImpl();
    },
    _unregisterImpl: function() {
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

        for (eventHandler in this._eventHandlers) {
            if (this._eventHandlers.hasOwnProperty(eventHandler)) {
                this._sandbox.registerForEventByName(this, eventHandler);
            }
        }

        this._startPluginImpl(sandbox);
    },
    _startPluginImpl : function (sandbox) {
    },

    /**
     * @method stopPlugin
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox and removes plugins UI from screen.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stopPlugin : function(sandbox) {
        this._stopPluginImpl(sandbox);

        for (eventHandler in this._eventHandlers) {
            if (this._eventHandlers.hasOwnProperty(eventHandler)) {
                this._sandbox.unregisterFromEventByName(this, eventHandler);
            }
        }

        sandbox.unregister(this);
        this._sandbox = null;
    },
    _stopPluginImpl : function (sandbox) {
    },

    /**
     * @method start
     * Start plugin as module by calling _registerImpl, which is overwritten by the
     * implementation when needed.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    start : function(sandbox) {
        return this._startImpl(sandbox);
    },
    _startImpl: function(sandbox) {
    },
    /**
     * @method stop
     * Stop plugin as module by calling _registerImpl, which is overwritten by the
     * implementation when needed.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stop : function(sandbox) {
        return this._stopImpl(sandbox);
    },
    _stopImpl: function(sandbox) {
    },
    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or
     * discarded* if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        var handler = this._eventHandlers[event.getName()];
        if (handler) {
            return handler.apply(this, [event]);
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
