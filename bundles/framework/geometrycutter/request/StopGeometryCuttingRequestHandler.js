Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequestHandler', function (geometryCutterInstance) {
    this.geometryCutterInstance = geometryCutterInstance;
}, {
    handleRequest: function (core, request) {
        this.geometryCutterInstance.stopEditing(request.getId());
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});