Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequestHandler', function (sandbox, geometryCutterInstance) {
    this.sandbox = sandbox;
    this.geometryCutterInstance = geometryCutterInstance;
}, {
    handleRequest: function (core, request) {
        this.geometryCutterInstance.stopEditing(request.getId());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});