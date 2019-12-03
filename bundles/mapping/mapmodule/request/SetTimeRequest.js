/**
 * @class SetTimeRequest
 * SetTime Request for Cesium Map
 */
Oskari.clazz.define('Oskari.mapframework.request.common.SetTimeRequest',
    /**
     * Creates a new SetTimeRequest
     * @param {String} date date formatted as D/M
     * @param {String} time time formattted as HH:mm
     */
    function (date, time, year) {
        this._date = date;
        this._time = time;
        this._year = year || new Date().getFullYear();
    }, {
        __name: 'SetTimeRequest',

        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getDate
         * Valid format d/m
         * @return {String} date
         */
        getDate: function () {
            return this._date;
        },

        /**
         * @method getTime
         * @return {String} time
         */
        getTime: function () {
            return this._time;
        },

        /**
         * @method getYear
         * @return {Number} year
         */
        getYear: function () {
            return this._year;
        }
    }, {
        protocol: ['Oskari.mapframework.request.Request']
    });
