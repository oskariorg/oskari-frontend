import { AbstractPublisherTool } from '../../publisher2/tools/AbstractPublisherTool';

class TimeSeriesTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 150;
        this.group = 'reactTools';
        this.allowedLocations = ['top center'];
        this.lefthanded = 'top center';
        this.righthanded = 'top center';
    }

    init (data) {
        this.controlConfig = {
            showControl: true,
            location: 'top center',
            widthMargin: 200,
            topMargin: '90px'
        };
        if (data && data.configuration && data.configuration.timeseries &&
            data.configuration.timeseries.conf &&
            data.configuration.timeseries.conf.plugins) {
            // Update control configuration according to app setup
            const plugin = data.configuration.timeseries.conf.plugins.find(function (plugin) {
                return plugin.id === 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
            });
            if (plugin) {
                this.controlConfig = plugin.config;
            }
        }
        // hide timeseries control if tool is disabled
        if (this.isDisabled()) {
            this.controlConfig.showControl = false;
        }
        if (this.isDisplayed()) {
            // Apply configuration
            this.setEnabled(this.controlConfig.showControl);
        }
    }

    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
            title: Oskari.getMsg('timeseries', 'publisher.TimeseriesControlPlugin.toolLabel')
        };
    }

    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled (enabled) {
        this.state.enabled = enabled;

        // Set control visibility by updating it's config.
        this.controlConfig.showControl = enabled;
        this._updateTimeseriesPluginConfig();
    }

    /**
    * Is this tool disabled.
    * @method isDisabled
    * @public
    *
    * @returns {Boolean} is tool disabled
    */
    isDisabled () {
        const service = this._getTimeseriesService();
        return typeof service === 'undefined' || typeof service.getActiveTimeseries() === 'undefined';
    }

    /**
     * Don't show the tool if this code is loaded BUT the timeseries bundle is not started as part of the appsetup
     */
    isDisplayed () {
        return typeof this._getTimeseriesService() !== 'undefined';
    }

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues () {
        if (this.state.enabled) {
            return {
                configuration: {
                    timeseries: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.controlConfig }]
                        },
                        state: this.getSandbox().getStatefulComponents().timeseries.getState()
                    }
                }
            };
        } else {
            // Don't include timeseries at all
            return null;
        }
    }

    /**
    * Stop tool.
    * @method stop
    * @public
    */
    stop () {
        if (this.controlConfig) {
            this.controlConfig = null;
            this._updateTimeseriesPluginConfig();
        }
    }

    /**
     * Sends configuration request to timeseries module
     *
     * @method _updateTimeseriesPluginConfig
     * @private
     */
    _updateTimeseriesPluginConfig () {
        const requestBuilder = Oskari.requestBuilder('Timeseries.ConfigurationRequest');
        this.__sandbox.request('Publisher2', requestBuilder(this.controlConfig));
    }

    _getTimeseriesService () {
        if (!this.service) {
            this.service = this.__sandbox.getService('Oskari.mapframework.bundle.timeseries.TimeseriesService');
        }
        return this.service;
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.TimeSeriesTool',
    TimeSeriesTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { TimeSeriesTool };
