Oskari.clazz.define('Oskari.lupapiste.bundle.myplaces2.request.GetGeometryRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var callBack = request.getCallBack();
        this.sandbox.printDebug("[Oskari.lupapiste.bundle.myplaces2.request.GetGeometryRequestPluginHandler] geometry requested");
        var drawing = this.drawPlugin.getDrawing();
        callBack(drawing.geometry);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
