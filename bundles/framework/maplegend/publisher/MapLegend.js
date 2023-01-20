Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapLegend',
    function () {
    }, {
        index: 4,
        lefthanded: 'top left',
        righthanded: 'top right',
        bundleName: 'maplegend',
        /**
         * Get tool object.
         * @method getTool
         *
         * @returns {Object} tool description
         */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
                title: 'MapLegend',
                config: {
                    instance: this.getInstance()
                }
            };
        },
        getInstance: function () {
            return this.__sandbox.findRegisteredModuleInstance(this.bundleName);
        },
        getPlugin: function () {
            return this.getInstance().getPlugin();
        },
        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            if (!data || !data.configuration[this.bundleName]) {
                return;
            }
            this.setEnabled(true);
        },
        isDisplayed: function () {
            return this.getSandbox().findAllSelectedMapLayers().some(l => l.getLegendImage());
        },
        /**
         * Set enabled.
         * @method setEnabled
         * @public
         *
         * @param {Boolean} enabled is tool enabled or not
         */
        setEnabled: function (enabled) {
            // state actually hasn't changed -> do nothing
            if (enabled === this.state.enabled) {
                return;
            }
            this.state.enabled = enabled;

            if (enabled) {
                this.getInstance().createPlugin();
                this.__started = true;
            } else {
                this.getInstance().stopPlugin();
                this.__started = false;
            }
        },
        /**
         * Get values.
         * @method getValues
         * @public
         *
         * @returns {Object} tool value object
         */
        getValues: function () {
            if (this.isEnabled()) {
                return {
                    configuration: {
                        [this.bundleName]: {
                            conf: this.getPlugin().getConfig(),
                            state: {}
                        }
                    }
                };
            }
            return null;
        }
    }, {
        extend: ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        protocol: ['Oskari.mapframework.publisher.Tool']
    });
