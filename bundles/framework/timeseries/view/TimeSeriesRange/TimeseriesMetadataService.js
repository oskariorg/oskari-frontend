import moment from 'moment';

const VECTOR_LAYER_PREFIX = 'TimeSeriesMetadata_';
const DEFAULT_STYLE = {
    stroke: {
        width: 1,
        color: 'rgba(0, 0, 0, 0.8)'
    },
    fill: {
        color: 'rgba(24, 219, 218, 0.5)'
    }
};

export class TimeseriesMetadataService {
    constructor (layerId, attributeName, toggleLevel) {
        this._layerId = layerId;
        this._attributeName = attributeName;
        if (typeof toggleLevel === 'number' && toggleLevel > -1) {
            this._toggleLevel = toggleLevel;
        } else {
            this._toggleLevel = -1;
        }
    }
    /**
     * Triggers a fetch for WFS features on the metadata layer
     * @param {Object} bbox usually the current viewport bbox
     * @param {Function} success called with updated years array based on the loaded features
     * @param {Function} error called if there's a problem loading the features
     */
    setBbox (bbox = [], success, error) {
        const sandbox = Oskari.getSandbox();
        if (Object.keys(bbox).length !== 4) {
            this.clearPreviousFeatures();
            error('Invalid bbox');
            return;
        }
        const bboxStr = [bbox.left, bbox.bottom, bbox.right, bbox.top].join(',');
        const attribute = this._attributeName;
        const url = Oskari.urls.getRoute('GetWFSFeatures', {
            id: this._layerId,
            bbox: bboxStr,
            srs: sandbox.getMap().getSrsName()
        });
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                // TODO: add error handling
                return Promise.reject(new Error('GetWFSFeatures error'));
            }
            return response.json();
        }).then(json => {
            this._geojson = json;
            this._updateYears(attribute);
            success(this.getCurrentYears());
        }).catch(e => {
            error(e);
        });
    }

    _updateYears (attribute) {
        const yearSet = new Set();
        this.getCurrentFeatures().forEach(feature => {
            const time = feature.properties[attribute];
            if (time) {
                const year = moment(time).year();
                yearSet.add(year);
            }
        });
        this._currentYears = Array.from(yearSet);
    }

    getCurrentYears () {
        return this._currentYears || [];
    }

    getCurrentFeatures (asGeoJson) {
        if (!this._geojson) {
            return asGeoJson ? null : [];
        }
        if (asGeoJson) {
            return { ...this._geojson };
        }
        if (!Array.isArray(this._geojson.features)) {
            return [];
        }
        return this._geojson.features.slice(0);
    }

    clearPreviousFeatures () {
        const sandbox = Oskari.getSandbox();
        // clear previous features from map
        sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest',
            [null, null, VECTOR_LAYER_PREFIX + this._layerId]);
    }

    showFeaturesForRange (startTime, endTime) {
        const sandbox = Oskari.getSandbox();
        this.clearPreviousFeatures();
        const log = Oskari.log('TimeSeries');
        log.info('Toggle at: ' + this._toggleLevel, 'Current zoom is: ' + sandbox.getMap().getZoom());
        if (this._toggleLevel === -1 || this._toggleLevel >= sandbox.getMap().getZoom()) {
            // don't show features but the wms
            log.info('Not showing features, WMS should be shown');
            return;
        }
        const attribute = this._attributeName;
        const geojson = this.getCurrentFeatures(true);
        const features = geojson.features.filter(feature => {
            const time = moment(feature.properties[attribute]);
            return startTime < time && time < endTime;
        });
        log.info('Features count for time range: ' + features.length + '/' + geojson.features.length);
        geojson.features = features;

        // TODO: push to map with addfeaturestomap/ styling/optimizing
        sandbox.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
            layerId: VECTOR_LAYER_PREFIX + this._layerId,
            featureStyle: this._getWFSLayerStyle(this._layerId)
        }]);
    }

    _getWFSLayerStyle (layerId) {
        const sandbox = Oskari.getSandbox();
        const service = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        const layer = service.findMapLayer(layerId);
        if (!layer) {
            return DEFAULT_STYLE;
        }
        const styles = layer.getOptions().styles || {};
        const layerStyleDef = styles.timeseriesStyle || {};
        return layerStyleDef.featureStyle || DEFAULT_STYLE;
    }
};
