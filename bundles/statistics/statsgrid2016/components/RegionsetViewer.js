const BORDER_PRIO = 10000;
const REGION_PRIO = 10;
const HIGHLIGHT_PRIO = 1;

Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function (instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.log = Oskari.log('Oskari.statistics.statsgrid.RegionsetViewer');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();
    this._pointSymbol = jQuery('<div><svg><circle></circle></svg></div>');
    this._regionsAdded = [];
    this._lastRenderCache = {};
}, {
    render: function (highlightRegionId) {
        const me = this;
        const { activeIndicator, regionset, error, seriesStats } = this.service.getStateService().getStateForRender();
        if (error) {
            this.log.warn('Error getting state', error);
            me._clearRegions();
            return;
        }
        me._updateLayerProperties();

        const { datasource, indicator, selections, series, classification } = activeIndicator;
        this.service.getIndicatorData(datasource, indicator, selections, series, regionset, function (err, data) {
            if (err) {
                me.log.warn('Error getting indicator data', datasource, indicator, selections, regionset);
                me._clearRegions();
                return;
            }
            const { error, ...classified } = me.service.getClassificationService().getClassification(data, classification, seriesStats);
            if (error) {
                me._clearRegions();
                return;
            }
            if (me._lastRenderCache.mapStyle !== classification.mapStyle) {
                me._clearRegions();
            }
            me._viewRegions(regionset, classification, classified, data, highlightRegionId);
        });
    },
    /** **** PRIVATE METHODS ******/
    _viewRegions: function (regionset, classification, classified, regionValues, highlightRegionId) {
        const me = this;
        const locale = me.instance.getLocalization();
        this.service.getRegions(regionset, function (err, regionIds) {
            if (err) {
                // notify error!!
                me.service.getErrorService().show(locale.errors.title, locale.errors.regionsDataError);
                return;
            }
            if (regionIds.length === 0) {
                me.service.getErrorService().show(locale.errors.title, locale.errors.regionsDataIsEmpty);
                return;
            }
            me._addRegionFeatures(classification, classified, regionIds, regionValues, highlightRegionId);
        });
    },
    _addRegionFeatures: function (classification, classified, regions, regionValues, highlightRegionId) {
        const me = this;
        const addFeaturesRequestParams = [];
        const handledRegions = [];
        const { groups, format } = classified;
        groups.forEach(function (regiongroup, index) {
            const { color, sizePx, regionIds } = regiongroup;
            const optionalStyles = [];
            const updates = [];
            const adds = [];
            const regionFeaturesToAdd = [];
            const borderFeatures = [];

            regionIds.forEach(regionId => {
                if (highlightRegionId && (highlightRegionId.toString() === regionId.toString())) {
                    optionalStyles.push(me._getFeatureStyle(classification, regionId, color, true, sizePx));
                }
                const region = regions.find(r => r.id === regionId);
                if (!region) {
                    return;
                }
                const regionVal = format(regionValues[regionId]);
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

            const defaultFeatureStyle = me._getFeatureStyle(classification, null, color, false, sizePx);
            const regionFeatureStyle = Object.assign({
                text: {
                    scale: 1.2,
                    fill: {
                        color: Oskari.util.isDarkColor(color) ? '#ffffff' : '#000000'
                    },
                    stroke: {
                        width: 0
                    },
                    labelProperty: classification.showValues ? 'regionValue' : '',
                    offsetX: 0,
                    offsetY: 0
                }
            }, defaultFeatureStyle);

            const regionRequestOptions = {
                clearPrevious: false,
                featureStyle: regionFeatureStyle,
                optionalStyles: optionalStyles,
                layerId: me.LAYER_ID,
                prio: REGION_PRIO + index,
                opacity: typeof classification.transparency !== 'undefined' ? classification.transparency : 100,
                animationDuration: 250
            };
            const borderRequestOptions = Object.assign({}, regionRequestOptions, {
                prio: BORDER_PRIO + index
            });
            borderRequestOptions.featureStyle = defaultFeatureStyle;

            if (adds.length !== 0) {
                me._regionsAdded = me._regionsAdded.concat(adds);
                addFeaturesRequestParams.push([me._getGeoJSON(regionFeaturesToAdd), regionRequestOptions]);
                // Add border features under the points
                if (borderFeatures.length > 0) {
                    addFeaturesRequestParams.push([me._getGeoJSON(borderFeatures), borderRequestOptions]);
                }
            }
            if (updates.length !== 0) {
                const searchOptions = { 'id': updates };
                addFeaturesRequestParams.push([searchOptions, regionRequestOptions]);

                if (classification.mapStyle === 'points') {
                    const borderUpdates = updates.map(updateParams => Object.assign({}, updateParams, { value: 'border' + updateParams.value }));
                    const borderSearchOptions = { 'id': borderUpdates };
                    addFeaturesRequestParams.push([borderSearchOptions, borderRequestOptions]);
                }
            }
        });

        // Remove regions missing value
        if (handledRegions.length !== regions.length) {
            const regionsWithoutValue = [];
            me._regionsAdded = [];
            regions.forEach(r => {
                const id = r.id;
                if (handledRegions.includes(id)) {
                    me._regionsAdded.push(id);
                } else {
                    regionsWithoutValue.push(id);
                }
            });
            const borders = regionsWithoutValue.map(id => 'border' + id);
            const removes = regionsWithoutValue.concat(borders);
            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', ['id', removes, me.LAYER_ID]);
        }
        addFeaturesRequestParams.forEach(params => {
            me.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', params);
        });

        me._lastRenderCache = { classification, groups, highlightRegionId, mapStyle: classification.mapStyle };
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
    _getPointStyle: function (strokeWidth, color, size) {
        const strokeColor = Oskari.util.isDarkColor(color) ? '#ffffff' : '#000000';
        return {
            fill: { color: null },
            image: {
                radius: size / 2,
                fill: { color }
            },
            stroke: {
                color: strokeColor,
                width: strokeWidth
            }
        };
    },
    _getPolygonStyle: function (strokeWidth, color) {
        var style = {
            fill: {
                color
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
            hoverOptions.featureStyle = {
                stroke: {
                    width: highlightStrokeWidth
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
        const { classification, groups } = this._lastRenderCache;
        if (!groups || !classification) {
            return;
        }
        const index = groups.findIndex(group => group.regionIds && group.regionIds.includes(regionId));
        if (index === -1) {
            return;
        }
        const { color, sizePx } = groups[index];
        const style = this._getFeatureStyle(classification, regionId, color, highlight, sizePx);
        style.effect = highlight ? 'darken' : '';
        const requestOptions = {
            featureStyle: style,
            layerId: this.LAYER_ID,
            prio: highlight ? HIGHLIGHT_PRIO : REGION_PRIO + index
        };
        const searchOptions = { id: regionId };
        this.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [searchOptions, requestOptions]);

        if (classification.mapStyle && classification.mapStyle === 'points') {
            const borderRequestOptions = { ...requestOptions };
            const borderSearchOptions = { ...searchOptions };
            delete borderRequestOptions.prio;
            borderSearchOptions.id = 'border' + regionId;
            this.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [borderSearchOptions, borderRequestOptions]);
        }
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
        me.service.on('StatsGrid.ParameterChangedEvent', function (event) {
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
        me.service.on('StatsGrid.StateChangedEvent', function (event) {
            if (event.isReset()) {
                return;
            }
            me._clearRegions();
            me.render(state.getRegion());
        });
        me.service.on('AfterMapLayerRemoveEvent', function () {
            me._clearRegions();
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
