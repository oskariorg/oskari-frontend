/**
 * @class SetTimeRequest
 * SetTime Request for Cesium Map
 */
const NAME = 'SetTimeRequest';
export class SetTimeRequest {
    /**
     * Creates a new SetTimeRequest
     * @param {*} date date string
     * @param {*} time time string
     */
    constructor (date, time) {
        this._date = date;
        this._time = time;
        this.__name = 'Oskari.mapframework.request.common.SetTimeRequest';
    }
    getName () {
        return this.__name;
    }
    getDate () {
        return this._date;
    }
    getTime () {
        return this._time;
    }
}
SetTimeRequest.NAME = NAME;

Oskari.clazz.defineES(
    'Oskari.mapframework.request.common.SetTimeRequest',
    SetTimeRequest,
    { protocol: ['Oskari.mapframework.request.Request'] }
);
