/**
 * Handles requests for indicators data
 *
 * @class Oskari.statistics.bundle.statsgrid.request.IndicatorsRequestHandler
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.IndicatorsRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.statistics.bundle.statsgrid.instance}
     *            instance reference to StatsGrids instance
     */

    function (instance) {
        this.instance = instance;
    }, {
        /**
         * Handles requests for indicators data and sends an event with the data.
         *
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.statistics.bundle.statsgrid.request.StatsGridRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            if (request.getName() == 'StatsGrid.IndicatorsRequest') {
                var sandbox = this.instance.getSandbox(),
                    eventBuilder = sandbox.getEventBuilder('StatsGrid.IndicatorsEvent'),
                    evt,
                    indicators = [];

                if (this.instance.isLayerVisible()) {
                    indicators = this.instance.getGridIndicators();
                }

                if (eventBuilder) {
                    evt = eventBuilder(indicators);
                    sandbox.notifyAll(evt);
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
