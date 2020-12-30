import moment from 'moment';
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (delegate, stateListener, onChange) {
        super();
        this._delegate = delegate;
        this._layer = delegate.getLayer();
        this._timer = null;
        this._debounceTime = 300;
        this._onChange = onChange;
        const [start, end] = delegate.getYearRange();
        const dataYears = this._getDataYears();
        this.state = {
            title: this._layer.getName(),
            start,
            end,
            value: [start, start],
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
        this._timer = setTimeout(() => this._onChange(value), this._debounceTime);
    }

    updateDataYears (dataYears) {
        this.updateState({ dataYears });
    }
}

export const TimeSeriesRangeControlHandler = controllerMixin(UIHandler, [
    'updateValue',
    'updateDataYears'
]);
