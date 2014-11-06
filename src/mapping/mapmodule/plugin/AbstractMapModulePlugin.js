/**
 * @class Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin
 * Abtract MapModule plugin intended to be extended by plugin implementations.
 *
 * TODO: remove Module protocol/interface to clearify intended usage.
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin',

    /**
     * @static @method create called automatically on construction
     */
    function (config) {
        var me = this;
        me._config = config || {};
        me._eventHandlers = {};
        me.isInLayerToolsEditMode = false;
        me._loc = {};
        me._map = null;
        me._mapModule = null;
        me._name = 'AbstractPlugin' + Math.floor(Math.random() * (1632960) + 46656).toString(36);
        me._pluginName = me._name;
        me._requestHandlers = {};
        me._sandbox = null;
    }, {
        /**
         * @public @method getName
         *
         *
         * @return {string} the name for the component
         */
        getName: function () {
            return this._pluginName;
        },

        /**
         * @public @method getMap
         *
         *
         * @return {OpenLayers.Map} reference to map implementation
         */
        getMap: function () {
            return this._map;
        },

        /**
         * @public @method getMapModule
         *
         *
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference
         * to map module
         */
        getMapModule: function () {
            // Throw a fit if mapmodule is not set, it'd probably break things.
            if (this._mapModule === null || this._mapModule === undefined) {
                throw 'No mapmodule provided!';
            }
            return this._mapModule;
        },

        /**
         * @public @method setMapModule
         * Setter for MapModule, checks that map module reference is truthy
         * before assigning.
         *
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference
         * to map module
         *
         */
        setMapModule: function (mapModule) {
            if (mapModule) {
                this._mapModule = mapModule;
                this._map = mapModule.getMap();
                this._pluginName = mapModule.getName() + this._name;
                this._loc =
                    mapModule.getLocalization('plugin', true)[this._name];
            }
        },

        /**
         * @public @method getSandbox
         *
         *
         * @return {Object}
         * Sandbox
         */
        getSandbox: function () {
            return this._sandbox;
        },

        /**
         * @public @method init
         * Initializes plugin by calling _initImpl, which is overwritten by the
         * implementation when needed.
         *
         *
         */
        init: function () {
            return this._initImpl();
        },

        _initImpl: function () {},

        /**
         * @public @method register
         * Interface method for the module protocol
         * Registers plugin by calling _registerImpl, which is overwritten by
         * the implementation when needed.
         *
         *
         */
        register: function () {
            return this._registerImpl();
        },

        _registerImpl: function () {},

        /**
         * @public @method unregister
         * Interface method for the module protocol
         * Unregisters plugin by calling _registerImpl, which is overwritten by
         * the implementation when needed.
         *
         *
         */
        unregister: function () {
            return this._unregisterImpl();
        },

        _unregisterImpl: function () {},

        /**
         * @public @method createEventHandlers
         *
         *
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
         *
         *
         * @return {Object} EventHandlers
         */
        _createEventHandlers: function () {
            return {};
        },

        /**
         * @public @method createRequestHandlers
         *
         *
         * @return {Object} RequestHandlers
         */
        createRequestHandlers: function () {
            var me = this,
                requestHandlers = me._createRequestHandlers();

            return requestHandlers;
        },

        /**
         * @method _createRequestHandlers
         * Create eventhandlers. Implement if need be.
         *
         *
         * @return {Object} RequestHandlers
         */
        _createRequestHandlers: function () {
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
         *
         *
         */
        _setLayerToolsEditModeImpl: function () {},

        /**
         * @public @method startPlugin
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox. Constructs the plugin UI
         * and displays it.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *
         */
        startPlugin: function (sandbox) {
            var me = this,
                handler;

            me._sandbox = sandbox;
            sandbox.register(me);
            me._eventHandlers = me.createEventHandlers();
            me._requestHandlers = me.createRequestHandlers();
            for (handler in me._eventHandlers) {
                if (me._eventHandlers.hasOwnProperty(handler)) {
                    sandbox.registerForEventByName(me, handler);
                }
            }

            for (handler in me._requestHandlers) {
                if (me._requestHandlers.hasOwnProperty(handler)) {
                    me._sandbox.addRequestHandler(
                        handler,
                        this._requestHandlers[handler]
                    );
                }
            }

            me._startPluginImpl(sandbox);
            // Make sure plugin's edit mode is set correctly
            // (we might already be in edit mode)
            me._setLayerToolsEditMode(
                me.getMapModule().isInLayerToolsEditMode()
            );
        },

        _startPluginImpl: function (sandbox) {},

        /**
         * @public @method stopPlugin
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                handler;

            me._stopPluginImpl(sandbox);

            for (handler in me._eventHandlers) {
                if (me._eventHandlers.hasOwnProperty(handler)) {
                    me._sandbox.unregisterFromEventByName(me, handler);
                }
            }

            for (handler in me._requestHandlers) {
                if (me._requestHandlers.hasOwnProperty(handler)) {
                    me._sandbox.removeRequestHandler(
                        handler,
                        this._requestHandlers[handler]
                    );
                }
            }

            sandbox.unregister(me);
            me._sandbox = null;
        },

        _stopPluginImpl: function (sandbox) {},

        /**
         * @public @method start
         * Start plugin as module by calling _registerImpl, which is overwritten
         * by the implementation when needed.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *
         */
        start: function (sandbox) {
            return this._startImpl(sandbox);
        },

        _startImpl: function (sandbox) {},

        /**
         * @public @method stop
         * Stop plugin as module by calling _registerImpl, which is overwritten
         * by the implementation when needed.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *
         */
        stop: function (sandbox) {
            return this._stopImpl(sandbox);
        },

        _stopImpl: function (sandbox) {},

        /**
         * @public @method getConfig Gets the plugin's config
         *
         *
         * @return {Object}
         * Plugin's configuration (a clone, use setConfig if you want to change
         * the plugin's config)
         */
        getConfig: function () {
            // use this when saving published map so we won't have to keep a
            // separate copy in the publisher
            var ret = {};

            if (this._config) {
                // return a clone so people won't muck about with the config...
                return jQuery.extend(true, ret, this._config);
            }
            return ret;
        },

        /**
         * @public @method setConfig
         * Sets the plugin's config
         *
         * @param {Object} config
         * Config
         *
         */
        setConfig: function (config) {
            this._config = config;
            // take new conf to use
            this.refresh();
        },

        /**
         * @public  @method _refresh
         * Called after a configuration change. Implement if needed.
         *
         *
         */
        refresh: function () {},

        /**
         * @public @method hasUI
         * Override if need be.
         *
         *
         * @return {Boolean} false
         */
        hasUI: function () {
            return false;
        },

        /**
         * @public @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded* if not.
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         *
         */
        onEvent: function (event) {
            var me = this,
                handler = me._eventHandlers[event.getName()];

            if (handler) {
                return handler.apply(me, [event]);
            } else {
                me.getSandbox().printWarn(
                    'No handler found for registered event', event.getName()
                );
            }
        }
    }, {
        /**
         * @static @property {string[]} protocol
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
