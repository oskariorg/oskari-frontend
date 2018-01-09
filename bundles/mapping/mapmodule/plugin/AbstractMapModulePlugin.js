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
        me._isInLayerToolsEditMode = false;
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
                if(!this._loc || Object.keys(this._loc).length === 0) {
                    // don't blindly overwrite if localization already has some content
                    this._loc = mapModule.getLocalization('plugin', true)[this._name] || {};
                }
            }
        },
        /**
         * Returns path to image resources
         * @return {String}
         */
        getImagePath : function() {
            return this.getMapModule().getImageUrl() + '/mapping/mapmodule/resources/images/';
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
            try {
                return this._initImpl();
            } catch(e) {
                Oskari.log('AbstractMapModulePlugin').error('Error initializing plugin impl ' + this.getName());
            }
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
         * @param {Oskari.Sandbox} sandbox
         *
         */
        startPlugin: function (sandbox) {
            var me = this,
                handler;

            me._sandbox = sandbox;
            sandbox.register(me);
            me._eventHandlers = me.createEventHandlers();
            me._requestHandlers = me.createRequestHandlers();

            Object.keys(me._eventHandlers).forEach(function(key) {
                sandbox.registerForEventByName(me, key);
            });

            Object.keys(me._requestHandlers).forEach(function(key) {
                sandbox.requestHandler(key, me._requestHandlers[key]);
            });

            var waitingForToolbar = false;
            try {
                waitingForToolbar = me._startPluginImpl(sandbox);
            } catch(e) {
                Oskari.log('AbstractMapModulePlugin').error('Error starting plugin impl ' + me.getName());
            }
            // Make sure plugin's edit mode is set correctly
            // (we might already be in edit mode)
            me._setLayerToolsEditMode(
                me.getMapModule().isInLayerToolsEditMode()
            );
            return waitingForToolbar;
        },

        _startPluginImpl: function (sandbox) { },

        /**
         * @public @method stopPlugin
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.Sandbox} sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                handler;

            try {
                me._stopPluginImpl(sandbox);
            } catch(e) {
                Oskari.log('AbstractMapModulePlugin').error('Error stopping plugin impl ' + me.getName());
            }

            Object.keys(me._eventHandlers).forEach(function(key) {
                sandbox.unregisterFromEventByName(me, key);
            });

            Object.keys(me._requestHandlers).forEach(function(key) {
                sandbox.requestHandler(key, null);
            });

            sandbox.unregister(me);
            me._sandbox = null;
        },

        _stopPluginImpl: function (sandbox) {},

        /**
         * @public @method start
         * Start plugin as module by calling _registerImpl, which is overwritten
         * by the implementation when needed.
         *
         * @param {Oskari.Sandbox} sandbox
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
         * @param {Oskari.Sandbox} sandbox
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
                try {
                    return jQuery.extend(true, ret, this._config);
                } catch(err) {
                    var log = Oskari.log('AbstractMapModulePlugin');
                    log.warn('Unable to setup config properly for ' + this.getName() + '. Trying shallow copy.', err);
                    try {
                        return jQuery.extend(ret, this._config);
                    } catch(err) {
                        log.error('Unable to setup config for ' + this.getName() + '. Returning empty config.', err);
                    }
                }
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
