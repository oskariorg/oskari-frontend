Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StartGeometryCuttingRequestHandler', function(sandbox, geometryEditPlugin) {
    
        this.sandbox = sandbox;
        this.geometryEditPlugin = geometryEditPlugin;
    }, {
        handleRequest : function(core, request) {
            this.geometryEditPlugin.startEditDrawing(request.getId(), request.getGeometry(), request.getMode());
        }
    }, {
        protocol : ['Oskari.mapframework.core.RequestHandler']
    });
    