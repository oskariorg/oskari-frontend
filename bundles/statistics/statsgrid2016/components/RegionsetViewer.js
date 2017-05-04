Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();

    this._pointSymbol = jQuery('<div><svg><circle></circle></svg></div>');
}, {
/****** PUBLIC METHODS ******/
    _getFeatureStyle: function(classification, region, color, highlightRegion, size){
        var me = this;
        var mapStyle = classification.mapStyle || 'choropleth';
        var style = null;
        var strokeWidth = (highlightRegion && (highlightRegion.toString() === region.toString())) ? 4 : 1;
        var strokeColor = Oskari.util.isDarkColor('#'+color) ? '#ffffff' : '#000000';
        var opacity = (classification.transparency) ? (100 - parseFloat(classification.transparency))/100 : 0.8;
        if(mapStyle === 'points') {
            var svg = me._pointSymbol.clone();
            svg.attr('width', 64);
            svg.attr('height',64);

            var circle = svg.find('circle');
            circle.attr('stroke', strokeColor);
            circle.attr('stroke-width', strokeWidth);
            circle.attr('fill', '#' + color);
            circle.attr('cx', 32);
            circle.attr('cy', 32);
            circle.attr('r', 32-strokeWidth);
            style = {
                property: {
                    value: region,
                    key: 'id'
                },
                image: {
                    opacity: opacity,
                    shape:{
                        data: svg.html(),
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

    _getFeature: function(classification,region, label) {

        if(classification.mapStyle === 'points') {
             return {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [region.point.lon, region.point.lat]
                },
                'properties': {
                    'id': region.id,
                    'name': region.name,
                    'regionValue': label
                }
            };
        }
        return region.geojson;
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
                    var color = colors[index];

                    // Get point symbol size
                    var min = classification.min;
                    var max = classification.max;
                    var iconSize = null;
                    if(min && max) {
                        var step = (max-min) / regiongroups.length;
                        iconSize = min + step * index;
                    }

                    regiongroup.forEach(function(region){
                        var wantedRegion = jQuery.grep(regions, function( r, i ) {
                            return r.id === region;
                        });

                        if(wantedRegion && wantedRegion.length === 1) {
                            optionalStyles.push(me._getFeatureStyle(classification,region, color,highlightRegion, iconSize));
                            features.push(me._getFeature(classification,wantedRegion[0], data[wantedRegion[0].id].toString()));
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

                    var defaultFeatureStyle = {
                        fill: {
                            color: 'rgba(255,0,0,0.0)'
                        },
                        stroke : {
                            color: '#000000',
                            width: 1
                        }
                    };

                    if(classification.showValues === true) {
                        var textColor = Oskari.util.isDarkColor('#'+color) ? '#ffffff' : '#000000';
                        defaultFeatureStyle.text = {
                            scale : 1.2,
                            fill : {
                                color : textColor
                            },
                            stroke: {
                                width: 0
                            },
                            labelProperty: 'regionValue',
                            offsetX: 0,
                            offsetY: 0
                        };
                    }
                    var params = [geoJSON, {
                        clearPrevious: false,
                        featureStyle: defaultFeatureStyle,
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