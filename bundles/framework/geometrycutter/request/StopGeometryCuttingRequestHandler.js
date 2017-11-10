Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequestHandler',
    function (sandbox, geometryCutterInstance) {
        this.sandbox = sandbox;
        this.geometryCutterInstance = geometryCutterInstance;
    },
    {
        handleRequest: function (core, request) {
            if (request.isCancel()) {
                this.geometryCutterInstance.cancelEditing(request.getId());
            }
            else {

                this.geometryCutterInstance.finishEditing(request.getId());
            }
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });