/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance
 *
 * Registers TimeseriesService & TimeseriesLayerService
 * Creates UI control for timeseries, when TimeseriesService indicates it's needed
 */
Oskari.clazz.define("Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance",
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._sandbox;
        this.started = false;
        this._controlPlugin;
        this._timeseriesService;
        this._timeseriesLayerService;
    }, {
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
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            var sandboxName = (me.conf ? me.conf.sandbox : null) || 'sandbox';
            var sandbox = me._sandbox = Oskari.getSandbox(sandboxName);

            me._timeseriesService = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesService');
            sandbox.registerService(me._timeseriesService);

            me._timeseriesLayerService = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesLayerService', sandbox, me._timeseriesService);
            sandbox.registerService(me._timeseriesLayerService);
            me._timeseriesLayerService.registerLayerType('wms', function (layerId) {
                return Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.WMSAnimator', sandbox, layerId);
            });

            Oskari.on('app.start', function () {
                me._timeseriesService.on('activeChanged', me._updateControl.bind(me));
                me._timeseriesLayerService.updateTimeseriesLayers();
            });
        },
        /**
         * @method _updateControl
         * Removes & recreates UI control for timeseries if there is active timeseries
         * @private
         * @param  {Object} active current timeseries state. If null, no active timeseries
         */
        _updateControl: function (active) {
            if (active) {
                this._createControlPlugin(active.delegate, active.conf);
            } else {
                this._removeControlPlugin();
            }
        },
        /**
         * @method _createControlPlugin
         * Creates UI control using given delegate & conf
         * @private
         * @param  {Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol} delegate object that connects UI to timeseries implementation
         * @param  {Object} conf configuration object for TimeseriesControlPlugin
         */
        _createControlPlugin: function (delegate, conf) {
            this._removeControlPlugin();
            var mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            var controlPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin', delegate, conf);
            mapModule.registerPlugin(controlPlugin);
            mapModule.startPlugin(controlPlugin);
            this._controlPlugin = controlPlugin;
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
            var mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.stopPlugin(this._controlPlugin);
            mapModule.unregisterPlugin(this._controlPlugin);
            this._controlPlugin = null;
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            this.started = false;
            this._removeControlPlugin();
            this._sandbox = null;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });