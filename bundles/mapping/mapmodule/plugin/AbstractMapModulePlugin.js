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
        me._mapModule = null;
        me._name = 'AbstractPlugin' + Math.floor(Math.random() * (1632960) + 46656).toString(36);
        me._pluginName = me._name;
        me._requestHandlers = {};
        me._sandbox = null;
        me._fixedLocation = false;
    }, {
        /**
         * @public @method getName
         * @return {string} the name for the component
         */
        getName: function () {
            return this._pluginName;
        },

        /**
         * @public @method setMapModule
         * Sets reference to map module where this plugin is used.
         * This allows the plugin to work with the map module and it's map implementation and gets localization from the map module
         *
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            if (!mapModule) {
                // clear references
                // FIXME: this seems to cause troubles in plugins and they are not prepared to handle this...
                //this._mapModule = null;
                //this._pluginName = this._name;
                return;
            }
            this._mapModule = mapModule;
            this._pluginName = mapModule.getName() + this._name;
            if (!this._loc || Object.keys(this._loc).length === 0) {
                // don't blindly overwrite if localization already has some content
                this._loc = mapModule.getLocalization('plugin', true)[this._name] || {};
            }
        },

        /**
         * @public @method getMap
         * Returns reference to actual map library impl (for example OpenLayers ol.Map)
         * @return {ol.Map} reference to map implementation
         */
        getMap: function () {
            return this.getMapModule().getMap();
        },

        /**
         * @public @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            // Throw a fit if mapmodule is not set, it'd probably break things.
            if (this._mapModule === null || this._mapModule === undefined) {
                throw new Error('No mapmodule provided!');
            }
            return this._mapModule;
        },

        getMsg: function (path, args) {
            return this.getMapModule().getPluginMsg(this._name, path, args);
        },
        /**
         * @public @method getSandbox
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
         */
        init: function () {
            try {
                return this._initImpl();
            } catch (e) {
                Oskari.log('AbstractMapModulePlugin').error('Error initializing plugin impl ' + this.getName());
            }
        },

        _initImpl: function () {},

        /**
         * @public @method register
         * Interface method for the module protocol
         * Registers plugin by calling _registerImpl, which is overwritten by
         * the implementation when needed.
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
         */
        unregister: function () {
            return this._unregisterImpl();
        },

        _unregisterImpl: function () {},

        /**
         * @public @method createEventHandlers
         *
         * @return {Object} EventHandlers
         */
        createEventHandlers: function () {
            const me = this;
            const eventHandlers = this._createEventHandlers();

            eventHandlers.LayerToolsEditModeEvent = function (event) {
                me._setLayerToolsEditMode(event.isInMode());
            };
            return eventHandlers;
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers. Implement if need be.
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
            return this._createRequestHandlers();
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
        isFixedLocation: function () {
            return this._fixedLocation;
        },

        _setLayerToolsEditMode: function (isInEditMode) {
            this._isInLayerToolsEditMode = isInEditMode;
            this._setLayerToolsEditModeImpl();
            if (this.isFixedLocation()) {
                this.handleDragDisabled();
            }
        },

        /**
         * @method _setLayerToolsEditModeImpl
         * Called after layerToolsEditMode is set, implement if needed.
         *
         *
         */
        _setLayerToolsEditModeImpl: function () {},

        /**
         * @method handleDragDisabled
         * Disable draggable inLayerToolsEditMode if plugin's location is fixed (publisher edit own tools layout)
         */
        handleDragDisabled: function (isInEditMode) {
            const elem = this.getElement();
            if (!elem) {
                return;
            }
            const draggable = elem.hasClass('ui-draggable');
            if (this.inLayerToolsEditMode()) {
                elem.addClass('plugin-drag-disabled');
                if (draggable) {
                    elem.draggable('disable');
                }
            } else {
                elem.removeClass('plugin-drag-disabled');
                if (draggable) {
                    elem.draggable('enable');
                }
            }
        },

        /**
         * @public @method startPlugin
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox. Constructs the plugin UI
         * and displays it.
         *
         * @param {Oskari.Sandbox} sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            sandbox.register(this);
            this._eventHandlers = this.createEventHandlers();
            this._requestHandlers = this.createRequestHandlers();

            Object.keys(this._eventHandlers)
                .forEach(eventName => sandbox.registerForEventByName(this, eventName));

            Object.keys(this._requestHandlers)
                .forEach(requestName => sandbox.requestHandler(requestName, this._requestHandlers[requestName]));

            let waitingForToolbar = false;
            try {
                waitingForToolbar = this._startPluginImpl(sandbox);
            } catch (e) {
                Oskari.log('AbstractMapModulePlugin').error('Error starting plugin impl ' + this.getName());
            }
            // Make sure plugin's edit mode is set correctly
            // (we might already be in edit mode)
            this._setLayerToolsEditMode(this.getMapModule().isInLayerToolsEditMode());
            return waitingForToolbar;
        },

        /**
         * @public @method _startPluginImpl
         * Impl should override this to construct the plugin UI and display it.
         *
         * @param {Oskari.Sandbox} sandbox
         */
        _startPluginImpl: function (sandbox) { },

        /**
         * @public @method stopPlugin
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.Sandbox} sandbox
         */
        stopPlugin: function (sandbox) {
            try {
                this._stopPluginImpl(sandbox);
            } catch (e) {
                Oskari.log('AbstractMapModulePlugin').error('Error stopping plugin impl ' + this.getName());
            }

            Object.keys(this._eventHandlers)
                .forEach(eventName => sandbox.unregisterFromEventByName(this, eventName));

            Object.keys(this._requestHandlers)
                .forEach(requestName => sandbox.requestHandler(requestName, null));

            sandbox.unregister(this);
            this._sandbox = null;
        },

        /**
         * @public @method _stopPluginImpl
         * Impl should override this to teardown the plugin UI and shutdown the plugin for removal.
         *
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {},

        /**
         * @public @method start
         * Start plugin as module by calling _startImpl, which is overwritten
         * by the implementation when needed.
         *
         * @param {Oskari.Sandbox} sandbox
         *
         */
        start: function (sandbox) {
            // TODO: do we need these? or could we just use startPlugin()?
            return this._startImpl(sandbox);
        },

        _startImpl: function (sandbox) {},

        /**
         * @public @method stop
         * Stop plugin as module by calling _stopImpl, which is overwritten
         * by the implementation when needed.
         *
         * @param {Oskari.Sandbox} sandbox
         *
         */
        stop: function (sandbox) {
            // TODO: do we need these? or could we just use stopPlugin()?
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
                } catch (err) {
                    var log = Oskari.log('AbstractMapModulePlugin');
                    log.warn('Unable to setup config properly for ' + this.getName() + '. Trying shallow copy.', err);
                    try {
                        return jQuery.extend(ret, this._config);
                    } catch (err) {
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
         */
        refresh: function () {},

        /**
         * @public @method hasUI
         * Override if need be.
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
            const handler = this._eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            } else {
                Oskari.log(this.getName())
                    .warn('No handler found for registered event', event.getName());
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
