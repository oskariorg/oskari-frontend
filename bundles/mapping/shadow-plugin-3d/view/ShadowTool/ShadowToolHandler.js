import { StateHandler, controllerMixin } from 'oskari-ui/util';
import moment from 'moment';

class UIService extends StateHandler {
    constructor (sandbox, initialDate) {
        super();
        this.sandbox = sandbox;
        const time = moment(initialDate);
        this.state = {
            time: time.format('H:mm'),
            date: time.format('D/M'),
            year: time.format('YYYY')
        };
        this.eventHandlers = this._createEventHandlers();
    }

    updateTimeEvent (event) {
        const time = event.getTime();
        const date = event.getDate();
        this.updateState({ time, date });
    }

    requestNewTime (time) {
        this.requestNewTimeAndDate(this.getState().date, time);
    }

    requestNewDate (date) {
        this.requestNewTimeAndDate(date, this.getState().time);
    }

    requestNewTimeAndDate (date, time) {
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

export const ShadowToolHandler = controllerMixin(UIService, [
    'requestNewTime',
    'requestNewDate',
    'requestNewTimeAndDate'
]);
