Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapLegendTool',
    function () {
        this.handler = null;
    }, {
        index: 10,
        group: 'layers',
        bundleName: 'maplegend',
        getComponent: function () {
            return {};
        },
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
                title: Oskari.getMsg('maplegend', 'tool.label'),
                config: this.state.pluginConfig || {},
                disabledReason: Oskari.getMsg('maplegend', 'noLegendsText')
            };
        },
        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            const myData = data?.configuration[this.bundleName];
            if (myData) {
                this.storePluginConf(myData.conf);
                this.setEnabled(true);
            }
        },
        isDisabled: function () {
            // should we filter layers with isVisibleOnMap()?
            return !this.getSandbox().findAllSelectedMapLayers().some(l => l.getLegendImage());
        },
        onLayersChanged: function () {
            if (this.isEnabled() && this.isDisabled()) {
                // disable if layers changed and there is no longer layers with legends on map
                this.setEnabled(false);
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
            if (!this.isEnabled()) {
                return null;
            }
            return {
                [this.bundleName]: {
                    conf: this.getPlugin().getConfig()
                }
            };
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    });
