Oskari.clazz.define("Oskari.mapping.printout2.tools.thematicmap",
    function ( ) {
        this.sandbox = Oskari.getSandbox();
}, {
    getName: function () {
        return "Thematicmap"
    },
    getStatsInstance : function() {
        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        return stats;
    },
    getGeoJSON: function () {
       var instance = this.getStatsInstance();
       var service = instance.statsService;
       var stateService = service.getStateService();
       var activeIndicator = stateService.getActiveIndicator();
       var regionSet = stateService.getRegionset();
       var legend;
       service.getIndicatorData( activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, regionSet, function ( err, data ) {
            var classificationOpts = stateService.getClassificationOpts(activeIndicator.hash);
            var classification = service.getClassificationService().getClassification(data, classificationOpts);

            var colors = service.getColorService().getColorsForClassification(classificationOpts, true);
            legend = classification.createLegend(colors);
       } )
        return legend;
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function(data) {
        var hasStatsLayerOnMap = this._getStatsLayer() !== null;
        if(hasStatsLayerOnMap) {
            return true;
        } else {
            return false;
        }
    },
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return founded stats layer, if not found then null
    */
    _getStatsLayer: function() {
        var me = this,
            selectedLayers = me.sandbox.findAllSelectedMapLayers(),
            statsLayer = null,
            layer;
        for (i = 0; i < selectedLayers.length; i += 1) {
            layer = selectedLayers[i];
            if (layer.getId() === 'STATS_LAYER') {
                statsLayer = layer;
                break;
            }
        }
        return statsLayer;
    },
    getElement: function () {
        return this.getGeoJSON();
    }
}, {
    'extend' : ['Oskari.mapping.printout2.tools.AbstractTool'],
    'protocol' : ['Oskari.mapping.printout2.Tool']
});