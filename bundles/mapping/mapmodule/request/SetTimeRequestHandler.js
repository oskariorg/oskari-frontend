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
     * @param {Oskari.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     *            mapModule reference to mapmodule
     */
    function (mapModule) {
        this.mapModule = mapModule;
        this.log = Oskari.log('Oskari.mapframework.bundle.mapmodule.request.SetTimeRequestHandler');
    }, {
        handleRequest: function (core, request) {
            if (!request.validateTime()) {
                this.log.warn('Invalid time format. Valid format is HH:mm');
                return;
            }
            if (!request.validateDate()) {
                this.log.warn('Invalid date format. Valid format is D/M.');
                return;
            }
            const formattedDate = request.formatDate();

            this.mapModule.setTime(formattedDate);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
