import { StateHandler, mutatorMixin } from 'oskari-ui/util';
import moment from 'moment';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this._time = Cesium.JulianDate.toDate(this.mapmodule.getTime());
        this.state = {
            time: this._getInitialTime(),
            date: this._getInitialDate(),
            year: this._getInitialYear(),
            playing: false,
            speed: 0
        };
        this.eventHandlers = this._createEventHandlers();
    }

    updateTimeEvent (event) {
        const time = event.getTime();
        const date = event.getDate();
        this.updateState({ time, date });
    }

    _getInitialTime () {
        const clock = moment(this._time).format('H:mm');
        return clock;
    }

    _getInitialDate () {
        const date = moment(this._time).format('D/M');
        return date;
    }

    _getInitialYear () {
        const year = moment(this._time).format('YYYY');
        return year;
    }

    _getTime () {
        return this.state.time;
    }

    _getDate () {
        return this.state.date;
    }

    setTime (time) {
        const date = this._getDate();
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }

    setDate (date) {
        const time = this._getTime();
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }

    setTimeAndDate (date, time) {
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'ShadowToolHandler';
    }
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    _createEventHandlers () {
        const handlers = {
            'TimeChangedEvent': event => this.updateTimeEvent(event)
        };
        this.sandbox.registerForEventByName(this, 'TimeChangedEvent');
        return handlers;
    }
}

export const ShadowToolHandler = mutatorMixin(UIService, [
    'setTime',
    'setDate',
    'setTimeAndDate'
]);
