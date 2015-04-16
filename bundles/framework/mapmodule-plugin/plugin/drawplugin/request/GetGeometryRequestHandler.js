Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.GetGeometryRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var callBack = request.getCallBack();
        this.sandbox.printDebug("[Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.GetGeometryRequestPluginHandler] geometry requested");
        var drawing = this.drawPlugin.getDrawing();
        callBack(drawing.geometry);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
