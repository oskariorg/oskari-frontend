Oskari.clazz.define('Oskari.mapframework.publisher.tool.StatsTableTool', function () {
}, {
    index: 1,
    group: 'data',

    groupedSiblings: false,
    templates: {},
    id: 'table',
    title: 'grid',
    /**
     * Initialize tool
     * @params {} state data
     * @method init
     * @public
     */
    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.grid === true);
    },
    /**
    * Get tool object.
     * @params {}  pdta.configuration.publishedgrid.state
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function () {
        return {
            id: 'Oskari.statistics.statsgrid.TogglePlugin',
            title: this.getTitle(),
            config: {
                grid: true
            },
            hasNoPlugin: true
        };
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    _setEnabledImpl: function (enabled) {
        var stats = this.getStatsgridBundle();
        if (!stats) {
            return;
        }
        if (enabled) {
            stats.togglePlugin.addTool(this.id);
        } else {
            stats.togglePlugin.removeTool(this.id);
        }
    },
    getValues: function () {
        return this.getConfiguration({ grid: this.isEnabled() });
    },
    _stopImpl: function () {
        var stats = this.getStatsgridBundle();
        if (stats) {
            stats.togglePlugin.removeTool(this.id);
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
