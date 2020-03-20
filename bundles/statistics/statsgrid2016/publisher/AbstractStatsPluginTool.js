Oskari.clazz.define('Oskari.mapframework.publisher.tool.AbstractStatsPluginTool', function () {
}, {
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
