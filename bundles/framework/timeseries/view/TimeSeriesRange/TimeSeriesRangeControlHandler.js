import moment from 'moment';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { TimeseriesMetadataService } from './TimeseriesMetadataService';

const _getTimeFromYear = (year) => {
    return moment.utc(year.toString()).startOf('year');
};

class UIHandler extends StateHandler {
    constructor (delegate, stateListener) {
        super();
        this._delegate = delegate;
        this._layer = delegate.getLayer();
        const hasMetadata = this._initMetadataLayer(this._layer);
        this._timer = null;
        this._debounceTime = 300;
        const [start, end] = delegate.getYearRange();
        const dataYears = hasMetadata ? [] : this._getDataYearsFromWMS();
        this.state = {
            title: this._layer.getName(),
            start,
            end,
            value: [start, start],
            dataYears
        };
        this.addStateListener(stateListener);
        delegate.onDestroy(() => this._teardown());
    }

    updateValue (value) {
        this.updateState({ value });
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => this._requestNewTime(value), this._debounceTime);
    }

    setCurrentViewportBbox (bbox) {
        if (!this._metadataHandler) {
            return;
        }
        this.updateState({
            error: false,
            loading: true
        });
        this._metadataHandler.setBbox(bbox, (data) => {
            this.updateState({
                dataYears: data,
                loading: false
            });
            const [start, end] = this._getTimeRange();
            this._updateFeaturesByTime(start, end);
        }, (error) => {
            this.updateState({
                error: true,
                loading: false
            });
            Oskari.log('TimeSeries').warn('Error updating features', error);
        });
    }

    _teardown () {
        if (!this._metadataHandler) {
            return;
        }
        this._metadataHandler.clearPreviousFeatures();
    }

    _initMetadataLayer (layer) {
        if (!layer) {
            return false;
        }
        const options = layer.getOptions() || {};
        const timeseries = options.timeseries || {};
        const metadata = timeseries.metadata || {};
        const layerId = metadata.layer;
        if (!layerId) {
            return false;
        }
        const attribute = metadata.attribute || 'time';
        this._metadataHandler = new TimeseriesMetadataService(layerId, attribute, metadata.toggleLevel);
        return true;
    }

    _getDataYearsFromWMS () {
        // get years from WMS-layer timeseries
        const times = this._layer.getAttributes().times;
        return times.map(time => moment(time).year());
    }

    _requestNewTime (value) {
        const [startYear, endYear] = value;
        const startTime = _getTimeFromYear(startYear);
        const endTime = _getTimeFromYear(endYear);
        const newTime = `${startTime.toISOString()}/${endTime.toISOString()}`;
        this._delegate.requestNewTime(newTime);
        this._updateFeaturesByTime(startTime, endTime);
    }

    _updateFeaturesByTime (start, end) {
        if (!this._metadataHandler) {
            return;
        }
        this._metadataHandler.showFeaturesForRange(start, end);
    }

    _getTimeRange () {
        const { value } = this.getState();
        const [startYear, endYear] = value;
        return [_getTimeFromYear(startYear), _getTimeFromYear(endYear)];
    }
}

export const TimeSeriesRangeControlHandler = controllerMixin(UIHandler, [
    'updateValue',
    'setCurrentViewportBbox'
]);
