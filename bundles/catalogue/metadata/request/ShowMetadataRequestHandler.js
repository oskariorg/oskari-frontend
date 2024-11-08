/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler
 *
 */
Oskari.clazz.define(
    'Oskari.catalogue.bundle.metadata.request.ShowMetadataRequestHandler',
    function (instance) {
        this.instance = instance;
    }, {
        handleRequest: function (core, request) {
            this.instance.showMetadata(request.getData());
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
