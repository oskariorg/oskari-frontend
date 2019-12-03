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
        },

        /**
         * @method validateTime
         * @return {Bool} true if valid time
         */
        validateTime: function () {
            const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
            return regex.test(this.getTime());
        },

        /**
         * @method validateDate
         * @return {Bool} true if valid date
         */
        validateDate: function () {
            const matches = /^(0[0-9]|1[0-9]|2[0-9]|3[0-1]|[0-9])[/](0[0-9]|1[0-2]|[0-9])$/.exec(this._date);
            if (matches === null) {
                return false;
            }
            const d = parseInt(matches[1]);
            const m = matches[2] - 1;
            const y = this.getYear();
            const date = new Date(y, m, d);
            return date.getDate() === d && date.getMonth() === m;
        },

        /**
         * @method formatDate
         * @return {String} Time formatted to ISO standard 'YYYY-MM-DDTHH:mm:ss.sssZ'
         */
        formatDate: function () {
            const dateArray = this.getDate().split('/');
            const timeArray = this.getTime().split(':');
            const date = new Date(this.getYear(), dateArray[1] - 1, dateArray[0], timeArray[0], timeArray[1]);
            return date.toISOString();
        }
    }, {
        protocol: ['Oskari.mapframework.request.Request']
    });
