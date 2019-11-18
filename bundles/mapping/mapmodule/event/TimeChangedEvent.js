/**
 * @class Oskari.mapframework.event.common.TimeChangedEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.TimeChangedEvent',
    /**
     * @static @method create called automatically on construction
     */
    function (dateTime) {
        this._dateTime = dateTime;
        this._dateObject = new Date(dateTime);
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

        getDateTime: function () {
            return this._dateTime;
        },

        getDateObject: function () {
            return this._dateObject;
        },

        /**
         * @method getDate
         * @return {String} date formatted as D/M
         */
        getDate: function () {
            const date = this.getDateObject();
            return `${date.getDate()}/${date.getMonth() + 1}`;
        },

        /**
         * @method getTime
         * @return {String} time formatted as HH:mm
         */
        getTime: function () {
            const date = this.getDateObject();
            return `${date.getHours()}:${date.getMinutes()}`;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.event.Event']
    });
