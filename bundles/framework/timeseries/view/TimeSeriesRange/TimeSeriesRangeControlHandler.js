import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (delegate, stateListener) {
        super();
        this._delegate = delegate;
        this._layer = delegate.getLayer();
        const [start, end] = delegate.getYearRange();
        this.state = {
            title: this._layer.getName(),
            start,
            end,
            value: [start, end],
            dataYears: [1950, 1990, 1996, 2010]
        };
        this.addStateListener(stateListener);
    }

    updateValue (value) {
        this.updateState({ value });
    }
}

export const TimeSeriesRangeControlHandler = controllerMixin(UIHandler, [
    'updateValue'
]);
