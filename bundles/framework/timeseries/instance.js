import './view/TimeSeriesRangeControlPlugin';

/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance
 *
 * Registers TimeseriesService & TimeseriesLayerService
 * Creates UI control for timeseries, when TimeseriesService indicates it's needed
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.started = false;
        this._initialState = null;
    },
    {
        __name: 'timeseries',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            const me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            const sandboxName = (me.conf ? me.conf.sandbox : null) || 'sandbox';
            const sandbox = me._sandbox = Oskari.getSandbox(sandboxName);

            if (me.conf && me.conf.plugins) {
                const plugin = me.conf.plugins.find(function (plugin) {
                    return plugin.id === 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
                });
                if (plugin) {
                    this._setControlPluginConfiguration(plugin.config);
                }
            }

            me._timeseriesService = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesService');
            sandbox.registerService(me._timeseriesService);

            me._timeseriesLayerService = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesLayerService', sandbox, me._timeseriesService);
            sandbox.registerService(me._timeseriesLayerService);
            me._timeseriesLayerService.registerLayerType('wms', function (layerId) {
                return Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.WMSAnimator', sandbox, layerId);
            });
            me._registerForLayerFiltering();
            Oskari.on('app.start', function () {
                const active = me._timeseriesService.getActiveTimeseries();
                if (active) {
                    me._updateControl(active);
                }
                me._timeseriesLayerService.updateTimeseriesLayers();
                me._timeseriesService.on('activeChanged', me._updateControl.bind(me));
            });
            sandbox.requestHandler('Timeseries.ConfigurationRequest', me);
            sandbox.registerAsStateful(me.mediator.bundleId, me);
            me.setState(me.state);
        },
        /**
         * @method _registerForLayerFiltering
         * Registers for creation of ui filter button
         * @private
         */
        _registerForLayerFiltering: function () {
            const layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
            if (layerlistService) {
                const loc = Oskari.getMsg.bind(null, 'timeseries');
                layerlistService.registerLayerlistFilterButton(
                    loc('layerFilter.timeseries'),
                    loc('layerFilter.tooltip'),
                    {
                        active: 'layer-timeseries',
                        deactive: 'layer-timeseries-disabled'
                    },
                    'timeseries'
                );
            }
        },
        /**
         * @method _setControlPluginConfiguration
         */
        _setControlPluginConfiguration: function (conf) {
            this._controlPluginConf = conf || {};
        },
        /**
         * @method _updateControl
         * Removes & recreates UI control for timeseries if there is active timeseries
         * @private
         * @param  {Object} active current timeseries state. If null, no active timeseries
         */
        _updateControl: function (active) {
            if (active) {
                var conf = jQuery.extend(true, {}, this._controlPluginConf || {}, active.conf);
                if (typeof conf.showControl === 'undefined' || conf.showControl) {
                    const controlClass = this._getControlPluginClazz(active.delegate);
                    if (this._isCurrentlyControlling(controlClass, active.delegate)) {
                        // do not update control ui if there's no changes in ui type and layer
                        return;
                    }
                    if (controlClass !== null) {
                        this._createControlPlugin(controlClass, active.delegate, conf);
                        return;
                    }
                }
            }
            this._removeControlPlugin();
        },
        _isCurrentlyControlling: function (controlClass, delegate) {
            if (!this._controlPlugin) {
                return false;
            }
            if (this._controlPlugin.getClazz() !== controlClass) {
                return false;
            }
            if (typeof this._controlPlugin.isControlling === 'function') {
                // don't know for sure but isControlling is not implemented on this control
                return false;
            }
            return this._controlPlugin.isControlling(delegate);
        },
        /**
         * @method _getControlPluginClazz
         * Get UI control plugin class for given delegate
         * @private
         * @param {Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol} delegate object that connects UI to timeseries implementation
         * @return {String} the name of UI control plugin class
         * @throws {Error} when timeseries layer has an invalid ui type configured
         */
        _getControlPluginClazz: function (delegate) {
            const layer = delegate.getLayer();
            const options = layer.getOptions();
            const timeseries = options.timeseries || {};
            const ui = timeseries.ui || 'player'; // defaults to 'player'
            switch (ui) {
            case 'player':
                return 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
            case 'range':
                return 'Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin';
            case 'none':
                return null;
            default:
                throw new Error('Invalid UI type');
            }
        },
        /**
         * @method _createControlPlugin
         * Creates UI control using given delegate & conf
         * @private
         * @param {String} controlClass The name of UI control plugin class
         * @param {Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol} delegate object that connects UI to timeseries implementation
         * @param {Object} conf configuration object for TimeseriesControlPlugin
         */
        _createControlPlugin: function (controlClass, delegate, conf) {
            this._removeControlPlugin();
            const mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            const controlPlugin = Oskari.clazz.create(controlClass, delegate, conf);
            mapModule.registerPlugin(controlPlugin);
            mapModule.startPlugin(controlPlugin);
            this._controlPlugin = controlPlugin;
            if (this._initialState) {
                // TODO: handle player UI control plugin also
                if (this._controlPlugin.getName() === 'TimeSeriesRangeControlPlugin') {
                    this._controlPlugin.setControlState(this._initialState);
                }
                this._initialState = null;
            }
        },
        /**
         * @method _removeControlPlugin
         * Removes UI control
         * @private
         */
        _removeControlPlugin: function () {
            if (!this._controlPlugin) {
                return;
            }
            const mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.stopPlugin(this._controlPlugin);
            mapModule.unregisterPlugin(this._controlPlugin);
            this._controlPlugin = null;
        },
        /**
         * @method handleRequest
         *
         * Request handler for control plugin configuration.
         */
        handleRequest: function (core, request) {
            if (request.getName() === 'Timeseries.ConfigurationRequest') {
                this._setControlPluginConfiguration(request.getConfiguration());
                const active = this._timeseriesService.getActiveTimeseries();
                this._updateControl(active);
            }
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            this.started = false;
            this._removeControlPlugin();
            this._sandbox = null;
        },

        setState: function (state) {
            // the control plugin may not be created at this time,
            // setting the _initialState to schedule the control
            // UI update when it's created
            this._initialState = state;
        },

        getState: function () {
            // TODO: handle player UI control plugin also
            if (this._controlPlugin && this._controlPlugin.getName() === 'TimeSeriesRangeControlPlugin') {
                return this._controlPlugin.getControlState();
            }
            return null;
        },

        getStateParameters: function () {
            const state = this.getState();
            if (!state) {
                return '';
            }
            const { time } = state;
            const queryStr = Array.isArray(time) ? `timeseries=${time[0]}/${time[1]}` : `timeseries=${time}`;
            const mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            return queryStr + mapModule.getStateParameters();
        }
    },
    {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    }
);
