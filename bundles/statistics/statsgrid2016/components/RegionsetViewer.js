Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();
}, {
/****** PUBLIC METHODS ******/
    getGeoJSONFeatures: function(){},
    render: function(highlightRegion){
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
                    optionalStyles.push({
                        property: {
                            value: region,
                            key: 'id'
                        },
                        fill: {
                            color: '#' + colors[index]
                        },
                        stroke: {
                            color: '#000000',
                            width: (highlightRegion && (highlightRegion.toString() === region.toString())) ? 4 : 1
                        },
                        image: {
                            opacity: 0.8,
                            shape: '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>'
                        }
                    });
                });
            });

            service.getRegions(currentRegion, function(er, regions){
                var features = [];
                regions.forEach(function(region){
                    //features.push(region.geojson);
                    features.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [region.point.lon, region.point.lat]
                        },
                        'properties': {
                            'id': region.id,
                            'name': region.name
                        }
                    });
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
        var sandbox = me.sb;
        var state = me.service.getStateService();

        me.service.on('StatsGrid.IndicatorEvent', function(event) {
            // if indicator is removed/added
            me.render();
        });

        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            // Always show the active indicator
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            // Need to update the map
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionSelectedEvent', function(event){
            me.render(event.getRegion());
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            // Classification changed, need update map
            me.render(state.getRegion());
        });

        me.service.on('FeatureEvent', function(event){
            if(event.getParams().operation !== 'click' || !event.hasFeatures()) {
                return;
            }

            // resolve region
            var features = event.getParams().features[0];
            var region = features.geojson.features[0].properties.id;

            state.selectRegion(region, 'map');
        });
    }

});