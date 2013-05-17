/**
 * @class Oskari.statistics.bundle.statsgrid.request.StatsGridRequestHandler
 * Handles requests regarding StatsGrid functionality
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.StatsGridRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.statistics.bundle.statsgrid.View}
 *            view reference to StatsGrids View
 */
function(view) {
    this.view = view;
}, {
    /**
     * @method handleRequest 
     * Handles requests regarding StatsGrid functionality.
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.statistics.bundle.statsgrid.request.StatsGridRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        if (request.getName() == 'StatsGrid.StatsGridRequest') {
            this.view.prepareMode(request.isEnabled(), request.getLayer());
        } 
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
