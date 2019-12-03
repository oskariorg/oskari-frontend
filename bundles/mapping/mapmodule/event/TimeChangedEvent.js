/**
 * @class Oskari.mapframework.event.common.TimeChangedEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.TimeChangedEvent',
    /**
     * @static @method create called automatically on construction
     */
    function (date, time) {
        this._date = date;
        this._time = time;
    }, {
        /** @static @property __name event name */
        __name: 'TimeChangedEvent',

        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getDate
         * @return {String} date formatted as D/M
         */
        getDate: function () {
            return this._date;
        },

        /**
         * @method getTime
         * @return {String} time formatted as HH:mm
         */
        getTime: function () {
            return this._time;
        },

        getParams: function () {
            return {
                'date': this.getDate(),
                'time': this.getTime()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.event.Event']
    });
