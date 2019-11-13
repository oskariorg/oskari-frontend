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
    }, {
        handleRequest: function (core, request) {
            const formattedDate = request.formatDate();
            if (!formattedDate) {
                const log = Oskari.log('Oskari.mapframework.ui.module.common.MapModule');
                log.warn('Invalid date and/or time format. Valid formats are d/m and HH:mm');
                return;
            }

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
