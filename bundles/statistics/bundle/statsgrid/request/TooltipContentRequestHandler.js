/**
 * @class Oskari.statistics.bundle.statsgrid.request.TooltipContentRequest
 * Handles requests for tooltip content
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.TooltipContentRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.statistics.bundle.statsgrid.instance}
 *            instance reference to StatsGrids instance
 */
function(instance) {
    this.instance = instance;
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
        if (request.getName() == 'StatsGrid.TooltipContentRequest') {
            this.instance.gridPlugin.sendTooltipData(request.getFeature());
        } 
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
