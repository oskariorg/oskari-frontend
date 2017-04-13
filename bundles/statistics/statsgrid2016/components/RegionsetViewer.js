Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();
}, {
/****** PUBLIC METHODS ******/
    render: function(){
        var me = this;
        var sandbox = me.sb;
        var service = me.service;
        var currentRegion = service.getStateService().getRegionset();
        var state = service.getStateService();
        var ind = state.getActiveIndicator();

        if(!ind) {
            // remove layer
            sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);
            return;
        }

        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
            if(err) {
                Oskari.log('RegionsetViewer').warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);
                return;
            }
            var classification = state.getClassificationOpts(ind.hash);
            var classify = service.getClassificationService().getClassification(data, classification);
            if(!classify) {
                Oskari.log('RegionsetViewer').warn('Error getting classification', data, classification);
                sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);
                return;
            }
            var colors = service.getColorService().getColorsForClassification(classification);

            var regiongroups = classify.getGroups();

            var optionalStyles = [];

            regiongroups.forEach(function(regiongroup, index){
                regiongroup.forEach(function(region){
                    var color = Oskari.util.hexToRgb(colors[index]);
                    // feature opacity
                    color.a = 0.8;
                    optionalStyles.push({
                        property: {
                            value: region,
                            key: 'id'
                        },
                        fill: {
                            color: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')'
                        },
                        stroke: {
                            color: '#000000',
                            width: 1
                        }
                    });
                });
            });

            service.getRegions(currentRegion, function(er, regions){
                var features = [];
                regions.forEach(function(region){
                    features.push(region.geojson);
                });
                var geoJSON = {
                    'type': 'FeatureCollection',
                    'crs': {
                        'type': 'name',
                        'properties': {
                          'name': sandbox.getMap().getSrsName()
                        }
                      },
                      'features': features
                };
                var params = [geoJSON, {
                    clearPrevious: true,
                    featureStyle: {
                        fill: {
                            color: 'rgba(255,0,0,0.0)'
                        },
                        stroke : {
                            color: '#000000',
                            width: 1
                        }
                    },
                    optionalStyles: optionalStyles,
                    layerId: me.LAYER_ID
                }];
                sandbox.postRequestByName(
                    'MapModulePlugin.AddFeaturesToMapRequest',
                    params
                );
            });
        });
    },
/****** PRIVATE METHODS ******/
    /**
     * Listen to events that require re-rendering the UI
     */
    _bindToEvents : function() {
        var me = this;

        me.service.on('StatsGrid.IndicatorEvent', function(event) {
            // if indicator is removed/added
            me.render();
        });

        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            // Always show the active indicator
            me.render();
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            // Need to update the map
            me.render();
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            // Classification changed, need update map
            me.render();
        });
    }

});