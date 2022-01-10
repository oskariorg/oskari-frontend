/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.request.MetadataSearchRequestHandler
 * Handles Oskari.catalogue.bundle.metadatacatalogue.request.MetadataSearchRequest.
 */
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance} instance
 *          reference to my metadatacatalogue bundle instance
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatacatalogue.request.MetadataSearchRequestHandler', function (instance) {
    this.instance = instance;
    this._log = Oskari.log('MetadataSearchRequestHandler');
}, {
    /**
     * @method handleRequest
     * Do metadata search.
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.catalogue.bundle.metadatacatalogue.request.MetadataSearchRequest} request
     *      request to handle
     */
    handleRequest: function (core, request) {
        this._log.debug('Handling reguest');
        this.instance.searchService.doSearch(request.getSearch());
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
