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
    function (config) {
        this._mapModule = null;
        this._name = "AbstractPlugin" + Math.floor(Math.random() * (1632960) + 46656).toString(36);
        this._pluginName = this._name;
        this._sandbox = null;
        this._map = null;
        this._config = config || {};
        this._eventHandlers = {};
        this.isInLayerToolsEditMode = false;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
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
        getMapModule: function () {
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
        setMapModule: function (mapModule) {
            if (mapModule) {
                this._mapModule = mapModule;
                this._map = mapModule.getMap();
                this._pluginName = mapModule.getName() + this._name;
            }
        },
        /**
         * @method init
         * Initializes plugin by calling _initImpl, which is overwritten by the
         * implementation when needed.
         */
        init: function () {
            return this._initImpl();
        },

        _initImpl: function () {},

        /**
         * @method register
         * Interface method for the module protocol
         * Registers plugin by calling _registerImpl, which is overwritten by the
         * implementation when needed.
         */
        register: function () {
            return this._registerImpl();
        },

        _registerImpl: function () {},
        /**
         * @method unregister
         * Interface method for the module protocol
         * Unregisters plugin by calling _registerImpl, which is overwritten by the
         * implementation when needed.
         */
        unregister: function () {
            return this._unregisterImpl();
        },

        _unregisterImpl: function () {},

        /**
         * @method createEventHandlers
         * @return {Object} EventHandlers
         */
        createEventHandlers: function () {
            var me = this,
                eventHandlers = me._createEventHandlers();
            eventHandlers.LayerToolsEditModeEvent = function(event) {
                me._setLayerToolsEditMode(event.isInMode());
            };
            return eventHandlers;
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers. Implement if need be.
         * @return {Object} EventHandlers
         */
        _createEventHandlers: function () {
            return {};
        },

        inLayerToolsEditMode: function () {
            return this._isInLayerToolsEditMode;
        },

        _setLayerToolsEditMode: function (isInEditMode) {
            this._isInLayerToolsEditMode = isInEditMode;
            this._setLayerToolsEditModeImpl();
        },

        /**
         * @method _setLayerToolsEditModeImpl
         * Called after layerToolsEditMode is set, implement if needed.
         */
        _setLayerToolsEditModeImpl: function () {},

        /**
         * @method startPlugin
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox. Constructs the plugin UI and displays it.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                eventHandler;

            me._eventHandlers = me.createEventHandlers();
            me._sandbox = sandbox;
            sandbox.register(me);
            for (eventHandler in me._eventHandlers) {
                if (me._eventHandlers.hasOwnProperty(eventHandler)) {
                    sandbox.registerForEventByName(me, eventHandler);
                }
            }

            me._startPluginImpl(sandbox);
            // Make sure plugin's edit mode is set correctly (we might already be in edit mode)
            me._setLayerToolsEditMode(me.getMapModule().isInLayerToolsEditMode());
        },

        _startPluginImpl: function (sandbox) {},

        /**
         * @method stopPlugin
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                eventHandler;
            me._stopPluginImpl(sandbox);

            for (eventHandler in me._eventHandlers) {
                if (me._eventHandlers.hasOwnProperty(eventHandler)) {
                    me._sandbox.unregisterFromEventByName(me, eventHandler);
                }
            }

            sandbox.unregister(me);
            me._sandbox = null;
        },

        _stopPluginImpl: function (sandbox) {},

        /**
         * @method start
         * Start plugin as module by calling _registerImpl, which is overwritten by the
         * implementation when needed.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        start: function (sandbox) {
            return this._startImpl(sandbox);
        },

        _startImpl: function (sandbox) {},
        /**
         * @method stop
         * Stop plugin as module by calling _registerImpl, which is overwritten by the
         * implementation when needed.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stop: function (sandbox) {
            return this._stopImpl(sandbox);
        },

        _stopImpl: function (sandbox) {},
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded* if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var me = this,
                handler = me._eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(me, [event]);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
