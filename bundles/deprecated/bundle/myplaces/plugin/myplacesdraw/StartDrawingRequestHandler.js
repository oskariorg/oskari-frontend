Oskari.clazz.define('Oskari.mapframework.myplaces.request.StartDrawingRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.sandbox.printDebug("[Oskari.mapframework.myplaces.request.StartDrawingRequestPluginHandler] Start Drawing: " + drawMode);
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
