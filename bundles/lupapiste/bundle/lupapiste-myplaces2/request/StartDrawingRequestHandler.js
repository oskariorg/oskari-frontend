Oskari.clazz.define('Oskari.lupapiste.bundle.myplaces2.request.StartDrawingRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.sandbox.printDebug("[Oskari.lupapiste.bundle.myplaces2.request.StartDrawingRequestPluginHandler] Start Drawing: " + drawMode);
        this.drawPlugin.startDrawing({
            drawMode : request.getDrawMode(),
            geometry : request.getGeometry(),
            isModify : request.isModify(),
            style : ''
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
