Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function (instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();
    this._initLayer();
    this._pointSymbol = jQuery('<div><svg><circle></circle></svg></div>');
}, {
/** **** PUBLIC METHODS ******/
    render: function (highlightRegion) {
        var me = this;
        var sandbox = me.sb;
        var service = me.service;
        var currentRegion = service.getStateService().getRegionset();
        var state = service.getStateService();
        var ind = state.getActiveIndicator();
        var locale = me.instance.getLocalization();

        // remove layer
        sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);

        if (!ind) {
            return;
        }
        me._updateLayerProperties();
        var errorService = service.getErrorService();

        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, ind.series, state.getRegionset(), function (err, data) {
            if (err) {
                Oskari.log('RegionsetViewer').warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                return;
            }

            var classification = state.getClassificationOpts(ind.hash);
            var groupStats = service.getSeriesService().getSeriesStats(ind.hash);
            var numberFormatter = Oskari.getNumberFormatter(classification.fractionDigits);

            var classify = service.getClassificationService().getClassification(data, classification, groupStats);

            if (!classify) {
                Oskari.log('RegionsetViewer').warn('Error getting classification', data, classification);
                return;
            }
            var colors = service.getColorService().getColorsForClassification(classification);

            service.getRegions(currentRegion, function (er, regions) {
                if (err) {
                    me.log.warn('Cannot get regions for wanted regionset=' + currentRegion);
                    // notify error!!
                    errorService.show(locale.errors.title, locale.errors.regionsDataError);
                    return;
                }
                if (regions.length === 0) {
                    errorService.show(locale.errors.title, locale.errors.regionsDataIsEmpty);
                }
                var regiongroups = classify.getGroups();

                regiongroups.forEach(function (regiongroup, index) {
                    var features = [];
                    var optionalStyles = [];
                    var color = colors[index];

                    var iconSizePx = service.getClassificationService().getPixelForSize(index,
                        {
                            min: classification.min,
                            max: classification.max
                        }, {
                            min: 0,
                            max: classification.count - 1
                        }
                    );

                    regiongroup.forEach(function (region) {
                        var wantedRegion = jQuery.grep(regions, function (r) {
                            return r.id === region;
                        });

                        if (wantedRegion && wantedRegion.length === 1) {
                            if (highlightRegion && (highlightRegion.toString() === region.toString())) {
                                optionalStyles.push(me._getFeatureStyle(classification, region, color, true, iconSizePx));
                            }
                            features.push(me._getFeature(classification, wantedRegion[0], numberFormatter.format(data[wantedRegion[0].id])));
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

                    var defaultFeatureStyle = me._getFeatureStyle(classification, null, color, false, iconSizePx);

                    if (classification.showValues === true) {
                        var textColor = Oskari.util.isDarkColor('#' + color) ? '#ffffff' : '#000000';
                        defaultFeatureStyle.text = {
                            scale: 1.2,
                            fill: {
                                color: textColor
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
                        prio: index,
                        opacity: typeof classification.transparency !== 'undefined' ? classification.transparency : 100
                    }];

                    sandbox.postRequestByName(
                        'MapModulePlugin.AddFeaturesToMapRequest',
                        params
                    );
                });
            });
        });
    },
    /** **** PRIVATE METHODS ******/
    _getFeatureStyle: function (classification, region, color, highlighted, size) {
        var me = this;
        var mapStyle = classification.mapStyle || 'choropleth';
        var style = null;
        var strokeWidth = highlighted ? 4 : 1;
        if (mapStyle === 'points') {
            style = me._getPointStyle(strokeWidth, color, size);
        } else {
            style = me._getPolygonStyle(strokeWidth, color);
        }
        if (region) {
            style.property = {
                value: region,
                key: 'id'
            }
        }
        return style;
    },

    _getPointStyle: function (strokeWidth, fillColor, size) {
        var strokeColor = Oskari.util.isDarkColor('#' + fillColor) ? '#ffffff' : '#000000';
        var svg = this._pointSymbol.clone();
        svg.attr('width', 64);
        svg.attr('height', 64);

        var circle = svg.find('circle');
        circle.attr('stroke', strokeColor);
        circle.attr('stroke-width', strokeWidth);
        circle.attr('fill', '#' + fillColor);
        circle.attr('cx', 32);
        circle.attr('cy', 32);
        circle.attr('r', 32 - strokeWidth);
        var style = {
            image: {
                opacity: 1,
                shape: {
                    data: svg.html(),
                    x: 32,
                    y: 0
                },
                sizePx: size
            }
        };
        return style;
    },

    _getPolygonStyle: function (strokeWidth, fillColor) {
        var style = {
            fill: {
                color: '#' + fillColor
            },
            stroke: {
                color: '#000000',
                width: strokeWidth
            },
            image: {
                opacity: 1
            }
        };
        return style;
    },

    _getFeature: function (classification, region, label) {
        var featureProperties = {
            'id': region.id,
            'name': region.name,
            'regionValue': label
        };
        if (classification.mapStyle === 'points') {
            return {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [region.point.lon, region.point.lat]
                },
                'properties': featureProperties
            };
        } else {
            var geojson = jQuery.extend(true, {}, region.geojson);
            geojson.properties = featureProperties;
            return geojson;
        }
    },
    /**
     * Prepare vectorlayer for features.
     */
    _initLayer: function () {
        var locale = this.instance.getLocalization();
        this.sb.postRequestByName(
            'VectorLayerRequest',
            [
                {
                    layerId: this.LAYER_ID,
                    layerName: locale.layer.name,
                    layerInspireName: locale.layer.inspireName,
                    layerOrganizationName: locale.layer.organizationName,
                    layerPermissions: {
                        'publish': 'publication_permission_ok'
                    }
                }
            ]
        );
    },
    _updateLayerProperties: function () {
        var service = this.service;
        var state = service.getStateService();
        var ind = state.getActiveIndicator();
        if (!ind) {
            return;
        }

        var regionsetId = state.getRegionset();
        var regionset = service.getRegionsets(regionsetId);
        var classification = state.getClassificationOpts(ind.hash);
        var highlightStrokeWidth = 4;

        var hoverOptions = {
            content: [
                {
                    keyProperty: 'name',
                    valueProperty: 'regionValue'
                }
            ]
        };

        if (classification.mapStyle && classification.mapStyle === 'points') {
            var colors = service.getColorService().getColorsForClassification(classification);
            var fillColor = colors[0];
            var ptStyle = this._getPointStyle(highlightStrokeWidth, fillColor);
            hoverOptions.featureStyle = {
                image: {
                    shape: {
                        data: ptStyle.image.shape.data
                    }
                },
                inherit: true
            };
        } else {
            hoverOptions.featureStyle = {
                stroke: {
                    width: highlightStrokeWidth
                },
                inherit: true,
                effect: 'darken'
            };
        }

        this.sb.postRequestByName(
            'VectorLayerRequest',
            [
                {
                    layerId: this.LAYER_ID,
                    hover: hoverOptions,
                    showLayer: true,
                    layerDescription: (regionset && regionset.name) ? regionset.name : null
                }
            ]
        );
    },
    /**
     * Listen to events that require re-rendering the UI
     */
    _bindToEvents: function () {
        var me = this;
        var state = me.service.getStateService();
        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {
            // Always show the active indicator
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function (event) {
            // Need to update the map
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionSelectedEvent', function (event) {
            // FIXME: this needs some serious optimization
            // we need previous selection from event so we can update the style
            //  for 2 features instead of ALL the regions
            me.render(event.getRegion());
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function (event) {
            // Classification changed, need update map
            me.render(state.getRegion());
        });

        me.service.on('FeatureEvent', function (event) {
            if (event.getParams().operation !== 'click' || !event.hasFeatures()) {
                return;
            }

            // resolve region
            var features = event.getParams().features[0];
            var region = features.geojson.features[0].properties.id;

            state.toggleRegion(region, 'map');
        });
    }

});
