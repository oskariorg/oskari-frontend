Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StartGeometryCuttingRequestHandler', function (sandbox, geometryCutterInstance) {
    this.sandbox = sandbox;
    this.geometryCutterInstance = geometryCutterInstance;
}, {
    handleRequest: function (core, request) {
        this.geometryCutterInstance.startEditing(request.getId(), request.getFeature(), request.getMode());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
