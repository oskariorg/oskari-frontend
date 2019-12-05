import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.state = {
            time: this._getTime(),
            date: this._getDate(),
            year: this._getYear()
        };
    }

    // TODO
    _getTime () {

    }

    _getDate () {

    }

    _getYear () {

    }

    setTime (time) {
        const date = this._getDate();
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }

    setDate (date) {
        const time = this._getTime();
        this.sandbox.postRequestByName('SetTimeRequest', [date, time]);
    }
}

export const SelectedLayersHandler = mutatorMixin(UIService, [
    'setTime',
    'setDate'
]);
