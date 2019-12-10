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
            time: this._getTime(),
            date: this._getDate(),
            year: this._getYear()
        };
        this.eventHandlers = this._createEventHandlers();
    }

    updateTimeEvent (event) {
        const time = event.getTime();
        const date = event.getDate();
        this.updateState({ time, date });
    }

    _getTime () {
        const clock = moment(this._time).format('H:mm');
        return clock;
    }

    _getDate () {
        const date = moment(this._time).format('D/M');
        return date;
    }

    _getYear () {
        const year = moment(this._time).format('YYYY');
        return year;
    }

    setTime (time) {
        const date = this._getDate();
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }

    setDate (date) {
        const time = this._getTime();
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }

    setCurrentTime (date, time) {
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
        Object.getOwnPropertyNames(handlers).forEach(p => {
            this.sandbox.registerForEventByName(this, p);
        });
        return handlers;
    }
}

export const ShadowToolHandler = mutatorMixin(UIService, [
    'setTime',
    'setDate',
    'setCurrentTime'
]);
