import moment from 'moment';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { TimeseriesMetadataService } from '../../service/TimeseriesMetadataService';

const _getStartTimeFromYear = (year) => {
    return moment.utc(year.toString(), 'YYYY').startOf('year');
};

const _getEndTimeFromYear = (year) => {
    return moment.utc(year.toString(), 'YYYY').endOf('year');
};

class UIHandler extends StateHandler {
    constructor (delegate, stateListener) {
        super();
        this._delegate = delegate;
        this._layer = delegate.getLayer();
        const hasMetadata = this._initMetadataLayer(this._layer);
        this._timer = null;
        this._debounceTime = 300;
        this._autoSelectMidDataYear = true;
        const [start, end] = delegate.getYearRange();
        const dataYears = hasMetadata ? [] : this._getDataYearsFromWMS();
        this.state = {
            title: this._layer.getName(),
            start,
            end,
            mode: 'year',
            value: start,
            dataYears
        };
        this.addStateListener(stateListener);
        delegate.onDestroy(() => this._teardown());
    }

    setInitialValue (value, mode) {
        // no need to auto select mid data year if an initial
        // value is provided through e.g. map link or map view
        this._autoSelectMidDataYear = false;
        this.updateValue(value, mode);
    }

    updateValue (value, mode) {
        const state = { value };
        if (mode) {
            state.mode = mode;
        }
        this.updateState(state);
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => this._requestNewTime(value), this._debounceTime);
    }

    setCurrentViewportBbox (bbox, zoomLevel) {
        if (!this._metadataHandler) {
            return;
        }
        if (this._metadataHandler.getToggleLevel() > zoomLevel) {
            const dataYears = this._getDataYearsFromWMS();
            const state = { dataYears };
            if (this._autoSelectMidDataYear && dataYears.length > 0) {
                this._autoSelectMidDataYear = false;
                state.value = this._getMidWayDataYear(dataYears);
            }
            this.updateState(state);
            return;
        }
        this.updateState({
            error: false,
            loading: true
        });
        this._metadataHandler.setBbox(
            bbox,
            (data) => {
                const state = {
                    dataYears: data,
                    loading: false
                };
                if (this._autoSelectMidDataYear && data.length > 0) {
                    this._autoSelectMidDataYear = false;
                    state.value = this._getMidWayDataYear(data);
                    this._requestNewTime(state.value);
                }
                this.updateState(state);
                const [start, end] = this._getTimeRange();
                this._updateFeaturesByTime(start, end);
            },
            (error) => {
                this.updateState({
                    error: true,
                    loading: false
                });
                Oskari.log('TimeSeries').warn('Error updating features', error);
            }
        );
    }

    _getMidWayDataYear (dataYears) {
        return dataYears[Math.ceil(dataYears.length / 2)];
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
        this._metadataHandler = new TimeseriesMetadataService(layerId, attribute, metadata.toggleLevel, !!metadata.visualize);
        return true;
    }

    _getDataYearsFromWMS () {
        // get years from WMS-layer timeseries
        const times = this._layer.getAttributes().times;
        return times.map(time => moment(time).year());
    }

    _requestNewTime (value) {
        let startYear = null;
        let endYear = null;
        if (Array.isArray(value)) {
            startYear = value[0];
            endYear = value[1];
        } else {
            startYear = value;
            endYear = value;
        }
        const startTime = _getStartTimeFromYear(startYear);
        const endTime = _getEndTimeFromYear(endYear);
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
        let startYear = null;
        let endYear = null;
        if (value.length === 2) {
            startYear = value[0];
            endYear = value[1];
        } else {
            startYear = value;
            endYear = value;
        }
        return [_getStartTimeFromYear(startYear), _getEndTimeFromYear(endYear)];
    }
}

export const TimeSeriesRangeControlHandler = controllerMixin(UIHandler, [
    'updateValue',
    'setCurrentViewportBbox'
]);
