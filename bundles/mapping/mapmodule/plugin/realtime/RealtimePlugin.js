/**
 * Interface/protocol definition for map plugins
 *
 * @class Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this,
            opt;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin';
        me._name = 'RealtimePlugin';

        this.minRefreshRate = 1000; // 1 second
        this.maxRefreshRate = Infinity;
        this.ignoredLayerTypes = [];
        this.intervals = {};

        var conf = {
            minRefreshRate: this.minRefreshRate,
            maxRefreshRate: this.maxRefreshRate,
            ignoredLayerTypes: this.ignoredLayerTypes
        };

        for (opt in me._config) {
            if (me._config.hasOwnProperty(opt)) {
                conf[opt] = me._config[opt];
            }
        }
        me._config = conf;
    }, {
        /**
         * @method _stopPluginImpl
         * Interface method for the plugin protocol.
         * Should unregisters requesthandlers and
         * eventlisteners.
         *
         *
         */
        _stopPluginImpl: function () {
            this.intervals = undefined;
        },

        _createEventHandlers: function () {
            return {
                AfterMapLayerAddEvent: function (event) {
                    var layer = event.getMapLayer();

                    if (layer.isRealtime() && this._isNotIgnored(layer)) {
                        this._setInterval(layer);
                    }
                },
                AfterMapLayerRemoveEvent: function (event) {
                    var layer = event.getMapLayer();

                    if (layer.isRealtime() && this._isNotIgnored(layer)) {
                        this._clearInterval(layer);
                    }
                },
                MapLayerEvent: function (event) {
                    if (event.getOperation() !== 'update') {
                        return;
                    }
                    const layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());
                    if (layer && layer.isRealtime() && this._isNotIgnored(layer)) {
                        this._resetInterval(layer);
                    }
                },
                MapLayerVisibilityChangedEvent: function (event) {
                    const layer = event.getMapLayer();

                    if (layer.isRealtime() && this._isNotIgnored(layer)) {
                        const clearOnly = !layer.isVisible() || !event.isInScale() || !event.isGeometryMatch();
                        this._resetInterval(layer, clearOnly);
                    }
                },
                AfterMapMoveEvent: function (event) {
                    this._resetEveryInterval();
                }
            };
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
                this.intervals['' + layer.getId()] = this._createInterval(
                    layer
                );
            }
        },

        /**
         * Creates an interval to send out a request to update the layer on the map.
         * @param  {Oskari.Layer} layer
         * @return {Number} the interval id
         */
        _createInterval: function (layer) {
            var me = this,
                sandbox = me.getSandbox(),
                refreshRate = this._getRefreshRate(layer.getRefreshRate()),
                reqB = Oskari.requestBuilder(
                    'MapModulePlugin.MapLayerUpdateRequest'
                ),
                req = (reqB ? reqB(layer.getId(), true) : undefined),
                evtB = Oskari.eventBuilder('Realtime.RefreshLayerEvent'),
                evt = (evtB ? evtB(layer) : undefined),
                interval;

            interval = setInterval(function () {
                if (req) {
                    sandbox.request(me, req);
                }
                if (evt) {
                    sandbox.notifyAll(evt);
                }
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
            if (!clearOnly) {
                this._setInterval(layer);
            }
        },

        /**
         * Resets the interval for every visible realtime layer.
         *
         * @method _resetEveryInterval
         */
        _resetEveryInterval: function () {
            const sb = this.getSandbox();

            Object.keys(this.intervals)
                .map(layerId => sb.findMapLayerFromSelectedMapLayers(layerId))
                .filter(layer => layer && layer.isRealtime())
                .forEach(layer => this._resetInterval(layer));
        },

        /**
         * Returns the refresh rate bound by configured min and max rates.
         *
         * @method _getRefreshRate
         * @param  {Number} rate in seconds
         * @return {Number} rate in milliseconds
         */
        _getRefreshRate: function (rate) {
            const minRate = this._config.minRefreshRate || this.minRefreshRate;
            const maxRate = this._config.maxRefreshRate || this.maxRefreshRate;
            const requestedOrMinRate = Math.max((rate * 1000), minRate);
            return Math.min(requestedOrMinRate, maxRate);
        },

        /**
         * Returns true if layer is not of type configured to be ignored.
         *
         * @method _isNotIgnored
         * @param  {Oskari.Layer}  layer
         * @return {Boolean}
         */
        _isNotIgnored: function (layer) {
            return !this._config.ignoredLayerTypes.some(type => layer.isLayerOfType(type));
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
