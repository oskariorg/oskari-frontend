/**
 * Interface/protocol definition for map plugins
 *
 * @class Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        this.minRefreshRate = 1000; // 1 second
        this.maxRefreshRate = Infinity;
        this.ignoredLayerTypes = [];

        this.mapModule = undefined;
        this.pluginName = undefined;
        this.sandbox = undefined;
        this.intervals = undefined;

        this.config = {
            minRefreshRate: this.minRefreshRate,
            maxRefreshRate: this.maxRefreshRate,
            ignoredLayerTypes: this.ignoredLayerTypes
        };

        config = config || {};
        for (var opt in config) {
            if (config.hasOwnProperty(opt)) this.config[opt] = config[opt];
        }
    }, {
        /**
         * @property __name plugin name
         * @static
         */
        __name: 'RealtimePlugin',
        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) this.pluginName = mapModule.getName() + this.__name;
        },
        /**
         * This plugin doesn't have an UI that we would want to ever hide
         * so always returns false
         *
         * @method hasUI
         * @return {Boolean}
         */
        hasUI: function () {
            return false;
        },
        /**
         * Interface method for the module protocol
         *
         * @method register
         */
        register: function () {},
        /**
         * Interface method for the module protocol
         *
         * @method unregister
         */
        unregister: function () {},
        /**
         * Interface method for the module protocol.
         *
         * @method init
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {},
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * Interface method for the plugin protocol.
         * Should registers requesthandlers and
         * eventlisteners.
         *
         * @method startPlugin
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            this.sandbox = sandbox;
            this.intervals = {};
            sandbox.register(this);

            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
        },
        /**
         * Interface method for the plugin protocol.
         * Should unregisters requesthandlers and
         * eventlisteners.
         *
         * @method stopPlugin
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);
            this.sandbox = undefined;
            this.intervals = undefined;
        },
        /**
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         *
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapLayerAddEvent': function (event) {
                var layer = event.getMapLayer();

                if (layer.isRealtime() && this._isNotIgnored(layer)) {
                    this._setInterval(layer);
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                var layer = event.getMapLayer();

                if (layer.isRealtime() && this._isNotIgnored(layer)) {
                    this._clearInterval(layer);
                }
            },
            'MapLayerEvent': function (event) {
                var op = event.getOperation(),
                    layer = this.sandbox.findMapLayerFromSelectedMapLayers(event.getLayerId());

                if (op === 'update' && layer && layer.isRealtime() && this._isNotIgnored(layer)) {
                    this._resetInterval(layer);
                }
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                var layer = event.getMapLayer(),
                    isVisible = layer.isVisible(),
                    inScale = event.isInScale(),
                    inViewPort = event.isGeometryMatch(),
                    clearOnly = (!isVisible || !inScale || !inViewPort);

                if (layer.isRealtime() && this._isNotIgnored(layer)) {
                    this._resetInterval(layer, clearOnly);
                }
            },
            'AfterMapMoveEvent': function (event) {
                this._resetEveryInterval();
            }
        },
        /**
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         *
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) return handler.apply(this, [event]);
        },
        /**
         * Returns the interval id for the layer or undefined if not found.
         *
         * @method _getInterval
         * @param  {Oskari.Layer} layer
         * @return {Number/undefined} the interval id
         */
        _getInterval: function (layer) {
            return this.intervals['' + layer.getId()];
        },
        /**
         * Sets the interval for the layer if not already defined.
         *
         * @method _setInterval
         * @param {Oskari.Layer} layer
         */
        _setInterval: function (layer) {
            if (this._getInterval(layer) === undefined) {
                this.intervals['' + layer.getId()] = this._createInterval(layer);
            }
        },
        /**
         * Creates an interval to send out a request to update the layer on the map.
         * @param  {Oskari.Layer} layer
         * @return {Number} the interval id
         */
        _createInterval: function (layer) {
            var me = this,
                sandbox = me.sandbox,
                refreshRate = this._getRefreshRate(layer.getRefreshRate()),
                reqB = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                req = (reqB ? reqB(layer.getId(), true) : undefined),
                evtB = sandbox.getEventBuilder('Realtime.RefreshLayerEvent'),
                evt = (evtB ? evtB(layer) : undefined),
                interval;

            interval = setInterval(function () {
                if (req) sandbox.request(me, req);
                if (evt) sandbox.notifyAll(evt);
            }, refreshRate);

            return interval;
        },
        /**
         * Clears the interval for the layer.
         *
         * @method _cleanInterval
         * @param  {Oskari.Layer} layer
         */
        _clearInterval: function (layer) {
            var interval = this._getInterval(layer);
            if (interval !== undefined) {
                clearInterval(interval);
                delete this.intervals['' + layer.getId()];
            }
        },
        /**
         * Resets the interval for the layer.
         * Optionally only clears it without creating a new one.
         *
         * @method _resetInterval
         * @param  {Oskari.Layer} layer
         * @param  {Boolean} clearOnly (optional)
         */
        _resetInterval: function (layer, clearOnly) {
            this._clearInterval(layer);
            if (!clearOnly) this._setInterval(layer);
        },
        /**
         * Resets the interval for every visible realtime layer.
         *
         * @method _resetEveryInterval
         */
        _resetEveryInterval: function () {
            var me = this,
                sandbox = me.sandbox;

            _.chain(this.intervals)
                .keys()
                .map(function (layerId) {
                    return sandbox.findMapLayerFromSelectedMapLayers(layerId);
                })
                .filter(function (layer) {
                    return layer && layer.isRealtime();
                })
                .each(function (layer) {
                    me._resetInterval(layer);
                });
        },
        /**
         * Returns the refresh rate bound by configured min and max rates.
         *
         * @method _getRefreshRate
         * @param  {Number} rate in seconds
         * @return {Number} rate in milliseconds
         */
        _getRefreshRate: function (rate) {
            var minRate = this.config.minRefreshRate || this.minRefreshRate,
                maxRate = this.config.maxRefreshRate || this.maxRefreshRate;

            return _.min([_.max([(rate * 1000), minRate]), maxRate]);
        },
        /**
         * Returns true if layer is not of type configured to be ignored.
         *
         * @method _isNotIgnored
         * @param  {Oskari.Layer}  layer
         * @return {Boolean}
         */
        _isNotIgnored: function (layer) {
            return !_.any(this.config.ignoredLayerTypes, function (type) {
                return layer.isLayerOfType(type);
            });
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
