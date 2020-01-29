import { validateDate, validateTime } from '../util/time';
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
            if (!validateTime(time)) {
                this.log.warn('Invalid time format. Valid format is HH:mm');
                return;
            }
            if (!validateDate(date, year)) {
                this.log.warn('Invalid date format. Valid format is D/M.');
                return;
            }
            const dateArray = date.split('/');
            const timeArray = time.split(':');
            const dateObj = new Date(year, dateArray[1] - 1, dateArray[0], timeArray[0], timeArray[1]);
            this.mapModule.setTime(dateObj);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
