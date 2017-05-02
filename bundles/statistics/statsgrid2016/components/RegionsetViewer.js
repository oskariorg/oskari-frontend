Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();

    this._pointSymbol = jQuery('<svg><circle></circle></svg>');
}, {
/****** PUBLIC METHODS ******/
    getFeatureStyle: function(classification, region, color, highlightRegion, size){
        var me = this;
        var mapStyle = classification.mapStyle || 'choropleth';
        var style = null;
        var strokeWidth = (highlightRegion && (highlightRegion.toString() === region.toString())) ? 4 : 1;
        var strokeColor = Oskari.util.isDarkColor('#'+color) ? '#ffffff' : '#000000';
        if(mapStyle === 'points') {
            var svg = me._pointSymbol.clone();
            svg.attr('width', 64);
            svg.attr('height',64);

            var circle = svg.find('circle');
            circle.attr('stroke', strokeColor);
            circle.attr('stroke-width', strokeWidth);
            circle.attr('fill', '#' + color);
            //circle.attr('fill-opacity', '0.5');
            circle.attr('cx', 32);
            circle.attr('cy', 32);
            circle.attr('r', 32-strokeWidth);
            style = {
                property: {
                    value: region,
                    key: 'id'
                },
                image: {
                    opacity: 0.8,
                    shape:{
                        data: svg.prop('outerHTML'),
                        x: 32,
                        y: 0
                    },
                    size: size
                }
            };
        }
        else {
            style = {
                property: {
                    value: region,
                    key: 'id'
                },
                fill: {
                    color: '#' + color
                },
                stroke: {
                    color: '#000000',
                    width: strokeWidth
                },
                image: {
                    opacity: 0.8
                }
            };
        }
        return style;
    },
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
            sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);

            if(!classify) {
                Oskari.log('RegionsetViewer').warn('Error getting classification', data, classification);
                return;
            }
            var colors = service.getColorService().getColorsForClassification(classification);

            service.getRegions(currentRegion, function(er, regions){
                var regiongroups = classify.getGroups();

                regiongroups.forEach(function(regiongroup, index){
                    var features = [];
                    var optionalStyles = [];

                    // Get point symbol size
                    var min = classification.min || 30;
                    var max = classification.max || 120;

                    var step = (max-min) / regiongroups.length;

                    var iconSize = min + step * index;

                    regiongroup.forEach(function(region){
                        optionalStyles.push(me.getFeatureStyle(classification,region, colors[index],highlightRegion, iconSize));

                        var addedRegion = jQuery.grep(regions, function( r, i ) {
                            return r.id === region;
                        });

                        if(addedRegion && addedRegion.length === 1) {
                            if(classification.mapStyle === 'points') {
                                 features.push({
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [addedRegion[0].point.lon, addedRegion[0].point.lat]
                                    },
                                    'properties': {
                                        'id': addedRegion[0].id,
                                        'name': addedRegion[0].name
                                    }
                                });
                            } else {
                                features.push(addedRegion[0].geojson);
                            }
                        }

                    });


                    // Add group features to map
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
                        clearPrevious: false,
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
                        layerId: me.LAYER_ID,
                        prio: index
                    }];
                    sandbox.postRequestByName(
                        'MapModulePlugin.AddFeaturesToMapRequest',
                        params
                    );

                });


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