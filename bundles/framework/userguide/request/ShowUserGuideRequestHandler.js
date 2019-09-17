/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequestHandler', function (sandbox, instance) {
    this.sandbox = sandbox;

    /** @property instance */
    this.instance = instance;
    this._log = Oskari.log('ShowUserGuideRequestHandler');
}, {

    /** @method handleRequest dispatches processing to instance */
    handleRequest: function (core, request) {
        this._log.debug('Show UserGuide: ' + request.getUuid());
        this.instance.scheduleShowUserGuide(request);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
