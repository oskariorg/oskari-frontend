Oskari.clazz.define('Oskari.mapframework.publisher.tool.AbstractStatsPluginTool', function () {
}, {
    getStatsgridConf: function (initialData) {
        const conf = initialData?.configuration?.statsgrid?.conf || {};
        // Setup the plugin location whenever any of the stats tools parse initial config.
        // There will be "too many calls" to this but it's not too bad and
        // we want the location always set or reset no matter which tool sets it
        this.getStatsgridBundle()?.togglePlugin?.setLocation(conf.location?.classes);
        return conf;
    },

    getStatsgridBundle: function () {
        return Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
    },
    getComponent: function () {
        return {};
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
    getPlugin: function () {
        var stats = this.getStatsgridBundle();
        return stats?.togglePlugin;
    },
    getConfiguration: function (conf = {}) {
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup tools configuration
        // otherwise the embedded map will get statsgrid config which means that editing the embedded
        // map will show the thematic map tools panel even if the thematic maps is not used on the embedded map
        if (!this._isStatsActive()) {
            return null;
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
