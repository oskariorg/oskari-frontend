import moment from 'moment';
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (delegate, stateListener) {
        super();
        this._delegate = delegate;
        this._layer = delegate.getLayer();
        this._timer = null;
        this._debounceTime = 300;
        const [start, end] = delegate.getYearRange();
        const dataYears = this._getDataYears();
        this.state = {
            title: this._layer.getName(),
            start,
            end,
            value: [start, end],
            dataYears
        };
        this.addStateListener(stateListener);
    }

    _getDataYears () {
        const times = this._layer.getAttributes().times;
        return times.map(time => moment(time).year());
    }

    updateValue (value) {
        this.updateState({ value });
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => this._requestNewTime(value), this._debounceTime);
    }

    _requestNewTime (value) {
        const [startYear, endYear] = value;
        const startTime = moment.utc(startYear.toString()).startOf('year').toISOString();
        const endTime = moment.utc(endYear.toString()).endOf('year').toISOString();
        const newTime = `${startTime}/${endTime}`;
        this._delegate.requestNewTime(newTime);
    }
}

export const TimeSeriesRangeControlHandler = controllerMixin(UIHandler, [
    'updateValue'
]);
