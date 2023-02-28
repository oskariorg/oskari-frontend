Oskari.clazz.define('Oskari.mapframework.publisher.tool.AbstractStatsPluginTool', function () {
}, {
    getStatsgridConf: function (initialData) {
        const conf = initialData?.configuration?.statsgrid?.conf || {};
        // Setup the plugin location whenever any of the stats tools parse initial config.
        // There will be "too many calls" to this but it's not too bad and
        // we want the location always set or reset no matter which tool sets it
        this.getStatsgridBundle()?.togglePlugin?.setLocation(conf.location?.classes);
        this.getStatsgridBundle()?.classificationPlugin?.setLocation(conf.location?.classes);
        return conf;
    },

    getStatsgridBundle: function () {
        return Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
    },

    /**
    * @method @private _isStatsActive
    * @return true when stats layer is on the map, false if removed
    */
    _isStatsActive: function () {
        return Oskari.getSandbox().isLayerAlreadySelected('STATS_LAYER');
    },
    /**
     * @method isDisplayed Is displayed.
     * @returns {Boolean} true, if stats layer is on the map or data contains statsdrid conf
     */
    isDisplayed: function (data) {
        if (this._isStatsActive()) {
            return true;
        }
        return Oskari.util.keyExists(data, 'configuration.statsgrid.conf');
    },
    isStarted: function () {
        return !!this.getPlugin();
    },
    getPlugin: function () {
        var stats = this.getStatsgridBundle();
        return stats?.togglePlugin;
    },
    getConfiguration: function (conf = {}) {
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup tools configuration
        if (!this._isStatsActive) {
            return {};
        }
        return {
            configuration: {
                statsgrid: {
                    conf
                }
            }
        };
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool']
});
