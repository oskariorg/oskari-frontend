import { StateHandler, controllerMixin } from 'oskari-ui/util';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

class UIService extends StateHandler {
    constructor (requestFn, initialDate) {
        super();
        this.requestFunction = requestFn;
        const time = dayjs(initialDate);
        this.state = {
            time: time.format('H:mm'),
            date: time.format('D/M'),
            year: time.format('YYYY')
        };
    }

    update (date, time) {
        this.updateState({ time, date });
    }

    requestNewTime (time) {
        this.requestNewDateAndTime(this.getState().date, time);
    }

    requestNewDate (date) {
        this.requestNewDateAndTime(date, this.getState().time);
    }

    requestNewDateAndTime (date, time) {
        this.requestFunction(date, time);
    }
}

export const TimeControl3dHandler = controllerMixin(UIService, [
    'requestNewTime',
    'requestNewDate',
    'requestNewDateAndTime'
]);
