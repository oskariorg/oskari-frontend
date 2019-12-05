/**
 * @class Oskari.mapframework.bundle.mapmodule.request.SetTimeRequestHandler
 * Set time for map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.SetTimeRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     *            mapModule reference to mapmodule
     */
    function (mapModule) {
        this.mapModule = mapModule;
        this.log = Oskari.log('Oskari.mapframework.bundle.mapmodule.request.SetTimeRequestHandler');
    }, {
        handleRequest: function (core, request) {
            const date = request.getDate();
            const time = request.getTime();
            const year = request.getYear();
            if (!this.validateTime(time)) {
                this.log.warn('Invalid time format. Valid format is HH:mm');
                return;
            }
            if (!this.validateDate(date, year)) {
                this.log.warn('Invalid date format. Valid format is D/M.');
                return;
            }
            const formattedDate = this.formatDate(date, time, year);

            this.mapModule.setTime(formattedDate);
        },

        /**
         * @method validateTime
         * @return {Bool} true if valid time
         */
        validateTime: function (time) {
            const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
            return regex.test(time);
        },

        /**
         * @method validateDate
         * @return {Bool} true if valid date
         */
        validateDate: function (date, year) {
            const matches = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])[/](0[1-9]|1[0-2]|[1-9])$/.exec(date);
            if (matches === null) {
                return false;
            }
            const d = parseInt(matches[1]);
            const m = matches[2] - 1;
            const dateObject = new Date(year, m, d);
            return dateObject.getDate() === d && dateObject.getMonth() === m;
        },

        /**
         * @method formatDate
         * @return {String} Time formatted to ISO standard 'YYYY-MM-DDTHH:mm:ss.sssZ'
         */
        formatDate: function (date, time, year) {
            const dateArray = date.split('/');
            const timeArray = time.split(':');
            const dateObject = new Date(year, dateArray[1] - 1, dateArray[0], timeArray[0], timeArray[1]);
            return dateObject.toISOString();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
