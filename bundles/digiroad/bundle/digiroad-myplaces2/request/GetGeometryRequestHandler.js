Oskari.clazz.define('Oskari.digiroad.bundle.myplaces2.request.GetGeometryRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var callBack = request.getCallBack();
        var drawing = this.drawPlugin.getDrawing();
        callBack(drawing.geometry);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
