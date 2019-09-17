const BORDER_PRIO = 10000;
const REGION_PRIO = 10;
const HIGHLIGHT_PRIO = 1;

Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function (instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();
    this._initLayer();
    this._pointSymbol = jQuery('<div><svg><circle></circle></svg></div>');
    this._regionsAdded = [];
    this._lastRenderCache = {};
}, {
    render: function (highlightRegionId) {
        const me = this;
        const service = me.service;
        const state = service.getStateService();
        const ind = state.getActiveIndicator();
        const regionset = state.getRegionset();

        if (!ind || !regionset) {
            me._clearRegions();
            return;
        }
        me._updateLayerProperties();

        const { datasource, indicator, selections, series } = ind;
        service.getIndicatorData(datasource, indicator, selections, series, regionset, function (err, data) {
            if (err) {
                Oskari.log('RegionsetViewer').warn('Error getting indicator data', datasource, indicator, selections, regionset);
                return;
            }
            const classificationOpts = state.getClassificationOpts(ind.hash);
            const groupStats = service.getSeriesService().getSeriesStats(ind.hash);
            const classified = service.getClassificationService().getClassification(data, classificationOpts, groupStats);
            if (!classified) {
                Oskari.log('RegionsetViewer').warn('Error getting classification', data, classified);
                return;
            }
            if (me._lastRenderCache.classification &&
                me._lastRenderCache.classification.mapStyle !== classificationOpts.mapStyle) {
                me._clearRegions();
            }
            const regionGroups = classified.getGroups();
            me._viewRegions(classificationOpts, regionGroups, data, highlightRegionId);
        });
    },
    /** **** PRIVATE METHODS ******/
    _viewRegions: function (classification, regionGroups, regionValues, highlightRegionId) {
        const me = this;
        const service = me.service;
        const errorService = service.getErrorService();
        const regionset = service.getStateService().getRegionset();
        const locale = me.instance.getLocalization();
        service.getRegions(regionset, function (err, regionIds) {
            if (err) {
                me.log.warn('Cannot get regions for wanted regionset=' + regionset);
                // notify error!!
                errorService.show(locale.errors.title, locale.errors.regionsDataError);
                return;
            }
            if (regionIds.length === 0) {
                errorService.show(locale.errors.title, locale.errors.regionsDataIsEmpty);
            }
            me._addRegionFeatures(classification, regionGroups, regionIds, regionValues, highlightRegionId);
        });
    },
    _addRegionFeatures: function (classification, regiongroups, regions, regionValues, highlightRegionId) {
        const me = this;
        const sandbox = me.sb;
        const service = me.service;
        const colors = service.getColorService().getColorsForClassification(classification);
        const numberFormatter = Oskari.getNumberFormatter(classification.fractionDigits);
        const addFeaturesRequestParams = [];
        const handledRegions = [];

        regiongroups.forEach(function (regiongroup, index) {
            const optionalStyles = [];
            const color = colors[index];

            const iconSizePx = service.getClassificationService().getPixelForSize(index,
                {
                    min: classification.min,
                    max: classification.max
                }, {
                    min: 0,
                    max: classification.count - 1
                }
            );

            const updates = [];
            const adds = [];
            const regionFeaturesToAdd = [];
            const borderFeatures = [];

            regiongroup.forEach(regionId => {
                if (highlightRegionId && (highlightRegionId.toString() === regionId.toString())) {
                    optionalStyles.push(me._getFeatureStyle(classification, regionId, color, true, iconSizePx));
                }
                const region = regions.find(r => r.id === regionId);
                if (!region) {
                    return;
                }
                const regionVal = numberFormatter.format(regionValues[regionId]);
                if (me._regionsAdded.includes(regionId)) {
                    updates.push({
                        value: regionId,
                        properties: {
                            regionValue: regionVal
                        }
                    });
                } else {
                    const feature = me._getFeature(classification, region, regionVal);
                    if (classification.mapStyle === 'points') {
                        borderFeatures.push(me._getBorderFeature(region, regionVal));
                    }
                    regionFeaturesToAdd.push(feature);
                    adds.push(regionId);
                }
                handledRegions.push(regionId);
            });

            const defaultFeatureStyle = me._getFeatureStyle(classification, null, color, false, iconSizePx);

            const textColor = Oskari.util.isDarkColor('#' + color) ? '#ffffff' : '#000000';
            defaultFeatureStyle.text = {
                scale: 1.2,
                fill: {
                    color: textColor
                },
                stroke: {
                    width: 0
                },
                labelProperty: classification.showValues ? 'regionValue' : '',
                offsetX: 0,
                offsetY: 0
            };

            const requestOptions = {
                clearPrevious: false,
                featureStyle: defaultFeatureStyle,
                optionalStyles: optionalStyles,
                layerId: me.LAYER_ID,
                prio: REGION_PRIO + index,
                opacity: typeof classification.transparency !== 'undefined' ? classification.transparency : 100,
                animationDuration: 250
            };
            if (adds.length !== 0) {
                me._regionsAdded = me._regionsAdded.concat(adds);
                addFeaturesRequestParams.push([me._getGeoJSON(regionFeaturesToAdd), requestOptions]);
                // Add border features under the points
                if (borderFeatures.length > 0) {
                    const borderRequestOptions = Object.assign({}, requestOptions, {
                        prio: BORDER_PRIO + index
                    });
                    addFeaturesRequestParams.push([me._getGeoJSON(borderFeatures), borderRequestOptions]);
                }
            }
            if (updates.length !== 0) {
                const searchOptions = {'id': updates};
                addFeaturesRequestParams.push([searchOptions, requestOptions]);
            }
        });

        // Remove regions missing value
        if (handledRegions.length !== regions.length) {
            const regionsWithoutValue = regions.filter(r => !handledRegions.includes(r.id)).map(r => r.id);
            const borders = regionsWithoutValue.map(id => 'border' + id);
            const removes = regionsWithoutValue.concat(borders);
            if (regionsWithoutValue.length > 0) {
                sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', ['id', removes, me.LAYER_ID]);
            }
        }
        addFeaturesRequestParams.forEach(params => {
            sandbox.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', params);
        });

        me._lastRenderCache = { classification, regiongroups, highlightRegionId };
    },

    _getGeoJSON: function (features) {
        const geojson = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': this.sb.getMap().getSrsName()
                }
            },
            'features': features
        };
        return geojson;
    },

    _clearRegions: function () {
        var me = this;
        me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);
        me._regionsAdded = [];
    },

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
        if (highlighted) {
            style.effect = 'darken';
        }
        if (region) {
            style.property = {
                value: region,
                key: 'id'
            };
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
            },
            stroke: {
                color: '#000000',
                width: strokeWidth
            },
            fill: {
                color: 'rgba(255,255,255,0)'
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
            'regionValue': label,
            'oskari_type': 'region'
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

    _getBorderFeature: function (region, label) {
        var featureProperties = {
            'id': 'border' + region.id,
            'name': region.name,
            'regionValue': label,
            'oskari_type': 'border'
        };
        var geojson = jQuery.extend(true, {}, region.geojson);
        geojson.properties = featureProperties;
        return geojson;
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
            filter: [{key: 'oskari_type', value: 'region'}],
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
    _updateFeatureStyle: function (regionId, highlight) {
        const me = this;
        const { classification, regiongroups } = me._lastRenderCache;
        if (!regiongroups || !classification) {
            return;
        }
        const group = regiongroups.find(group => group.includes(regionId));
        if (!group) {
            return;
        }
        const groupIndex = regiongroups.indexOf(group);
        const color = me.service.getColorService().getColorsForClassification(classification)[groupIndex];

        const { min, max, count } = classification;
        const iconSizePx = me.service.getClassificationService().getPixelForSize(
            groupIndex,
            { min, max },
            {
                min: 0,
                max: count - 1
            }
        );
        const style = me._getFeatureStyle(me._lastRenderCache.classification, regionId, color, highlight, iconSizePx);
        style.effect = highlight ? 'darken' : '';
        const requestOptions = {
            featureStyle: style,
            layerId: me.LAYER_ID,
            prio: highlight ? HIGHLIGHT_PRIO : REGION_PRIO + groupIndex
        };
        const searchOptions = {'id': regionId};
        me.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [searchOptions, requestOptions]);
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
            me._clearRegions();
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionSelectedEvent', function (event) {
            const selectedRegion = event.getRegion();
            me._updateFeatureStyle(selectedRegion, true);
            // Remove previous highlight
            const previous = me._lastRenderCache.highlightRegionId;
            if (previous && previous !== selectedRegion) {
                me._updateFeatureStyle(previous, false);
            }
            me._lastRenderCache.highlightRegionId = selectedRegion;
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
            var topmostFeature = event.getParams().features[0];
            if (topmostFeature.layerId !== me.LAYER_ID) {
                return;
            }
            var region = topmostFeature.geojson.features[0].properties.id;
            state.toggleRegion(region, 'map');
        });
    }

});
