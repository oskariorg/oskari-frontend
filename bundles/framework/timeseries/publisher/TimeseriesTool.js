Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesTool',
    function () {
    }, {
        index: 0,
        allowedLocations: ['top center', 'top right', 'top left'],
        lefthanded: 'top center',
        righthanded: 'top center',
        allowedSiblings: [],
        groupedSiblings: false,
        activeTimeseries: null,
        /**
         * Initialize tool
         * @params {} state data
         * @method init
         * @public
         */
        init: function (pdata) {
            this.setEnabled(true);
        },
        _getTimeseriesService: function () {
            if (!this.service) {
                this.service = this.__sandbox.getService('Oskari.mapframework.bundle.timeseries.TimeseriesService');
            }
            return this.service;
        },
        /**
        * Get tool object.
        * @method getTool
        * @private
        *
        * @returns {Object} tool
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
                title: 'TimeseriesControlPlugin',
                config: {
                    showControl: true,
                    location: this.allowedLocations[0],
                    widthMargin: 200,
                    topMargin: '10%'
                }
            };
        },
        /**
        * Set enabled.
        * @method setEnabled
        * @public
        *
        * @param {Boolean} enabled is tool enabled or not
        */
        setEnabled: function (enabled) {
            var tool = this.getTool();

            // state actually hasn't changed -> do nothing
            if (this.state.enabled !== undefined && this.state.enabled !== null && enabled === this.state.enabled) {
                return;
            }

            this.state.enabled = enabled;
            if (enabled) {
                var active = this._getTimeseriesService().getActiveTimeseries();
                if (active) {
                    active.conf = jQuery.extend(true, active.conf || {}, tool.config);
                }
                this.service.trigger('activeChanged', active);
            } else {
                // removes the control plugin
                this.service.trigger('activeChanged', null);
            }

            var event = Oskari.eventBuilder('Publisher2.ToolEnabledChangedEvent')(this);
            this.__sandbox.notifyAll(event);
        },
        /**
        * Is displayed.
        * @method isDisplayed
        * @public
        *
        * @returns {Boolean} is tool displayed
        */
        isDisplayed: function (data) {
            return typeof this._getTimeseriesService().getActiveTimeseries() !== 'undefined';
        },
        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            var me = this;

            if (me.state.enabled) {
                return {
                    configuration: {
                        timeseries: {
                            conf: {
                                plugins: [{ id: this.getTool().id, config: this.getTool().config }]
                            }
                        }
                    }
                };
            } else {
                return null;
            }
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
