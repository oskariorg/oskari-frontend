/**
 * Handles requests for adding a new data source to the stats plugin.
 *
 * @class Oskari.statistics.bundle.statsgrid.request.DataSourceRequestHandler
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.DataSourceRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin}
     *            plugin reference to stats plugin
     */

    function (plugin) {
        this.plugin = plugin;
    }, {
        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.statistics.bundle.statsgrid.request.StatsGridRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            if (request.getName() === 'StatsGrid.AddDataSourceRequest') {
                var id = request.getDataSourceId(),
                    name = request.getDataSourceName(),
                    data = request.getData();

                if (this.plugin) {
                    this.plugin.addDataSource(id, name, data);
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
