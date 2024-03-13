import { Messaging } from 'oskari-ui/util';
import { LAYER_ID } from '../constants';
import { getRegionsets } from '../helper/ConfigHelper';
import { getRegions } from '../helper/RegionsHelper';
import { getDataByRegions } from '../helper/StatisticsHelper';

const BORDER_PRIO = 10000;
const REGION_PRIO = 10;
const HIGHLIGHT_PRIO = 1;

Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function (instance) {
    this.instance = instance;
    this.sb = instance.getSandbox();
    this.stateHandler = instance.getStateHandler();
    this.log = Oskari.log('Oskari.statistics.statsgrid.RegionsetViewer');

    this._pointSymbol = jQuery('<div><svg><circle></circle></svg></div>');
    this._regionsAdded = [];
    this._lastRenderCache = {};

    // state handler's setActiveRegion doesn't use normal updateState
    // it notifies listeners with updated key
    // full render is heavy operation and causes blinking on map
    this.stateHandler.addStateListener((state, updated) => updated === 'activeRegion'
        ? this.updateActiveRegion(state.activeRegion)
        : this.render(state));
}, {
    updateActiveRegion: function (activeRegion) {
        const { highlightRegionId } = this._lastRenderCache;
        // higlight feature
        this._updateFeatureStyle(activeRegion, true);
        if (highlightRegionId) {
            // Remove previous highlight
            this._updateFeatureStyle(highlightRegionId, false);
        }
        this._lastRenderCache.highlightRegionId = activeRegion;
    },
    render: async function (state) {
        try {
            const { indicators, activeIndicator, activeRegion, regionset } = state;
            const currentIndicator = indicators.find(ind => ind.hash === activeIndicator);
            if (!currentIndicator) {
                this.clearRegions();
                return;
            }
            const { classification, classifiedData } = currentIndicator;
            const dataByRegions = getDataByRegions(currentIndicator);
            const { mapStyle } = classification;
            this._updateLayerProperties(mapStyle, regionset);

            if (classifiedData.error) {
                this.clearRegions();
                return;
            }
            const { mapStyle: lastStyle, regionset: lastRegionset } = this._lastRenderCache;
            if (lastStyle !== mapStyle || lastRegionset !== regionset) {
                this.clearRegions();
                this._lastRenderCache.regionset = regionset;
            }
            this._viewRegions(classification, classifiedData, dataByRegions, activeRegion);
        } catch (error) {
            this.log.warn('Error getting indicator data:', error.message);
            this.clearRegions();
        }
    },
    /** **** PRIVATE METHODS ******/
    _viewRegions: async function (classification, classifiedData, dataByRegions, highlightRegionId) {
        const locale = this.instance.getLocalization();
        try {
            const { regionset } = this.stateHandler.getState();
            const regions = getRegions(regionset);
            if (regions.length === 0) {
                Messaging.error(locale.errors.regionsDataIsEmpty);
                return;
            }
            this._addRegionFeatures(classification, classifiedData, regions, dataByRegions, highlightRegionId);
        } catch (error) {
            Messaging.error(locale.errors.regionsDataError);
        }
    },
    _addRegionFeatures: function (classification, classifiedData, regions, dataByRegions, highlightRegionId) {
        const me = this;
        const addFeaturesRequestParams = [];
        const handledRegions = [];
        const { groups } = classifiedData;
        const { mapStyle, showValues } = classification;
        groups.forEach(function (regiongroup, index) {
            const { color, sizePx, regionIds } = regiongroup;
            const optionalStyles = [];
            const updates = [];
            const adds = [];
            const regionFeaturesToAdd = [];
            const borderFeatures = [];

            regionIds.forEach(regionId => {
                if (highlightRegionId && (highlightRegionId.toString() === regionId.toString())) {
                    optionalStyles.push(me._getFeatureStyle(mapStyle, regionId, color, true, sizePx));
                }
                const region = regions.find(r => r.id === regionId);
                if (!region) {
                    return;
                }
                const { formatted = '' } = dataByRegions.find(r => r.id === regionId) || {};
                if (me._regionsAdded.includes(regionId)) {
                    updates.push({
                        value: regionId,
                        properties: {
                            regionValue: formatted
                        }
                    });
                } else {
                    const feature = me._getFeature(mapStyle, region, formatted);
                    if (mapStyle === 'points') {
                        borderFeatures.push(me._getBorderFeature(region, formatted));
                    }
                    regionFeaturesToAdd.push(feature);
                    adds.push(regionId);
                }
                handledRegions.push(regionId);
            });

            const defaultFeatureStyle = me._getFeatureStyle(mapStyle, null, color, false, sizePx);
            const regionFeatureStyle = Object.assign({
                text: {
                    scale: 1.2,
                    fill: {
                        color: Oskari.util.isDarkColor(color) ? '#ffffff' : '#000000'
                    },
                    stroke: {
                        width: 0
                    },
                    labelProperty: showValues ? 'regionValue' : '',
                    offsetX: 0,
                    offsetY: 0
                }
            }, defaultFeatureStyle);

            const regionRequestOptions = {
                clearPrevious: false,
                featureStyle: regionFeatureStyle,
                optionalStyles: optionalStyles,
                layerId: LAYER_ID,
                prio: REGION_PRIO + index,
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

                if (mapStyle === 'points') {
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
            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', ['id', removes, LAYER_ID]);
        }
        addFeaturesRequestParams.forEach(params => {
            me.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', params);
        });

        me._lastRenderCache = { groups, highlightRegionId, mapStyle };
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

    clearRegions: function () {
        var me = this;
        me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);
        me._regionsAdded = [];
    },

    _getFeatureStyle: function (mapStyle, region, color, highlighted, size) {
        var me = this;
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
        return {
            fill: { color: null },
            image: {
                radius: size / 2,
                fill: { color }
            },
            stroke: {
                color: '#000000',
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

    _getFeature: function (mapStyle, region, label) {
        var featureProperties = {
            'id': region.id,
            'name': region.name,
            'regionValue': label,
            'oskari_type': 'region'
        };
        if (mapStyle === 'points') {
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

    _updateLayerProperties: function (mapStyle, regionsetId) {
        const regionset = getRegionsets().find(rs => rs.id === regionsetId);
        const hoverOptions = {
            featureStyle: {
                stroke: {
                    width: 4
                },
                inherit: true
            },
            content: [
                {
                    keyProperty: 'name',
                    valueProperty: 'regionValue'
                }
            ]
        };

        if (mapStyle !== 'points') {
            hoverOptions.featureStyle.effect = 'darken';
        }
        this.sb.postRequestByName(
            'VectorLayerRequest',
            [
                {
                    layerId: LAYER_ID,
                    hover: hoverOptions,
                    showLayer: true,
                    layerDescription: (regionset && regionset.name) ? regionset.name : null
                }
            ]
        );
    },
    _updateFeatureStyle: function (regionId, highlight) {
        const { mapStyle, groups } = this._lastRenderCache;
        if (!groups || !mapStyle) {
            return;
        }
        const index = groups.findIndex(group => group.regionIds && group.regionIds.includes(regionId));
        if (index === -1) {
            return;
        }
        const { color, sizePx } = groups[index];
        const style = this._getFeatureStyle(mapStyle, regionId, color, highlight, sizePx);
        style.effect = highlight ? 'darken' : '';
        const requestOptions = {
            featureStyle: style,
            layerId: LAYER_ID,
            prio: highlight ? HIGHLIGHT_PRIO : REGION_PRIO + index
        };
        const searchOptions = { id: regionId };
        this.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [searchOptions, requestOptions]);

        if (mapStyle === 'points') {
            const borderRequestOptions = { ...requestOptions };
            const borderSearchOptions = { ...searchOptions };
            delete borderRequestOptions.prio;
            borderSearchOptions.id = 'border' + regionId;
            this.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [borderSearchOptions, borderRequestOptions]);
        }
    }
});
